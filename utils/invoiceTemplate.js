function invoiceHTML(order) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial; }
    table { width:100%; border-collapse: collapse; }
    th, td { border:1px solid #000; padding:6px; font-size:13px; }
    th { background:#eee; }
    .right { text-align:right; }
  </style>
</head>
<body>

<h2>GUJARAT FREIGHT TOOLS</h2>
<p><b>GST TAX INVOICE</b></p>

<table>
<tr>
  <td><b>Customer:</b> ${order.customerName}</td>
  <td><b>Invoice No:</b> INV-${order._id.slice(-6)}</td>
</tr>
<tr>
  <td><b>Phone:</b> ${order.phone}</td>
  <td><b>Date:</b> ${new Date(order.createdAt).toLocaleDateString()}</td>
</tr>
<tr>
  <td colspan="2"><b>Address:</b> ${order.address}</td>
</tr>
</table>

<br>

<table>
<tr>
  <th>Sr</th>
  <th>Description</th>
  <th>Qty</th>
  <th>Rate</th>
  <th>Taxable</th>
  <th>GST%</th>
  <th>GST Amt</th>
  <th>Total</th>
</tr>

${order.items.map((item, i) => {
  const tax = item.price * item.qty * 0.18;
  return `
  <tr>
    <td>${i + 1}</td>
    <td>${item.name}</td>
    <td>${item.qty}</td>
    <td>${item.price}</td>
    <td>${item.price * item.qty}</td>
    <td>18%</td>
    <td>${tax.toFixed(2)}</td>
    <td>${(item.price * item.qty + tax).toFixed(2)}</td>
  </tr>
  `;
}).join("")}

</table>

<br>

<h3 class="right">
Total Amount: ₹ ${order.items.reduce((s, i) => s + (i.price * i.qty * 1.18), 0).toFixed(2)}
</h3>

<p>This is a computer generated invoice.</p>

</body>
</html>
`;
}

module.exports = invoiceHTML;
