document.addEventListener("DOMContentLoaded", () => {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let orderItem = document.getElementById("orderItem");
  let ordersSection = document.getElementById("ordersSection");
  let ordersTableBody = document.getElementById("ordersTableBody");

  // ===> Filtering & Searching Handler
  function applyOrderFilters(orders, loggedInUser) {
    let searchValue =
      document.getElementById("orderSearch")?.value.toLowerCase() || "";
    let filterValue =
      document.getElementById("orderFilter")?.value.toLowerCase() || "";
    let dateValue = document.getElementById("orderDate")?.value || "";

    // ==> 1- user orders
    let filtered = orders.filter((order) => order.userId == loggedInUser.ID);

    // ==> 2️- status filter
    if (filterValue) {
      filtered = filtered.filter(
        (order) => order.Status.toLowerCase() === filterValue
      );
    }

    // ==> 3️- date filter
    if (dateValue) {
      filtered = filtered.filter((order) => {
        let orderDate = new Date(order.Date);
        let formatted = orderDate.toISOString().split("T")[0]; // match YYYY-MM-DD
        return formatted === dateValue;
      });
    }

    // ==> 4️- search filter
    if (searchValue) {
      filtered = filtered.filter((order) => {
        let itemsList = Array.isArray(order.products)
          ? order.products
              .map((p) => p.name)
              .join(" ")
              .toLowerCase()
          : "";
        return (
          order.ID.toString().includes(searchValue) ||
          order.Date.toLowerCase().includes(searchValue) ||
          itemsList.includes(searchValue)
        );
      });
    }

    // 5️⃣ sort
    filtered.sort((a, b) => new Date(b.Date) - new Date(a.Date));

    return filtered;
  }
  if (window.location.hash === "#orders") {
    document.querySelector("#ordersTab")?.click();
    document.getElementById("orderItem")?.click(); 
    document
      .querySelector("#ordersSection")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  orderItem.addEventListener("click", (e) => {
    e.preventDefault();
    //===> handel filtering and searching
    if (!document.getElementById("orderSearch")) {
      let controls = document.createElement("div");
      controls.className = "d-flex mb-3";
      controls.innerHTML = `
        <input type="text" id="orderSearch" class="form-control me-2" placeholder="Search orders ID, Product name , date...">
        <select id="orderFilter" class="form-select me-2" style="max-width:200px">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="shipped">Shipped</option>
          <option value="cancelled">Cancelled</option>
        </select>
      <div class="input-group" style="max-width:220px">
        <input type="date" id="orderDate" class="form-control">
        <button class="btn btn-outline-danger" type="button" id="clearDate">
          <i class="bi bi-x-circle"></i>
        </button>
      </div>

      `;

      ordersSection.prepend(controls);
      document.getElementById("orderSearch").addEventListener("input", () => {
        orderItem.click();
      });
      document.getElementById("orderFilter").addEventListener("change", () => {
        orderItem.click();
      });
      document.getElementById("orderDate").addEventListener("change", () => {
        orderItem.click();
      });
      document.getElementById("clearDate").addEventListener("click", () => {
        document.getElementById("orderDate").value = "";
        orderItem.click();
      });
    }

    ordersTableBody.innerHTML = "";

    // let userOrders = orders.filter((order) => order.userId == loggedInUser.ID);
    // userOrders.sort((a, b) => new Date(b.Date) - new Date(a.Date));

    let userOrders = applyOrderFilters(orders, loggedInUser);

    if (userOrders.length === 0) {
      ordersTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center">No orders found</td>
      </tr>
    `;
    } else {
      userOrders.forEach((order) => {
        //===> 1- Show products with quantity
        let itemsList = Array.isArray(order.products)
          ? order.products
              .map((prod) => `${prod.name} (x${prod.quantity})`)
              .join("<br>")
          : "No products";

        // ===> 2- normalize status
        let status = order.Status?.toLowerCase();
        let deleteBtn = "";
        // ==> handel background for each status
        let statusClass = "";
        switch (order.Status.toLowerCase()) {
          case "completed":
            statusClass = "badge bg-success";
            break;
          case "pending":
            statusClass = "badge bg-warning text-dark";
            break;
          case "cancelled":
            statusClass = "badge bg-danger";
            break;
          case "shipped":
            statusClass = "badge bg-info text-dark";
            break;
          default:
            statusClass = "badge bg-secondary";
        }
        // ==> 3- Show delete button, but disable if not pending
        deleteBtn = `
        <button class="btn btn-sm btn-danger cancel-order"
                data-id="${order.ID}"
                ${status !== "pending" ? "disabled" : ""}>
          <i class="bi bi-x-circle"></i>
        </button>
      `;

        let row = `
        <tr>
          <td>${order.ID}</td>
          <td>${order.Date}</td>
          <td><span class="${statusClass}">${order.Status}</span></td>
          <td>${order.TotalPrice}</td>
          <td>${order.TotalItems}</td>
          <td>${itemsList}</td>
          <td>${deleteBtn}</td>
        </tr>
      `;
        ordersTableBody.innerHTML += row;
      });

      // ===> 4- attach delete handler
      document.querySelectorAll(".cancel-order").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (btn.disabled) return; // do nothing if disabled

          let orderId = btn.getAttribute("data-id");

          Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to cancel this order?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, cancel it",
            cancelButtonText: "No, keep it",
          }).then((result) => {
            if (result.isConfirmed) {
              // ===> 5- Find order and update status
              let orderIndex = orders.findIndex(
                (order) =>
                  order.ID == orderId && order.userId == loggedInUser.ID
              );

              if (orderIndex !== -1) {
                // 1. Mark as cancelled
                orders[orderIndex].Status = "Cancelled";
                localStorage.setItem("orders", JSON.stringify(orders));

                // 2. Restore product stock
                let products =
                  JSON.parse(localStorage.getItem("products")) || [];
                orders[orderIndex].products.forEach((orderedProd) => {
                  let prodIndex = products.findIndex(
                    (p) => p.id === orderedProd.id
                  );
                  if (prodIndex !== -1) {
                    products[prodIndex].stock += orderedProd.quantity;
                  }
                });
                localStorage.setItem("products", JSON.stringify(products));
              }

              Swal.fire({
                title: "Cancelled",
                text: "Your order has been cancelled successfully.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
              });

              // refresh orders instantly
              orderItem.click();
            }
          });
        });
      });

      ordersSection.classList.remove("d-none");
    }
  });

  // ===> check if user logged in or not to access userData links
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

// ===> Validation needed <===
const validateEmail = (email) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
const validateName = (name) => /^[A-Za-zÀ-ÖØ-öø-ÿ]{3,}$/.test(name);

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

  ["firstName", "lastName", "email", "password"].forEach((id) => {
    document.getElementById(id).classList.remove("is-invalid");
    let feedbackEl = document.getElementById(id + "Feedback");
    if (feedbackEl) feedbackEl.textContent = "";
  });

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
  // 3- ===> prevent duplicate email
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

  // 4- === Update users array ===
  let idx = users.findIndex((u) => u.ID === loggedInUser.ID);
  if (idx !== -1) {
    users[idx] = updatedUser;
    saveUsers(users);
  }

  // 5- === Save back loggedInUser ===
  localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

  document.getElementById("userName").textContent = updatedUser.Name;
  document.getElementById("userEmail").textContent = updatedUser.Email;

  // 6- ====> Clear errors
  ["firstName", "lastName", "email", "password"].forEach((id) => {
    document.getElementById(id).classList.remove("is-invalid");
  });

  // 7- ====> Show Toast
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
    user.wishlist = user.wishlist.filter((p) => p.id !== id);

    localStorage.setItem("loggedInUser", JSON.stringify(user));

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let idx = users.findIndex((u) => u.ID === user.ID);
    if (idx !== -1) {
      users[idx] = user;
      localStorage.setItem("users", JSON.stringify(users));
    }
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

      let users = JSON.parse(localStorage.getItem("users")) || [];
      let idx = users.findIndex((u) => u.ID === user.ID);
      if (idx !== -1) {
        users[idx] = user;
        localStorage.setItem("users", JSON.stringify(users));
      }

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

    // Check stock
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
