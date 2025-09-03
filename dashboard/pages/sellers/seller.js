export async function initSellerPage() {
  let tableBody = document.getElementById("sellersTable");
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let filteredUsers = users.filter(
    (user) => user.Role === "seller" && !user.isDeleted
  );
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
          <button class="btn btn-sm btn-info me-2 view-user" data-id="${user.ID}">
            <i class="fa-solid fa-eye"></i>
          </button>
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
    // =====> search seller <====
    searchIdInput.addEventListener("input", () => {
      currentPage = 1;
      renderUsers();
    });
    // =====> search seller ID <====
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
    let user = users.find((u) => u.ID === userId);

    if (user) {
      document.getElementById("editSellerId").value = user.ID;
      document.getElementById("editSellerName").value = user.Name;
      document.getElementById("editSellerEmail").value = user.Email;
      document.getElementById("editSellerPhone").value = user.Phone;
      document.getElementById("editSellerRole").value = user.Role;

      new bootstrap.Modal(document.getElementById("editSellerModal")).show();
    }
  }
  //apply style on js to remove layer because of positioning
  let sellerModal = document.getElementById("editSellerModal");
  sellerModal.addEventListener("show.bs.modal", () => {
    document.body.appendChild(sellerModal);
  });
  document.getElementById("editSellerForm").addEventListener("submit", (e) => {
    e.preventDefault();
    let id = document.getElementById("editSellerId").value;
    let name = document.getElementById("editSellerName").value;
    let email = document.getElementById("editSellerEmail").value;
    let phone = document.getElementById("editSellerPhone").value;
    let role = document.getElementById("editSellerRole").value;

    users = users.map((user) =>
      user.ID == id
        ? { ...user, Name: name, Email: email, Phone: phone, Role: role }
        : user
    );

    localStorage.setItem("users", JSON.stringify(users));
    filteredUsers = users.filter((user) => user.Role === "seller");
    renderUsers();
    bootstrap.Modal.getInstance(
      document.getElementById("editSellerModal")
    ).hide();
  });

  function attachEventListeners() {
    document
      .querySelectorAll(".edit-user")
      .forEach((btn) => btn.addEventListener("click", handleEditUser));

    document.querySelectorAll(".del-user").forEach((btn) =>
      btn.addEventListener("click", function () {
        let id = Number(this.dataset.id);
        Swal.fire({
          title: "Are you sure?",
          text: "This will delete the user!",
          icon: "warning",
          showCancelButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            users = users.filter((user) => Number(user.ID) !== id);
            localStorage.setItem("users", JSON.stringify(users));
            filteredUsers = users.filter((user) => user.Role === "seller");
            renderUsers();
          }
        });
      })
    );
    // sOFT delete
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

            // persist changes
            localStorage.setItem("users", JSON.stringify(users));

            // filter sellers only
            filteredUsers = users.filter(
              (u) => u.Role?.toLowerCase() === "seller" && !u.isDeleted
            );

            renderUsers();

            Swal.fire({
              title: "Deactivated!",
              text: "The seller has been deactivated successfully.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
          }
        });
      })
    );
  }
  let viewuserModal = document.getElementById("viewUserModal");
  viewuserModal.addEventListener("show.bs.modal", () => {
    document.body.appendChild(viewuserModal);
  });

  document.querySelectorAll(".view-user").forEach((btn) =>
    btn.addEventListener("click", function () {
      let id = this.dataset.id;
      let user = users.find((u) => String(u.ID) === id);

      if (user) {
        // Fill basic info
        document.getElementById("viewUserId").textContent = user.ID;
        document.getElementById("viewUserName").textContent = user.Name;
        document.getElementById("viewUserEmail").textContent = user.Email;
        document.getElementById("viewUserPhone").textContent = user.Phone;
        document.getElementById("viewUserRole").textContent = user.Role;

        // ===== Orders =====
        let allOrders = JSON.parse(localStorage.getItem("orders")) || [];
        let userOrders = allOrders.filter(
          (o) => String(o.userId) === String(user.ID)
        );

        let ordersList = document.getElementById("viewUserOrders");
        ordersList.innerHTML = userOrders.length
          ? userOrders
              .map(
                (o) => `
              <li class="list-group-item">
                <b>Order #${o.ID}</b> - ${o.Status} <br>
                Items: ${o.TotalItems} | Total: $${o.TotalPrice} <br>
                Date: ${o.Date}
                <ul class="mt-2">
                  ${o.products
                    .map(
                      (p) => `<li>${p.name} (x${p.quantity}) - $${p.price}</li>`
                    )
                    .join("")}
                </ul>
              </li>
            `
              )
              .join("")
          : "<li class='list-group-item text-muted'>No orders yet</li>";

        // ===== Cart =====
        let allCarts = JSON.parse(localStorage.getItem("carts")) || [];
        let userCart = allCarts.find(
          (c) => String(c.userId) === String(user.ID)
        );

        // ===== Cart (from user.cart) =====
        let cartList = document.getElementById("viewUserCart");
        cartList.innerHTML = user.cart?.length
          ? user.cart
              .map(
                (item) => `
        <li class="list-group-item d-flex align-items-center">
          <img src="${item.image}" width="50" class="me-3 rounded">
          <div>
            <b>${item.name}</b> <br>
            Quantity: ${item.quantity ?? 1} <br>
            Price: $${item.price}
          </div>
        </li>
      `
              )
              .join("")
          : "<li class='list-group-item text-muted'>Empty cart</li>";

        // ===== Wishlist (from user.wishlist) =====
        let wishlistList = document.getElementById("viewUserWishlist");
        wishlistList.innerHTML = user.wishlist?.length
          ? user.wishlist
              .map(
                (w) =>
                  `<li class="list-group-item">
                  <img src="${w.image}" width="40" class="me-2 rounded">
                  ${w.name} - $${w.price}
                </li>`
              )
              .join("")
          : "<li class='list-group-item text-muted'>Empty wishlist</li>";

        // Show modal
        new bootstrap.Modal(document.getElementById("viewUserModal")).show();
      }
    })
  );
}
