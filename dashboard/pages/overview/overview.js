export function initOverviewPage() {


    let ordersPerMonth = JSON.parse(localStorage.getItem("ordersPerMonth"))
    let totalPrice = ordersPerMonth.map(ord => +ord.TotalPrice) || []
    let orderDate = ordersPerMonth.map(ord => new Date(ord.Date).toDateString().slice(4, 7)) || []

    console.log(totalPrice);
    console.log(orderDate);

    var barColors = [
        "#b91d47",
        "#00aba9",
        "#2b5797",
        "#e8c3b9",
        "#1e7145",
        "#1db922ff",
        "#023534ff",
        "#58595bff",
        "#fd6bffff",
        "#a852e9ff",
        "#6bffd5ff",
        "#ffd900ff",
    ];

    new Chart("TotalPriceChart", {
        type: "bar",
        data: {
            labels: orderDate,
            datasets: [{
                label: "Total Price",
                backgroundColor: barColors,
                data: totalPrice
            }]
        },
        options: {
            legend: { display: false },
            title: {
                display: true,
                text: "Total input every month per 2018"
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Toatal price"
                    }
                },
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Month"
                    }
                }
            }
        }
    });



// ===============================================

let products = JSON.parse(localStorage.getItem("products"))
let category = products.map(product => product.category) || []
let MainCategory = category.map((cat, i, final) => final.indexOf(cat) === i && cat).filter(cat => cat)
let LengthOfCategory = []

MainCategory.forEach(subcat => {
    LengthOfCategory.push(category.map((cat) => cat == subcat).filter(cat => cat).length)
})
const layout = { title: "Numper of product in Each category different style" };

const data = [{ labels: MainCategory, values: LengthOfCategory, type: "pie" }];

Plotly.newPlot("myPlot", data, layout);

//=======================================

//====================================
//============================================

let orders = JSON.parse(localStorage.getItem("orders"))
console.log(orders)

let lengthOfstatus = []

let statusOForders = ["Completed", "Pending", "Shipped", "Cancelled"]
statusOForders.forEach(sta => {
    lengthOfstatus.push(orders.filter((ord) => ord.Status === sta).length)
})

console.log(lengthOfstatus)

// new Chart("Status", {
//     type: "line",
//     data: {
//         labels: statusOForders,
//         datasets: [{
//             fill: false,
//             lineTension: 0,
//             backgroundColor: "rgba(0,0,255,1.0)",
//             borderColor: "rgba(0,0,255,0.1)",
//             data: lengthOfstatus
//         }]
//     },
//     options: {
//         legend: { display: false },
//         scales: {
//             yAxes: [{ ticks: { min: 0, max: 16 } }],
//         }
//     }
// });
// }
 new Chart("Status", {
        type: "line",
        data: {
            labels: statusOForders,
            datasets: [{
                label: "Orders by Status",
                fill: false,
                tension: 0.3, 
                backgroundColor: "rgba(0,0,255,1.0)",
                borderColor: "rgba(0,0,255,0.5)",
                data: lengthOfstatus
            }]
        },
        options: {
            responsive:true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    title: {
                        display: true,
                        text: "Orders Count"
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: "Status"
                    }
                }
            }
        }
    });
}


// export function initOverviewPage() {
//     // ================== Bar Chart ==================
//     let ordersPerMonth = JSON.parse(localStorage.getItem("ordersPerMonth")) || [];
//     let totalPrice = ordersPerMonth.map(ord => +ord.TotalPrice) || [];
//     let orderDate = ordersPerMonth.map(ord => new Date(ord.Date).toLocaleString("en", { month: "short" })) || [];

//     new Chart("TotalPriceChart", {
//         type: "bar",
//         data: {
//             labels: orderDate,
//             datasets: [{
//                 label: "Total Price",
//                 backgroundColor: [
//                     "#b91d47", "#00aba9", "#2b5797", "#e8c3b9",
//                     "#1e7145", "#1db922ff", "#023534ff", "#58595bff",
//                     "#fd6bffff", "#a852e9ff", "#6bffd5ff", "#ffd900ff"
//                 ],
//                 data: totalPrice
//             }]
//         },
//         options: {
//             responsive:true,
//             plugins: {
//                 title: {
//                     display: true,
//                     text: "Total input every month (2025)"
//                 },
//                 legend: {
//                     display: false
//                 }
//             },
//             scales: {
//                 y: {
//                     beginAtZero: true,
//                     title: {
//                         display: true,
//                         text: "Total Price"
//                     }
//                 },
//                 x: {
//                     title: {
//                         display: true,
//                         text: "Month"
//                     }
//                 }
//             }
//         }
//     });

//     // ================== Pie Chart ==================
//     let products = JSON.parse(localStorage.getItem("products")) || [];
//     let categories = products.map(p => p.category);
//     let MainCategory = [...new Set(categories)];
//     let LengthOfCategory = MainCategory.map(cat =>
//         categories.filter(c => c === cat).length
//     );

//     Plotly.newPlot("myPlot", [{
//         labels: MainCategory,
//         values: LengthOfCategory,
//         type: "pie"
//     }], {
//         title: "Number of Products in Each Category"
//     });

//     // ================== Line Chart ==================
//     let orders = JSON.parse(localStorage.getItem("orders")) || [];
//     let statusOForders = ["Completed", "Pending", "Shipped", "Cancelled"];
//     let lengthOfstatus = statusOForders.map(sta =>
//         orders.filter(ord => ord.Status === sta).length
//     );
// console.log(lengthOfstatus); 

//     new Chart("Status", {
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
