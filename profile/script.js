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
let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
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
