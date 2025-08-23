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

////////// build productcard from localstorage
let products = JSON.parse(localStorage.getItem("products")) || [];
// let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// cart badge
let users = JSON.parse(localStorage.getItem("users")) || [];
let loggedInUserId = localStorage.getItem("loggedInUserId");
let userIndex = users.findIndex((user) => user.ID === loggedInUserId);
let loggedInUser = users[userIndex];

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
}

let productList = document.getElementById("product-list");
let homeproducts = products.slice(0, 8);

homeproducts.forEach((product) => {
  let card = document.createElement("div");
  card.className = "col-6 col-md-3 mb-4";
  let isFavorite = loggedInUser.wishlist.some((p) => p.id === product.id);

  card.innerHTML = `
    <div class="card product-card homecardproduct">
          <div class="image-scale">

      <button class="favorite-btn ${isFavorite ? "active" : ""}" data-id="${
    product.id
  }">
       <i class="bi ${isFavorite ? "bi-heart-fill" : "bi-heart"}"></i>
      </button>
      <img src="${product.image}" class="card-img-top" alt="${product.name}">
      </div>
     <div class="card-body text-center">
  <h6 class=" card-title text-truncate">${product.name}</h6>
  <div class="card-text mb-2">
    <span class="newprice fw-bold">$${product.price}</span>
    ${
      product.oldPrice
        ? `<span class="old-price text-secondary text-decoration-line-through">${product.oldPrice}</span>`
        : ""
    }
  </div>
</div>
    </div>
  `;

  card.addEventListener("click", () => {
    window.location.href = `#${product.id}`;
  });

  productList.appendChild(card);
});

///////// add favorite button fuctionality
let allfavoritebtn = document.querySelectorAll(".favorite-btn");

function renderFavoriteModal() {
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

//go to cart

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btnaddtocard")) {
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

    saveUsers();
    updateCartBadge();

    window.location.href = "../cart/cart.html";
    console.log(loggedInUser.wishlist);
  }
});

let favoriteLabel = document.getElementById("favoritelabel");
if (loggedInUser && loggedInUser.Email) {
  favoriteLabel.textContent = loggedInUser.Email;
} else {
  favoriteLabel.textContent = "example@gmail.com";
}

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

// update favorite badge
let favBadge = document.getElementById("favBadge");

function updateFavBadge() {
  favBadge.textContent =
    loggedInUser.wishlist.length > 0 ? loggedInUser.wishlist.length : 0;
}
updateFavBadge();
// هنا بعمل check علشان لما اعمل reload  favorite products تبقي موجوده
allfavoritebtn.forEach((btn) => {
  let id = parseInt(btn.getAttribute("data-id"));
  let icon = btn.querySelector("i");
  let isFavorite = loggedInUser.wishlist.some((p) => p.id === id);

  if (isFavorite) {
    btn.classList.add("active");
    icon.classList.remove("bi-heart");
    icon.classList.add("bi-heart-fill");
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    let toastEl = document.getElementById("favToast");
    let toastBody = document.getElementById("favToastBody");
    let toast = new bootstrap.Toast(toastEl);
    let product = products.find((p) => p.id === id);

    let inWishlist = loggedInUser.wishlist.some((p) => p.id === id);

    if (inWishlist) {
      // remove from favorites
      loggedInUser.wishlist = loggedInUser.wishlist.filter((p) => p.id !== id);
      btn.classList.remove("active");
      icon.classList.remove("bi-heart-fill");
      icon.classList.add("bi-heart");

      toastBody.innerHTML = `<p class=" text-black text-center ">${product.name} has been removed from Favorites!`;
      toastEl.className =
        "opacity-100 toast align-items-center border-0 toaststyle";
    } else {
      // add to favorites
      loggedInUser.wishlist.push(product);
      btn.classList.add("active");
      icon.classList.remove("bi-heart");
      icon.classList.add("bi-heart-fill");

      toastBody.innerHTML = `<p class="text-black text-center "> ${product.name}  has been added to Favorites!</p>`;
      toastEl.className =
        "opacity-100 toast align-items-center  border-0 toaststyle";
    }

    // Update localStorage
    saveUsers();
    // Update the modal content
    renderFavoriteModal();

    updateFavBadge();

    // Show toast
    toast.show();
  });
});
function updateCartBadge() {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {
    cart: [],
  };
  let cartBadge = document.getElementById("cartbadge");
  if (cartBadge) {
    cartBadge.textContent = loggedInUser.cart.length;
  }
}

renderFavoriteModal();

// ===>redirect to products page with category query
function goToCategory(categoryName) {
  window.location.href = `../products/products.html?category=${encodeURIComponent(
    categoryName
  )}`;
}
