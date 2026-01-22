import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../config/app_config.dart';

class ApiClient {
  static Future<dynamic> get(String path) async {
    final res = await http
        .get(Uri.parse("${AppConfig.apiBaseUrl}$path"))
        .timeout(const Duration(seconds: AppConfig.apiTimeout));

    return _handle(res);
  }

  static Future<dynamic> post(String path, Map data) async {
    final res = await http
        .post(
          Uri.parse("${AppConfig.apiBaseUrl}$path"),
          headers: {"Content-Type": "application/json"},
          body: jsonEncode(data),
        )
        .timeout(const Duration(seconds: AppConfig.apiTimeout));

    return _handle(res);
  }

  static dynamic _handle(http.Response res) {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return jsonDecode(res.body);
    } else {
      throw Exception("Server error ${res.statusCode}");
    }
  }
}
