export async function initUsersPage() {
  const tableBody = document.getElementById("usersTable");
  let users = JSON.parse(localStorage.getItem("users")) || [];

  renderUsers();

  // ---- render users data table----
  function renderUsers() {
    tableBody.innerHTML = "";
    users.forEach((user) => {
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

    // ------ attach events edit and remove
    document.querySelectorAll(".edit-user").forEach((btn) => {
      btn.addEventListener("click", handleEditUser);
    });
    document.querySelectorAll(".del-user").forEach((btn) => {
      btn.addEventListener("click", handleDeleteUser);
    });
  }

  // ---- edit user ----
  function handleEditUser(e) {
    const userId = e.currentTarget.dataset.id;
    const user = users.find((u) => u.ID == userId);

    if (user) {
      document.getElementById("editUserId").value = user.ID;
      document.getElementById("editUserName").value = user.Name;
      document.getElementById("editUserEmail").value = user.Email;
      document.getElementById("editUserRole").value = user.Role;

      // Show modal
      const modal = new bootstrap.Modal(document.getElementById("editUserModal"));
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
    bootstrap.Modal.getInstance(document.getElementById("editUserModal")).hide();
  });

  // ---- delete user ----
  function handleDeleteUser(e) {
    const userId = e.currentTarget.dataset.id;
    users = users.filter((u) => u.ID != userId);
    localStorage.setItem("users", JSON.stringify(users));
    renderUsers();
  }
}
