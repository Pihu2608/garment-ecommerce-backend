const API_BASE =
  "https://garment-ecommerce-backend-production.up.railway.app/api";

async function loadOrders() {
  const res = await fetch(`${API_BASE}/admin/orders`);
  const orders = await res.json();

  const tbody = document.querySelector("#ordersTable tbody");
  tbody.innerHTML = "";

  orders.forEach((order) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${order.companyName}</td>
      <td>${order.phone}</td>
      <td>₹ ${order.total}</td>
      <td>
        <select id="status-${order._id}">
          <option ${order.status === "Pending" ? "selected" : ""}>Pending</option>
          <option ${order.status === "Processing" ? "selected" : ""}>Processing</option>
          <option ${order.status === "Delivered" ? "selected" : ""}>Delivered</option>
          <option ${order.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
        </select>
      </td>
      <td>
        <button onclick="updateStatus('${order._id}')">Update</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

async function updateStatus(orderId) {
  const status = document.getElementById(`status-${orderId}`).value;

  await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  alert("Status updated");
  loadOrders();
}

loadOrders();
