import 'package:flutter/material.dart';
import '../services/order_service.dart';

class MyOrdersScreen extends StatefulWidget {
  const MyOrdersScreen({super.key});

  @override
  State<MyOrdersScreen> createState() => _MyOrdersScreenState();
}

class _MyOrdersScreenState extends State<MyOrdersScreen> {
  late Future<List<dynamic>> ordersFuture;

  @override
  void initState() {
    super.initState();
    ordersFuture = OrderService.fetchMyOrders();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("My Orders"),
        backgroundColor: const Color(0xffE46B2D),
      ),
      body: FutureBuilder<List<dynamic>>(
        future: ordersFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return const Center(child: Text("Something went wrong"));
          }

          final orders = snapshot.data ?? [];

          if (orders.isEmpty) {
            return const Center(child: Text("No orders found"));
          }

          return ListView.builder(
            padding: const EdgeInsets.all(12),
            itemCount: orders.length,
            itemBuilder: (_, i) {
              final o = orders[i];
              return Card(
                margin: const EdgeInsets.only(bottom: 10),
                child: ListTile(
                  leading:
                      const Icon(Icons.shopping_bag, color: Color(0xffE46B2D)),
                  title: Text("Order #${o["_id"] ?? ""}"),
                  subtitle: Text("₹ ${o["total"] ?? ""}"),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
