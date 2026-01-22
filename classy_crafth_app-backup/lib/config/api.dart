class ApiConfig {
  static const String baseUrl =
      "https://garment-ecommerce-backend-production.up.railway.app/api";

  static const String products = "$baseUrl/products";
  static const String orders = "$baseUrl/orders";
  static const String login = "$baseUrl/auth/login";
  static const String register = "$baseUrl/auth/register";
  static const String createPayment = "$baseUrl/payment/create";
  static const String verifyPayment = "$baseUrl/payment/verify";
}
