export async function initUsersPage() {
  let tableBody = document.getElementById("usersTable");
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let filteredUsers = users.filter((u) => u.Role?.toLowerCase() === "user");
  let currentPage = 1;
  let pageSize = 6;
  let paginationContainer = document.getElementById("pagination");
  const searchIdInput = document.getElementById("userSearchId");
  const searchUserInput = document.getElementById("userSearch");
  renderUsers();

  function renderUsers() {
    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize;
    let currentUsers = filteredUsers.slice(start, end);

    // apply search order id
    let searchId = searchIdInput.value.trim();
    if (searchId) {
      currentUsers = currentUsers.filter((user) =>
        String(user.ID).includes(searchId)
      );
    }

    // apply User search
    let searchUser = searchUserInput.value.trim().toLowerCase();
    if (searchUser) {
      currentUsers = currentUsers.filter(
        (user) =>
          user.Name.toLowerCase().includes(searchUser) ||
          user.Email.toLowerCase().includes(searchUser)
      );
    }
    tableBody.innerHTML = "";
    currentUsers.forEach((user) => {
      let row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.ID}</td>
        <td>${user.Name}</td>
        <td>${user.Email}</td>
        <td>${user.Phone}</td>
        <td>${user.Role}</td>
        <td>
          <button class="btn btn-sm btn-warning me-2 edit-user" data-id="${user.ID}">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn btn-sm btn-danger del-user" data-id="${user.ID}">
            <i class="fa-solid fa-trash"></i>
          </button>
          <button class="btn btn-sm btn-secondary me-2 soft-del-user" data-id="${user.ID}">
            <i class="fa-solid fa-ban"></i>
          </button>

        </td>
      `;
      if (user.isDeleted) {
        row.style.display = "none";
      }
      tableBody.appendChild(row);
    });
    attachEventListeners();
    renderPagination();
  }

  function renderPagination() {
    paginationContainer.innerHTML = "";
    let totalPages = Math.ceil(filteredUsers.length / pageSize);

    if (totalPages === 0) return;

    let prevBtn = document.createElement("button");
    prevBtn.textContent = "Prev";
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        renderUsers();
      }
    };
    paginationContainer.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
      let btn = document.createElement("button");
      btn.textContent = i;
      if (i === currentPage) btn.style.fontWeight = "bold";
      btn.onclick = () => {
        currentPage = i;
        renderUsers();
      };
      paginationContainer.appendChild(btn);
    }

    // =====> search users <====
    searchIdInput.addEventListener("input", () => {
      currentPage = 1;
      renderUsers();
    });
    // =====> search users ID <====
    searchUserInput.addEventListener("input", () => {
      currentPage = 1;
      renderUsers();
    });

    let nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderUsers();
      }
    };
    paginationContainer.appendChild(nextBtn);
  }

  function handleEditUser(e) {
    let userId = e.currentTarget.dataset.id;
    let user = users.find((u) => String(u.ID) === userId);

    if (user) {
      document.getElementById("editUserId").value = user.ID;
      document.getElementById("editUserName").value = user.Name;
      document.getElementById("editUserEmail").value = user.Email;
      document.getElementById("editUserPhone").value = user.Phone;
      document.getElementById("editUserRole").value = user.Role.toLowerCase();

      new bootstrap.Modal(document.getElementById("editUserModal")).show();
    }
  }
  //apply style on js to remove layer because of positioning
  let userModal = document.getElementById("editUserModal");
  userModal.addEventListener("show.bs.modal", () => {
    document.body.appendChild(userModal);
  });
  document.getElementById("editUserForm").addEventListener("submit", (e) => {
    e.preventDefault();
    let id = document.getElementById("editUserId").value;
    let name = document.getElementById("editUserName").value;
    let email = document.getElementById("editUserEmail").value;
    let phone = document.getElementById("editUserPhone").value;
    let role = document.getElementById("editUserRole").value;

    users = users.map((user) =>
      user.ID == id
        ? { ...user, Name: name, Email: email, Phone: phone, Role: role }
        : user
    );

    localStorage.setItem("users", JSON.stringify(users));
    filteredUsers = users.filter((user) => user.Role?.toLowerCase() === "user");
    renderUsers();
    bootstrap.Modal.getInstance(
      document.getElementById("editUserModal")
    ).hide();
  });

  function attachEventListeners() {
    document
      .querySelectorAll(".edit-user")
      .forEach((btn) => btn.addEventListener("click", handleEditUser));

    document.querySelectorAll(".del-user").forEach((btn) =>
      btn.addEventListener("click", function () {
        let id = this.dataset.id;
        Swal.fire({
          title: "Are you sure?",
          text: "This will delete the user!",
          icon: "warning",
          showCancelButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            users = users.filter((user) => String(user.ID) !== id);
            localStorage.setItem("users", JSON.stringify(users));
            filteredUsers = users.filter(
              (user) => user.Role?.toLowerCase() === "user"
            );
            renderUsers();
          }
        });
      })
    );
    // SOFT delete (fixed: persist with localStorage.setItem)
    document.querySelectorAll(".soft-del-user").forEach((btn) =>
      btn.addEventListener("click", function () {
        let id = this.dataset.id;

        Swal.fire({
          title: "Deactivate User?",
          text: "This will deactivate the user but not delete their data.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, deactivate",
          cancelButtonText: "Cancel",
          confirmButtonColor: "#6c757d",
          cancelButtonColor: "#d33",
        }).then((result) => {
          if (result.isConfirmed) {
            users = users.map((user) =>
              String(user.ID) === id ? { ...user, isDeleted: true } : user
            );

            // ✅ persist changes (was saveUsers(users) before)
            localStorage.setItem("users", JSON.stringify(users));

            // refresh filtered list and UI
            filteredUsers = users.filter(
              (u) => u.Role?.toLowerCase() === "user" && !u.isDeleted
            );
            renderUsers();

            Swal.fire({
              title: "Deactivated!",
              text: "The user has been deactivated successfully.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
          }
        });
      })
    );
  }
}
