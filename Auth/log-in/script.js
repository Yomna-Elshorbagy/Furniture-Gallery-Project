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
      window.location.href = "../log-in/login.html";
    });
  } else {
    window.location.href = link.href;
  }
});

// ===== GOOGLE SIGN-IN HANDLER =====
const googleBtn = document.querySelector(".google-btn");

if (googleBtn) {
  googleBtn.addEventListener("click", () => {
    google.accounts.id.initialize({
      client_id:
        "700704531343-a9a4dtrmun32cn8g9vaq0geckdlrdhf9.apps.googleusercontent.com",
      callback: handleGoogleLoginResponse,
    });

    google.accounts.id.prompt();
  });
}

let loginInProgress = false;

async function handleGoogleLoginResponse(response) {
  if (loginInProgress) {
    Swal.fire({
      title: "⚠️ Please Wait",
      text: "Login is already in progress.",
      icon: "info",
      timer: 2000,
      showConfirmButton: false,
    });
    return;
  }

  loginInProgress = true;

  try {
    if (!response || !response.credential) {
      throw new Error("No Google login response received.");
    }

    // decode JWT
    const data = JSON.parse(atob(response.credential.split(".")[1]));
    console.log("Google user:", data);

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let existingUser = users.find(
      (u) => u.Email.toLowerCase() === data.email.toLowerCase()
    );

    let loggedInUser;

    if (existingUser) {
      // link Google ID to existing account if not already linked
      if (!existingUser.GoogleID) {
        existingUser.GoogleID = data.sub;
        users = users.map((u) =>
          u.Email.toLowerCase() === data.email.toLowerCase() ? existingUser : u
        );
        localStorage.setItem("users", JSON.stringify(users));
      }
      loggedInUser = existingUser;
    } else {
      // If user never signed up manually, create a new account
      let id = users.length ? Math.max(...users.map((u) => u.ID)) + 1 : 1;
      loggedInUser = {
        ID: id,
        Name: data.name,
        Email: data.email,
        Phone: data.sub,
        Password: "google-auth",
        Role: "user",
        GoogleID: data.sub,
        cart: [],
        wishlist: [],
        orderHistory: [],
        isDeleted: false,
      };
      users.push(loggedInUser);
      localStorage.setItem("users", JSON.stringify(users));
    }

    // Save session
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    localStorage.setItem("loggedInUserId", loggedInUser.ID);

    Swal.fire({
      title: `✅ Welcome ${data.name}!`,
      text: "You have logged in with Google.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      setTimeout(() => {
        window.location.href = "../../home/home.html";
      }, 200);
    });
  } catch (error) {
    console.error("Google login failed:", error);

    Swal.fire({
      title: "❌ Login Failed",
      text:
        error.message ||
        "Something went wrong during Google login. Please try again.",
      icon: "error",
      confirmButtonText: "OK",
    });
  } finally {
    loginInProgress = false;
  }
}

// global error listener for unexpected AbortErrors (FedCM / credentials API)
window.addEventListener("unhandledrejection", (event) => {
  if (event.reason?.name === "AbortError") {
    Swal.fire({
      title: "⚠️ Login Interrupted",
      text: "Your login attempt was cancelled. Please try again.",
      icon: "warning",
      confirmButtonText: "Retry",
    });
  }
});
