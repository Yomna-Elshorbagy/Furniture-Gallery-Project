document.addEventListener("DOMContentLoaded", addContactDetails);

const form = document.getElementById("contactForm");
const alertPlaceholder = document.getElementById("alertPlaceholder");

function showAlert(message, type) {
  const wrapper = document.createElement("div");
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

    const contactData = {
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
