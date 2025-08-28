export function initOrdersPage() {
  const tableBody = document.getElementById("ordersTable");
  const modalTitle = document.getElementById("orderModalTitle");
  const userInput = document.getElementById("omUser");
  const priceInput = document.getElementById("omPrice");
  const statusInput = document.getElementById("omStatus");
  const saveBtn = document.getElementById("omSave");
  const paginationContainer = document.getElementById("pagination");

  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
  let sellerId = Number(loggedInUser.ID);

  let editingId = null;
  let currentPage = 1;
  const pageSize = 6;
  let allOrders = JSON.parse(localStorage.getItem("orders")) || [];
  let orders = allOrders.filter((order) =>
    order.products.some((prod) => prod.sellerId === sellerId)
  );
  let selectedFilter = "All";

  // ====> render Orders table <====
  function renderOrders() {
    tableBody.innerHTML = "";

    // apply filter
    let filteredOrders =
      selectedFilter === "All"
        ? orders
        : orders.filter((order) => order.Status === selectedFilter);

    // slice orders for pagination
    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize;
    let currentOrders = filteredOrders.slice(start, end);

    if (currentOrders.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="text-center">No orders found</td></tr>`;
    }
    currentOrders.forEach((order) => {
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

    // Attach events
    document.querySelectorAll(".edit-order").forEach((btn) => {
      btn.addEventListener("click", handleEditOrder);
    });
    document.querySelectorAll(".del-order").forEach((btn) => {
      btn.addEventListener("click", handleDeleteOrder);
    });

    renderPagination(filteredOrders.length);
  }

  // =====> Pagination <====
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

  statusFilter.addEventListener("change", () => {
    selectedFilter = statusFilter.value;
    currentPage = 1;
    renderOrders();
  });

  // =====> edit order <=====
  function handleEditOrder(e) {
    editingId = parseInt(e.currentTarget.dataset.id);
    const order = orders.find((order) => order.ID === editingId);

    if (order) {
      modalTitle.textContent = "Edit Order";
      userInput.value = order.UserName;
      priceInput.value = order.TotalPrice;
      statusInput.value = order.Status;
      //   dateInput.value = order.Date;

      const modal = new bootstrap.Modal(document.getElementById("orderModal"));
      modal.show();
    }
  }

  // =====> save order <=====
  saveBtn.addEventListener("click", () => {
    const user = userInput.value.trim();
    const price = priceInput.value.trim();
    const status = statusInput.value;
    // const date = dateInput.value;

    if (!user || !price || !status) {
      alert("Please fill in all fields");
      return;
    }

    if (editingId) {
      // update existing
      orders = orders.map((order) =>
        order.ID === editingId
          ? {
              ...order,
              UserName: user,
              TotalPrice: price,
              Status: status,
              //   Date: date,
            }
          : order
      );
    } else {
      // add new
      const newId = orders.length
        ? Math.max(...orders.map((o) => o.ID)) + 1
        : 1;
      orders.push({
        ID: newId,
        UserName: user,
        TotalPrice: price,
        Status: status,
        // Date: date,
      });
    }

    localStorage.setItem("orders", JSON.stringify(orders));
    renderOrders();

    bootstrap.Modal.getInstance(document.getElementById("orderModal")).hide();
  });

  // =====> delete order  <=====
  function handleDeleteOrder(e) {
    const id = parseInt(e.currentTarget.dataset.id);

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
        // delete from orders array
        orders = orders.filter((o) => o.ID !== id);
        localStorage.setItem("orders", JSON.stringify(orders));

        // handle empty page after deletion
        const totalPages = Math.ceil(orders.length / pageSize);
        if (currentPage > totalPages) currentPage = totalPages || 1;

        renderOrders(); // re-render table + pagination

        Swal.fire("Deleted!", "Order has been deleted.", "success");
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
