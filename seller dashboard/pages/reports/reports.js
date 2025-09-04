
// ========> Reports Logic <========
export function initReportsPage() {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser || loggedInUser.Role !== "seller") return;

  let sellerId = loggedInUser.ID;
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let products = JSON.parse(localStorage.getItem("products")) || [];

  let sellerOrders = orders.filter(order =>
    order.products.some(prod => String(prod.sellerId) === String(sellerId))
  );
  let completedOrders = sellerOrders.filter(ord => ord.Status === "Completed");

  // ===== Monthly Income =====
  let monthlyIncome = {};
  completedOrders.forEach(order => {
    let date = new Date(order.Date);
    let monthYear = date.toLocaleString("default", { month: "short", year: "numeric" });
    let sellerRevenue = 0;
    order.products.forEach(prod => {
      if (String(prod.sellerId) === String(sellerId)) {
        sellerRevenue += Number(prod.price) * Number(prod.quantity);
      }
    });
    monthlyIncome[monthYear] = (monthlyIncome[monthYear] || 0) + sellerRevenue;
  });

  let monthlyIncomeBody = document.getElementById("monthlyIncomeReport");
  monthlyIncomeBody.innerHTML = Object.entries(monthlyIncome)
    .map(([month, income]) => `<tr><td>${month}</td><td>$${income.toLocaleString()}</td></tr>`)
    .join("");

  // ===== Products by Category =====
  let sellerProducts = products.filter(p => String(p.sellerId) === String(sellerId));
  let categories = sellerProducts.map(p => p.category);
  let mainCategories = [...new Set(categories)];
  let productsCategoryBody = document.getElementById("productsCategoryReport");
  productsCategoryBody.innerHTML = mainCategories
    .map(cat => {
      let count = categories.filter(c => c === cat).length;
      return `<tr><td>${cat}</td><td>${count}</td></tr>`;
    })
    .join("");

  // ===== Orders by Status =====
  let statusList = ["Completed", "Pending", "Shipped", "Cancelled"];
  let ordersStatusBody = document.getElementById("ordersStatusReport");
  ordersStatusBody.innerHTML = statusList
    .map(sta => {
      let count = sellerOrders.filter(o => o.Status === sta).length;
      return `<tr><td>${sta}</td><td>${count}</td></tr>`;
    })
    .join("");

  // ===== Revenue by Category =====
  let revenueByCategory = {};
  completedOrders.forEach(order => {
    order.products.forEach(item => {
      if (String(item.sellerId) === String(sellerId)) {
        let revenue = Number(item.price) * Number(item.quantity);
        revenueByCategory[item.category] = (revenueByCategory[item.category] || 0) + revenue;
      }
    });
  });

  let revenueCategoryBody = document.getElementById("revenueCategoryReport");
  revenueCategoryBody.innerHTML = Object.entries(revenueByCategory)
    .map(([cat, rev]) => `<tr><td>${cat}</td><td>$${rev.toLocaleString()}</td></tr>`)
    .join("");
}
