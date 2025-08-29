const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const cardOption = document.getElementById("cardOption");
const codOption = document.getElementById("codOption");
const cardSection = document.getElementById("cardPaymentSection");
const codSection = document.getElementById("codSection");
const orderItemsContainer = document.getElementById("order-items");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");
const placeOrderBtn = document.querySelector(".pay-btn");
const restoreStockBtn = document.getElementById("restoreStockBtn");
const shippingCost = 150;

let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {
  cart: [],
  wishlist: [],
};
let allProducts = JSON.parse(localStorage.getItem("products")) || [];

window.addEventListener("DOMContentLoaded", () => {
  if (loggedInUser && loggedInUser.Email) {
    loginBtn.classList.add("d-none");
    logoutBtn.classList.remove("d-none");
  } else {
    loginBtn.classList.remove("d-none");
    logoutBtn.classList.add("d-none");
  }

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInUserId");

    Swal.fire({
      title: "👋 Logged out",
      text: "You have been logged out successfully.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = "../Auth/log-in/login.html";
    });
  });

  // if user Not logged in redirect him to login page
  document.addEventListener("click", (e) => {
    let link = e.target.closest("a.userData");
    if (!link) return;
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      e.preventDefault();
      Swal.fire({
        title: "🔒 Login Required",
        text: "You must be logged in to access this page.",
        icon: "warning",
        showConfirmButton: true,
        confirmButtonText: "Go to Login",
      }).then(() => {
        window.location.href = "../Auth/log-in/login.html";
      });
    } else {
      window.location.href = link.href;
    }
  });
});

cardOption.addEventListener("change", () => {
  cardSection.style.display = cardOption.checked ? "block" : "none";
  codSection.style.display = cardOption.checked ? "none" : "block";
});
codOption.addEventListener("change", () => {
  cardSection.style.display = codOption.checked ? "none" : "block";
  codSection.style.display = codOption.checked ? "block" : "none";
});

