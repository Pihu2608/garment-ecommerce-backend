import 'package:flutter/material.dart';
import '../services/cart_service.dart';
import '../services/order_service.dart';
import 'order_success_screen.dart';

class PaymentScreen extends StatefulWidget {
  const PaymentScreen({super.key});

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  bool loading = false;

  Future<void> placeOrder() async {
    if (loading) return;

    setState(() => loading = true);

    print("🔥 PAY BUTTON CLICKED");

    try {
      final cart = CartService.cart;

      final orderData = {
        "customerName": "App User",
        "phone": "0000000000",
        "address": "Mobile App Order",
        "items": cart
            .map((c) => {
                  "productId": c.product.id,
                  "name": c.product.name,
                  "price": c.product.price,
                  "qty": c.qty,
                })
            .toList(),
        "total": CartService.total(),
        "paymentMethod": "COD",
        "paymentStatus": "PAID"
      };

      print("📦 ORDER DATA => $orderData");

      final success = await OrderService.createOrder(orderData);

      print("✅ API RESPONSE => $success");

      if (!mounted) return;

      if (success) {
        CartService.clear();

        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (_) => const OrderSuccessScreen()),
          (_) => false,
        );
      } else {
        throw "Order failed from server";
      }
    } catch (e) {
      print("❌ ORDER ERROR => $e");

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Order failed: $e")),
        );
      }
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final total = CartService.total();

    return Scaffold(
      appBar: AppBar(
        title: const Text("Payment"),
        backgroundColor: const Color(0xffE46B2D),
      ),
      body: Column(
        children: [
          const Spacer(),
          Icon(Icons.account_balance_wallet,
              size: 90, color: const Color(0xffE46B2D)),
          const SizedBox(height: 20),
          Text(
            "Total Payable: ₹ $total",
            style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
          ),
          const Spacer(),
          Padding(
            padding: const EdgeInsets.all(16),
            child: SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: loading ? null : placeOrder,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xffE46B2D),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                ),
                child: loading
                    ? const SizedBox(
                        height: 24,
                        width: 24,
                        child: CircularProgressIndicator(
                          strokeWidth: 3,
                          color: Colors.white,
                        ),
                      )
                    : const Text(
                        "Pay & Place Order",
                        style: TextStyle(
                            fontSize: 16, fontWeight: FontWeight.w600),
                      ),
              ),
            ),
          )
        ],
      ),
    );
  }
}
