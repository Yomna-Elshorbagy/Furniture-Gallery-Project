document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  // Check if a user is logged in
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (loggedInUser) {
    // Show logout, hide login
    loginBtn.classList.add("d-none");
    logoutBtn.classList.remove("d-none");
  } else {
    // Show login, hide logout
    loginBtn.classList.remove("d-none");
    logoutBtn.classList.add("d-none");
  }

  // Handle logout
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
  updateFavBadge();
  updateCartBadge();
  renderFavoriteModal();
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
function renderFavoriteModal() {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {
    wishlist: [],
  };

  let favmodalbody = document.getElementById("favmodalbody");
  favmodalbody.innerHTML = "";

  if (loggedInUser.wishlist.length === 0) {
    var nofav = document.createElement("div");
    nofav.className = "nofavoritediv";
    nofav.innerHTML = `
      <h5>Love It? Add to My Favorites</h5>
      <p>My Favorites allows you to keep track of all of your favorites and shopping activity whether <br> 
        you're on your computer, phone, or tablet. You won't have to waste time searching all over <br>
         again for that item you loved on your phone the other day - it's all here in one place!</p>
         <button class="continueShop">Continue Shopping</button>
    `;
    favmodalbody.appendChild(nofav);
    let shopBtn = document.querySelector(".continueShop");
    if (shopBtn) {
      shopBtn.addEventListener("click", () => {
        window.location.href = "../products/products.html";
      });
    }
  } else {
    let favdiv = document.createElement("div");
    favdiv.className = "favdiv";
    loggedInUser.wishlist.forEach((product) => {
      let card = document.createElement("div");
      card.className = "cardstyle";
      card.innerHTML = `
        <div class="card product-card">
          <img src="${product.image}" class="card-img-top" alt="${
        product.name
      }">
          <div class="card-body text-center ">
            <div class="d-flex flex-column text-start mb-0">
              <h5 class=" text-truncate producttitlefav">${product.name}</h5>
              <h4 class="card-text">
                <h4 class="newprice fw-bold text-danger">$${product.price}</h4>
                ${
                  product.oldPrice
                    ? `<h4 class="old-price  text-secondary text-decoration-line-through">${product.oldPrice}</h4>`
                    : ""
                }
              </h4>
            </div>
            <button class="btn btn-dark w-100 btnaddtocard" data-id="${
              product.id
            }">ADD TO CART</button>
          </div>
        </div>
      `;
      favdiv.appendChild(card);
    });
    favmodalbody.appendChild(favdiv);
  }
}
document.addEventListener("click", function (e) {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || [];
  if (e.target.classList.contains("btnaddtocard")) {
    let products = JSON.parse(localStorage.getItem("products"));
    let productId = parseInt(e.target.getAttribute("data-id"));

    let quantity = 1;

    if (!loggedInUser.cart) {
      loggedInUser.cart = [];
    }

    // هات المنتج نفسه من الـ products
    let productToAdd = products.find((p) => p.id === productId);

    if (productToAdd && !loggedInUser.cart.some((p) => p.id === productId)) {
      let productCopy = { ...productToAdd };
      productCopy.quantity = 1;
      loggedInUser.cart.push(productCopy);
    }

    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    updateCartBadge();

    window.location.href = "../cart/cart.html";
    console.log(loggedInUser.wishlist);
  }
});

let favBadge = document.getElementById("favBadge");

function updateFavBadge() {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {
    wishlist: [],
  };

  favBadge.textContent =
    loggedInUser.wishlist.length > 0 ? loggedInUser.wishlist.length : 0;
}

function updateCartBadge() {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {
    cart: [],
  };

  let cartBadge = document.getElementById("cartbadge");
  if (cartBadge) {
    cartBadge.textContent = loggedInUser.cart.length;
  }
}
