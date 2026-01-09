const token = localStorage.getItem("adminToken");

// 🔐 agar token hi nahi hai → login page
if (!token) {
  location.href = "login.html";
}

async function loadDashboard() {
  try {
    const res = await fetch("/api/admin/dashboard", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    // 🔐 token invalid / expired
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("adminToken");
      location.href = "login.html";
      return;
    }

    const data = await res.json();

    document.getElementById("totalOrders").innerText = data.totalOrders || 0;
    document.getElementById("pendingOrders").innerText = data.pending || 0;
    document.getElementById("processingOrders").innerText = data.processing || 0;
    document.getElementById("deliveredOrders").innerText = data.delivered || 0;
    document.getElementById("cancelledOrders").innerText = data.cancelled || 0;
    document.getElementById("totalRevenue").innerText = data.revenue || 0;

  } catch (err) {
    console.log("Dashboard error:", err.message);
    localStorage.removeItem("adminToken");
    location.href = "login.html";
  }
}

loadDashboard();
