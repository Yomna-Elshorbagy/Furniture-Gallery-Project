import { addLog } from "../logs/logs.js";

// emails.js
export function initEmailsPage() {
  let tableBody = document.getElementById("emailsTable");
  let respToInput = document.getElementById("respTo");
  let respSubjectInput = document.getElementById("respSubject");
  let respMessageInput = document.getElementById("respMessage");
  let sendBtn = document.getElementById("sendRespBtn");

  // ===> Search inputs <===
  let searchById = document.getElementById("emailSearchById");
  let searchByName = document.getElementById("emailSearchByName");
  let searchByEmail = document.getElementById("emailSearchByEmail");
  let searchBySubject = document.getElementById("emailSearchBySubject");

  // ===> Pagination elements <===
  let prevBtn = document.getElementById("emailPrevPage");
  let nextBtn = document.getElementById("emailNextPage");
  let pageInfo = document.getElementById("emailPageInfo");

  let contactMessages =
    JSON.parse(localStorage.getItem("contactMessages")) || [];

  let searchedMessages = [...contactMessages];
  let currentPage = 1;
  let pageSize = 6;
  let currentEmail = null;

  // ===> Apply Filters <===
  function applyFilters() {
    let idQuery = searchById?.value.trim().toLowerCase();
    let nameQuery = searchByName?.value.trim().toLowerCase();
    let emailQuery = searchByEmail?.value.trim().toLowerCase();

    searchedMessages = contactMessages.filter((msg, index) => {
      let match = true;

      if (idQuery && !(index + 1).toString().toLowerCase().includes(idQuery)) {
        match = false;
      }
      if (
        nameQuery &&
        !(msg.firstName + " " + msg.lastName).toLowerCase().includes(nameQuery)
      ) {
        match = false;
      }
      if (emailQuery && !msg.email.toLowerCase().includes(emailQuery)) {
        match = false;
      }

      return match;
    });

    currentPage = 1;
    renderEmails();
  }

  // ===> render Messages <===
  function renderEmails() {
    tableBody.innerHTML = "";

    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize;
    let currentMessages = searchedMessages.slice(start, end);

    currentMessages.forEach((msg, index) => {
      let row = document.createElement("tr");
      row.innerHTML = `
        <td>${msg.id}</td>        
        <td>${msg.firstName} ${msg.lastName}</td>
        <td>${msg.email}</td>
        <td>${msg.phone}</td>
        <td>${msg.subject}</td>
        <td>${msg.message}</td>
        <td>${new Date(msg.date).toLocaleString()}</td>
        <td>
          <button class="btn btn-sm reply-btn send-email" data-global-index="${contactMessages.indexOf(
            msg
          )}">
            <i class="fa fa-envelope"></i> Reply
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // ===> attach event listeners <===
    document.querySelectorAll(".send-email").forEach((btn) => {
      btn.addEventListener("click", handleSendEmail);
    });

    renderPagination();
  }

  // ===> pagination <===
  function renderPagination() {
    let totalPages = Math.ceil(searchedMessages.length / pageSize);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
  }

  prevBtn?.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderEmails();
    }
  });

  nextBtn?.addEventListener("click", () => {
    let totalPages = Math.ceil(searchedMessages.length / pageSize);
    if (currentPage < totalPages) {
      currentPage++;
      renderEmails();
    }
  });

  // ===> open Modal for Response <===
  function handleSendEmail(e) {
    let globalIndex = e.currentTarget.dataset.globalIndex;
    currentEmail = contactMessages[globalIndex];

    respToInput.value = currentEmail.email;
    respSubjectInput.value = "Re: " + currentEmail.subject;
    respMessageInput.value = "";
    // log when opening for reply
    addLog(
      "Opened Email for Reply",
      {
        id: currentEmail.id,
        subject: currentEmail.subject,
        name: currentEmail.email,
      },
      "Email"
    );
    const modal = new bootstrap.Modal(document.getElementById("emailModal"));
    modal.show();
  }

  // Handle Send
  sendBtn.addEventListener("click", () => {
    const to = respToInput.value.trim();
    const subject = respSubjectInput.value.trim();
    const message = respMessageInput.value.trim();

    if (!subject || !message) {
      alert("Please fill subject and message");
      return;
    }

    // save response in localStorage
    let responses = JSON.parse(localStorage.getItem("emailResponses")) || [];
    responses.push({
      to,
      subject,
      message,
      date: new Date().toISOString(),
      replyTo: currentEmail,
    });
    localStorage.setItem("emailResponses", JSON.stringify(responses));
    addLog(
      "Sent Email Response",
      {
        id: currentEmail.id,
        subject,
        name: currentEmail.email,
      },
      "Email"
    );
    console.log("Response sent:", { to, subject, message });

    //  Find the Reply button for this email and style it
    const btn = document.querySelector(
      `.send-email[data-global-index="${contactMessages.indexOf(
        currentEmail
      )}"]`
    );
    if (btn) {
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-success");
      btn.innerHTML = `<i class="fa fa-check"></i> Replied`; // change text + icon
    }

    // Close modal
    bootstrap.Modal.getInstance(document.getElementById("emailModal")).hide();
  });

  // Modal fix for layering
  let emailModal = document.getElementById("emailModal");
  emailModal.addEventListener("show.bs.modal", () => {
    document.body.appendChild(emailModal);
  });

  // Attach Search events
  [searchById, searchByName, searchByEmail, searchBySubject].forEach((el) => {
    el?.addEventListener("input", applyFilters);
  });

  // Initial render
  renderEmails();
}
