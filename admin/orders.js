const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://garment-ecommerce-backend-production.up.railway.app";

const tableBody = document.querySelector("#ordersTable tbody");

// ===============================
// LOAD ORDERS
// ===============================
async function loadOrders() {
  try {
    const res = await fetch(`${API_BASE}/api/admin/orders`);
    const orders = await res.json();

    tableBody.innerHTML = "";

    orders.forEach((order) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${order.companyName}</td>
        <td>${order.phone}</td>
        <td>₹ ${order.total}</td>
        <td>
          <select data-id="${order._id}">
            ${["Pending", "Processing", "Delivered", "Cancelled"]
              .map(
                (s) =>
                  `<option value="${s}" ${
                    s === order.status ? "selected" : ""
                  }>${s}</option>`
              )
              .join("")}
          </select>
        </td>
        <td>
          <button onclick="updateStatus('${order._id}', this)">
            Update
          </button>
        </td>
      `;

      tableBody.appendChild(tr);
    });
  } catch (err) {
    alert("Failed to load orders");
  }
}

// ===============================
// UPDATE STATUS
// ===============================
async function updateStatus(orderId, btn) {
  const select = btn.parentElement.parentElement.querySelector("select");
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
  } catch (err) {
    alert("❌ " + err.message);
  } finally {
    btn.disabled = false;
    btn.innerText = "Update";
  }
}

// ===============================
loadOrders();
