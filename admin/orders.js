const API_BASE =
  "https://garment-ecommerce-backend-production.up.railway.app";

const tableBody = document.querySelector("#ordersTable tbody");

// ===============================
// LOAD ORDERS
// ===============================
async function loadOrders() {
  const res = await fetch(`${API_BASE}/api/admin/orders`);
  const orders = await res.json();

  tableBody.innerHTML = "";

  orders.forEach((order) => {
    const tr = document.createElement("tr");

    const locked = order.isInvoiceFinal === true;

    tr.innerHTML = `
      <td>${order.companyName}</td>
      <td>${order.phone}</td>
      <td>₹ ${order.total}</td>
      <td>
        <select ${locked ? "disabled" : ""}>
          <option ${order.status === "Pending" ? "selected" : ""}>Pending</option>
          <option ${order.status === "Processing" ? "selected" : ""}>Processing</option>
          <option ${order.status === "Delivered" ? "selected" : ""}>Delivered</option>
          <option ${order.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
        </select>
        ${locked ? "<br><small style='color:red'>🔒 Invoice Final</small>" : ""}
      </td>
      <td>
        ${
          locked
            ? "<button disabled>Locked</button>"
            : `<button onclick="updateStatus('${order._id}', this)">Update</button>`
        }
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

// ===============================
// UPDATE STATUS
// ===============================
async function updateStatus(orderId, btn) {
  const row = btn.closest("tr");
  const status = row.querySelector("select").value;

  btn.innerText = "Updating...";
  btn.disabled = true;

  const res = await fetch(
    `${API_BASE}/api/admin/orders/${orderId}/status`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }
  );

  const data = await res.json();

  alert(data.message || "Updated");

  loadOrders();
}

// INITIAL LOAD
loadOrders();