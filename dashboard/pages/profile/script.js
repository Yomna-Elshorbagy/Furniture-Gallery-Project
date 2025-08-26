// ***** enable dark mode ******
let darkSwitch = document.getElementById("darkModeSwitch");

if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark");
  darkSwitch.checked = true;
}

darkSwitch.addEventListener("change", () => {
  if (darkSwitch.checked) {
    document.body.classList.add("dark");
    localStorage.setItem("darkMode", "enabled");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("darkMode", "disabled");
  }
});

let cancelBtn = document.getElementById("cancel");
cancelBtn.addEventListener("click", () => {
  window.location.href = "../../dashboard.html";
});

// ====> Validation needed ===
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

document.addEventListener("DOMContentLoaded", () => {
  // ====> smoothly switch from admin dashboard
  document.body.classList.add("fade-in");
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  // document.getElementById("phone").value = loggedInUser.Phone;
  document.getElementById("fullName").value = loggedInUser.Name;
  document.getElementById("email").value = loggedInUser.Email;
  document.getElementById("password").value = "";
});

document.getElementById("editButton").addEventListener("click", (e) => {
  e.preventDefault();
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  let users = getUsers();

  let fullName = document.getElementById("fullName").value.trim();
  let email = document.getElementById("email").value.trim();
  let newPassword = document.getElementById("password").value.trim();

  if (!fullName && !email && !newPassword) {
    let toastEl = document.getElementById("ToastNoUpdate");
    toastEl.classList.add("bg-danger");
    let toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
    return;
  }

  // 2- ===> VALIDATIONS ===
  document.getElementById("fullName").addEventListener("input", () => {
    let fullName = document.getElementById("fullName").value.trim();
    if (!validateName(fullName) && fullName !== "") {
      document.getElementById("nameFeedback").textContent = "Invalid name.";
      document.getElementById("fullName").classList.add("is-invalid");
    } else {
      document.getElementById("fullName").classList.remove("is-invalid");
      document.getElementById("nameFeedback").textContent = "";
    }
  });

  document.getElementById("email").addEventListener("input", () => {
    let email = document.getElementById("email").value.trim();
    if (!validateEmail(email) && email !== "") {
      document.getElementById("emailFeedback").textContent =
        "Invalid email format.";
      document.getElementById("email").classList.add("is-invalid");
    } else {
      document.getElementById("email").classList.remove("is-invalid");
      document.getElementById("emailFeedback").textContent = "";
    }
  });

  document.getElementById("password").addEventListener("input", () => {
    let password = document.getElementById("password").value.trim();
    if (password !== "" && !validatePassword(password)) {
      document.getElementById("passwordFeedback").textContent =
        "Password must be at least 6 characters.";
      document.getElementById("password").classList.add("is-invalid");
    } else {
      document.getElementById("password").classList.remove("is-invalid");
      document.getElementById("passwordFeedback").textContent = "";
    }
  });

  // === note here ==> update fields only if changed ===
  let updatedAdmin = { ...loggedInUser };
  if (fullName) {
    updatedAdmin.Name = fullName;
  }
  if (email) {
    updatedAdmin.Email = email;
  }
  if (newPassword) {
    updatedAdmin.Password = bcrypt.hashSync(newPassword, 10);
  }
  // === Update users array ===
  let idx = users.findIndex((admin) => admin.ID === loggedInUser.ID);
  if (idx !== -1) {
    users[idx] = updatedAdmin;
    saveUsers(users);
  }

  // === Save back loggedInUser ===
  localStorage.setItem("loggedInUser", JSON.stringify(updatedAdmin));

  //====> Clear errors
  ["fullName", "email", "password"].forEach((id) => {
    document.getElementById(id).classList.remove("is-invalid");
  });

  //====> Show Toast
  let toastEl = document.getElementById("ToastProfile");
  toastEl.classList.add("styleToast");
  let toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
});
