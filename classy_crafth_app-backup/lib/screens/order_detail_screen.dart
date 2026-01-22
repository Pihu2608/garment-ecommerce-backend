import 'package:flutter/material.dart';

class OrderDetailScreen extends StatelessWidget {
  const OrderDetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Order Details"),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 📦 ORDER STATUS CARD
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  gradient: const LinearGradient(
                    colors: [Color(0xffE46B2D), Color(0xffF39C6B)],
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text("Order ID", style: TextStyle(color: Colors.white70)),
                    SizedBox(height: 4),
                    Text(
                      "#CC1023",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1,
                      ),
                    ),
                    SizedBox(height: 10),
                    Row(
                      children: [
                        Icon(Icons.verified, color: Colors.white, size: 18),
                        SizedBox(width: 6),
                        Text(
                          "PAID • Order Confirmed",
                          style: TextStyle(color: Colors.white),
                        ),
                      ],
                    )
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // 🛒 ITEMS
              sectionTitle("Items"),
              const SizedBox(height: 10),
              whiteCard(
                Column(
                  children: const [
                    itemRow("White T-Shirt", "1", "₹500"),
                    Divider(height: 22),
                    itemRow("Black Hoodie", "1", "₹1200"),
                  ],
                ),
              ),

              const SizedBox(height: 22),

              // 💰 PRICE SUMMARY
              sectionTitle("Price Details"),
              const SizedBox(height: 10),
              whiteCard(
                Column(
                  children: const [
                    priceRow("Subtotal", "₹1700"),
                    SizedBox(height: 8),
                    priceRow("Delivery", "Free"),
                    Divider(height: 22),
                    priceRow("Total Amount", "₹1700", bold: true),
                  ],
                ),
              ),

              const SizedBox(height: 22),

              // 📍 DELIVERY ADDRESS
              sectionTitle("Delivery Address"),
              const SizedBox(height: 10),
              whiteCard(
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Reena Gupta",
                      style:
                          TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                    ),
                    SizedBox(height: 6),
                    Text(
                      "Bharat Arcade, Beema Kunj,\nKolar Road, Bhopal, M.P. 462042",
                      style: TextStyle(height: 1.4),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  // ================= UI HELPERS =================

  Widget sectionTitle(String text) {
    return Text(
      text,
      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
    );
  }

  Widget whiteCard(Widget child) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 6,
            offset: const Offset(0, 3),
          )
        ],
      ),
      child: child,
    );
  }
}

// 🛒 Item row
class itemRow extends StatelessWidget {
  final String name;
  final String qty;
  final String price;

  const itemRow(this.name, this.qty, this.price, {super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Text(
            "$name ×$qty",
            style: const TextStyle(fontSize: 15),
          ),
        ),
        Text(
          price,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}

// 💰 Price row
class priceRow extends StatelessWidget {
  final String left;
  final String right;
  final bool bold;

  const priceRow(this.left, this.right, {this.bold = false, super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          left,
          style: TextStyle(
            fontSize: 15,
            fontWeight: bold ? FontWeight.bold : FontWeight.normal,
          ),
        ),
        Text(
          right,
          style: TextStyle(
            fontSize: 15,
            fontWeight: bold ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ],
    );
  }
}
