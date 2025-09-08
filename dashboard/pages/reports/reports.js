// // ========== Admin Reports Logic ==========
// export function initAdminReportsPage() {
//   let orders = JSON.parse(localStorage.getItem("orders")) || [];
//   let products = JSON.parse(localStorage.getItem("products")) || [];
//   let users = JSON.parse(localStorage.getItem("users")) || [];

//   let completedOrders = orders.filter((ord) => ord.Status === "Completed");

//   // ===== Monthly Income =====
//   let monthlyIncome = {};
//   completedOrders.forEach((order) => {
//     let date = new Date(order.Date);
//     let monthYear = date.toLocaleString("default", {
//       month: "short",
//       year: "numeric",
//     });
//     monthlyIncome[monthYear] =
//       (monthlyIncome[monthYear] || 0) + Number(order.TotalPrice);
//   });
//   document.getElementById("adminMonthlyIncomeReport").innerHTML =
//     Object.entries(monthlyIncome)
//       .map(
//         ([month, income]) =>
//           `<tr><td>${month}</td><td>$${income.toLocaleString()}</td></tr>`
//       )
//       .join("");

//   // ===== Products by Category =====
//   let categories = products.map((p) => p.category);
//   let uniqueCats = [...new Set(categories)];
//   document.getElementById("adminProductsCategoryReport").innerHTML = uniqueCats
//     .map((cat) => {
//       let count = categories.filter((c) => c === cat).length;
//       return `<tr><td>${cat}</td><td>${count}</td></tr>`;
//     })
//     .join("");

//   // ===== Orders by Status =====
//   let statuses = ["Completed", "Pending", "Shipped", "Cancelled"];
//   document.getElementById("adminOrdersStatusReport").innerHTML = statuses
//     .map((sta) => {
//       let count = orders.filter((o) => o.Status === sta).length;
//       return `<tr><td>${sta}</td><td>${count}</td></tr>`;
//     })
//     .join("");

//   // ===== Revenue by Category =====
//   let revenueByCategory = {};
//   completedOrders.forEach((order) => {
//     order.products.forEach((item) => {
//       let revenue = Number(item.price) * Number(item.quantity);
//       revenueByCategory[item.category] =
//         (revenueByCategory[item.category] || 0) + revenue;
//     });
//   });
//   document.getElementById("adminRevenueCategoryReport").innerHTML =
//     Object.entries(revenueByCategory)
//       .map(
//         ([cat, rev]) =>
//           `<tr><td>${cat}</td><td>$${rev.toLocaleString()}</td></tr>`
//       )
//       .join("");

//   // ===== Users Report =====
//   let activeUsers = users.filter((u) => !u.isDeleted).length;
//   let inactiveUsers = users.filter((u) => u.isDeleted).length;
//   document.getElementById("adminUsersReport").innerHTML = `
//     <tr><td>Active Users</td><td>${activeUsers}</td></tr>
//     <tr><td>Inactive Users</td><td>${inactiveUsers}</td></tr>
//   `;

//   // ===== Top Selling Products =====
//   let productSales = {};
//   completedOrders.forEach((order) => {
//     order.products.forEach((item) => {
//       productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
//     });
//   });
//   let topProducts = Object.entries(productSales)
//     .sort((a, b) => b[1] - a[1])
//     .slice(0, 5);
//   document.getElementById("adminTopProductsReport").innerHTML = topProducts
//     .map(([name, qty]) => `<tr><td>${name}</td><td>${qty}</td></tr>`)
//     .join("");

//   // ===== Seller Performance =====
//   let sellerMap = {};
//   products.forEach((prod) => {
//     sellerMap[prod.sellerId] = prod.sellerName;
//   });

//   let sellerRevenue = {};
//   completedOrders.forEach((order) => {
//     order.products.forEach((item) => {
//       sellerRevenue[item.sellerId] =
//         (sellerRevenue[item.sellerId] || 0) + item.price * item.quantity;
//     });
//   });

//   let topSellers = Object.entries(sellerRevenue).sort((a, b) => b[1] - a[1]);
//   document.getElementById("adminSellerPerformanceReport").innerHTML = topSellers
//     .map(
//       ([id, rev]) =>
//         `<tr><td>${
//           sellerMap[id] || id
//         }</td><td>$${rev.toLocaleString()}</td></tr>`
//     )
//     .join("");

//   // // ===== Print Reports Button =====
//   document.getElementById("printReportsBtn")?.addEventListener("click", () => {
//     let content = document.getElementById("mainContent").innerHTML;

