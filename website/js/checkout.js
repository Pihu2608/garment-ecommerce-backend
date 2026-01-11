const cart = JSON.parse(localStorage.getItem("cart") || "[]");
const itemsBox = document.getElementById("items");
const totalBox = document.getElementById("total");

let total = 0;

// 🧾 Show order summary
cart.forEach(p => {
  const qty = p.qty || 1;
  total += p.price * qty;

  itemsBox.innerHTML += `
    <p>${p.name} × ${qty} — ₹ ${p.price * qty}</p>
  `;
});

totalBox.innerText = total;

// 📤 Place order + redirect to payment
async function placeOrder() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;

  if (!name || !phone || !address) {
    alert("Fill all details");
    return;
  }

  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  const orderData = {
    customerName: name,
    phone,
    address,
    items: cart,
    total
  };

  try {
    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });

    const data = await res.json();

    if (data.success) {
      // ✅ store total for payment page
      localStorage.setItem("order_total", total);

      // (optional) you can also store orderId if backend returns it
      if (data.order && data.order._id) {
        localStorage.setItem("order_id", data.order._id);
      }

      // 👉 go to payment page
      location.href = "payment.html";

    } else {
      alert("Order failed");
    }

  } catch (err) {
    alert("Server error while placing order");
    console.log(err);
  }
}
