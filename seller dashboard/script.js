import { categoriesTemplate } from "./pages/categories/categoryTemplet.js";
import { initCategoriesPage } from "./pages/categories/categry.js";
import { initProductsPage } from "./pages/products/products.js";
import { productsTemplate } from "./pages/products/productTemplete.js";

let serverDataFiles = {
  products: "../server/data/products.json",
  categories: "../server/data/categories.json",
  orders: "../server/data/orders.json",
  users: "../server/data/users.json",
  ordersPerMonth: "../server/data/ordersPerMonth.json",
};
window.addEventListener("DOMContentLoaded", () => {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // ===> 1. If not logged in at all so login first
  // if (!loggedInUser) {
  //   window.location.href = "../Auth/log-in/login.html";
  //   return;
  // }
  // ===> 2. If logged in but not seller redirect im to home
  // if ( loggedInUser.Role !== "seller") {
  //   window.location.href = "../home/home.html";
  // }
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

document.getElementById("logOut").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "../Auth/log-in/login.html";
});

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

  // Filter based on role
  let sellerProducts =
    loggedInUser?.Role?.toLowerCase() === "seller"
      ? allProducts.filter(
          (p) => p.sellerId?.toString() === loggedInUser.ID.toString()
        )
      : allProducts;

  // Low stock filter
  let lowStockProducts = sellerProducts.filter((prod) => prod.stock < 10);

  // Reuse the existing products page & pass filtered list
  document.getElementById("mainContent").innerHTML = productsTemplate;
  initProductsPage(lowStockProducts);

  // Hide add button (optional)
  let addBtn = document.getElementById("addProductBtn");
  if (addBtn) addBtn.style.display = "none";

  // Show warning message
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
