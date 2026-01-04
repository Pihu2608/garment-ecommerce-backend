const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://garment-ecommerce-backend-production.up.railway.app";

const tableBody = document.querySelector("#ordersTable tbody");

// ===============================
// LOAD ORDERS (WITH INVOICE LOCK)
// ===============================
async function loadOrders() {
  try {
    const res = await fetch(`${API_BASE}/api/admin/orders`);
    const orders = await res.json();

    tableBody.innerHTML = "";

    orders.forEach((order) => {
      const tr = document.createElement("tr");

      // 🔒 Invoice lock condition
      const isLocked =
        order.status === "Delivered" && order.isInvoiceFinal === true;

      tr.innerHTML = `
        <td>${order.companyName}</td>
        <td>${order.phone}</td>
        <td>₹ ${order.total}</td>

        <td>
          <select ${isLocked ? "disabled" : ""}>
            ${["Pending", "Processing", "Delivered", "Cancelled"]
              .map(
                (s) =>
                  `<option value="${s}" ${
                    s === order.status ? "selected" : ""
                  }>${s}</option>`
              )
              .join("")}
          </select>
          ${
            isLocked
              ? `<div style="font-size:11px;color:red;margin-top:4px;">
                   🔒 Invoice Final
                 </div>`
              : ""
          }
        </td>

        <td>
          <button
            onclick="updateStatus('${order._id}', this)"
            ${isLocked ? "disabled" : ""}
          >
            ${isLocked ? "Locked" : "Update"}
          </button>
        </td>
      `;

      tableBody.appendChild(tr);
    });
  } catch (err) {
    alert("❌ Failed to load orders");
  }
}

// ===============================
// UPDATE ORDER STATUS
// ===============================
async function updateStatus(orderId, btn) {
  const row = btn.closest("tr");
  const select = row.querySelector("select");
  const newStatus = select.value;

  btn.disabled = true;
  btn.innerText = "Updating...";

  try {
    const res = await fetch(
      `${API_BASE}/api/admin/orders/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Update failed");
    }

    alert("✅ Status updated successfully");

    // 🔄 Reload to apply lock if Delivered
    loadOrders();
  } catch (err) {
    alert("❌ " + err.message);
  }
}

// ===============================
loadOrders();
