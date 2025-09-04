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
}
