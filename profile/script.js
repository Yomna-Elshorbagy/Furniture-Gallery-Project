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
            <td>${itemsList}</td>
          </tr>
        `;
        ordersTableBody.innerHTML += row;
      });
    }
    ordersSection.classList.remove("d-none");
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
