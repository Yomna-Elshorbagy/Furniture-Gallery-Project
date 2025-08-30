let loggedInUser;

document.addEventListener("DOMContentLoaded", () => {
  let loginBtn = document.getElementById("loginBtn");
  let logoutBtn = document.getElementById("logoutBtn");

  loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (loginBtn && logoutBtn) {
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

  updateCartBadge();
  updateFavBadge();
  renderFavoriteModal();
});

/* ---------------- CART SECTION ---------------- */

let cartbody = document.getElementById("cartbody");
loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || { cart: [] };
let cartproducts = loggedInUser.cart || [];

if (cartbody) {
  if (cartproducts.length === 0) {
    let noproductsdiv = document.createElement("div");
    noproductsdiv.className = "emptycart";
    noproductsdiv.innerHTML = `
      <h4 class="text-uppercase fw-light emptycarttitle">Your cart is empty</h4>
      <button class="emptycartbtn">Shop our products</button>`;
   
    cartbody.appendChild(noproductsdiv);
    let shopBtn = document.querySelector(".emptycartbtn");
    if (shopBtn) {
      shopBtn.addEventListener("click", () => {
        window.location.href = "../products/products.html";
      });
    }
    
    
  } else {
    let carttitle = document.createElement("h4");
    carttitle.className = "emptycarttitle";
    carttitle.textContent = " CART DETAILS ";
    cartbody.appendChild(carttitle);
    let table = document.createElement("table");
    table.className = "table text-start";
    table.innerHTML = `
      <thead>
        <tr class="theadstyle">
          <th>Product</th>
          <th class="text-center">Quantity</th>
          <th class="text-end">Total</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    let tbody = table.querySelector("tbody");

    function updateGrandTotal() {
      let totals = document.querySelectorAll("[id^='total-']");
      let total = 0;
      totals.forEach((cell) => {
        total += parseFloat(cell.textContent.replace("$", ""));
      });
      let grandTotal = document.getElementById("grand-total");
      if (grandTotal) grandTotal.textContent = `$${total}`;
    }

    cartproducts.forEach((product) => {
      let row = document.createElement("tr");
      row.innerHTML = `
        <td>
          <div class="d-flex align-items-center">
            <img src="${product.image}" alt="${product.name}" class="me-3" style="width:80px; height:80px; object-fit:cover;">
            <div>
              <h6 class="mb-1 fw-light">${product.name}</h6>
              <p class="mb-0 text-muted">$${product.price}</p>
            </div>
          </div>
        </td>
        <td class="text-center">
          <div class="d-flex justify-content-center align-items-center">
            <button class="btn btn-sm btn-outline-secondary minus-btn" data-id="${product.id}">-</button>
            <span class="mx-2 quantity" id="quantity-${product.id}">${product.quantity}</span>
            <button class="btn btn-sm btn-outline-secondary plus-btn" data-id="${product.id}">+</button>
          </div>
          <button class="btn btn-link text-muted p-0 remove-btn mt-3" data-id="${product.id}">REMOVE</button>
        </td>
        <td class="text-end" id="total-${product.id}">$${product.price * product.quantity}</td>
      `;
      tbody.appendChild(row);
    });

    tbody.addEventListener("click", function (event) {
      let btn = event.target.closest("button");
      if (!btn) return;

      let id = parseInt(btn.dataset.id);
      let product = loggedInUser.cart.find((p) => p.id === id);
      if (!product) return;

      let quantitySpan = document.getElementById(`quantity-${id}`);
      let totalCell = document.getElementById(`total-${id}`);
      let quantity = parseInt(quantitySpan.textContent);

      if (btn.classList.contains("plus-btn") && quantity < (product.stock)) {
        quantity++;
      }
      if (btn.classList.contains("minus-btn") && quantity > 1) {
        quantity--;
      }

      if (btn.classList.contains("plus-btn") || btn.classList.contains("minus-btn")) {
        quantitySpan.textContent = quantity;
        totalCell.textContent = `$${product.price * quantity}`;
        product.quantity = quantity;
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
        updateGrandTotal();
      }

      if (btn.classList.contains("remove-btn")) {
        loggedInUser.cart = loggedInUser.cart.filter((p) => p.id !== id);
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
        btn.closest("tr").remove();
        updateCartBadge();

        if (loggedInUser.cart.length === 0) {
          cartbody.innerHTML = `
            <div class="emptycart">
              <h4 class="text-uppercase fw-light emptycarttitle">Your cart is empty</h4>
              <button class="emptycartbtn">Shop our products</button>
            </div>`;
            let shopBtn = document.querySelector(".emptycartbtn");
    if (shopBtn) {
      shopBtn.addEventListener("click", () => {
        window.location.href = "../products/products.html";
      });
    }
        } else {
          updateGrandTotal();
        }
      }
    });

    let grandTotalDiv = document.createElement("div");
    grandTotalDiv.className = "text-end mt-3 alltotal";
    grandTotalDiv.innerHTML = ` Total: <span id="grand-total"></span>`;
    cartbody.appendChild(table);
    cartbody.appendChild(grandTotalDiv);
    updateGrandTotal();

    let checkoutdiv = document.createElement("div");
    checkoutdiv.className = "d-flex flex-row justify-content-end";

    let checkoutBtn = document.createElement("button");
    checkoutBtn.className = "btn checkoutbtn emptycartbtn my-3";
    checkoutBtn.textContent = "CHECKOUT ";
    checkoutdiv.appendChild(checkoutBtn);
    cartbody.appendChild(checkoutdiv);

    checkoutBtn.addEventListener("click", () => {
      localStorage.setItem("checkoutItems", JSON.stringify(loggedInUser.cart));
      window.location.href = "../checkout/checkout.html";
    });
  }
}

/* ---------------- USER REDIRECT ---------------- */

document.addEventListener("click", (e) => {
  let link = e.target.closest("a.userData");
  if (!link) return;
  let loggedInUser = getLoggedInUser();
  if (!loggedInUser) {
    e.preventDefault();
    Swal.fire({
      title: "🔒 Login Required",
      text: "You must be logged in to access this page.",
      icon: "warning",
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

/* ---------------- FAVORITES ---------------- */

function renderFavoriteModal() {
  const favmodalbody = document.getElementById("favmodalbody");
  const user = getLoggedInUser();
  let favoriteLabel = document.getElementById("favoritelabel");

  if (favoriteLabel) {
    favoriteLabel.textContent = user?.Email || "example@gmail.com";
  }

  if (!favmodalbody) return;
  favmodalbody.innerHTML = "";

  if (!user || !user.wishlist || user.wishlist.length === 0) {
    var nofav = document.createElement("div");
    nofav.className = "nofavoritediv";
    nofav.innerHTML = `
      <h5>Love It? Add to My Favorites</h5>
      <p>My Favorites allows you to keep track of all of your favorites and shopping activity whether <br> 
        you're on your computer, phone, or tablet.</p>
      <button class="continueShop">Continue Shopping</button>
    `;
    favmodalbody.appendChild(nofav);
    let cont = document.querySelector(".continueShop");
    if (cont) {
      cont.addEventListener("click", () => {
        window.location.href = "../products/products.html";
      });
    }
    return;
  }

  let clearBtn = document.getElementById("clearBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      user.wishlist = [];
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      renderFavoriteModal();
      updateFavBadge();
      document.querySelectorAll(".favorite-btn").forEach((btn) => {
        btn.classList.remove("active");
        let icon = btn.querySelector("i");
        if (icon) {
          icon.classList.remove("bi-heart-fill");
          icon.classList.add("bi-heart");
        }
      });
    });
  }

  const favdiv = document.createElement("div");
  favdiv.className = "favdiv";
  user.wishlist.forEach((product) => {
    const card = document.createElement("div");
    card.className = "cardstyle";
    card.innerHTML = `
      <div class="card product-card">
        <div class="position-relative">
          <img src="${product.image}" class="card-img-top" alt="${product.name}">
          <button class=" removeFavBtn btn btn-sm bg-white position-absolute top-0 end-0 m-2" data-id="${product.id}">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="card-body text-center">
          <h5 class="producttitlefav">${product.name}</h5>
          <h4 class="newprice fw-bold text-danger">$${product.price}</h4>
          ${
            product.oldPrice
              ? `<h4 class="old-price text-secondary text-decoration-line-through">$${product.oldPrice}</h4>`
              : ""
          }
          <button class="btn btn-dark w-100 btnaddtocard" data-id="${product.id}">ADD TO CART</button>
        </div>
      </div>
    `;
    favdiv.appendChild(card);
  });
  favmodalbody.appendChild(favdiv);

  document.querySelectorAll(".removeFavBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      user.wishlist = user.wishlist.filter((p) => p.id !== id);
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

/* ---------------- USERS & CART ---------------- */

function saveUsers(users, loggedInUser) {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
  localStorage.setItem("loggedInUserId", loggedInUser.ID);
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btnaddtocard")) {
    const productId = parseInt(e.target.getAttribute("data-id"));
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const product = products.find((p) => p.id === productId);
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
    if (!user.cart.some((p) => p.id === productId)) {
      user.cart.push({ ...product, quantity: 1 });
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const index = users.findIndex((u) => u.ID === user.ID);
    if (index !== -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    saveUsers(users, user);
    updateCartBadge();
    updateFavBadge();
    window.location.href = "../cart/cart.html";
  }
});

/* ---------------- BADGES ---------------- */

function updateFavBadge() {
  const favBadge = document.getElementById("favBadge");
  const user = getLoggedInUser();
  if (favBadge) favBadge.textContent = user?.wishlist?.length || 0;
}

function updateCartBadge() {
  const cartBadge = document.getElementById("cartbadge");
  const user = getLoggedInUser();
  if (cartBadge) cartBadge.textContent = user?.cart?.length || 0;
}
