// 🔐 AUTH GUARD
const token = localStorage.getItem("adminToken");
if (!token) {
  window.location.href = "/admin/login.html";
}

// 📊 LOAD DASHBOARD STATS
async function loadDashboard() {
  try {
    const res = await fetch("/api/admin/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!data.success) {
      alert("Failed to load dashboard");
      return;
    }

    const s = data.stats;

    document.getElementById("totalOrders").innerText = s.totalOrders;
    document.getElementById("pendingOrders").innerText = s.pendingOrders;
    document.getElementById("processingOrders").innerText = s.processingOrders;
    document.getElementById("deliveredOrders").innerText = s.deliveredOrders;
    document.getElementById("cancelledOrders").innerText = s.cancelledOrders;
    document.getElementById("totalRevenue").innerText = s.totalRevenue;

  } catch (err) {
    alert("Server error");
  }
}

loadDashboard();
