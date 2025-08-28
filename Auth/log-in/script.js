let signedIn;
let users = JSON.parse(localStorage.getItem("users")) || [];

let emailInput = document.getElementById("email");
let passwordInput = document.getElementById("password");
let emailError = document.getElementById("emailError");
let passwordError = document.getElementById("passwordError");
let loginError = document.getElementById("loginError");
let submitBtn = document.getElementById("submitBtn");

function validateEmailExists(email) {
  return users.some((user) => user.Email.toLowerCase() === email.toLowerCase());
}

function validatePasswordMatch(email, password) {
  let user = users.find((u) => u.Email.toLowerCase() === email.toLowerCase());
  if (!user) return false;
  return bcrypt.compareSync(password, user.Password);
}

function checkFormValidity() {
  let emailValid = validateEmailExists(emailInput.value.trim());
  let passwordValid =
    emailValid &&
    validatePasswordMatch(emailInput.value.trim(), passwordInput.value.trim());

  submitBtn.disabled = !(emailValid && passwordValid);
}

// ====== Email Input Validation ======>
emailInput.addEventListener("input", () => {
  let email = emailInput.value.trim();

  if (!validateEmailExists(email)) {
    emailError.textContent = "❌ Email not found. Please sign up.";
    emailError.style.display = "block";
  } else {
    emailError.textContent = "";
    emailError.style.display = "none";
  }
  checkFormValidity();
});

// ========== Password Input Validation ======>
passwordInput.addEventListener("input", () => {
  let email = emailInput.value.trim();
  let password = passwordInput.value.trim();

  if (!validatePasswordMatch(email, password)) {
    passwordError.textContent = "❌ Incorrect password.";
    passwordError.style.display = "block";
  } else {
    passwordError.textContent = "";
    passwordError.style.display = "none";
  }
  checkFormValidity();
});

// =========== Form Submit ==========>
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let email = emailInput.value.trim();
  let password = passwordInput.value.trim();

  if (validateSignIn(email, password)) {
    signedIn = true;
    let loggedInUser = users.find(
      (user) => user.Email.toLowerCase() === email.toLowerCase()
    );

    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    localStorage.setItem("loggedInUserId", loggedInUser.ID);

    Swal.fire({
      title: "✅ Login Successful!",
      text:
        loggedInUser.Role === "admin" || loggedInUser.Role === "seller"
          ? `Welcome back, ${loggedInUser.Role}!`
          : `Welcome back, ${loggedInUser.Name}!`,
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
      if (loggedInUser.Role === "admin") {
        window.location.href = "../../dashboard/dashboard.html";
      } else if (loggedInUser.Role === "seller") {
        window.location.href = "../../seller dashboard/seller.html";
      } else {
        window.location.href = "../../home/home.html";
      }
    });
  } else {
    loginError.textContent = "Invalid email or password.";
    loginError.style.display = "block";
  }
});

// ========= Reuse Sign-in Check =========>
function validateSignIn(email, password) {
  return users.some(
    (user) =>
      user.Email.toLowerCase() === email.toLowerCase() &&
      bcrypt.compareSync(password, user.Password)
  );
}

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
