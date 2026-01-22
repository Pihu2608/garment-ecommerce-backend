const API = "https://garment-ecommerce-backend-production.up.railway.app/api/products";


async function loadProducts() {
  const res = await fetch(API);
  const products = await res.json();

  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  products.forEach(p => {
    grid.innerHTML += `
      <div class="card">
        <img src="${p.image}" onerror="this.src='https://via.placeholder.com/300'"/>
        <h3>${p.name}</h3>
        <p class="price">₹ ${p.price}</p>
        <button class="btn" onclick='addToCart(${JSON.stringify(p)})'>Add to Cart</button>
      </div>
    `;
  });
}

function scrollToProducts() {
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
}

loadProducts();
