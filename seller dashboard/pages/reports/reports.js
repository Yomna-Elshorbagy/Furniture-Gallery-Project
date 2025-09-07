// ========> Reports Logic <========
export function initReportsPage() {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser || loggedInUser.Role !== "seller") return;

  let sellerId = loggedInUser.ID;
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let products = JSON.parse(localStorage.getItem("products")) || [];

  let sellerOrders = orders.filter((order) =>
    order.products.some((prod) => String(prod.sellerId) === String(sellerId))
  );
  let completedOrders = sellerOrders.filter(
    (ord) => ord.Status === "Completed"
  );

  // ===== Monthly Income =====
  let monthlyIncome = {};
  completedOrders.forEach((order) => {
    let date = new Date(order.Date);
    let monthYear = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    let sellerRevenue = 0;
    order.products.forEach((prod) => {
      if (String(prod.sellerId) === String(sellerId)) {
        sellerRevenue += Number(prod.price) * Number(prod.quantity);
      }
    });
    monthlyIncome[monthYear] = (monthlyIncome[monthYear] || 0) + sellerRevenue;
  });

  let monthlyIncomeBody = document.getElementById("monthlyIncomeReport");
  monthlyIncomeBody.innerHTML = Object.entries(monthlyIncome)
    .map(
      ([month, income]) =>
        `<tr><td>${month}</td><td>$${income.toLocaleString()}</td></tr>`
    )
    .join("");

  // ===== Products by Category =====
  let sellerProducts = products.filter(
    (p) => String(p.sellerId) === String(sellerId)
  );
  let categories = sellerProducts.map((p) => p.category);
  let mainCategories = [...new Set(categories)];
  let productsCategoryBody = document.getElementById("productsCategoryReport");
  productsCategoryBody.innerHTML = mainCategories
    .map((cat) => {
      let count = categories.filter((c) => c === cat).length;
      return `<tr><td>${cat}</td><td>${count}</td></tr>`;
    })
    .join("");

  // ===== Orders by Status =====
  let statusList = ["Completed", "Pending", "Shipped", "Cancelled"];
  let ordersStatusBody = document.getElementById("ordersStatusReport");
  ordersStatusBody.innerHTML = statusList
    .map((sta) => {
      let count = sellerOrders.filter((o) => o.Status === sta).length;
      return `<tr><td>${sta}</td><td>${count}</td></tr>`;
    })
    .join("");

  // ===== Revenue by Category =====
  let revenueByCategory = {};
  completedOrders.forEach((order) => {
    order.products.forEach((item) => {
      if (String(item.sellerId) === String(sellerId)) {
        let revenue = Number(item.price) * Number(item.quantity);
        revenueByCategory[item.category] =
          (revenueByCategory[item.category] || 0) + revenue;
      }
    });
  });

  let revenueCategoryBody = document.getElementById("revenueCategoryReport");
  revenueCategoryBody.innerHTML = Object.entries(revenueByCategory)
    .map(
      ([cat, rev]) =>
        `<tr><td>${cat}</td><td>$${rev.toLocaleString()}</td></tr>`
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

  document
    .getElementById("SellerReportsCSVBtn")
    ?.addEventListener("click", () => {
      let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!loggedInUser || loggedInUser.Role !== "seller") return;

      let sellerId = loggedInUser.ID;
      let orders = JSON.parse(localStorage.getItem("orders")) || [];
      let products = JSON.parse(localStorage.getItem("products")) || [];

      let sellerOrders = orders.filter((order) =>
        order.products.some(
          (prod) => String(prod.sellerId) === String(sellerId)
        )
      );
      let completedOrders = sellerOrders.filter(
        (ord) => ord.Status === "Completed"
      );

      let csvRows = [];

      // ===== Monthly Income =====
      csvRows.push(["Monthly Income Report"]);
      csvRows.push(["Month-Year", "Total Income ($)"]);
      let monthlyIncome = {};
      completedOrders.forEach((order) => {
        let monthYear = new Date(order.Date).toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        let sellerRevenue = 0;
        order.products.forEach((prod) => {
          if (String(prod.sellerId) === String(sellerId)) {
            sellerRevenue += Number(prod.price) * Number(prod.quantity);
          }
        });
        monthlyIncome[monthYear] =
          (monthlyIncome[monthYear] || 0) + sellerRevenue;
      });
      for (let [month, income] of Object.entries(monthlyIncome)) {
        csvRows.push([month, income]);
      }
      csvRows.push([]);

      // ===== Products by Category =====
      csvRows.push(["Products by Category"]);
      csvRows.push(["Category", "Number of Products"]);
      let sellerProducts = products.filter(
        (prod) => String(prod.sellerId) === String(sellerId)
      );
      let categories = sellerProducts.map((p) => p.category);
      let mainCategories = [...new Set(categories)];
      mainCategories.forEach((cat) => {
        let count = categories.filter((c) => c === cat).length;
        csvRows.push([cat, count]);
      });
      csvRows.push([]);

      // ===== Orders by Status =====
      csvRows.push(["Orders by Status"]);
      csvRows.push(["Status", "Orders Count"]);
      let statusList = ["Completed", "Pending", "Shipped", "Cancelled"];
      statusList.forEach((status) => {
        let count = sellerOrders.filter((ord) => ord.Status === status).length;
        csvRows.push([status, count]);
      });
      csvRows.push([]);

      // ===== Revenue by Category =====
      csvRows.push(["Revenue by Category"]);
      csvRows.push(["Category", "Total Revenue ($)"]);
      let revenueByCategory = {};
      completedOrders.forEach((order) => {
        order.products.forEach((item) => {
          if (String(item.sellerId) === String(sellerId)) {
            let revenue = Number(item.price) * Number(item.quantity);
            revenueByCategory[item.category] =
              (revenueByCategory[item.category] || 0) + revenue;
          }
        });
      });
      for (let [cat, rev] of Object.entries(revenueByCategory)) {
        csvRows.push([cat, rev]);
      }

      // ===== convert to CSV String =====
      let csvContent = csvRows.map((e) => e.join(",")).join("\n");

      // ===== download CSV =====
      let blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      let link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "seller_reports.csv";
      link.click();
    });
}
