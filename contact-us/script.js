document.addEventListener("DOMContentLoaded", addContactDetails);

let form = document.getElementById("contactForm");
let alertPlaceholder = document.getElementById("alertPlaceholder");

function showAlert(message, type) {
  let wrapper = document.createElement("div");
  wrapper.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
  alertPlaceholder.innerHTML = "";
  alertPlaceholder.append(wrapper);
}

function addContactDetails() {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let contactData = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      subject: document.getElementById("subject").value.trim(),
      message: document.getElementById("message").value.trim(),
      terms: document.getElementById("terms").checked,
      date: new Date().toISOString(),
    };
    if (
      !contactData.firstName ||
      !contactData.lastName ||
      !contactData.email ||
      !contactData.message
    ) {
      showAlert("🚫 Please fill in all required fields.", "danger");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contactData.email)) {
      showAlert("🚫 Please enter a valid email address.", "danger");
      return;
    }
    if (!/^(010|011|012|015)\d{8}$/.test(contactData.phone)) {
      showAlert(
        "🚫 Please enter a valid Egyptian mobile number (e.g., 01012345678).",
        "danger"
      );
      return;
    }
    if (!contactData.terms) {
      showAlert("👀 You must accept the terms.", "danger");
      return;
    }

    let storedMessages =
      JSON.parse(localStorage.getItem("contactMessages")) || [];
    storedMessages.push(contactData);
    localStorage.setItem("contactMessages", JSON.stringify(storedMessages));

    showAlert("✅ Your message has been saved!", "success");
    Swal.fire({
      icon: "success",
      title: "Message Sent!",
      text: "✅ Your message has been saved.",
      showConfirmButton: false,
      timer: 2000,
    });
    form.reset();
  });
}

let loggedInUser;
// handel logged in and logged out
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

// cart badge
function updateCartBadge() {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  let cartproducts = loggedInUser.cart;
  let cartBadge = document.getElementById("cartbadge");
  if (cartBadge) {
    cartBadge.textContent = cartproducts.length;
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
let favoriteLabel = document.getElementById("favoritelabel");
if (loggedInUser && loggedInUser.Email) {
  favoriteLabel.textContent = loggedInUser.Email;
} else {
  favoriteLabel.textContent = "example@gmail.com";
}

let favBadge = document.getElementById("favBadge");

function updateFavBadge() {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {
    wishlist: [],
  };

  favBadge.textContent =
    loggedInUser.wishlist.length > 0 ? loggedInUser.wishlist.length : 0;
}
updateCartBadge();
renderFavoriteModal();
updateFavBadge();
