// ====== 1- User Class ========>
class User {
  constructor(_ID, _name, _email, _phone, _hashedPassword, _role = "user") {
    this.ID = _ID;
    this.Name = _name;
    this.Email = _email;
    this.Phone = _phone;
    this.Password = _hashedPassword;
    this.Role = _role;
    this.cart = [];
    this.wishlist = [];
    this.orderHistory = [];
    this.isDeleted = false;
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
      document.getElementById("checkUser").style.display = "block";
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
  /^[A-Za-zÀ-ÖØ-öø-ÿ]{3,}(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(name);

const validatePassword = (password) => password.length >= 6;
const validatePhone = (phone) => /^(010|011|012|015)[0-9]{8}$/.test(phone);

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
const phoneInput = document.getElementById("tel");
const confirmPasswordInput = document.getElementById("confirmPassword");
const phoneError = document.getElementById("phoneError");
const confirmPasswordError = document.getElementById("confirmPasswordError");

// ======= 5- validation function =====>
function checkFormValidity() {
  let nameValid = validateName(nameInput.value.trim());
  let emailValid =
    validateEmail(emailInput.value.trim()) &&
    !getUsers().some(
      (u) => u.Email.toLowerCase() === emailInput.value.trim().toLowerCase()
    );
  let passwordValid = validatePassword(passwordInput.value.trim());
  let phoneValid = validatePhone(phoneInput.value.trim());
  let confirmPasswordValid =
    passwordInput.value.trim() === confirmPasswordInput.value.trim();

  submitBtn.disabled = !(
    nameValid &&
    emailValid &&
    passwordValid &&
    phoneValid &&
    confirmPasswordValid
  );
}
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
phoneInput.addEventListener("input", () => {
  if (!validatePhone(phoneInput.value.trim())) {
    phoneError.textContent =
      "Phone must start with 010, 011, 012, or 015 and contain 11 digits.";
    phoneError.style.display = "block";
  } else {
    phoneError.textContent = "";
    phoneError.style.display = "none";
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
confirmPasswordInput.addEventListener("input", () => {
  if (passwordInput.value.trim() !== confirmPasswordInput.value.trim()) {
    confirmPasswordError.textContent = "Passwords do not match.";
    confirmPasswordError.style.display = "block";
  } else {
    confirmPasswordError.textContent = "";
    confirmPasswordError.style.display = "none";
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
  let phone = phoneInput.value.trim();

  let users = getUsers();
  let id = Date.now() + Math.floor(Math.random() * 1000);

  let newUser = new User(id, name, email, phone, hashedPassword, role);
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
      window.location.href = "../log-in/login.html";
    });
  } else {
    window.location.href = link.href;
  }
});
// ===== GOOGLE SIGNUP HANDLER =====
const googleBtn = document.querySelector(".google-btn");

if (googleBtn) {
  googleBtn.addEventListener("click", () => {
    google.accounts.id.initialize({
      client_id:
        "700704531343-a9a4dtrmun32cn8g9vaq0geckdlrdhf9.apps.googleusercontent.com",
      callback: handleGoogleResponse,
    });

    google.accounts.id.prompt(); // opens the popup for errors
  });
}

// Process Google login response
function handleGoogleResponse(response) {
  // Decode JWT
  const data = JSON.parse(atob(response.credential.split(".")[1]));
  console.log("Google user:", data);

  // Check if user already exists
  let users = getUsers();
  let existingUser = users.find(
    (u) => u.Email.toLowerCase() === data.email.toLowerCase()
  );

  let loggedInUser;
  if (!existingUser) {
    let id = Date.now() + Math.floor(Math.random() * 1000);
    loggedInUser = new User(
      id,
      data.name,
      data.email,
      data.sub, // save google ID as "phone" just to keep schema filled
      "google-auth", // this is default password but not needed
      "user"
    );
    users.push(loggedInUser);
    saveUsers(users);
  } else {
    loggedInUser = existingUser;
  }

  // Save session
  localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

  Swal.fire({
    title: `🎉 Welcome ${data.name}!`,
    text: "You have signed up with Google successfully.",
    icon: "success",
    timer: 2000,
    showConfirmButton: false,
  }).then(() => {
    window.location.href = "../../home/home.html";
  });
}