//     let printWindow = window.open("", "_blank", "width=900,height=700");
//     printWindow.document.write(`
//     <html>
//       <head>
//         <title>Admin Reports</title>
//         <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
//         <style>
//           body {
//             padding: 30px;
//             font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
//             background: #fff;
//             color: #333;
//           }

//           h3 {
//             margin-bottom: 30px;
//             text-align: center;
//             font-weight: 600;
//             color: #2c3e50;
//           }

//           h5 {
//             margin: 20px 0 10px;
//             font-weight: 600;
//             color: #34495e;
//           }

//           .report-section {
//             margin-bottom: 30px;
//           }

//           table {
//             width: 100%;
//             border-collapse: collapse;
//             margin-top: 10px;
//             font-size: 14px;
//           }

//           th {
//             background: #2c3e50;
//             color: #fff;
//             padding: 10px;
//             text-align: left;
//           }

//           td {
//             padding: 8px 10px;
//             border: 1px solid #ddd;
//           }

//           tr:nth-child(even) {
//             background: #f9f9f9;
//           }

//           tr:hover {
//             background: #f1f1f1;
//           }

//           /* Remove print button*/
//           #printReportsBtn {
//             display: none !important;
//           }
//         </style>
//       </head>
//       <body>
//         ${content}
//       </body>
//     </html>
//   `);
//     printWindow.document.close();
//     printWindow.focus();
//     printWindow.print();
//     printWindow.onafterprint = () => {
//       printWindow.close();
//     };
//   });

// document.getElementById("downloadAllReportsCSVBtn").addEventListener("click", () => {
//   let orders = JSON.parse(localStorage.getItem("orders")) || [];
//   let products = JSON.parse(localStorage.getItem("products")) || [];
//   let users = JSON.parse(localStorage.getItem("users")) || [];

//   let completedOrders = orders.filter(order => order.Status === "Completed");

//   let csvRows = [];

//   // ===== Monthly Income =====
//   csvRows.push(["Monthly Income Report"]);
//   csvRows.push(["Month-Year", "Total Income ($)"]);
//   let monthlyIncome = {};
//   completedOrders.forEach(order => {
//     let monthYear = new Date(order.Date).toLocaleString("default", { month: "short", year: "numeric" });
//     monthlyIncome[monthYear] = (monthlyIncome[monthYear] || 0) + Number(order.TotalPrice);
//   });
//   for (let [month, income] of Object.entries(monthlyIncome)) {
//     csvRows.push([month, income]);
//   }
//   csvRows.push([]); // empty line

//   // ===== Products by Category =====
//   csvRows.push(["Products by Category"]);
//   csvRows.push(["Category", "Number of Products"]);
//   let categories = products.map(p => p.category);
//   let uniqueCats = [...new Set(categories)];
//   uniqueCats.forEach(cat => {
//     let count = categories.filter(c => c === cat).length;
//     csvRows.push([cat, count]);
//   });
//   csvRows.push([]);

//   // ===== Orders by Status =====
//   csvRows.push(["Orders by Status"]);
//   csvRows.push(["Status", "Orders Count"]);
//   let statuses = ["Completed", "Pending", "Shipped", "Cancelled"];
//   statuses.forEach(status => {
//     let count = orders.filter(o => o.Status === status).length;
//     csvRows.push([status, count]);
//   });
//   csvRows.push([]);

//   // ===== Revenue by Category =====
//   csvRows.push(["Revenue by Category"]);
//   csvRows.push(["Category", "Total Revenue ($)"]);
//   let revenueByCategory = {};
//   completedOrders.forEach(order => {
//     order.products.forEach(item => {
//       revenueByCategory[item.category] = (revenueByCategory[item.category] || 0) + item.price * item.quantity;
//     });
//   });
//   for (let [cat, rev] of Object.entries(revenueByCategory)) {
//     csvRows.push([cat, rev]);
//   }
//   csvRows.push([]);

//   // ===== Users Report =====
//   csvRows.push(["Users Report"]);
//   csvRows.push(["Type", "Count"]);
//   let activeUsers = users.filter(u => !u.isDeleted).length;
//   let inactiveUsers = users.filter(u => u.isDeleted).length;
//   csvRows.push(["Active Users", activeUsers]);
//   csvRows.push(["Inactive Users", inactiveUsers]);
//   csvRows.push([]);

