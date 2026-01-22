import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/product.dart';

class ApiService {
  static const String baseUrl =
      "https://garment-ecommerce-backend-production.up.railway.app";

  static Future<List<Product>> getProducts() async {
    final res = await http.get(Uri.parse("$baseUrl/api/products"));

    if (res.statusCode == 200) {
      final List data = json.decode(res.body);
      return data.map((e) => Product.fromJson(e)).toList();
    } else {
      throw Exception("Failed to load products");
    }
  }
}
