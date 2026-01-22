// loading lock + payment verify + order create
// (final version – shortened for clarity)

if (loading) return const Center(child: CircularProgressIndicator());

ElevatedButton(
  onPressed: () {
    if (loading) return;
    setState(() => loading = true);

    PaymentService.startPayment(
      amount: total.toInt(),
      name: widget.name,
      phone: widget.phone,
      onSuccess: (res) async {
        await OrderService.verifyAndCreateOrder(res);
        Navigator.pushReplacement(context,
          MaterialPageRoute(builder: (_) => const OrderSuccessScreen()));
      },
      onFail: (res) {
        setState(() => loading = false);
        Navigator.push(context,
          MaterialPageRoute(builder: (_) => const OrderFailedScreen()));
      },
    );
  },
  child: const Text("Pay Securely"),
)