//   // ===== Top Selling Products =====
//   csvRows.push(["Top Selling Products"]);
//   csvRows.push(["Product Name", "Units Sold"]);
//   let productSales = {};
//   completedOrders.forEach(order => {
//     order.products.forEach(item => {
//       productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
//     });
//   });
//   Object.entries(productSales)
//     .sort((a, b) => b[1] - a[1])
//     .slice(0, 5)
//     .forEach(([name, qty]) => {
//       csvRows.push([name, qty]);
//     });
//   csvRows.push([]);

//   // ===== Seller Performance =====
//   csvRows.push(["Seller Performance"]);
//   csvRows.push(["Seller", "Total Revenue ($)"]);
//   let sellerMap = {};
//   products.forEach(prod => {
//     sellerMap[prod.sellerId] = prod.sellerName;
//   });
//   let sellerRevenue = {};
//   completedOrders.forEach(order => {
//     order.products.forEach(item => {
//       sellerRevenue[item.sellerId] = (sellerRevenue[item.sellerId] || 0) + item.price * item.quantity;
//     });
//   });
//   Object.entries(sellerRevenue)
//     .sort((a, b) => b[1] - a[1])
//     .forEach(([id, rev]) => {
//       csvRows.push([sellerMap[id] || id, rev]);
//     });

//   // ===== Convert to CSV String =====
//   let csvContent = csvRows.map(e => e.join(",")).join("\n");

//   // ===== Download CSV =====
//   let blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//   let link = document.createElement("a");
//   link.href = URL.createObjectURL(blob);
//   link.download = "admin_reports.csv";
//   link.click();
// });

// }

