// ===============================
// 🔐 ADMIN AUTH GUARD
// ===============================
const token = localStorage.getItem("adminToken");
if (!token) {
  window.location.href = "/admin/login.html";
}

// ===============================
// API BASE URL (AUTO)
// ===============================
const API_BASE = location.origin;

// ===============================
// LOAD ALL ORDERS
// ===============================
async function loadOrders() {
  try {
    const res = await fetch(`${API_BASE}/api/admin/orders`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
    });

    const orders = await res.json();
    const tbody = document.querySelector("#ordersTable tbody");
    tbody.innerHTML = "";

    orders.forEach((order) => {
      const tr = document.createElement("tr");

      const locked = order.isInvoiceFinal === true;

      tr.innerHTML = `
        <td>${order.companyName}</td>
        <td>${order.phone}</td>
        <td>₹ ${order.total}</td>

        <td>
          <select ${locked ? "disabled" : ""} id="status-${order._id}">
            <option ${order.status === "Pending" ? "selected" : ""}>Pending</option>
            <option ${order.status === "Processing" ? "selected" : ""}>Processing</option>
            <option ${order.status === "Delivered" ? "selected" : ""}>Delivered</option>
            <option ${order.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
          </select>
          ${
            locked
              ? `<div style="color:red;font-size:12px;margin-top:4px;">🔒 Invoice Final</div>`
              : ""
          }
        </td>

        <td>
          ${
            locked
              ? `<button disabled style="opacity:0.6">Locked</button>`
              : `<button onclick="updateStatus('${order._id}')">Update</button>`
          }
        </td>
      `;

      tbody.appendChild(tr);
    });
  } catch (err) {
    alert("Failed to load orders");
    console.error(err);
  }
}

// ===============================
// UPDATE ORDER STATUS
// ===============================
async function updateStatus(orderId) {
  const status = document.getElementById(`status-${orderId}`).value;

  try {
    const res = await fetch(
      `${API_BASE}/api/admin/orders/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({ status }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Status update failed");
      return;
    }

    alert("✅ Status updated successfully");
    loadOrders(); // reload table
  } catch (err) {
    alert("Server error");
    console.error(err);
  }
}

// ===============================
// INIT
// ===============================
loadOrders();
