import { productsTemplate } from "./pages/productsTemplate.js";
import { initProductsPage } from "./pages/products.js";
import { ordersTemplate } from "./pages/orders/ordersTemplete.js";
import { initOrdersPage } from "./pages/orders/orders.js";
import { initUsersPage } from "./pages/users/users.js";
import { UsersTemplate } from "./pages/users/userTemplete.js";
import { categoriesTemplate } from "./pages/categories/categoriesTemplate.js";
import { initCategoriesPage } from "./pages/categories/categories.js";

const serverDataFiles = {
  products: "../server/data/products.json",
  categories: "../server/data/categories.json",
  orders: "../server/data/orders.json",
  users: "../server/data/users.json",
};
window.addEventListener("DOMContentLoaded", () => {
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
  const countElement = document.getElementById("productCount");
  if (countElement) {
    // countElement.textContent =
  }
}