// ========== Admin Reports Logic ==========
export function initAdminReportsPage() {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // ========== Render Reports Function (Reusable with filters) ==========
  function renderReports(filteredOrders) {
    let completedOrders = filteredOrders.filter(
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
    document.getElementById("adminProductsCategoryReport").innerHTML =
      uniqueCats
        .map((cat) => {
          let count = categories.filter((c) => c === cat).length;
          return `<tr><td>${cat}</td><td>${count}</td></tr>`;
        })
        .join("");

    // ===== Orders by Status =====
    let statuses = ["Completed", "Pending", "Shipped", "Cancelled"];
    document.getElementById("adminOrdersStatusReport").innerHTML = statuses
      .map((sta) => {
        let count = filteredOrders.filter((o) => o.Status === sta).length;
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
        productSales[item.name] =
          (productSales[item.name] || 0) + item.quantity;
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
    document.getElementById("adminSellerPerformanceReport").innerHTML =
      topSellers
        .map(
          ([id, rev]) =>
            `<tr><td>${
              sellerMap[id] || id
            }</td><td>$${rev.toLocaleString()}</td></tr>`
        )
        .join("");
  }

  // ===== Initial render (no filters) =====
  renderReports(orders);

  // ===== Apply Filters =====
  document.getElementById("applyFiltersBtn")?.addEventListener("click", () => {
    let fromDate = document.getElementById("filterFromDate").value;
    let toDate = document.getElementById("filterToDate").value;
    let status = document.getElementById("filterStatus").value;

    let filteredOrders = orders.filter((o) => {
      let orderDate = new Date(o.Date);
      let afterFrom = fromDate ? orderDate >= new Date(fromDate) : true;
      let beforeTo = toDate ? orderDate <= new Date(toDate) : true;
      let matchStatus = status ? o.Status === status : true;
      return afterFrom && beforeTo && matchStatus;
    });

    renderReports(filteredOrders);
  });

  // ===== Reset Filters =====
  document.getElementById("resetFiltersBtn")?.addEventListener("click", () => {
    document.getElementById("filterFromDate").value = "";
    document.getElementById("filterToDate").value = "";
    document.getElementById("filterStatus").value = "";
    renderReports(orders);
  });

  // ===== Print Reports Button =====
  document.getElementById("printReportsBtn")?.addEventListener("click", () => {
    let content = document.getElementById("mainContent").innerHTML;

    let printWindow = window.open("", "_blank", "width=900,height=700");
    printWindow.document.write(`
    <html>
      <head>
        <title>Admin Reports</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
        <style>
          body { padding: 30px; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
          h3 { margin-bottom: 30px; text-align: center; font-weight: 600; }
          h5 { margin: 20px 0 10px; font-weight: 600; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
          th { background: #2c3e50; color: #fff; padding: 10px; }
          td { padding: 8px 10px; border: 1px solid #ddd; }
          tr:nth-child(even) { background: #f9f9f9; }
          #printReportsBtn { display: none !important; }
        </style>
      </head>
      <body>${content}</body>
    </html>
  `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
  });

  // ===== Download CSV Button =====
document.getElementById("downloadAllReportsCSVBtn")
  ?.addEventListener("click", () => {
    let fromDate = document.getElementById("filterFromDate").value;
    let toDate = document.getElementById("filterToDate").value;
    let status = document.getElementById("filterStatus").value;

    //===> 1- apply same filtering logic used in renderReports
    let filteredOrders = orders.filter((ord) => {
      let orderDate = new Date(ord.Date);
      let afterFrom = fromDate ? orderDate >= new Date(fromDate) : true;
      let beforeTo = toDate ? orderDate <= new Date(toDate) : true;
      let matchStatus = status ? ord.Status === status : true;
      return afterFrom && beforeTo && matchStatus;
    });

    let completedOrders = filteredOrders.filter(
      (order) => order.Status === "Completed"
    );

    let csvRows = [];

    // =====> 2- calculate Monthly Income =====
    csvRows.push(["Monthly Income Report"]);
    csvRows.push(["Month-Year", "Total Income ($)"]);
    let monthlyIncome = {};
    completedOrders.forEach((order) => {
      let monthYear = new Date(order.Date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      monthlyIncome[monthYear] =
        (monthlyIncome[monthYear] || 0) + Number(order.TotalPrice);
    });
    for (let [month, income] of Object.entries(monthlyIncome)) {
      csvRows.push([month, income]);
    }
    csvRows.push([]);

    // =====> 3- Products by Category =====
    csvRows.push(["Products by Category"]);
    csvRows.push(["Category", "Number of Products"]);
    let categories = products.map((p) => p.category);
    let uniqueCats = [...new Set(categories)];
    uniqueCats.forEach((cat) => {
      let count = categories.filter((c) => c === cat).length;
      csvRows.push([cat, count]);
    });
    csvRows.push([]);

    // =====> 4- Orders by Status =====
    csvRows.push(["Orders by Status"]);
    csvRows.push(["Status", "Orders Count"]);
    let statuses = ["Completed", "Pending", "Shipped", "Cancelled"];
    statuses.forEach((status) => {
      let count = filteredOrders.filter((ord) => ord.Status === status).length;
      csvRows.push([status, count]);
    });
    csvRows.push([]);

    // =====> 5- Revenue by Category =====
    csvRows.push(["Revenue by Category"]);
    csvRows.push(["Category", "Total Revenue ($)"]);
    let revenueByCategory = {};
    completedOrders.forEach((order) => {
      order.products.forEach((item) => {
        revenueByCategory[item.category] =
          (revenueByCategory[item.category] || 0) +
          item.price * item.quantity;
      });
    });
    for (let [cat, rev] of Object.entries(revenueByCategory)) {
      csvRows.push([cat, rev]);
    }
    csvRows.push([]);

    // =====> 6- Users Report =====
    csvRows.push(["Users Report"]);
    csvRows.push(["Type", "Count"]);
    let activeUsers = users.filter((u) => !u.isDeleted).length;
    let inactiveUsers = users.filter((u) => u.isDeleted).length;
    csvRows.push(["Active Users", activeUsers]);
    csvRows.push(["Inactive Users", inactiveUsers]);
    csvRows.push([]);

    // =====> 7- Top Selling Products =====
    csvRows.push(["Top Selling Products"]);
    csvRows.push(["Product Name", "Units Sold"]);
    let productSales = {};
    completedOrders.forEach((order) => {
      order.products.forEach((item) => {
        productSales[item.name] =
          (productSales[item.name] || 0) + item.quantity;
      });
    });
    Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([name, qty]) => {
        csvRows.push([name, qty]);
      });
    csvRows.push([]);

    // =====> 8- Seller Performance =====
    csvRows.push(["Seller Performance"]);
    csvRows.push(["Seller", "Total Revenue ($)"]);
    let sellerMap = {};
    products.forEach((prod) => {
      sellerMap[prod.sellerId] = prod.sellerName;
    });
    let sellerRevenue = {};
    completedOrders.forEach((order) => {
      order.products.forEach((item) => {
        sellerRevenue[item.sellerId] =
          (sellerRevenue[item.sellerId] || 0) +
          item.price * item.quantity;
      });
    });
    Object.entries(sellerRevenue)
      .sort((a, b) => b[1] - a[1])
      .forEach(([id, rev]) => {
        csvRows.push([sellerMap[id] || id, rev]);
      });

    // =====> 9- convert to CSV String =====
    let csvContent = csvRows.map((e) => e.join(",")).join("\n");

    // ===== 10- download CSV =====
    let blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "admin_reports.csv";
    link.click();
  });

}
