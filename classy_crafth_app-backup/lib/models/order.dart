class Order {
  final String id;
  final String customerName;
  final String phone;
  final String address;
  final double total;
  final List items;
  final String createdAt;

  Order({
    required this.id,
    required this.customerName,
    required this.phone,
    required this.address,
    required this.total,
    required this.items,
    required this.createdAt,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json["_id"] ?? "",
      customerName: json["customerName"] ?? "",
      phone: json["phone"] ?? "",
      address: json["address"] ?? "",
      total: double.parse(json["total"].toString()),
      items: json["items"] ?? [],
      createdAt: json["createdAt"] ?? "",
    );
  }
}
