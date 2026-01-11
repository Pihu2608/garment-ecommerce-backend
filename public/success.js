// success.js

// URL se data nikaalna
const params = new URLSearchParams(window.location.search);
const orderId = params.get("orderId");
const amount = params.get("amount");

if (orderId) document.getElementById("orderId").innerText = orderId;
if (amount) document.getElementById("amount").innerText = amount;

// 🧹 cart clear
localStorage.removeItem("cart");

function goHome() {
  window.location.href = "/";
}
