class Product {
  final String id;
  final String name;
  final double price;
  final String description;
  final String image;

  Product({
    required this.id,
    required this.name,
    required this.price,
    required this.description,
    required this.image,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json["_id"] ?? "",
      name: json["name"] ?? "",
      price: double.parse(json["price"].toString()),
      description: json["description"] ?? "",
      image: json["image"] ?? "",
    );
  }
}
