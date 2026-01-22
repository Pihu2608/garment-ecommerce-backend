import 'package:flutter/material.dart';
import '../services/order_service.dart';

class AdminOrdersScreen extends StatefulWidget {
  const AdminOrdersScreen({super.key});

  @override
  State<AdminOrdersScreen> createState() => _AdminOrdersScreenState();
}

class _AdminOrdersScreenState extends State<AdminOrdersScreen> {
  late Future<List<dynamic>> orders;

  @override
  void initState() {
    super.initState();
    orders = OrderService.fetchOrders();
  }

  Future refresh() async {
    setState(() {
      orders = OrderService.fetchOrders();
    });
  }

  Future deleteOrder(String id) async {
    final ok = await OrderService.deleteOrder(id);
    if (ok) {
      refresh();
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text("Order deleted")));
    }
  }

  Future updateStatus(String id, String status) async {
    final ok = await OrderService.updateOrder(id: id, status: status);
    if (ok) refresh();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Admin Orders")),
      body: FutureBuilder<List<dynamic>>(
        future: orders,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          }

          final data = snapshot.data ?? [];

          if (data.isEmpty) {
            return const Center(child: Text("No orders yet"));
          }

          return ListView.builder(
            itemCount: data.length,
            itemBuilder: (context, i) {
              final o = data[i];

              return Card(
                margin: const EdgeInsets.all(10),
                child: ListTile(
                  title: Text(o["customerName"] ?? ""),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("📞 ${o["phone"]}"),
                      Text("💰 ₹ ${o["total"]}"),
                      Text("📦 Status: ${o["status"]}"),
                    ],
                  ),
                  trailing: PopupMenuButton<String>(
                    onSelected: (v) {
                      if (v == "DELETE")
                        deleteOrder(o["_id"]);
                      else
                        updateStatus(o["_id"], v);
                    },
                    itemBuilder: (c) => const [
                      PopupMenuItem(value: "PENDING", child: Text("Pending")),
                      PopupMenuItem(
                          value: "PROCESSING", child: Text("Processing")),
                      PopupMenuItem(
                          value: "DELIVERED", child: Text("Delivered")),
                      PopupMenuItem(
                          value: "CANCELLED", child: Text("Cancelled")),
                      PopupMenuDivider(),
                      PopupMenuItem(
                          value: "DELETE",
                          child: Text("Delete",
                              style: TextStyle(color: Colors.red))),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