function displayCartItems() {
  orderItemsContainer.innerHTML = "";
  if (!loggedInUser.cart || loggedInUser.cart.length === 0) {
    orderItemsContainer.innerHTML = `<p class="text-center text-muted">Your cart is empty</p>`;
    subtotalEl.textContent = "$0.00";
    totalEl.textContent = `$${shippingCost.toFixed(2)}`;
    return;
  }

  let subtotal = 0;

  loggedInUser.cart.forEach((item, index) => {
    let product = allProducts.find((p) => p.id === item.id);
    let maxStock = product ? product.stock : 0;
    if (item.quantity > maxStock) item.quantity = maxStock;

    let itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const div = document.createElement("div");
    div.className = "d-flex justify-content-between align-items-center mb-3";
    div.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${
          product.image
        }" style="width:100px;height:100px;object-fit:contain;margin-right:10px; border-radius: 10px;">
        <div>
          <span class="text-secondary">${item.name}</span>
          <p class="mb-0 fw-bold">Price: <span class="text-color">$${
            item.price
          }</span></p>
        </div>
      </div>
      <div class="d-flex align-items-center">
        <input type="number" min="1" max="${maxStock}" value="${
      item.quantity
    }" class="quantity-input me-2 text-center rounded-2 fw-bold text-warning" data-index="${index}">
        <span class="fw-5 text-secondary" >$${itemTotal.toFixed(2)}</span>
        <button class="btn btn-sm btn-danger ms-2 remove-btn" data-index="${index}">Remove</button>
      </div>
    `;
    orderItemsContainer.appendChild(div);
  });

  orderItemsContainer.style.maxHeight = "700px";
  orderItemsContainer.style.overflowY = "auto";

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  totalEl.textContent = `$${(subtotal + shippingCost).toFixed(2)}`;

  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", (e) => {
      let idx = parseInt(e.target.dataset.index);
      let max = parseInt(e.target.max);
      let newQuantity = parseInt(e.target.value);
      if (isNaN(newQuantity) || newQuantity < 1) newQuantity = 1;
      if (newQuantity > max) newQuantity = max;

      e.target.value = newQuantity;
      loggedInUser.cart[idx].quantity = newQuantity;
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
      displayCartItems();
    });
  });

  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let idx = parseInt(e.target.dataset.index);
      loggedInUser.cart.splice(idx, 1);
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
      displayCartItems();
    });
  });
}

displayCartItems();

// ==== Live Validation ====
function showError(id, msg) {
  document.getElementById(id + "Error").textContent = msg;
  document.getElementById(id + "Error").classList.remove("d-none");
}
function hideError(id) {
  document.getElementById(id + "Error").classList.add("d-none");
}

function validateFullName() {
  const val = document.getElementById("fullName").value.trim();
  if (!val || !/^[A-Za-z ]+$/.test(val)) {
    showError("fullName", "Please enter a valid full name (letters only).");
    return false;
  }
  hideError("fullName");
  return true;
}
function validatePhone() {
  const val = document.getElementById("phoneNumber").value.trim();
  if (!val || !/^(?:\+20|0)?[0-9]{10,12}$/.test(val)) {
    showError("phone", "Please enter a valid phone number.");
    return false;
  }
  hideError("phone");
  return true;
}
function validateEmail() {
  const val = document.getElementById("e-mail").value.trim();
  if (!val || !/^\S+@\S+\.\S+$/.test(val)) {
    showError("email", "Please enter a valid email address.");
    return false;
  }
  hideError("email");
  return true;
}
function validateAddress() {
  const val = document.getElementById("address").value.trim();
  if (!val) {
    showError("address", "Please enter your shipping address.");
    return false;
  }
  hideError("address");
  return true;
}
function validateCardName() {
  const val = document
    .querySelector("#cardPaymentSection input[placeholder='Name on Card']")
    .value.trim();
  if (!val || !/^[A-Za-z ]+$/.test(val)) {
    showError("cardName", "Enter a valid name (letters only).");
    return false;
  }
  hideError("cardName");
  return true;
}
function validateCardNumber() {
  const val = document
    .querySelector(
      "#cardPaymentSection input[placeholder='4320 5333 7807 3634']"
    )
    .value.trim();
  if (!/^[0-9]{16}$/.test(val)) {
    showError("cardNumber", "Enter a valid 16-digit card number.");
    return false;
  }
  hideError("cardNumber");
  return true;
}
function validateExpiry() {
  const expiryInput = document
    .querySelector("input[placeholder='MM/YY']")
    .value.trim();
  const errorEl = document.getElementById("expiryError");
  if (!/^\d{2}\/\d{2}$/.test(expiryInput)) {
    errorEl.textContent = "Enter expiry in MM/YY format.";
    errorEl.classList.remove("d-none");
    return false;
  }
  const [month, year] = expiryInput.split("/").map(Number);
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;
  if (month < 1 || month > 12) {
    errorEl.textContent = "Enter a valid month (01-12).";
    errorEl.classList.remove("d-none");
    return false;
  }
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    errorEl.textContent = "Card has expired.";
    errorEl.classList.remove("d-none");
    return false;
  }
  errorEl.classList.add("d-none");
  return true;
}
function validateCVC() {
  const val = document
    .querySelector("#cardPaymentSection input[placeholder='CVC']")
    .value.trim();
  if (!/^[0-9]{3}$/.test(val)) {
    showError("cvc", "Enter a valid 3-digit CVC.");
    return false;
  }
  hideError("cvc");
  return true;
}

let fullName = document.getElementById("fullName");
let phoneNumber = document.getElementById("phoneNumber");
let email = document.getElementById("e-mail");
let address = document.getElementById("address");

fullName.addEventListener("input", validateFullName);
phoneNumber.addEventListener("input", validatePhone);
email.addEventListener("input", validateEmail);

document.getElementById("address").addEventListener("input", validateAddress);
document
  .querySelector("#cardPaymentSection input[placeholder='Name on Card']")
  .addEventListener("input", validateCardName);
document
  .querySelector("#cardPaymentSection input[placeholder='4320 5333 7807 3634']")
  .addEventListener("input", validateCardNumber);
document
  .querySelector("#cardPaymentSection input[placeholder='MM/YY']")
  .addEventListener("input", validateExpiry);
document
  .querySelector("#cardPaymentSection input[placeholder='CVC']")
  .addEventListener("input", validateCVC);

// ==== Restore Stock from Original JSON ====
restoreStockBtn.addEventListener("click", async () => {
  try {
    const res = await fetch("../server/data/products.json");
    const originalProducts = await res.json();
    allProducts = originalProducts;
    localStorage.setItem("products", JSON.stringify(allProducts));
    Swal.fire({
      icon: "success",
      title: "Stock Restored!",
      text: "All products have been restored to original stock values.",
      timer: 2000,
      showConfirmButton: false,
    });
    displayCartItems();
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to restore stock.",
    });
  }
});

function saveUserData(updatedUser) {
  localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let loggedInUserId = localStorage.getItem("loggedInUserId");

  let userIndex = users.findIndex((user) => user.ID == loggedInUserId);
  if (userIndex !== -1) {
    users[userIndex] = updatedUser;
    localStorage.setItem("users", JSON.stringify(users));
  }
}

placeOrderBtn.addEventListener("click", () => {
  if (!loggedInUser.cart || loggedInUser.cart.length === 0) {
    Swal.fire({
      icon: "info",
      title: "Cart is empty",
      text: "You don't have any items to place an order.",
      timer: 2000,
      showConfirmButton: false,
    });
    return;
  }

  let isValid =
    validateFullName() &&
    validatePhone() &&
    validateEmail() &&
    validateAddress();
  if (cardOption.checked) {
    isValid =
      isValid &&
      validateCardName() &&
      validateCardNumber() &&
      validateExpiry() &&
      validateCVC();
  }
  if (!isValid) return;

  // =====> 1- Check stock <===
  const outOfStockItems = loggedInUser.cart.filter((item) => {
    const product = allProducts.find((prod) => prod.id === item.id);
    return product && product.stock < item.quantity;
  });
  if (outOfStockItems.length > 0) {
    Swal.fire({
      icon: "error",
      title: "Out of Stock",
      text: "Some products in your cart are out of stock.",
      timer: 3000,
      showConfirmButton: false,
    });
    return;
  }
  // =====> 2- Get all orders from localStorage & generate new id <=====
  let allOrders = JSON.parse(localStorage.getItem("orders")) || [];
  let ids = allOrders
    .map((order) => Number(order.ID))
    .filter((id) => !isNaN(id) && id > 0);
  let newId = ids.length > 0 ? Math.max(...ids) + 1 : 1;

  console.log("All orders:", allOrders);
  console.log("Existing IDs:", ids);
  console.log("New ID will be:", newId);
  // ====> 3- Order object <=====
  const newOrder = {
    ID: newId,
    userId: loggedInUser.ID,
    Phone: phoneNumber.value.trim(),
    Email: email.value.trim,
    UserName: fullName.value.trim(),
    products: loggedInUser.cart.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      category: item.category,
      sellerId: item.sellerId
    })),
    TotalItems: loggedInUser.cart.reduce((sum, item) => sum + item.quantity, 0),
    TotalPrice: loggedInUser.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
    Date: new Date().toLocaleString(),
    Status: "pending",
  };

  // ====> 4- update stock from products array <====
  loggedInUser.cart.forEach((item) => {
    let product = allProducts.find((p) => p.id === item.id);
    if (product) {
      product.stock -= item.quantity;
      if (product.stock < 0) product.stock = 0;
    }
  });
  localStorage.setItem("products", JSON.stringify(allProducts));

  // ===> 5- save orders in orders array <====
  allOrders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(allOrders));

  // ===> 6- Save to user <===
  loggedInUser.orderHistory = loggedInUser.orderHistory || [];
  loggedInUser.orderHistory.push(newOrder);
  loggedInUser.cart = [];

  saveUserData(loggedInUser);
  displayCartItems();

  Swal.fire({
    icon: "success",
    title: "Order Placed!",
    text: "Your order has been placed successfully.",
    timer: 3000,
    showConfirmButton: false,
  });
});

// if user Not logged in redirect him to login page
document.addEventListener("click", (e) => {
  let link = e.target.closest("a.userData");
  if (!link) return;
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    e.preventDefault();
    Swal.fire({
      title: "🔒 Login Required",
      text: "You must be logged in to access this page.",
      icon: "warning",
      showConfirmButton: true,
      confirmButtonText: "Go to Login",
    }).then(() => {
      window.location.href = "../Auth/log-in/login.html";
    });
  } else {
    window.location.href = link.href;
  }
});

function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("loggedInUser"));
}

function renderFavoriteModal() {
  const favmodalbody = document.getElementById("favmodalbody");
  const user = getLoggedInUser();
  let favoriteLabel = document.getElementById("favoritelabel");
if (user && user.Email) {
  favoriteLabel.textContent = user.Email;
} else {
  favoriteLabel.textContent = "example@gmail.com";
}
  favmodalbody.innerHTML = "";

  if (!user || !user.wishlist || user.wishlist.length === 0) {
    var nofav = document.createElement("div");
    nofav.className = "nofavoritediv";
    nofav.innerHTML = `<h5>Love It? Add to My Favorites</h5>
      <p>My Favorites allows you to keep track of all of your favorites and shopping activity whether <br> 
        you're on your computer, phone, or tablet. You won't have to waste time searching all over <br>
         again for that item you loved on your phone the other day - it's all here in one place!</p>
         <button class="continueShop">Continue Shopping</button>
    `;
    favmodalbody.appendChild(nofav);
    document.querySelector(".continueShop").addEventListener("click", () => {
      window.location.href = "../products/products.html";
    });
    return;
  }
  let clearBtn = document.getElementById("clearBtn");
  clearBtn.addEventListener("click", () => {
    user.wishlist = []; 
    let products =JSON.parse(localStorage.getItem("products"))
    localStorage.setItem("loggedInUser", JSON.stringify(user));  
    renderFavoriteModal();
    updateFavBadge();
    document.querySelectorAll(".favorite-btn").forEach(btn => {
    btn.classList.remove("active");
    let icon = btn.querySelector("i");
    if (icon) {
      icon.classList.remove("bi-heart-fill");
      icon.classList.add("bi-heart");
    }
  });
    
  });


  const favdiv = document.createElement("div");
  favdiv.className = "favdiv";
  user.wishlist.forEach(product => {
    const card = document.createElement("div");
    card.className = "cardstyle";
    card.innerHTML = `
      <div class="card product-card">
       <div class="position-relative">
        <img src="${product.image}" class="card-img-top" alt="${product.name}">
        <button class="removeFavBtn btn btn-sm bg-white position-absolute top-0 end-0 m-2" data-id="${product.id}">
            <i class="bi bi-x-lg"></i>
          </button>
       </div>
        <div class="card-body text-center">
          <h5 class="producttitlefav">${product.name}</h5>
          <h4 class="newprice fw-bold text-danger">$${product.price}</h4>
          ${product.oldPrice ? `<h4 class="old-price text-secondary text-decoration-line-through">$${product.oldPrice}</h4>` : ""}
          <button class="btn btn-dark w-100 btnaddtocard" data-id="${product.id}">ADD TO CART</button>
        </div>
      </div>
    `;
    favdiv.appendChild(card);
  });
  favmodalbody.appendChild(favdiv);
document.querySelectorAll(".removeFavBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      user.wishlist = user.wishlist.filter(p => p.id !== id);
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      updateFavBadge();
      renderFavoriteModal();
            let favBtn = document.querySelector(`.favorite-btn[data-id="${id}"]`);
      if (favBtn) {
        favBtn.classList.remove("active");
        let icon = favBtn.querySelector("i");
        if (icon) {
          icon.classList.remove("bi-heart-fill");
          icon.classList.add("bi-heart");
        }
      }
    });
  
  });


}

function saveUsers(users, loggedInUser) {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
  localStorage.setItem("loggedInUserId", loggedInUser.ID);
}

function handleAuthButtons() {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const loggedInUser = getLoggedInUser();

  if (loggedInUser) {
    loginBtn.classList.add("d-none");
    logoutBtn.classList.remove("d-none");
  } else {
    loginBtn.classList.remove("d-none");
    logoutBtn.classList.add("d-none");
  }

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInUserId");
    Swal.fire({
      title: "👋 Logged out",
      text: "You have been logged out successfully.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = "../Auth/log-in/login.html";
    });
  });
}



document.addEventListener("click", e => {
  if (e.target.classList.contains("btnaddtocard")) {
    const productId = parseInt(e.target.getAttribute("data-id"));
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const product = products.find(p => p.id === productId);
    const user = getLoggedInUser();

    if (!user) {
      Swal.fire({
        title: "🔒 Login Required",
        text: "You must be logged in to add items to your cart.",
        icon: "warning",
        confirmButtonText: "Go to Login",
      }).then(() => {
        window.location.href = "../Auth/log-in/login.html";
      });
      return;
    }

    if (!user.cart) user.cart = [];
    if (!user.cart.some(p => p.id === productId)) {
      user.cart.push({ ...product, quantity: 1 });
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const index = users.findIndex(u => u.ID === user.ID);
    users[index] = user;
    saveUsers(users, user);
    updateCartBadge();
    updateFavBadge();
    window.location.href = "../cart/cart.html";
  }
});



function updateFavBadge() {
  const favBadge = document.getElementById("favBadge");
  const user = getLoggedInUser();
  favBadge.textContent = user?.wishlist?.length || 0;
}

function updateCartBadge() {
  const cartBadge = document.getElementById("cartbadge");
  const user = getLoggedInUser();
  cartBadge.textContent = user?.cart?.length || 0;
}

updateCartBadge();
renderFavoriteModal();
updateFavBadge();
