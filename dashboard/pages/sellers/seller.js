export async function initSellerPage() {
  let tableBody = document.getElementById("sellersTable");
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let filteredUsers = users.filter(u => u.Role === "seller"); 
  let currentPage = 1;
  let pageSize = 6;
  let paginationContainer = document.getElementById("pagination");

  renderUsers();

  function renderUsers() {
    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize;
    let currentUsers = filteredUsers.slice(start, end);

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
    renderPagination();
  }

  function renderPagination() {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(filteredUsers.length / pageSize);

    if (totalPages === 0) return;

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

  function handleEditUser(e) {
    const userId = e.currentTarget.dataset.id;
    const user = users.find((u) => u.ID === userId);

    if (user) {
      document.getElementById("editUserId").value = user.ID;
      document.getElementById("editUserName").value = user.Name;
      document.getElementById("editUserEmail").value = user.Email;
      document.getElementById("editUserRole").value = user.Role;

      new bootstrap.Modal(document.getElementById("editUserModal")).show();
    }
  }

  document.getElementById("editUserForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("editUserId").value;
    const name = document.getElementById("editUserName").value;
    const email = document.getElementById("editUserEmail").value;
    const role = document.getElementById("editUserRole").value;

    users = users.map((user) =>
      user.ID == id ? { ...user, Name: name, Email: email, Role: role } : user
    );

    localStorage.setItem("users", JSON.stringify(users));
    filteredUsers = users.filter(user => user.Role === "user"); 
    renderUsers();
    bootstrap.Modal.getInstance(document.getElementById("editUserModal")).hide();
  });

  function attachEventListeners() {
    document.querySelectorAll(".edit-user").forEach((btn) =>
      btn.addEventListener("click", handleEditUser)
    );

    document.querySelectorAll(".del-user").forEach((btn) =>
      btn.addEventListener("click", function () {
        const id = Number(this.dataset.id);
        Swal.fire({
          title: "Are you sure?",
          text: "This will delete the user!",
          icon: "warning",
          showCancelButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            users = users.filter((user) => Number(user.ID) !== id);
            localStorage.setItem("users", JSON.stringify(users));
            filteredUsers = users.filter(user => user.Role === "user");
            renderUsers();
          }
        });
      })
    );
  }
}
