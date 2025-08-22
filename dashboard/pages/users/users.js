export async function initUsersPage() {
  let tableBody = document.getElementById("usersTable");
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let currentPage = 1;
  let pageSize = 6;
  let paginationContainer = document.getElementById("pagination");

  renderUsers();

  // ---- render users data table----
  function renderUsers() {
    // slice users for pagination
    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize;
    let currentUsers = users.slice(start, end);

    tableBody.innerHTML = "";
    currentUsers.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.ID}</td>
        <td>${user.Name}</td>
        <td>${user.Email}</td>
        <td>${user.Role}</td>
        <td>
          <button class="btn btn-sm btn-warning me-2 edit-user" data-id="${user.ID}">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn btn-sm btn-danger del-user" data-id="${user.ID}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });
    attachEventListeners();

    // ------ attach events edit and remove
    document.querySelectorAll(".edit-user").forEach((btn) => {
      btn.addEventListener("click", handleEditUser);
    });
    // document.querySelectorAll(".del-user").forEach((btn) => {
    //   btn.addEventListener("click", handleDeleteUser);
    // });
    renderPagination();
  }

  // ---- Pagination ----
  function renderPagination() {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(users.length / pageSize);

    // Prev button
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Prev";
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        renderUsers();
      }
    };
    paginationContainer.appendChild(prevBtn);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === currentPage) btn.style.fontWeight = "bold";
      btn.onclick = () => {
        currentPage = i;
        renderUsers();
      };
      paginationContainer.appendChild(btn);
    }

    // Next button
    const nextBtn = document.createElement("button");
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
  // ---- edit user ----
  function handleEditUser(e) {
    const userId = e.currentTarget.dataset.id;
    const user = users.find((u) => u.ID === userId);

    if (user) {
      document.getElementById("editUserId").value = user.ID;
      document.getElementById("editUserName").value = user.Name;
      document.getElementById("editUserEmail").value = user.Email;
      document.getElementById("editUserRole").value = user.Role;

      // Show modal
      const modal = new bootstrap.Modal(
        document.getElementById("editUserModal")
      );
      modal.show();
    }
  }

  // ---- save user ----> (Update) ----
  document.getElementById("editUserForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("editUserId").value;
    const name = document.getElementById("editUserName").value;
    const email = document.getElementById("editUserEmail").value;
    const role = document.getElementById("editUserRole").value;

    // update user in array
    users = users.map((u) =>
      u.ID == id ? { ...u, Name: name, Email: email, Role: role } : u
    );

    // Save to localStorage
    localStorage.setItem("users", JSON.stringify(users));

    // re-render
    renderUsers();

    // hide modal
    bootstrap.Modal.getInstance(
      document.getElementById("editUserModal")
    ).hide();
  });

  // ===== Attach delete events =====
  function attachEventListeners() {
    // ---- delete user ----
   document.querySelectorAll(".del-user").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const id = Number(this.dataset.id);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // convert ID to number to match dataset
        users = users.filter((u) => Number(u.ID) !== id);
        localStorage.setItem("users", JSON.stringify(users));

        // fix pagination if page empty
        const totalPages = Math.ceil(users.length / pageSize);
        if (currentPage > totalPages) currentPage = totalPages || 1;

        renderUsers(); // re-render table + pagination
        Swal.fire("Deleted!", "User has been deleted.", "success");
      }
    });
  });
});


    // ---- edit user ----
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const id = Number(this.dataset.id);
        const user = users.find((u) => u.ID === id);
        if (!user) return;

        document.getElementById("editUserId").value = user.ID;
        document.getElementById("editUserName").value = user.Name;
        document.getElementById("editUserEmail").value = user.Email;
        document.getElementById("editUserRole").value = user.Role;

        new bootstrap.Modal(document.getElementById("editUserModal")).show();
      });
    });
  }
}
