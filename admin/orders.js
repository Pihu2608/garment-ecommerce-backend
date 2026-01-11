const API = "/api/admin/orders";
const token = localStorage.getItem("adminToken");

if(!token){
  location.href = "login.html";
}

async function loadOrders(){
  const q = document.getElementById("search").value;
  const paymentStatus = document.getElementById("paymentFilter").value;
  const status = document.getElementById("statusFilter").value;

  let url = API + "?";
  if(q) url += "q=" + q + "&";
  if(paymentStatus) url += "paymentStatus=" + paymentStatus + "&";
  if(status) url += "status=" + status;

  const res = await fetch(url,{
    headers:{ Authorization:"Bearer "+token }
  });

  const data = await res.json();
  renderOrders(data.orders || []);
}

function renderOrders(orders){
  const table = document.getElementById("ordersTable");
  const mobile = document.getElementById("ordersMobile");

  table.innerHTML = "";
  mobile.innerHTML = "";

  orders.forEach(o=>{
    table.innerHTML += `
      <tr>
        <td>${o._id}</td>
        <td>${o.customerName}</td>
        <td>${o.phone}</td>
        <td>₹${o.total}</td>
        <td class="${o.paymentStatus==="PAID"?"paid":"pending"}">${o.paymentStatus}</td>
        <td>${o.status}</td>
        <td>
          <select onchange="updateStatus('${o._id}',this.value)">
            ${["PENDING","PROCESSING","DELIVERED","CANCELLED"].map(s=>
              `<option ${o.status===s?"selected":""}>${s}</option>`
            ).join("")}
          </select>
        </td>
      </tr>
    `;

    mobile.innerHTML += `
      <div class="card">
        <b>${o.customerName}</b> (${o.phone})<br/>
        ₹${o.total} | <span class="${o.paymentStatus==="PAID"?"paid":"pending"}">${o.paymentStatus}</span><br/>
        Status:
        <select onchange="updateStatus('${o._id}',this.value)">
          ${["PENDING","PROCESSING","DELIVERED","CANCELLED"].map(s=>
            `<option ${o.status===s?"selected":""}>${s}</option>`
          ).join("")}
        </select>
      </div>
    `;
  });
}

async function updateStatus(id,status){
  if(!confirm("Update order status?")) return;

  await fetch("/api/admin/orders/"+id+"/status",{
    method:"PUT",
    headers:{
      "Content-Type":"application/json",
      Authorization:"Bearer "+token
    },
    body: JSON.stringify({ status })
  });

  loadOrders();
}

loadOrders();
