// handel logged in and logged out
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
      <button class="btn  hover-button w-100 mt-2 py-2">FIND IN STORES</button>
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

  //====> go to cart page
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btnaddtocard")) {
      let productId = parseInt(e.target.getAttribute("data-id"));
      let quantityInput = document.getElementById("quantity"); // جيب قيمة input
      if (!loggedInUser) {
        e.preventDefault();
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
      if (!loggedInUser.cart) {
        loggedInUser.cart = [];
      }

      let productToAdd = products.find((p) => p.id === productId);

      if (productToAdd && !loggedInUser.cart.some((p) => p.id === productId)) {
        loggedInUser.cart.push({
          ...productToAdd, // all products displayed
          quantity: Number(quantityInput.value), // quantity
        });
      }

      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

      window.location.href = "../cart/cart.html";
      console.log(loggedInUser.wishlist);
    }
  });

  // ------------------------------------------> related products-----------------------------------------------------
}
// ===> add fav badge
let favBadge = document.getElementById("favBadge");

function updateFavBadge() {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {
    wishlist: [],
  };

  favBadge.textContent =
    loggedInUser.wishlist.length > 0 ? loggedInUser.wishlist.length : 0;
}

// ====> add cart badge
function updateCartBadge() {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {
    cart: [],
  };

  let cartBadge = document.getElementById("cartbadge");
  if (cartBadge) {
    cartBadge.textContent = loggedInUser.cart.length;
  }
}
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
let favoriteLabel = document.getElementById("favoritelabel");
if (loggedInUser && loggedInUser.Email) {
  favoriteLabel.textContent = loggedInUser.Email;
} else {
  favoriteLabel.textContent = "example@gmail.com";
}

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
