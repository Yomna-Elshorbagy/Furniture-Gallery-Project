window.addEventListener("DOMContentLoaded", () => {
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
  handleAuthButtons();
  renderFavoriteModal();
  updateCartBadge();
  updateFavBadge();
});

function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("loggedInUser"));
}

function saveUsers(users, loggedInUser) {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
  localStorage.setItem("loggedInUserId", loggedInUser.ID);
}
function updateUserData(user) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let idx = users.findIndex((u) => u.ID === user.ID);
  if (idx !== -1) {
    users[idx] = user;
  } else {
    users.push(user);
  }
  saveUsers(users, user);
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
    let products = JSON.parse(localStorage.getItem("products"));
    updateUserData(user);
    renderFavoriteModal();
    updateFavBadge();
    setupFavoriteButtons(products);

    document.querySelectorAll(".favorite-btn").forEach((btn) => {
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
  user.wishlist.forEach((product) => {
    const card = document.createElement("div");
    card.className = "cardstyle";
    card.innerHTML = `
      <div class="card product-card">
       <div class="position-relative">
        <img src="${product.image}" class="card-img-top" alt="${product.name}">
        <button class="removeFavBtn btn btn-sm bg-white position-absolute top-0 end-0 m-2 w-25" data-id="${
          product.id
        }">
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
          <button class="btn btn-dark w-100 btnaddtocard" data-id="${
            product.id
          }">ADD TO CART</button>
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
      updateUserData(user);
      renderFavoriteModal();
      updateFavBadge();
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
  document.addEventListener("click", function (e) {
  if (!e.target.classList.contains("btnaddtocard")) return;

  e.preventDefault();

  const productId = parseInt(e.target.getAttribute("data-id"));
  const quantityInput = document.getElementById("quantity");
  const quantityToAdd = Number(quantityInput?.value) || 1;

  const user = getLoggedInUser();
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const productToAdd = products.find((prod) => prod.id === productId);

  if (!user) {
    Swal.fire({
      title: "🔒 Login Required",
      text: "You must be logged in to add products to your cart.",
      icon: "warning",
      confirmButtonText: "Go to Login",
    }).then(() => {
      window.location.href = "../Auth/log-in/login.html";
    });
    return;
  }

  if (!productToAdd) return;

  if (productToAdd.stock === 0) {
    Swal.fire({
      title: "❌ Out of Stock",
      text: "This product is currently not available.",
      icon: "error",
      confirmButtonText: "OK",
    });
    return;
  }

  if (quantityToAdd > productToAdd.stock) {
    Swal.fire({
      title: "⚠️ Limited Stock",
      text: `Only ${productToAdd.stock} items are available in stock.`,
      icon: "warning",
      confirmButtonText: "OK",
    });
    return;
  }

  if (!user.cart) user.cart = [];

  let existing = user.cart.find((prod) => prod.id === productId);
  if (existing) {
    existing.quantity = quantityToAdd;
  } else {
    user.cart.push({ ...productToAdd, quantity: quantityToAdd });
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const index = users.findIndex((u) => u.ID === user.ID);
  if (index !== -1) users[index] = user;

  saveUsers(users, user);
  updateCartBadge();
  updateFavBadge();
  window.location.href = "../cart/cart.html";
});
}


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
