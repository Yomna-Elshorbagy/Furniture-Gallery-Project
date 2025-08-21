export function initOrdersPage() {
  const tableBody = document.getElementById("ordersTable");
  const modalTitle = document.getElementById("orderModalTitle");
  const userInput = document.getElementById("omUser");
  const priceInput = document.getElementById("omPrice");
  const statusInput = document.getElementById("omStatus");
  const dateInput = document.getElementById("omDate");
  const saveBtn = document.getElementById("omSave");

  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let editingId = null;

  renderOrders();

  // ---- render Orders table ----
  function renderOrders() {
    tableBody.innerHTML = "";
    orders.forEach((order) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${order.ID}</td>
        <td>${order.UserName}</td>
        <td>${order.TotalPrice}</td>
        <td>${order.Status}</td>
        <td>${order.Date}</td>
        <td>
          <button class="btn btn-sm btn-warning me-2 edit-order" data-id="${order.ID}">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn btn-sm btn-danger del-order" data-id="${order.ID}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // ---- attach events for edit and delete
    document.querySelectorAll(".edit-order").forEach((btn) => {
      btn.addEventListener("click", handleEditOrder);
    });
    document.querySelectorAll(".del-order").forEach((btn) => {
      btn.addEventListener("click", handleDeleteOrder);
    });
  }

  // ---- add order ----
  document.getElementById("addOrderBtn")?.addEventListener("click", () => {
    editingId = null;
    modalTitle.textContent = "Add Order";
    userInput.value = "";
    priceInput.value = "";
    statusInput.value = "Pending";
    dateInput.value = new Date().toISOString().split("T")[0];

    const modal = new bootstrap.Modal(document.getElementById("orderModal"));
    modal.show();
  });

  // ---- edit order ---->
  function handleEditOrder(e) {
    editingId = parseInt(e.currentTarget.dataset.id);
    const order = orders.find((o) => o.ID === editingId);

    if (order) {
      modalTitle.textContent = "Edit Order";
      userInput.value = order.UserName;
      priceInput.value = order.TotalPrice;
      statusInput.value = order.Status;
      dateInput.value = order.Date;

      const modal = new bootstrap.Modal(document.getElementById("orderModal"));
      modal.show();
    }
  }

  // ---- save order ----
  saveBtn.addEventListener("click", () => {
    const user = userInput.value.trim();
    const price = priceInput.value.trim();
    const status = statusInput.value;
    const date = dateInput.value;

    if (!user || !price || !status || !date) {
      alert("Please fill in all fields");
      return;
    }

    if (editingId) {
      // ----- Update existing
      orders = orders.map((o) =>
        o.ID === editingId
          ? { ...o, UserName: user, TotalPrice: price, Status: status, Date: date }
          : o
      );
    } else {
      //------ add new
      const newId = orders.length ? Math.max(...orders.map((o) => o.ID)) + 1 : 1;
      orders.push({
        ID: newId,
        UserName: user,
        TotalPrice: price,
        Status: status,
        Date: date,
      });
    }

    // Save & re-render
    localStorage.setItem("orders", JSON.stringify(orders));
    renderOrders();

    // Close modal
    bootstrap.Modal.getInstance(document.getElementById("orderModal")).hide();
  });

  // ---- Delete Order ----
  function handleDeleteOrder(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    orders = orders.filter((o) => o.ID !== id);
    localStorage.setItem("orders", JSON.stringify(orders));
    renderOrders();
  }
}
