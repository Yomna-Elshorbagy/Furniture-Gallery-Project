export function initOverviewPage() {
  // =========> 1- get logged in seller <=========
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser || loggedInUser.Role !== "seller") return;

  let sellerId = loggedInUser.ID;

  // =========> 2- Orders Data filtered by seller <===========
  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  let sellerOrders = orders.filter((order) =>
    order.products.some((prod) => String(prod.sellerId) === String(sellerId))
  );
  let completedOrders = sellerOrders.filter(
    (ord) => ord.Status === "Completed"
  );

  // =====> 3- monthly Income from seller products only <=====
  let monthlyIncome = {};
  completedOrders.forEach((order) => {
    let date = new Date(order.Date);
    let monthYear = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    //====> 4- calculate only seller's share of TotalPrice <=====
    let sellerRevenue = 0;
    order.products.forEach((prod) => {
      if (String(prod.sellerId) === String(sellerId)) {
        sellerRevenue += Number(prod.price) * Number(prod.quantity);
      }
    });

    monthlyIncome[monthYear] = (monthlyIncome[monthYear] || 0) + sellerRevenue;
  });

  let orderDate = Object.keys(monthlyIncome);
  let totalPrice = Object.values(monthlyIncome);

  // my favorite pastel colors 👀
  const pastelColors = [
    "#A5C9CA",
    "#E7F6F2",
    "#FAD4D4",
    "#FFE699",
    "#D9D7F1",
    "#B8DFD8",
    "#FFD1BA",
    "#C7E9B0",
    "#FFC4D6",
    "#D6E5FA",
    "#FFF5C0",
    "#D4ECDD",
  ];

  // =====> Chart 1: Monthly Income (seller only) <=====
  new Chart("TotalPriceChart", {
    type: "bar",
    data: {
      labels: orderDate,
      datasets: [
        {
          label: "Monthly Income (Your Products)",
          backgroundColor: pastelColors,
          borderRadius: 10,
          data: totalPrice,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "💰 Your Total Income per Month",
          color: "#333",
          font: { size: 18 },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "#eee" },
          title: { display: true, text: "Income ($)" },
        },
        x: {
          grid: { display: false },
          title: { display: true, text: "Month-Year" },
        },
      },
    },
  });

  // =====> Chart 2: Products by Category (seller only) <=====
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let sellerProducts = products.filter(
    (p) => String(p.sellerId) === String(sellerId)
  );

  let categories = sellerProducts.map((p) => p.category);
  let mainCategories = [...new Set(categories)];
  let categoryCounts = mainCategories.map(
    (cat) => categories.filter((c) => c === cat).length
  );

  Plotly.newPlot(
    "myPlot",
    [
      {
        labels: mainCategories,
        values: categoryCounts,
        type: "pie",
        marker: { colors: pastelColors },
      },
    ],
    {
      title: "🛒 Your Products by Category",
      paper_bgcolor: "white",
      plot_bgcolor: "white",
    }
  );

  // =====> Chart 3: Orders by Status (seller only) <=====
  let statusOForders = ["Completed", "Pending", "Shipped", "Cancelled"];
  let lengthOfstatus = statusOForders.map(
    (sta) => sellerOrders.filter((order) => order.Status === sta).length
  );

  new Chart("Status", {
    type: "line",
    data: {
      labels: statusOForders,
      datasets: [
        {
          label: "Your Orders by Status",
          fill: true,
          tension: 0.4,
          backgroundColor: "rgba(173, 216, 230, 0.3)",
          borderColor: "#5A8DEE",
          pointBackgroundColor: "#5A8DEE",
          pointRadius: 6,
          data: lengthOfstatus,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "📦 Orders Distribution by Status (Your Products)",
          color: "#333",
          font: { size: 18 },
        },
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "#eee" },
          title: { display: true, text: "Orders Count" },
        },
        x: {
          grid: { display: false },
          title: { display: true, text: "Order Status" },
        },
      },
    },
  });

  // =====> Chart 4: Revenue by Category (seller only) <=====
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

  let revCategories = Object.keys(revenueByCategory);
  let revenues = Object.values(revenueByCategory);

  new Chart("RevenueByCategoryChart", {
    type: "pie",
    data: {
      labels: revCategories,
      datasets: [
        {
          label: "Revenue by Category",
          data: revenues,
          backgroundColor: pastelColors,
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "📊 Your Revenue Distribution by Category",
          color: "#333",
          font: { size: 18 },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: $${context.raw.toLocaleString()}`;
            },
          },
        },
      },
    },
  });
}
