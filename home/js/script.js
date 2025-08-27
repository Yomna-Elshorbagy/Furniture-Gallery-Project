const serverDataFiles = {
  products: "../../server/data/products.json",
  categories: "../../server/data/categories.json",
  orders: "../../server/data/orders.json",
  users: "../../server/data/users.json",
};

window.addEventListener("DOMContentLoaded", () => {
  Object.entries(serverDataFiles).forEach(([key, url]) => {
    if (!localStorage.getItem(key)) {
      fetch(url)
        .then(res => res.json())
        .then(data => localStorage.setItem(key, JSON.stringify(data)))
        .catch(err => console.error(`Error loading ${key}:`, err));
    }
  });

  handleAuthButtons();
  renderProducts();
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

function renderProducts() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const productList = document.getElementById("product-list");
  const user = getLoggedInUser() || { wishlist: [] };

  const homeproducts = products.slice(0, 8);
  homeproducts.forEach(product => {
    const isFavorite = user.wishlist?.some(p => p.id === product.id);
    const card = document.createElement("div");
    card.className = "col-6 col-md-3 mb-4";
    card.innerHTML = `
      <div class="card product-card homecardproduct">
        <div class="image-scale">
          <button class="favorite-btn ${isFavorite ? "active" : ""}" data-id="${product.id}">
            <i class="bi ${isFavorite ? "bi-heart-fill" : "bi-heart"}"></i>
          </button>
          <img src="${product.image}" class="card-img-top" alt="${product.name}">
        </div>
        <div class="card-body text-center">
          <h6 class="card-title text-truncate">${product.name}</h6>
          <div class="card-text mb-2">
            <span class="newprice fw-bold">$${product.price}</span>
            ${product.oldPrice ? `<span class="old-price text-secondary text-decoration-line-through">${product.oldPrice}</span>` : ""}
          </div>
        </div>
      </div>
    `;
    card.addEventListener("click", () => {
      window.location.href = `/product%20details/proDetails.html?id=${product.id}`;
    });
    productList.appendChild(card);
  });

  setupFavoriteButtons(products);
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
    favmodalbody.innerHTML = `
      <div class="nofavoritediv">
        <h5>Love It? Add to My Favorites</h5>
        <p>Track your favorite items across devices.</p>
        <button class="continueShop">Continue Shopping</button>
      </div>
    `;
    document.querySelector(".continueShop").addEventListener("click", () => {
      window.location.href = "../products/products.html";
    });
    return;
  }

  const favdiv = document.createElement("div");
  favdiv.className = "favdiv";
  user.wishlist.forEach(product => {
    const card = document.createElement("div");
    card.className = "cardstyle";
    card.innerHTML = `
      <div class="card product-card">
        <img src="${product.image}" class="card-img-top" alt="${product.name}">
        <div class="card-body text-center">
          <h5 class="producttitlefav">${product.name}</h5>
          <h4 class="newprice fw-bold text-danger">$${product.price}</h4>
          ${product.oldPrice ? `<h4 class="old-price text-secondary text-decoration-line-through">${product.oldPrice}</h4>` : ""}
          <button class="btn btn-dark w-100 btnaddtocard" data-id="${product.id}">ADD TO CART</button>
        </div>
      </div>
    `;
    favdiv.appendChild(card);
  });
  favmodalbody.appendChild(favdiv);
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



function setupFavoriteButtons(products) {
  const buttons = document.querySelectorAll(".favorite-btn");
  const user = getLoggedInUser();

  buttons.forEach(btn => {
    const id = parseInt(btn.getAttribute("data-id"));
    const icon = btn.querySelector("i");

    btn.addEventListener("click", e => {
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

      const product = products.find(p => p.id === id);
      const inWishlist = user.wishlist.some(p => p.id === id);
let toastEl = document.getElementById("favToast");
  let toastBody = document.getElementById("favToastBody");
  let toast = new bootstrap.Toast(toastEl);
      if (inWishlist) {
        user.wishlist = user.wishlist.filter(p => p.id !== id);
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
      const index = users.findIndex(u => u.ID === user.ID);
      users[index] = user;
      saveUsers(users, user);
      renderFavoriteModal();
      updateFavBadge();
      toast.show();
    });
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
