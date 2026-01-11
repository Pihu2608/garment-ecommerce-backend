let cart = JSON.parse(localStorage.getItem("cart") || "[]");

function renderCart() {
  const box = document.getElementById("cartItems");
  const totalBox = document.getElementById("total");

  box.innerHTML = "";
  let total = 0;

  if(cart.length === 0){
    box.innerHTML = "<p>Your cart is empty.</p>";
    totalBox.innerText = "0";
    return;
  }

  cart.forEach((item, index) => {
    item.qty = item.qty || 1;
    total += item.price * item.qty;

    box.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" onerror="this.src='https://via.placeholder.com/100'"/>
        <div class="cart-info">
          <h4>${item.name}</h4>
          <p>₹ ${item.price}</p>

          <div class="qty">
            <button onclick="changeQty(${index}, -1)">-</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${index}, 1)">+</button>
          </div>

          <div class="remove" onclick="removeItem(${index})">Remove</div>
        </div>
      </div>
    `;
  });

  totalBox.innerText = total;
  localStorage.setItem("cart", JSON.stringify(cart));
}

function changeQty(i, change){
  cart[i].qty += change;
  if(cart[i].qty <= 0){
    cart.splice(i,1);
  }
  renderCart();
}

function removeItem(i){
  cart.splice(i,1);
  renderCart();
}

function checkout(){
  location.href = "checkout.html";
}


renderCart();
