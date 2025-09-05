let users = JSON.parse(localStorage.getItem("users")) || [];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

document.getElementById("forgetForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let email = document.getElementById("forgetEmail").value.trim().toLowerCase();
  let emailError = document.getElementById("emailError");

  // regex validation
  if (!emailRegex.test(email)) {
    emailError.textContent = "❌ Invalid email format";
    emailError.style.display = "block";
    return;
  } else {
    emailError.style.display = "none";
  }

  let user = users.find((user) => user.Email.toLowerCase() === email);

  if (!user) {
    Swal.fire("❌ Error", "Email not found. Please sign up.", "error");
    return;
  }

  // Generate reset code
  let resetCode = Math.floor(100000 + Math.random() * 900000);
  let expiry = Date.now() + 5 * 60 * 1000;

  localStorage.setItem(
    "resetData",
    JSON.stringify({ email: user.Email, code: resetCode, expiry })
  );

  Swal.fire({
    title: "📩 Reset Code Sent",
    text: `Use this code to reset your password: ${resetCode}  ===> (Valid for 5 minutes)`,
    icon: "info",
    confirmButtonText: "Go to Reset Page",
  }).then(() => {
    window.location.href = "./reset.html";
  });
});
