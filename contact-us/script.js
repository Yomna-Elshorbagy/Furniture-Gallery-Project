document.addEventListener("DOMContentLoaded", addContactDetails);
const serverDataFiles = {
  products: "../../server/data/products.json",
  categories: "../../server/data/categories.json",
  orders: "../../server/data/orders.json",
  users: "../../server/data/users.json",
  contactMessages: "../../server/data/contactMessages.json",
};
// =====> on load run functions <=====
Object.entries(serverDataFiles).forEach(([key, url]) => {
  if (!localStorage.getItem(key)) {
    fetch(url)
      .then((res) => res.json())
      .then((data) => localStorage.setItem(key, JSON.stringify(data)))
      .catch((err) => console.error(`Error loading ${key}:`, err));
  }
});
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

    const user = getLoggedInUser();
    if (!user) {
      Swal.fire({
        title: "🔒 Login Required",
        text: "You must be logged in to send a message.",
        icon: "warning",
        confirmButtonText: "Go to Login",
      }).then(() => {
        window.location.href = "../Auth/log-in/login.html";
      });
      return;
    }
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
    if (!/^[A-Za-z ]{3,30}$/.test(contactData.firstName)) {
      showAlert(
        "🚫 First name must be 3–30 letters only (spaces allowed).",
        "danger"
      );
      return;
    }
    if (!/^[A-Za-z ]{3,30}$/.test(contactData.lastName)) {
      showAlert(
        "🚫 Last name must be 3–30 letters only (spaces allowed).",
        "danger"
      );
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
    if (contactData.message.length < 10) {
      showAlert("🚫 Message must be at least 10 characters long.", "danger");
      return;
    }

    if (!contactData.terms) {
      showAlert("👀 You must accept the terms.", "danger");
      return;
    }

    // --- Save if valid ---
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
