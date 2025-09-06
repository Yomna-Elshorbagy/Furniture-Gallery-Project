// ========== Admin Reports Logic ==========
export function initAdminReportsPage() {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let users = JSON.parse(localStorage.getItem("users")) || [];

  let completedOrders = orders.filter((ord) => ord.Status === "Completed");

  // ===== Monthly Income =====
  let monthlyIncome = {};
  completedOrders.forEach((order) => {
    let date = new Date(order.Date);
    let monthYear = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    monthlyIncome[monthYear] =
      (monthlyIncome[monthYear] || 0) + Number(order.TotalPrice);
  });
  document.getElementById("adminMonthlyIncomeReport").innerHTML =
    Object.entries(monthlyIncome)
      .map(
        ([month, income]) =>
          `<tr><td>${month}</td><td>$${income.toLocaleString()}</td></tr>`
      )
      .join("");

  // ===== Products by Category =====
  let categories = products.map((p) => p.category);
  let uniqueCats = [...new Set(categories)];
  document.getElementById("adminProductsCategoryReport").innerHTML = uniqueCats
    .map((cat) => {
      let count = categories.filter((c) => c === cat).length;
      return `<tr><td>${cat}</td><td>${count}</td></tr>`;
    })
    .join("");

  // ===== Orders by Status =====
  let statuses = ["Completed", "Pending", "Shipped", "Cancelled"];
  document.getElementById("adminOrdersStatusReport").innerHTML = statuses
    .map((sta) => {
      let count = orders.filter((o) => o.Status === sta).length;
      return `<tr><td>${sta}</td><td>${count}</td></tr>`;
    })
    .join("");

  // ===== Revenue by Category =====
  let revenueByCategory = {};
  completedOrders.forEach((order) => {
    order.products.forEach((item) => {
      let revenue = Number(item.price) * Number(item.quantity);
      revenueByCategory[item.category] =
        (revenueByCategory[item.category] || 0) + revenue;
    });
  });
  document.getElementById("adminRevenueCategoryReport").innerHTML =
    Object.entries(revenueByCategory)
      .map(
        ([cat, rev]) =>
          `<tr><td>${cat}</td><td>$${rev.toLocaleString()}</td></tr>`
      )
      .join("");

  // ===== Users Report =====
  let activeUsers = users.filter((u) => !u.isDeleted).length;
  let inactiveUsers = users.filter((u) => u.isDeleted).length;
  document.getElementById("adminUsersReport").innerHTML = `
    <tr><td>Active Users</td><td>${activeUsers}</td></tr>
    <tr><td>Inactive Users</td><td>${inactiveUsers}</td></tr>
  `;

  // ===== Top Selling Products =====
  let productSales = {};
  completedOrders.forEach((order) => {
    order.products.forEach((item) => {
      productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
    });
  });
  let topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  document.getElementById("adminTopProductsReport").innerHTML = topProducts
    .map(([name, qty]) => `<tr><td>${name}</td><td>${qty}</td></tr>`)
    .join("");

  // ===== Seller Performance =====
  let sellerMap = {};
  products.forEach((prod) => {
    sellerMap[prod.sellerId] = prod.sellerName;
  });

  let sellerRevenue = {};
  completedOrders.forEach((order) => {
    order.products.forEach((item) => {
      sellerRevenue[item.sellerId] =
        (sellerRevenue[item.sellerId] || 0) + item.price * item.quantity;
    });
  });

  let topSellers = Object.entries(sellerRevenue).sort((a, b) => b[1] - a[1]);
  document.getElementById("adminSellerPerformanceReport").innerHTML = topSellers
    .map(
      ([id, rev]) =>
        `<tr><td>${
          sellerMap[id] || id
        }</td><td>$${rev.toLocaleString()}</td></tr>`
    )
    .join("");

  // // ===== Print Reports Button =====
  document.getElementById("printReportsBtn")?.addEventListener("click", () => {
    let content = document.getElementById("mainContent").innerHTML;

    let printWindow = window.open("", "_blank", "width=900,height=700");
    printWindow.document.write(`
    <html>
      <head>
        <title>Admin Reports</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
        <style>
          body {
            padding: 30px;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            background: #fff;
            color: #333;
          }

          h3 {
            margin-bottom: 30px;
            text-align: center;
            font-weight: 600;
            color: #2c3e50;
          }

          h5 {
            margin: 20px 0 10px;
            font-weight: 600;
            color: #34495e;
          }

          .report-section {
            margin-bottom: 30px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 14px;
          }

          th {
            background: #2c3e50;
            color: #fff;
            padding: 10px;
            text-align: left;
          }

          td {
            padding: 8px 10px;
            border: 1px solid #ddd;
          }

          tr:nth-child(even) {
            background: #f9f9f9;
          }

          tr:hover {
            background: #f1f1f1;
          }

          /* Remove print button*/
          #printReportsBtn {
            display: none !important;
          }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.onafterprint = () => {
      printWindow.close();
    };
  });
}
