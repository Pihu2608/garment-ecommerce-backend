import '../models/product.dart';

class CartService {
  static final List<CartItem> _cart = [];

  static List<CartItem> get cart => _cart;

  static void add(Product p) {
    final index = _cart.indexWhere((e) => e.product.id == p.id);

    if (index != -1) {
      _cart[index].qty++;
    } else {
      _cart.add(CartItem(product: p, qty: 1));
    }
  }

  static void remove(String productId) {
    _cart.removeWhere((e) => e.product.id == productId);
  }

  static void clear() {
    _cart.clear();
  }

  static double total() {
    double t = 0;
    for (var i in _cart) {
      t += i.product.price * i.qty;
    }
    return t;
  }
}

class CartItem {
  final Product product;
  int qty;

  CartItem({required this.product, required this.qty});
}
