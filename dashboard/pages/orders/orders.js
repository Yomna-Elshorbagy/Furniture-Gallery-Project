import { addLog } from "../logs/logs.js";

export function initOrdersPage() {
  const tableBody = document.getElementById("ordersTable");
  const modalTitle = document.getElementById("orderModalTitle");
  const userInput = document.getElementById("omUser");
  const priceInput = document.getElementById("omPrice");
  const statusInput = document.getElementById("omStatus");
  const saveBtn = document.getElementById("omSave");
  const paginationContainer = document.getElementById("pagination");
  const searchIdInput = document.getElementById("orderSearchId");
  const searchUserInput = document.getElementById("orderSearch");

  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let editingId = null;
  let currentPage = 1;
  const pageSize = 6;
  let selectedFilter = "All";
  let products = JSON.parse(localStorage.getItem("products")) || [];

  function restoreStock(order) {
    if (!Array.isArray(products)) return;

    order.products.forEach((orderedProduct) => {
      let prod = products.find(
        (p) => Number(p.id) === Number(orderedProduct.id)
      );
      if (prod) {
        let qty = Number(orderedProduct.quantity) || 0;
        prod.stock = (Number(prod.stock) || 0) + qty;
      }
    });

    localStorage.setItem("products", JSON.stringify(products));
  }

  // ---- render Orders table ----
  function renderOrders() {
    tableBody.innerHTML = "";

    // apply filter
    let filteredOrders =
      selectedFilter === "All"
        ? orders.filter((o) => !o.isDeleted)
        : orders.filter(
            (order) =>
              !order.isDeleted &&
              order.Status.toLowerCase() === selectedFilter.toLowerCase()
          );

    // apply search order id
    let searchId = searchIdInput.value.trim();
    if (searchId) {
      filteredOrders = filteredOrders.filter((order) =>
        String(order.ID).includes(searchId)
      );
    }

    // apply User search
    let searchUser = searchUserInput.value.trim().toLowerCase();
    if (searchUser) {
      filteredOrders = filteredOrders.filter((order) =>
        order.UserName.toLowerCase().includes(searchUser)
      );
    }
    // slice orders for pagination
    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize;
    let currentOrders = filteredOrders.slice(start, end);

    if (currentOrders.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="text-center">No orders found</td></tr>`;
    }
    currentOrders.forEach((order) => {
      let statusClass = "";
      switch (order.Status.toLowerCase()) {
        case "completed":
          statusClass = "badge bg-success";
          break;
        case "pending":
          statusClass = "badge bg-warning text-dark";
          break;
        case "cancelled":
          statusClass = "badge bg-danger";
          break;
        case "shipped":
          statusClass = "badge bg-info text-dark";
          break;
        default:
          statusClass = "badge bg-secondary";
      }
      let productNames = order.products
        .map((p) => `${p.name} (x${p.quantity})`)
        .join("<br>");

      let totalQuantity = order.products.reduce(
        (sum, p) => sum + Number(p.quantity),
        0
      );
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${order.ID}</td>
        <td>${order.UserName}</td>
        <td>${order.TotalPrice}</td>
        <td>${productNames}</td> <!-- All product names -->
        <td>${totalQuantity}</td> <!-- Total quantity -->
        <td><span class="${statusClass}">${order.Status}</span></td>
        <td>${order.Date}</td>
        <td>
          <button class="btn btn-sm btn-warning me-2 edit-order edit-btn" data-id="${order.ID}">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn btn-sm btn-danger del-order delete-btn" data-id="${order.ID}">
            <i class="fa-solid fa-trash"></i>
          </button>
          <button class="btn btn-sm btn-secondary soft-del-order" data-id="${order.ID}">
            <i class="fa-solid fa-ban"></i>
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Attach events
    document.querySelectorAll(".edit-order").forEach((btn) => {
      btn.addEventListener("click", handleEditOrder);
    });
    document.querySelectorAll(".del-order").forEach((btn) => {
      btn.addEventListener("click", handleDeleteOrder);
    });
    document.querySelectorAll(".soft-del-order").forEach((btn) => {
      btn.addEventListener("click", handleSoftDeleteOrder);
    });

    renderPagination(filteredOrders.length);
  }

  // ====> Pagination <=====
  function renderPagination(totalItems) {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(totalItems / pageSize);
    if (totalPages <= 1) return;
    // Prev button
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Prev";
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        renderOrders();
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
        renderOrders();
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
        renderOrders();
      }
    };
    paginationContainer.appendChild(nextBtn);
  }
  // =====> search Orders <====
  searchIdInput.addEventListener("input", () => {
    currentPage = 1;
    renderOrders();
  });
  // =====> search order ID <====
  searchUserInput.addEventListener("input", () => {
    currentPage = 1;
    renderOrders();
  });
  // =====> filter status <====
  statusFilter.addEventListener("change", () => {
    selectedFilter = statusFilter.value;
    currentPage = 1; // reset to first page
    renderOrders();
  });

  // ====> validation  <====
  function validateName(name) {
    return /^[a-zA-Z ]{3,30}$/.test(name); // only letters & spaces, 3–30 chars
  }

  function validatePrice(price) {
    return /^\d+(\.\d{1,2})?$/.test(price) && parseFloat(price) > 0; // positive number
  }
  // ====> edit order <====
  function handleEditOrder(e) {
    editingId = parseInt(e.currentTarget.dataset.id);
    const order = orders.find((o) => o.ID === editingId);

    if (order) {
      modalTitle.textContent = "Edit Order";
      userInput.value = order.UserName;
      priceInput.value = order.TotalPrice;
      statusInput.value = order.Status;
      // dateInput.value = order.Date;

      const modal = new bootstrap.Modal(document.getElementById("orderModal"));
      modal.show();
    }
  }

  // ====> save order <===
  saveBtn.addEventListener("click", () => {
    const user = userInput.value.trim();
    const price = priceInput.value.trim();
    const status = statusInput.value;

    const errorMsgEl = document.getElementById("formErrorMsg");
    errorMsgEl.classList.add("d-none");
    errorMsgEl.textContent = "";

    if (!user || !price || !status) {
      errorMsgEl.textContent = "⚠️ Please fill in all fields.";
      errorMsgEl.classList.remove("d-none");
      return;
    }

    if (editingId) {
      let oldOrder = orders.find((o) => o.ID === editingId);

      if (
        oldOrder &&
        oldOrder.Status.toLowerCase() === "pending" &&
        status.toLowerCase() === "cancelled"
      ) {
        restoreStock(oldOrder);
      }

      orders = orders.map((order) =>
        order.ID === editingId
          ? { ...order, UserName: user, TotalPrice: price, Status: status }
          : order
      );
      addLog("Edited Order", { id: editingId, name: user }, "Order");
    } else {
      const newId = orders.length
        ? Math.max(...orders.map((o) => o.ID)) + 1
        : 1;
      orders.push({
        ID: newId,
        UserName: user,
        TotalPrice: price,
        Status: status,
        isDeleted: false,
      });
      addLog("Added Order", { id: newId, name: user }, "Order");
    }

    localStorage.setItem("orders", JSON.stringify(orders));
    renderOrders();

    let modalEl = document.getElementById("orderModal");
    let modalInstance =
      bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modalInstance.hide();
  });

  // =====> delete order  <====
  function handleDeleteOrder(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    const deletedOrder = orders.find((o) => o.ID === id);

    Swal.fire({
      title: "Are you sure?",
      text: "This order will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        if (deletedOrder && deletedOrder.Status.toLowerCase() === "pending") {
          restoreStock(deletedOrder); // return stock before deleting
        }
        // delete from orders array
        orders = orders.filter((o) => o.ID !== id);
        localStorage.setItem("orders", JSON.stringify(orders));

        // handle empty page after deletion
        const totalPages = Math.ceil(orders.length / pageSize);
        if (currentPage > totalPages) currentPage = totalPages || 1;

        renderOrders(); // re-render table + pagination
        if (deletedOrder) {
          addLog(
            "Hard Deleted Order",
            { id: deletedOrder.ID, name: deletedOrder.UserName },
            "Order"
          );
        }
        Swal.fire("Deleted!", "Order has been deleted.", "success");
      }
    });
  }

  function handleSoftDeleteOrder(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    const order = orders.find((o) => o.ID === id);

    Swal.fire({
      title: "Soft Deleted order?",
      text: "This will hide the order but keep its data.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, soft deleted",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#6c757d",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        if (order && order.Status.toLowerCase() === "pending") {
          restoreStock(order); // return stock on soft delete too
        }
        orders = orders.map((o) =>
          o.ID === id ? { ...o, isDeleted: true } : o
        );
        localStorage.setItem("orders", JSON.stringify(orders));
        renderOrders();

        if (order) {
          addLog(
            "Soft Deleted Order",
            { id: order.ID, name: order.UserName, price: order.TotalPrice },
            "Order"
          );
        }

        Swal.fire("Deleted!", "The order has been deactivated.", "success");
      }
    });
  }

  //apply style on js to remove layer because of positioning
  let orderModal = document.getElementById("orderModal");
  orderModal.addEventListener("show.bs.modal", () => {
    document.body.appendChild(orderModal);
  });
  // Initial render
  renderOrders();
}
