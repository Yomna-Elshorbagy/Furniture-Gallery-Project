import { productsTemplate } from "./pages/productsTemplate.js";
import { initProductsPage } from "./pages/products.js";

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

document.getElementById("addSeller").addEventListener("click", () => {
  window.location.href = "../Auth/sign-up/signup.html";
});

function countProducts() {
  const countElement = document.getElementById("productCount");
  if (countElement) {
    // countElement.textContent =
  }
}
