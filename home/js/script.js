const serverDataFiles = {
  products: "../../server/data/products.json",
  categories: "../../server/data/categories.json",
  orders: "../../server/data/orders.json",
  users: "../../server/data/users.json",
  contactMessages:"../../server/data/contactMessages.json"
};
// =====> on load run functions <=====
window.addEventListener("DOMContentLoaded", () => {
  Object.entries(serverDataFiles).forEach(([key, url]) => {
    if (!localStorage.getItem(key)) {
      fetch(url)
        .then((res) => res.json())
        .then((data) => localStorage.setItem(key, JSON.stringify(data)))
        .catch((err) => console.error(`Error loading ${key}:`, err));
    }
  });

  let params = new URLSearchParams(window.location.search);
  let category = params.get("category");

  if (category) {
    filterProductsByCategory(category);
  }
  handleAuthButtons();
  renderProducts();
  renderFavoriteModal();
  updateCartBadge();
  updateFavBadge();
});
function filterProductsByCategory(category) {
  let filtered = products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
  renderProducts(filtered);
}
// =====> get all users <=====
function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("loggedInUser"));
}
// =====> saving all users in localstorage <=====
function saveUsers(users, loggedInUser) {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
  localStorage.setItem("loggedInUserId", loggedInUser.ID);
}
// =====> redirect category cards to products of filtered category <=====
function goToCategory(categoryName) {
  window.location.href = `../products/products.html?category=${encodeURIComponent(
    categoryName
  )}`;
}
// =====> auth controls  <=====
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
// =====> render favorite icon padge and cart padge for loggedIn user <=====
// ===> 1- render products
function renderProducts() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const productList = document.getElementById("product-list");
  const user = getLoggedInUser() || { wishlist: [] };

  const homeproducts = products.slice(0, 8);

  homeproducts.forEach((product) => {
    const isFavorite = user.wishlist?.some((p) => p.id === product.id);
    const card = document.createElement("div");
    card.className = "col-6 col-md-3 mb-4";

    card.innerHTML = `
      <div class="card product-card homecardproduct h-100 shadow-sm">
        <div class="image-scale position-relative">
          <button class="favorite-btn ${isFavorite ? "active" : ""}" data-id="${product.id}">
            <i class="bi ${isFavorite ? "bi-heart-fill" : "bi-heart"}"></i>
          </button>
          <img src="${product.image}" class="card-img-top" alt="${product.name}">
        </div>
        
        <div class="card-body d-flex flex-column">
          <h6 class="card-title text-start fw-semibold">${product.name}</h6>
          
          <div class="mb-2 text-warning small text-start"><span class="text-muted">Reviews</span> ${product.reviews || ""}</div>

          <div class="d-flex align-items-center mb-2">
            <span class="me-2 small text-muted">Color:</span>
            <span class="color-dot" style="background:${product.color?.hex || "#ccc"}"></span>
            <span class="ms-2 small">${product.color?.name || ""}</span>
          </div>         
          <div class="d-flex justify-content-between align-items-center mt-auto">
            <span>
              <span class="newprice fw-bold">$${product.price}</span>
              ${product.oldPrice ? `<span class="old-price ms-2 text-secondary">$${product.oldPrice}</span>` : ""}
            </span>
            <button class="btn btn-sm add-to-cart-btn rounded-circle" data-id="${product.id}">
              <i class="bi bi-cart-fill fs-5"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    // Click redirect to details page
    card.addEventListener("click", (e) => {
      if (
        e.target.closest(".favorite-btn") ||
        e.target.closest(".add-to-cart-btn")
      ) {
        return;
      }
      window.location.href = `/product%20details/proDetails.html?id=${product.id}`;
    });

    productList.appendChild(card);
  });

  setupFavoriteButtons(products);
}


// ===> 2- render favorite model
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
    localStorage.setItem("loggedInUser", JSON.stringify(user));
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
        <button class="removeFavBtn btn btn-sm bg-white position-absolute top-0 end-0 m-2" data-id="${
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
//===> 3- add to cart
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

    if (!product || product.stock === 0) {
      Swal.fire({
        title: "Out of Stock ❌",
        text: "This product is currently unavailable.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!user.cart) user.cart = [];
    if (!user.cart.some((p) => p.id === productId)) {
      user.cart.push({ ...product, quantity: 1 });
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const index = users.findIndex((u) => u.ID === user.ID);
    users[index] = user;
    saveUsers(users, user);
    updateCartBadge();
    updateFavBadge();
    window.location.href = "../cart/cart.html";
  }
});

// ===> 4- handle add to cart  in products
document.addEventListener("click", (e) => {
  let btn = e.target.closest(".add-to-cart-btn");
  if (!btn) return;
  e.stopPropagation();

  let loggedInUser = getLoggedInUser();
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let id = parseInt(btn.getAttribute("data-id"));
  let product = products.find((p) => p.id === id);

  if (!product) return;

  if (!loggedInUser) {
    Swal.fire({
      title: "🔒 Login Required",
      text: "You must be logged in to add to Cart.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Login",
      cancelButtonText: "Stay Here",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "../Auth/log-in/login.html";
      }
    });
    return;
  }

  if (!loggedInUser.cart) {
    loggedInUser.cart = [];
  }

  let existing = loggedInUser.cart.find((p) => p.id === id);
  let toastEl = document.getElementById("carttoast");
  let toastBody = document.getElementById("cartToastBody");
  let toast = new bootstrap.Toast(toastEl);
  if (product.stock <= 0) {
    toastBody.innerHTML = `<p class="text-white text-center">${product.name} is out of stock!</p>`;
    toastEl.className =
      "opacity-100 toast align-items-center border-0 bg-danger";
    toast.show();
    return;
  }
  if (!existing) {
    loggedInUser.cart.push({ ...product, quantity: 1 });
    toastBody.innerHTML = `<p class="text-black text-center">${product.name} has been added to Cart!</p>`;
    toastEl.className =
      "opacity-100 toast align-items-center border-0 toaststyle";
  } else {
    toastBody.innerHTML = `<p class="text-white text-center">${product.name} has been already in Cart!</p>`;
    toastEl.className =
      "opacity-100 toast align-items-center border-0 bg-danger";
  }
  toast.show();
  localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
  updateCartBadge();
});

// ===> 5- action on button favorite
function setupFavoriteButtons(products) {
  const buttons = document.querySelectorAll(".favorite-btn");
  const user = getLoggedInUser();

  buttons.forEach((btn) => {
    const id = parseInt(btn.getAttribute("data-id"));
    const icon = btn.querySelector("i");

    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      if (!user) {
        Swal.fire({
          title: "🔒 Login Required",
          text: "You must be logged in to add favorites.",
          icon: "warning",
          confirmButtonText: "Go to Login",
        }).then(() => {
          window.location.href = "../Auth/log-in/login.html";
        });
        return;
      }

      const product = products.find((p) => p.id === id);
      const inWishlist = user.wishlist.some((p) => p.id === id);
      let toastEl = document.getElementById("favToast");
      let toastBody = document.getElementById("favToastBody");
      let toast = new bootstrap.Toast(toastEl);
      if (inWishlist) {
        user.wishlist = user.wishlist.filter((p) => p.id !== id);
        btn.classList.remove("active");
        icon.classList.replace("bi-heart-fill", "bi-heart");
        toastBody.innerHTML = `<p class=" text-black text-center ">${product.name} has been removed from Favorites!`;
        toastEl.className =
          "opacity-100 toast align-items-center border-0 toaststyle";
      } else {
        user.wishlist.push(product);
        btn.classList.add("active");
        icon.classList.replace("bi-heart", "bi-heart-fill");
        toastBody.innerHTML = `<p class="text-black text-center "> ${product.name}  has been added to Favorites!</p>`;
        toastEl.className =
          "opacity-100 toast align-items-center  border-0 toaststyle";
      }

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const index = users.findIndex((u) => u.ID === user.ID);
      users[index] = user;
      saveUsers(users, user);
      renderFavoriteModal();
      updateFavBadge();
      toast.show();
    });
  });
}
// ===> 5- update padges in navbar
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
