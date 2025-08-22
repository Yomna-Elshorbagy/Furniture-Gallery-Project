import { productsTemplate } from "./pages/productsTemplate.js";
import { initProductsPage } from "./pages/products.js";
import { ordersTemplate } from "./pages/orders/ordersTemplete.js";
import { initOrdersPage } from "./pages/orders/orders.js";
import { initUsersPage } from "./pages/users/users.js";
import { UsersTemplate } from "./pages/users/userTemplete.js";
import { categoriesTemplate } from "./pages/categories/categoriesTemplate.js";
import { initCategoriesPage } from "./pages/categories/categories.js";

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
  // ===> 2. If logged in but not admin/seller redirect im to home
  if (loggedInUser.Role !== "admin" && loggedInUser.Role !== "seller") {
    window.location.href = "../home/home.html";
  }
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
  countOrders();
  countTotalRevenues();
});
document.getElementById("products").addEventListener("click", () => {
  document.getElementById("mainContent").innerHTML = productsTemplate;
  initProductsPage();
});
document.getElementById("categories").addEventListener("click", () => {
  document.getElementById("mainContent").innerHTML = categoriesTemplate;
  initCategoriesPage();
});

document.getElementById("addSeller").addEventListener("click", () => {
  window.location.href = "../Auth/sign-up/signup.html";
});
document.getElementById("users").addEventListener("click", () => {
  document.getElementById("mainContent").innerHTML = UsersTemplate;
  initUsersPage();
});
document.getElementById("orders").addEventListener("click", () => {
  document.getElementById("mainContent").innerHTML = ordersTemplate;
  initOrdersPage();
});
function countProducts() {
  let countElement = document.getElementById("productCount");
  if (!countElement) return;
  let products = JSON.parse(localStorage.getItem("products")) || [];
  countElement.textContent = products.length;
}

function countOrders() {
  let countElement = document.getElementById("ordersCount");
  if (!countElement) return;
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  countElement.textContent = orders.length;
}

function countTotalRevenues() {
  let countElement = document.getElementById("totalRevenues");
  if (!countElement) return;

  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  let total = orders
    .filter((order) => order.Status === "Completed")
    .reduce((sum, order) => {
      let price = parseFloat(order.TotalPrice);
      console.log(sum + (isNaN(price) ? 0 : price));
      
      return sum + (isNaN(price) ? 0 : price);
    }, 0);

  countElement.textContent = `$${total}`;
}
