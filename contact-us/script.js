document.addEventListener("DOMContentLoaded", addContactDetails);

let form = document.getElementById("contactForm");
let alertPlaceholder = document.getElementById("alertPlaceholder");

function showAlert(message, type) {
  let wrapper = document.createElement("div");
  wrapper.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
  alertPlaceholder.innerHTML = "";
  alertPlaceholder.append(wrapper);
}

function addContactDetails() {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let contactData = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      subject: document.getElementById("subject").value.trim(),
      message: document.getElementById("message").value.trim(),
      terms: document.getElementById("terms").checked,
      date: new Date().toISOString(),
    };
    if (
      !contactData.firstName ||
      !contactData.lastName ||
      !contactData.email ||
      !contactData.message
    ) {
      showAlert("🚫 Please fill in all required fields.", "danger");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contactData.email)) {
      showAlert("🚫 Please enter a valid email address.", "danger");
      return;
    }
    if (!/^(010|011|012|015)\d{8}$/.test(contactData.phone)) {
      showAlert(
        "🚫 Please enter a valid Egyptian mobile number (e.g., 01012345678).",
        "danger"
      );
      return;
    }
    if (!contactData.terms) {
      showAlert("👀 You must accept the terms.", "danger");
      return;
    }

    let storedMessages =
      JSON.parse(localStorage.getItem("contactMessages")) || [];
    storedMessages.push(contactData);
    localStorage.setItem("contactMessages", JSON.stringify(storedMessages));

    showAlert("✅ Your message has been saved!", "success");
    Swal.fire({
      icon: "success",
      title: "Message Sent!",
      text: "✅ Your message has been saved.",
      showConfirmButton: false,
      timer: 2000,
    });
    form.reset();
  });
}


// handel logged in and logged out 
document.addEventListener("DOMContentLoaded", () => {
  let loginBtn = document.getElementById("loginBtn");
  let logoutBtn = document.getElementById("logoutBtn");
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

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
      showConfirmButton: false
    }).then(() => {
      window.location.href = "../Auth/log-in/login.html";
    });
  });
});
