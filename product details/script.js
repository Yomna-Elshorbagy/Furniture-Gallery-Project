//======> handel logged in and logged out
let loggedInUser;
document.addEventListener("DOMContentLoaded", () => {
  let loginBtn = document.getElementById("loginBtn");
  let logoutBtn = document.getElementById("logoutBtn");
  loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (loggedInUser) {
    // show logout, hide login
    loginBtn.classList.add("d-none");
    logoutBtn.classList.remove("d-none");
  } else {
    // show login, hide logout
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
});
loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

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

//====> if user Not logged in redirect him to login page
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
// =====> get product details
let urlParams = new URLSearchParams(window.location.search);
let productId = parseInt(urlParams.get("id"));
let products = JSON.parse(localStorage.getItem("products"));

if (!products) {
  // If not found in localStorage, fetch from server
  fetch("../server/data/products.json")
    .then((res) => res.json())
    .then((prod) => {
      localStorage.setItem("products", JSON.stringify(prod));
      showProductDetails(prod);
    })
    .catch((err) => console.error("Error loading products:", err));
} else {
  showProductDetails(products);
}

//======> display product details
function showProductDetails(products) {
  let product = products.find((p) => p.id === productId);

  if (!product) {
    document.getElementById("details").innerHTML = "<p>Product not found</p>";
    return;
  }
  document.getElementById("details").innerHTML = `
      <h2 class="fw-bold">${product.name}</h2>
      <p>
        <span class="old-price me-2">$${product.oldPrice}</span> 
        <span class="text-color fs-4 fw-bold">$${product.price}</span>
      </p>
      <p class="text-muted">${product.description}</p>
      <p class="text-muted"> Reviews: <span class="text-secondary text-capitalize">${product.reviews}</span></p>
      <p><strong>In Stock:</strong> ${product.stock}</p>
        <div class="d-flex align-items-center mb-3">
        <button class="btn btn-outline-secondary me-2" id="decrease">-</button>
        <input type="text" id="quantity" value="1" class="form-control text-center" style="width:70px;" readonly>
        <button class="btn btn-outline-secondary ms-2" id="increase">+</button>
      </div>
      <button class="btn btn-dark w-100 mb-2 mt-2 py-2 btnaddtocard" data-id="${product.id}">Add to Cart</button>
      <button class="btn  hover-button w-100 mt-2 py-2" id="findStoreBtn">FIND IN STORES</button>
     <button class="btn hover-button w-100 mt-2 py-2" data-bs-toggle="modal" data-bs-target="#questionModal">  Ask A QUESTIONS</button>
     <button class="btn hover-button w-100 mt-2 py-2" data-bs-toggle="modal" data-bs-target="#deliveryModal"> GET DELIVERY ESTIMATE</button>


        <div class="social-icons mb-4 pt-2">
        <span class="fw-bold  mb-2">Share:</span>
        <a href="#"><i class="fab fa-facebook"></i></a>
        <a href="#"><i class="fab fa-twitter"></i></a>
        <a href="#"><i class="fab fa-pinterest"></i></a>
        <a href="#"><i class="fab fa-whatsapp"></i></a>
        <a href="#"><i class="fab fa-linkedin"></i></a>
        <a href="#"><i class="fab fa-instagram"></i></a>
      </div>
    `;

  document.addEventListener("click", (e) => {
    if (e.target.id === "findStoreBtn") {
      window.location.href = "../findStore/find.html";
    }
  });
  //====> get main image
  document.getElementById("mainImage").innerHTML = `
      <img src="${
        product.image
      }" id="currentImage" class="img-fluid shadow-sm" />
             <div class="accordion py-3" id="accordionExample">
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
              <i class="fa-solid fa-ruler me-2"></i> Dimensions
            </button>
          </h2>
          <div id="collapseOne" class="accordion-collapse collapse">
            <div class="accordion-body">
             <div class="accordion-body">
              <p><i class="fa-solid fa-arrows-left-right me-2"></i> <strong>Width:</strong> ${
                product.dimentions?.width || "N/A"
              }</p>
              <p><i class="fa-solid fa-arrows-up-down me-2"></i> <strong>Height:</strong> ${
                product.dimentions?.height || "N/A"
              }</p>
              <p><i class="fa-solid fa-up-right-and-down-left-from-center me-2"></i> <strong>Length:</strong> ${
                product.dimentions?.length
              }</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    `;

  // ====> get sub-images
  let subImagesContainer = document.getElementById("subImages");
  product.subImages.forEach((img) => {
    let wrapper = document.createElement("div");
    wrapper.classList.add("blockCont");
    wrapper.classList.add("sub-image-wrapper");
    let imgEl = document.createElement("img");
    imgEl.src = img;
    imgEl.classList.add("img-fluid", "shadow-md");
    imgEl.addEventListener("click", () => {
      document.getElementById("currentImage").src = img;
    });
    wrapper.appendChild(imgEl);
    subImagesContainer.appendChild(wrapper);
  });

  // ===> counter logic
  let quantityInput = document.getElementById("quantity");
  let increaseBtn = document.getElementById("increase");
  let decreaseBtn = document.getElementById("decrease");

  increaseBtn.addEventListener("click", () => {
    let current = Number(quantityInput.value);
    if (current < product.stock) {
      quantityInput.value = current + 1;
    }
  });

  decreaseBtn.addEventListener("click", () => {
    let current = Number(quantityInput.value);
    if (current > 1) {
      quantityInput.value = current - 1;
    }
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

// ========> related products
document.addEventListener("DOMContentLoaded", () => {
  const products = JSON.parse(localStorage.getItem("products")) || [];

  // get this product from query params
  const urlParams = new URLSearchParams(window.location.search);
  const currentId = parseInt(urlParams.get("id"));

  const currentProduct = products.find((p) => p.id === currentId);
  if (!currentProduct) return;

  function getRelatedProducts() {
    // get all products related to this category and save in anew array
    const sameCategory = products.filter(
      (p) => p.category === currentProduct.category && p.id !== currentId
    );

    // if less than display
    return sameCategory.sort(() => Math.random() - 0.5).slice(0, 4);
  }

  function renderRelatedProducts(related) {
    const container = document.getElementById("related-products");
    container.innerHTML = "";

    related.forEach((product) => {
      const card = document.createElement("div");
      card.className = "related-card";
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h4>${product.name}</h4>
         <p>
        <span class="old-price me-2">$${product.oldPrice}</span> 
        <span class="text-color fs-4 fw-bold">$${product.price}</span>
      </p>
      `;
      card.addEventListener("click", () => {
        window.location.href = `proDetails.html?id=${product.id}`;
      });
      container.appendChild(card);
    });
  }

  const related = getRelatedProducts();
  renderRelatedProducts(related);
  updateCartBadge();

  updateFavBadge();
  renderFavoriteModal();
});

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
// ====> save users
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
