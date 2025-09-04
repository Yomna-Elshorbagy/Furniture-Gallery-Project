import { categoriesTemplate } from "./pages/categories/categoryTemplet.js";
import { initCategoriesPage } from "./pages/categories/categry.js";
import { initOrdersPage } from "./pages/orders/orders.js";
import { ordersTemplate } from "./pages/orders/ordersTemplete.js";
import { initOverviewPage } from "./pages/overview/overview.js";
import { overviewTemplate } from "./pages/overview/overviewTemplete.js";
import { initProductsPage } from "./pages/products/products.js";
import { productsTemplate } from "./pages/products/productTemplete.js";
import { initReportsPage } from "./pages/reports/reports.js";
import { reportsTemplate } from "./pages/reports/reportsTemplete.js";

let serverDataFiles = {
  products: "../server/data/products.json",
  categories: "../server/data/categories.json",
  orders: "../server/data/orders.json",
  users: "../server/data/users.json",
};
window.addEventListener("DOMContentLoaded", () => {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // ===> 1. If not logged in at all so login first
  if (!loggedInUser) {
    window.location.href = "../Auth/log-in/login.html";
    return;
  }
  // ===> 2. If logged in but not seller redirect im to home
  if (loggedInUser.Role !== "seller") {
    window.location.href = "../home/home.html";
  }

  document.getElementById("overview").addEventListener("click", () => {
    document.getElementById("mainContent").innerHTML = overviewTemplate;
    initOverviewPage();
  });

  document.getElementById("mainContent").innerHTML = overviewTemplate;
  initOverviewPage();

  Object.entries(serverDataFiles).forEach(([key, url]) => {
    if (!localStorage.getItem(key)) {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem(key, JSON.stringify(data));
          console.log(`${key} saved`, data);
        })
        .catch((err) =>
          console.error(`Error loading ${key} from ${url}:`, err)
        );
    } else {
      console.log(`${key} already in localStorage`);
    }
  });

  countProducts();
  CountLowStock();
  countOrders();
  countTotalRevenues();
  const sellerEmailEl = document.getElementById("sellerEmail");

  if (sellerEmailEl && loggedInUser?.Email) {
    sellerEmailEl.textContent = loggedInUser.Email;
  }
});

let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
let products = JSON.parse(localStorage.getItem("products")) || [];
let sellerProduct = products.filter(
  (p) => p.sellerId?.toString() === loggedInUser.ID.toString()
);

document.getElementById("products").addEventListener("click", () => {
  document.getElementById("mainContent").innerHTML = productsTemplate;
  initProductsPage();
});

document.getElementById("categories").addEventListener("click", () => {
  document.getElementById("mainContent").innerHTML = categoriesTemplate;
  initCategoriesPage();
});

document.getElementById("orders").addEventListener("click", () => {
  document.getElementById("mainContent").innerHTML = ordersTemplate;
  initOrdersPage();
});

document.getElementById("reports").addEventListener("click", () => {
  document.getElementById("mainContent").innerHTML = reportsTemplate;
  initReportsPage();
});

document.getElementById("logOut").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "../Auth/log-in/login.html";
});
// ====> function to count all orders for this seller
function countOrders() {
  let countElement = document.getElementById("ordersCount");
  if (!countElement) return;

  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  if (loggedInUser?.Role?.toLowerCase() === "seller") {
    orders = orders.filter((order) =>
      order.products.some(
        (p) => p.sellerId?.toString() === loggedInUser.ID.toString()
      )
    );
  }

  countElement.textContent = orders.length;
}

// ====> function to count all completed status orders for this seller
function countTotalRevenues() {
  let countElement = document.getElementById("totalRevenues");
  if (!countElement) return;

  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  let total = 0;

  if (loggedInUser?.Role?.toLowerCase() === "seller") {
    let completedOrders = orders.filter(
      (order) => order.Status === "Completed"
    );

    completedOrders.forEach((order) => {
      order.products.forEach((p) => {
        if (p.sellerId?.toString() === loggedInUser.ID.toString()) {
          total += Number(p.price) * Number(p.quantity);
        }
      });
    });
  } else {
    total = 0;
  }

  countElement.textContent = `$${total}`;
}

// ====> function count products for this seller
function countProducts() {
  let countElement = document.getElementById("productCount");
  if (!countElement) return;

  if (loggedInUser?.Role?.toLowerCase() === "seller") {
    products = sellerProduct;
  }
  countElement.textContent = products.length;
}
// ====> function count low stock for this seller products
function CountLowStock() {
  let countLowStock = document.getElementById("lowStockCount");
  if (loggedInUser?.Role?.toLowerCase() === "seller") {
    products = sellerProduct;
  }
  let filteredData = products.filter((prod) => prod.stock < 10);

  let lengthData = filteredData.length;
  countLowStock.innerText = lengthData;
}

// ====> function to display these products with low stock
export function showLowStockProducts() {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  let allProducts = JSON.parse(localStorage.getItem("products")) || [];

  // filter based on role
  let sellerProducts =
    loggedInUser?.Role?.toLowerCase() === "seller"
      ? allProducts.filter(
          (p) => p.sellerId?.toString() === loggedInUser.ID.toString()
        )
      : allProducts;

  // low stock filter
  let lowStockProducts = sellerProducts.filter((prod) => prod.stock < 10);

  // reuse the existing products page & pass filtered list
  document.getElementById("mainContent").innerHTML = productsTemplate;
  initProductsPage(lowStockProducts);

  // hide add button
  let addBtn = document.getElementById("addProductBtn");
  if (addBtn) addBtn.style.display = "none";

  // show warning message
  let tableWrapper = document.querySelector("#mainContent h3");
  if (tableWrapper) {
    tableWrapper.insertAdjacentHTML(
      "afterend",
      `<div class="alert alert-warning my-2" role="alert">
        ⚠️ Showing only <strong>Low Stock</strong> products (stock less than 10).
      </div>`
    );
  }
}
document.getElementById("lowStock").addEventListener("click", () => {
  showLowStockProducts();
});

// =====> function Export Seller's Products JSON
document.getElementById("exportBtn").addEventListener("click", () => {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser || loggedInUser?.Role?.toLowerCase() !== "seller") {
    Swal.fire({
      icon: "warning",
      title: "Access Denied",
      text: "Only sellers can export their products.",
    });
    return;
  }

  // ===> collect only seller products
  let allProducts = JSON.parse(localStorage.getItem("products")) || [];
  let sellerProducts = allProducts.filter(
    (p) => p.sellerId?.toString() === loggedInUser.ID.toString()
  );
  let jsonString = JSON.stringify(sellerProducts, null, 2);
  let blob = new Blob([jsonString], { type: "application/json" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `seller_${loggedInUser.ID}_products.json`;
  link.click();

  URL.revokeObjectURL(link.href);
});
