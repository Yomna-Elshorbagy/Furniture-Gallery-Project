// export function initOverviewPage() {

//     let ordersPerMonth = JSON.parse(localStorage.getItem("ordersPerMonth"))
//     let totalPrice = ordersPerMonth.map(ord => +ord.TotalPrice) || []
//     let orderDate = ordersPerMonth.map(ord => new Date(ord.Date).toDateString().slice(4, 7)) || []

//     console.log(totalPrice);
//     console.log(orderDate);

//     var barColors = [
//         "#b91d47",
//         "#00aba9",
//         "#2b5797",
//         "#e8c3b9",
//         "#1e7145",
//         "#1db922ff",
//         "#023534ff",
//         "#58595bff",
//         "#fd6bffff",
//         "#a852e9ff",
//         "#6bffd5ff",
//         "#ffd900ff",
//     ];

//     new Chart("TotalPriceChart", {
//         type: "bar",
//         data: {
//             labels: orderDate,
//             datasets: [{
//                 label: "Total Price",
//                 backgroundColor: barColors,
//                 data: totalPrice
//             }]
//         },
//         options: {
//             legend: { display: false },
//             title: {
//                 display: true,
//                 text: "Total input every month per 2018"
//             },
//             scales: {
//                 y: {
//                     beginAtZero: true,
//                     title: {
//                         display: true,
//                         text: "Toatal price"
//                     }
//                 },
//                 x: {
//                     beginAtZero: true,
//                     title: {
//                         display: true,
//                         text: "Month"
//                     }
//                 }
//             }
//         }
//     });

// // ===============================================

// let products = JSON.parse(localStorage.getItem("products"))
// let category = products.map(product => product.category) || []
// let MainCategory = category.map((cat, i, final) => final.indexOf(cat) === i && cat).filter(cat => cat)
// let LengthOfCategory = []

// MainCategory.forEach(subcat => {
//     LengthOfCategory.push(category.map((cat) => cat == subcat).filter(cat => cat).length)
// })
// const layout = { title: "Numper of product in Each category different style" };

// const data = [{ labels: MainCategory, values: LengthOfCategory, type: "pie" }];

// Plotly.newPlot("myPlot", data, layout);

// //=======================================

// //====================================
// //============================================

// let orders = JSON.parse(localStorage.getItem("orders"))
// console.log(orders)

// let lengthOfstatus = []

// let statusOForders = ["Completed", "Pending", "Shipped", "Cancelled"]
// statusOForders.forEach(sta => {
//     lengthOfstatus.push(orders.filter((ord) => ord.Status === sta).length)
// })

// console.log(lengthOfstatus)

// // new Chart("Status", {
// //     type: "line",
// //     data: {
// //         labels: statusOForders,
// //         datasets: [{
// //             fill: false,
// //             lineTension: 0,
// //             backgroundColor: "rgba(0,0,255,1.0)",
// //             borderColor: "rgba(0,0,255,0.1)",
// //             data: lengthOfstatus
// //         }]
// //     },
// //     options: {
// //         legend: { display: false },
// //         scales: {
// //             yAxes: [{ ticks: { min: 0, max: 16 } }],
// //         }
// //     }
// // });
// // }
//  new Chart("Status", {
//         type: "line",
//         data: {
//             labels: statusOForders,
//             datasets: [{
//                 label: "Orders by Status",
//                 fill: false,
//                 tension: 0.3,
//                 backgroundColor: "rgba(0,0,255,1.0)",
//                 borderColor: "rgba(0,0,255,0.5)",
//                 data: lengthOfstatus
//             }]
//         },
//         options: {
//             responsive:true,
//             plugins: {
//                 legend: { display: false }
//             },
//             scales: {
//                 y: {
//                     beginAtZero: true,
//                     min: 0,
//                     title: {
//                         display: true,
//                         text: "Orders Count"
//                     }
//                 },
//                 x: {
//                     title: {
//                         display: true,
//                         text: "Status"
//                     }
//                 }
//             }
//         }
//     });
// }



export function initOverviewPage() {
  // =============== Orders Data ===============
  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  let completedOrders = orders.filter((ord) => ord.Status === "Completed");

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

  let orderDate = Object.keys(monthlyIncome);
  let totalPrice = Object.values(monthlyIncome);

  // my favorite pallet coloers 👀
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

  // ===============> Chart 1: Monthly Income <===============
  new Chart("TotalPriceChart", {
    type: "bar",
    data: {
      labels: orderDate,
      datasets: [
        {
          label: "Monthly Income (Completed Orders)",
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
          text: "💰 Total Income per Month (Completed Orders)",
          color: "#333",
          font: { size: 18 },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return " $" + context.raw.toLocaleString();
            },
          },
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

  // ===============> chart 2: products by category <===============
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let category = products.map((product) => product.category) || [];
  let MainCategory = category.filter((cat, i, arr) => arr.indexOf(cat) === i);
  let LengthOfCategory = MainCategory.map(
    (subcat) => category.filter((cat) => cat === subcat).length
  );

  const layout = {
    title: "🛒 Number of Products in Each Category",
    paper_bgcolor: "white",
    plot_bgcolor: "white",
  };
  const data = [
    {
      labels: MainCategory,
      values: LengthOfCategory,
      type: "pie",
      marker: {
        colors: pastelColors,
      },
    },
  ];
  Plotly.newPlot("myPlot", data, layout);

  // =============== chart 3: orders by status ===============
  let statusOForders = ["Completed", "Pending", "Shipped", "Cancelled"];
  let lengthOfstatus = statusOForders.map(
    (sta) => orders.filter((ord) => ord.Status === sta).length
  );

  new Chart("Status", {
    type: "line",
    data: {
      labels: statusOForders,
      datasets: [
        {
          label: "Orders by Status",
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
          text: "📦 Orders Distribution by Status",
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

  // =============== chart 4: revenue by Category ===============
  let revenueByCategory = {};

  completedOrders.forEach((order) => {
    order.products.forEach((item) => {
      let category = item.category; 
      let revenue = Number(item.price) * Number(item.quantity);
      revenueByCategory[category] =
        (revenueByCategory[category] || 0) + revenue;
    });
  });

  let categories = Object.keys(revenueByCategory);
  let revenues = Object.values(revenueByCategory);

  new Chart("RevenueByCategoryChart", {
    type: "pie",
    data: {
      labels: categories,
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
          text: "📊 Revenue Distribution by Category (Completed Orders)",
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
