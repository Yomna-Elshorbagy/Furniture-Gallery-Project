document.addEventListener("DOMContentLoaded", () => {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let orderItem = document.getElementById("orderItem");
  let ordersSection = document.getElementById("ordersSection");
  let ordersTableBody = document.getElementById("ordersTableBody");

  orderItem.addEventListener("click", (e) => {
    e.preventDefault();
    ordersTableBody.innerHTML = "";
    let userOrders = orders.filter((order) => order.userId == loggedInUser.ID);

    if (userOrders.length === 0) {
      ordersTableBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center">No orders found</td>
        </tr>
      `;
    } else {
      userOrders.forEach((order) => {
        let itemsList = Array.isArray(order.items)
          ? order.items.map((item) => `${item.name} (x${item.qty})`).join(", ")
          : "No items";

        let row = `
          <tr>
            <td>${order.ID}</td>
            <td>${order.Date}</td>
            <td>${order.Status}</td>
            <td>${order.TotalPrice}</td>
            <td>${order.TotalItems}</td>
          </tr>
        `;
        ordersTableBody.innerHTML += row;
      });
    }
    ordersSection.classList.remove("d-none");
  });

  // check if user logged in or not to access userData links
  document.addEventListener("click", (e) => {
    let link = e.target.closest("a.userData");
    if (!link) return;
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
  //=====>  handel logged in and logged out
  handleAuthButtons();
});

// === Validation needed ===
const validateEmail = (email) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
const validateName = (name) =>
  /^(?=(?:.*[A-Za-zÀ-ÖØ-öø-ÿ]){2,})[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(
    name
  );
const validatePassword = (password) => password.length >= 6;

const getUsers = () => JSON.parse(localStorage.getItem("users")) || [];
const saveUsers = (users) =>
  localStorage.setItem("users", JSON.stringify(users));

// === 1- ==> get user data ===
document.addEventListener("DOMContentLoaded", () => {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    window.location.href = "../Auth/log-in/login.html";
    return;
  }

  document.getElementById("userName").textContent = loggedInUser.Name;
  document.getElementById("userEmail").textContent = loggedInUser.Email;

  let [firstName, lastName] = loggedInUser.Name.split(" ");
  document.getElementById("firstName").value = firstName || "";
  document.getElementById("lastName").value = lastName || "";
  document.getElementById("email").value = loggedInUser.Email;
  document.getElementById("password").value = "";
});

document.getElementById("editButton").addEventListener("click", () => {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  let users = getUsers();

  let firstName = document.getElementById("firstName").value.trim();
  let lastName = document.getElementById("lastName").value.trim();
  let email = document.getElementById("email").value.trim();
  let newPassword = document.getElementById("password").value.trim();

  if (!firstName && !lastName && !email && !newPassword) {
    let toastEl = document.getElementById("ToastNoUpdate");
    toastEl.classList.add("bg-danger");
    let toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
    return;
  }
  // 2- ===> VALIDATIONS ===
  if (firstName && !validateName(firstName)) {
    document.getElementById("firstNameFeedback").textContent =
      "Invalid first name.";
    document.getElementById("firstName").classList.add("is-invalid");
    return;
  }
  if (lastName && !validateName(lastName)) {
    document.getElementById("lastNameFeedback").textContent =
      "Invalid last name.";
    document.getElementById("lastName").classList.add("is-invalid");
    return;
  }
  if (email && !validateEmail(email)) {
    document.getElementById("emailFeedback").textContent =
      "Invalid email format.";
    document.getElementById("email").classList.add("is-invalid");
    return;
  }
  // 2- ===> prevent duplicate email
  if (
    email &&
    email.toLowerCase() !== loggedInUser.Email.toLowerCase() &&
    users.some((u) => u.Email.toLowerCase() === email.toLowerCase())
  ) {
    document.getElementById("emailFeedback").textContent =
      "This email is already registered.";
    document.getElementById("email").classList.add("is-invalid");
    return;
  }
  if (newPassword && !validatePassword(newPassword)) {
    document.getElementById("passwordFeedback").textContent =
      "Password must be at least 6 characters.";
    document.getElementById("password").classList.add("is-invalid");
    return;
  }

  // === note here ==> update fields only if changed ===
  let updatedUser = { ...loggedInUser };

  if (firstName || lastName) {
    updatedUser.Name = `${firstName || ""} ${lastName || ""}`.trim();
  }
  if (email) {
    updatedUser.Email = email;
  }
  if (newPassword) {
    updatedUser.Password = bcrypt.hashSync(newPassword, 10);
  }

  // === Update users array ===
  let idx = users.findIndex((u) => u.ID === loggedInUser.ID);
  if (idx !== -1) {
    users[idx] = updatedUser;
    saveUsers(users);
  }

  // === Save back loggedInUser ===
  localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

  document.getElementById("userName").textContent = updatedUser.Name;
  document.getElementById("userEmail").textContent = updatedUser.Email;

  //====> Clear errors
  ["firstName", "lastName", "email", "password"].forEach((id) => {
    document.getElementById(id).classList.remove("is-invalid");
  });

  //====> Show Toast
  let toastEl = document.getElementById("ToastProfile");
  toastEl.classList.add("styleToast");
  let toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
});

// ====> Toggle Password Visibility ===
document.getElementById("togglePassword").addEventListener("click", () => {
  let passwordInput = document.getElementById("password");
  let icon = document.querySelector("#togglePassword i");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    icon.classList.replace("bi-eye-slash", "bi-eye");
  } else {
    passwordInput.type = "password";
    icon.classList.replace("bi-eye", "bi-eye-slash");
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

    let existing = user.cart.find((p) => p.id === productId);

    // 🔴 Check stock
    if (product.stock === 0) {
      Swal.fire({
        title: "❌ Out of Stock",
        text: "This product is currently not available.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (existing) {
      if (existing.quantity < product.stock) {
        existing.quantity += 1;
        Swal.fire({
          title: "✅ Updated Cart",
          text: `${product.name} quantity increased.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: "⚠️ Stock Limit Reached",
          text: "You cannot add more of this product.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }
    } else {
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
