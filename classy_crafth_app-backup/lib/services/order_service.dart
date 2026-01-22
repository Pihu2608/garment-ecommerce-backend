import 'dart:convert';
import 'package:http/http.dart' as http;

class OrderService {
  // 🔧 CHANGE THIS when going live
  // Android emulator: http://10.0.2.2:5000
  // Real device: http://YOUR_IP:5000
  static const String baseUrl = "http://192.168.0.152:5000/api/orders";

  /* ===============================
     ✅ CREATE ORDER
  =============================== */
  static Future<bool> createOrder(Map<String, dynamic> orderData) async {
    try {
      final res = await http.post(
        Uri.parse(baseUrl),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode(orderData),
      );

      if (res.statusCode == 200 || res.statusCode == 201) {
        return true;
      } else {
        print("❌ Create order failed: ${res.body}");
        return false;
      }
    } catch (e) {
      print("❌ Create order error: $e");
      return false;
    }
  }

  /* ===============================
     ✅ FETCH MY ORDERS
  =============================== */
  static Future<List<Map<String, dynamic>>> fetchMyOrders() async {
    try {
      final res = await http.get(Uri.parse(baseUrl));

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data is List) {
          return List<Map<String, dynamic>>.from(data);
        } else {
          return [];
        }
      } else {
        print("❌ Fetch orders failed: ${res.body}");
        return [];
      }
    } catch (e) {
      print("❌ Fetch orders error: $e");
      return [];
    }
  }
}
