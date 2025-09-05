let users = JSON.parse(localStorage.getItem("users")) || [];
let resetData = JSON.parse(localStorage.getItem("resetData"));

const passwordRegex = /^[A-Za-z0-9]{6,}$/;

document.getElementById("resetForm").addEventListener("submit", function (e) {
  e.preventDefault();

  if (!resetData) {
    Swal.fire("❌ Error", "No reset request found. Please try again.", "error");
    return;
  }

  let enteredCode = document.getElementById("resetCode").value.trim();
  let newPassword = document.getElementById("newPassword").value.trim();
  let passwordError = document.getElementById("passwordError");

  //==> check expiry
  if (Date.now() > resetData.expiry) {
    Swal.fire(
      "⚠️ Expired",
      "Reset code expired. Please request again.",
      "warning"
    );
    localStorage.removeItem("resetData");
    return;
  }

  //==> check code
  if (enteredCode !== resetData.code.toString()) {
    Swal.fire("❌ Invalid", "Reset code is incorrect.", "error");
    return;
  }

  //==> regex validation
  if (!passwordRegex.test(newPassword)) {
    passwordError.style.display = "block";
    return;
  } else {
    passwordError.style.display = "none";
  }

  //==> update user password (hashed)
  let userIndex = users.findIndex(
    (user) => user.Email.toLowerCase() === resetData.email.toLowerCase()
  );

  if (userIndex === -1) {
    Swal.fire("❌ Error", "User not found.", "error");
    return;
  }

  let hashed = bcrypt.hashSync(newPassword, 10);
  users[userIndex].Password = hashed;

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.removeItem("resetData");

  Swal.fire(" Success", "Password updated successfully!", "success").then(
    () => {
      window.location.href = "../log-in/login.html";
    }
  );
});
