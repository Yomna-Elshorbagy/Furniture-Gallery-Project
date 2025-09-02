import { productsTemplate } from "./pages/productsTemplate.js";
import { initProductsPage } from "./pages/products.js";
import { ordersTemplate } from "./pages/orders/ordersTemplete.js";
import { initOrdersPage } from "./pages/orders/orders.js";
import { initUsersPage } from "./pages/users/users.js";
import { UsersTemplate } from "./pages/users/userTemplete.js";
import { categoriesTemplate } from "./pages/categories/categoriesTemplate.js";
import { initCategoriesPage } from "./pages/categories/categories.js";
import { initSellerPage } from "./pages/sellers/seller.js";
import { SellersTemplate } from "./pages/sellers/sellerTemplete.js";
import { overviewTemplate } from "./pages/overview/overviewTemplate.js";
import { initOverviewPage } from "./pages/overview/overview.js";
import { emailsTemplate } from "./pages/emails/emailsTemplete.js";
import { initEmailsPage } from "./pages/emails/emails.js";

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
  if (loggedInUser.Role !== "admin") {
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
  countOrders();
  countTotalRevenues();
  CountLowStock();
  const adminEmailEl = document.getElementById("adminEmail");

  if (adminEmailEl && loggedInUser?.Email) {
    adminEmailEl.textContent = loggedInUser.Email;
  }
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
document.getElementById("sellers").addEventListener("click", () => {
  document.getElementById("mainContent").innerHTML = SellersTemplate;
  initSellerPage();
});
document.getElementById("emails").addEventListener("click", () => {
  document.getElementById("mainContent").innerHTML = emailsTemplate;
  initEmailsPage();
});
document.getElementById("logOut").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "../Auth/log-in/login.html";
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
function CountLowStock() {
  let countLowStock = document.getElementById("lowStockCount");
  let products = JSON.parse(localStorage.getItem("products"));
  let filteredData = products.filter((prod) => prod.stock < 10);
  let lengthData = filteredData.length;
  countLowStock.innerText = lengthData;
}

export function showLowStockProducts() {
  let allProducts = JSON.parse(localStorage.getItem("products")) || [];
  let lowStockProducts = allProducts.filter((prod) => prod.stock < 10);

  document.getElementById("mainContent").innerHTML = productsTemplate;
  initProductsPage(lowStockProducts);
  let addBtn = document.getElementById("addProductBtn");
  if (addBtn) addBtn.style.display = "none";

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

let profileAdmin = document.getElementById("profileAdmin");
profileAdmin.addEventListener("click", () => {
  document.body.classList.add("fade-out");
  setTimeout(() => {
    window.location.href = "./pages/profile/profile.html";
  }, 500);
});

// =====> Export Json Data
document.getElementById("exportBtn").addEventListener("click", () => {
  // ===> 1- collect all the data you want to export
  let data = {
    products: JSON.parse(localStorage.getItem("products")) || [],
    categories: JSON.parse(localStorage.getItem("categories")) || [],
    orders: JSON.parse(localStorage.getItem("orders")) || [],
    users: JSON.parse(localStorage.getItem("users")) || [],
  };

  //===> 2- convert data to JSON string
  let jsonString = JSON.stringify(data, null, 2);

  //===> 3- create a blob
  let blob = new Blob([jsonString], { type: "application/json" });

  //===> 4- create a link element
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "furniture_data.json";
  link.click();

  //===> 5- cleanup
  URL.revokeObjectURL(link.href);
});
