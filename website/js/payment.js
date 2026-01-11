const total = localStorage.getItem("order_total");
document.getElementById("amount").innerText = total || 0;

async function payNow() {
  if (!total || total == 0) {
    alert("No amount found");
    return;
  }

  // 1️⃣ Create Razorpay order from backend
  const res = await fetch("http://localhost:5000/api/payment/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: total })
  });

  const data = await res.json();

  if (!data.success) {
    alert("Payment init failed");
    return;
  }

  // 2️⃣ Open Razorpay checkout
  const options = {
    key: data.key, // Razorpay public key
    amount: data.order.amount,
    currency: "INR",
    name: "ClassyCrafth",
    description: "Garments Purchase",
    order_id: data.order.id,

    handler: async function (response) {
      // 3️⃣ Verify payment
      const verify = await fetch("http://localhost:5000/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response)
      });

      const result = await verify.json();

      if (result.success) {
        alert("🎉 Payment successful!");
        localStorage.removeItem("cart");
        localStorage.removeItem("order_total");
        location.href = "success.html";
      } else {
        alert("Payment verification failed");
      }
    },

    theme: { color: "#e91e63" }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}
