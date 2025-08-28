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
});

document.getElementById("products").addEventListener("click", () => {
  document.getElementById("mainContent").innerHTML = productsTemplate;
  initProductsPage();
});
document.getElementById("categories").addEventListener("click", () => {
  document.getElementById("mainContent").innerHTML = categoriesTemplate;
  initCategoriesPage();
});
function countProducts() {
  let countElement = document.getElementById("productCount");
  if (!countElement) return;

  let products = JSON.parse(localStorage.getItem("products")) || [];
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser?.Role?.toLowerCase() === "seller") {
    products = products.filter(
      (p) => p.sellerId?.toString() === loggedInUser.ID.toString()
    );
  }

  countElement.textContent = products.length;
}
