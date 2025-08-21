// ====== 1- User Class ========>
class User {
  constructor(_ID, _name, _email, _hashedPassword, _role = "user") {
    this.ID = _ID;
    this.Name = _name;
    this.Email = _email;
    this.Password = _hashedPassword;
    this.Role = _role;
    this.cart = [];
    this.wishlist = [];
    this.orderHistory = [];
    if (this.Role === "admin" || this.Role === "seller") {
      this.cart = [];
      this.orderHistory = [];
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser) {
    if (loggedInUser.Role === "admin") {
      document.getElementById("checkAdmin").style.display = "block";
      document.getElementById("checkSeller").style.display = "block";
    } else {
      document.getElementById("checkAdmin").style.display = "none";
      document.getElementById("checkSeller").style.display = "none";
      document.getElementById("checkUser").style.display = "none";
    }
  }
});

// ======= 2- Validation helpers =====>
const validateEmail = (email) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
const validateName = (name) =>
  /^(?=(?:.*[A-Za-zÀ-ÖØ-öø-ÿ]){3,})[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(
    name
  );
const validatePassword = (password) => password.length >= 6;

// ======= 3- LocalStorage helpers =====>
const getUsers = () => JSON.parse(localStorage.getItem("users")) || [];
const saveUsers = (users) =>
  localStorage.setItem("users", JSON.stringify(users));

// ======= 4- get all elements needed =====>
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const submitBtn = document.getElementById("submitBtn");

// ======= 5- validation function =====>
function checkFormValidity() {
  let nameValid = validateName(nameInput.value.trim());
  let emailValid =
    validateEmail(emailInput.value.trim()) &&
    !getUsers().some(
      (u) => u.Email.toLowerCase() === emailInput.value.trim().toLowerCase()
    );
  let passwordValid = validatePassword(passwordInput.value.trim());

  submitBtn.disabled = !(nameValid && emailValid && passwordValid);
}
// ======= 6- Seed default admins to be read when open the page ========>
(async function seedAdmins() {
  let users = getUsers();
  if (users.length === 0) {
    let defaultAdmins = [
      {
        id: "1",
        name: "yomna",
        email: "yomna@gmail.com",
        password: "123yomna",
      },
      { id: "2", name: "omar", email: "omar@gmail.com", password: "123omar" },
    ];

    for (let adminData of defaultAdmins) {
      let hashed = bcrypt.hashSync(adminData.password, 10);

      users.push(
        new User(adminData.id, adminData.name, adminData.email, hashed, "admin")
      );
    }
    saveUsers(users);
  }
})();

// ======= 7- validate errors =====>
nameInput.addEventListener("input", () => {
  if (!validateName(nameInput.value.trim())) {
    nameError.innerHTML =
      "At least 3 letters<br/><br/>Name can only contain letters, spaces, hyphens, or apostrophes.";
    nameError.style.display = "block";
  } else {
    nameError.textContent = "";
    nameError.style.display = "none";
  }
  checkFormValidity();
});

emailInput.addEventListener("input", () => {
  if (!validateEmail(emailInput.value.trim())) {
    emailError.textContent = "Invalid email format.";
    emailError.style.display = "block";
  } else if (
    getUsers().some(
      (u) => u.Email.toLowerCase() === emailInput.value.trim().toLowerCase()
    )
  ) {
    emailError.textContent = "This email is already registered.";
    emailError.style.display = "block";
  } else {
    emailError.textContent = "";
    emailError.style.display = "none";
  }
  checkFormValidity();
});

passwordInput.addEventListener("input", () => {
  if (!validatePassword(passwordInput.value.trim())) {
    passwordError.textContent = "Password must be at least 6 characters.";
    passwordError.style.display = "block";
  } else {
    passwordError.textContent = "";
    passwordError.style.display = "none";
  }
  checkFormValidity();
});

// ===== 8- Submit handler to successful signed up =====>
document.getElementById("userForm").addEventListener("submit", (e) => {
  e.preventDefault();

  let name = nameInput.value.trim();
  let email = emailInput.value.trim();
  let password = passwordInput.value.trim();
  let hashedPassword = bcrypt.hashSync(password, 10);
  let role = document.querySelector('input[name="role"]:checked').value;

  let users = getUsers();
  let id = Date.now() + Math.floor(Math.random() * 1000);

  let newUser = new User(id, name, email, hashedPassword, role);
  users.push(newUser);
  saveUsers(users);

  // localStorage.setItem("loggedInUser", JSON.stringify(newUser));

  Swal.fire({
    title: "🎉 Registration Successful!",
    text:
      role === "admin"
        ? "New Admin Registered!"
        : role === "seller"
        ? "Welcome Seller!"
        : "Welcome aboard!",
    icon: "success",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    background: "#dce3e8",
    color: "#444648",
    confirmButtonColor: "#3a6897",
    didOpen: () => {
      const content = Swal.getHtmlContainer();
      if (content) {
        content.style.fontSize = "1.1rem";
      }
    },
  }).then(() => {
    window.location.href = "../log-in/login.html";
  });
});
