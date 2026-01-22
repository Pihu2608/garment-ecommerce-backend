import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../config/api.dart';
import '../models/product.dart';

class ProductService {
  // ✅ GET all products
  static Future<List<Product>> fetchProducts() async {
    final res = await http.get(Uri.parse(ApiConfig.products));

    if (res.statusCode == 200) {
      final List data = jsonDecode(res.body);
      return data.map((e) => Product.fromJson(e)).toList();
    } else {
      throw Exception("Failed to load products");
    }
  }

  // ✅ ADD product
  static Future<bool> addProduct({
    required String name,
    required String price,
    required String description,
    File? imageFile,
  }) async {
    var request = http.MultipartRequest(
      'POST',
      Uri.parse(ApiConfig.products),
    );

    request.fields['name'] = name;
    request.fields['price'] = price;
    request.fields['description'] = description;

    if (imageFile != null) {
      request.files.add(
        await http.MultipartFile.fromPath('image', imageFile.path),
      );
    }

    var res = await request.send();
    return res.statusCode == 200 || res.statusCode == 201;
  }

  // ✅ UPDATE product
  static Future<bool> updateProduct({
    required String id,
    required String name,
    required String price,
    required String description,
    File? imageFile,
  }) async {
    var request = http.MultipartRequest(
      'PUT',
      Uri.parse("${ApiConfig.products}/$id"),
    );

    request.fields['name'] = name;
    request.fields['price'] = price;
    request.fields['description'] = description;

    if (imageFile != null) {
      request.files.add(
        await http.MultipartFile.fromPath('image', imageFile.path),
      );
    }

    var res = await request.send();
    return res.statusCode == 200;
  }

  // ✅ DELETE product
  static Future<bool> deleteProduct(String id) async {
    final res = await http.delete(
      Uri.parse("${ApiConfig.products}/$id"),
    );

    return res.statusCode == 200;
  }
}
