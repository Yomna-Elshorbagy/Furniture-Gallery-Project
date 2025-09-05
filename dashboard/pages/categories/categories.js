import { addLog } from "../logs/logs.js";

export function initCategoriesPage() {
  const tableBody = document.getElementById("categoriesTable");
  const modalTitle = document.getElementById("categoryModalTitle");
  const nameInput = document.getElementById("cmName");
  const descInput = document.getElementById("cmDesc");
  const saveBtn = document.getElementById("cmSave");
  const searchIdInput = document.getElementById("catSearchId");
  const searchUserInput = document.getElementById("catSearch");

  let categories = JSON.parse(localStorage.getItem("categories")) || [];
  let editingId = null; // to know if editing or adding

  renderCategories();

  // ====> Render Categories <====
  function renderCategories() {
    let allCategories = JSON.parse(localStorage.getItem("categories")) || [];
    allCategories = allCategories.filter((cat) => !cat.isDeleted);

    // apply search category id
    let searchId = searchIdInput.value.trim();
    if (searchId) {
      allCategories = allCategories.filter((cat) =>
        String(cat.id).includes(searchId)
      );
    }

    // apply category search
    let searchUser = searchUserInput.value.trim().toLowerCase();
    if (searchUser) {
      allCategories = allCategories.filter((cat) =>
        cat.name.toLowerCase().includes(searchUser)
      );
    }
    tableBody.innerHTML = "";
    allCategories.forEach((cat) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${cat.id}</td>
        <td>${cat.name}</td>
        <td>${cat.description}</td>
        <td>
          <button class="btn btn-sm btn-warning me-2 edit-cat edit-btn" data-id="${cat.id}">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn btn-sm btn-danger del-cat delete-btn" data-id="${cat.id}">
            <i class="fa-solid fa-trash"></i>
          </button>
          </button>
          <button class="btn btn-sm btn-secondary me-2 soft-del-cat soft-del-btn" data-id="${cat.id}">
            <i class="fa-solid fa-ban"></i>
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Attach events
    document.querySelectorAll(".edit-cat").forEach((btn) => {
      btn.onclick = handleEditCategory;
    });
    document.querySelectorAll(".del-cat").forEach((btn) => {
      btn.onclick = handleDeleteCategory;
    });

    document.querySelectorAll(".soft-del-cat").forEach((btn) => {
      btn.onclick = handleSoftDeleteCategory;
    });

    searchIdInput.addEventListener("input", renderCategories);
    searchUserInput.addEventListener("input", renderCategories);
  }

  // ---- Open Modal for Add ----
  document.getElementById("addCategoryBtn")?.addEventListener("click", () => {
    editingId = null;
    modalTitle.textContent = "Add Category";
    nameInput.value = "";
    descInput.value = "";

    const modal = new bootstrap.Modal(document.getElementById("categoryModal"));
    modal.show();
  });

  // ---- Edit Category ----
  function handleEditCategory(e) {
    editingId = parseInt(e.currentTarget.dataset.id);
    const cat = categories.find((c) => c.id === editingId);

    if (cat) {
      modalTitle.textContent = "Edit Category";
      nameInput.value = cat.name;
      descInput.value = cat.description;

      const modal = new bootstrap.Modal(
        document.getElementById("categoryModal")
      );
      modal.show();
    }
  }

  // ---- Save (Add or Update) ----
  // ---- Save (Add or Update) ----
  saveBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const desc = descInput.value.trim();
    if (!name || !desc) {
      alert("Please fill in all fields");
      return;
    }

    if (editingId) {
      // Update existing
      categories = categories.map((c) =>
        c.id === editingId ? { ...c, name, description: desc } : c
      );

      // Log edit
      addLog("Edited Category", { id: editingId, name }, "Category");
    } else {
      // Add new
      const newId = categories.length
        ? Math.max(...categories.map((c) => c.id)) + 1
        : 1;
      categories.push({ id: newId, name, description: desc, isDeleted: false });

      // Log add
      addLog("Added Category", { id: newId, name }, "Category");
    }

    // Save + re-render
    localStorage.setItem("categories", JSON.stringify(categories));
    renderCategories();

    // Close modal
    bootstrap.Modal.getInstance(
      document.getElementById("categoryModal")
    ).hide();
  });

  // =====> Hard Delete Category <====
  function handleDeleteCategory(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    const deletedCat = categories.find((c) => c.id === id); // keep reference

    if (!deletedCat) return;

    Swal.fire({
      title: "Delete category?",
      text: "This will permanently remove the category.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
    }).then((result) => {
      if (result.isConfirmed) {
        categories = categories.filter((c) => c.id !== id);
        localStorage.setItem("categories", JSON.stringify(categories));
        renderCategories();

        // Log deletion
        addLog("Hard Deleted Category", deletedCat, "Category");

        Swal.fire({
          title: "Deleted!",
          text: "The category has been permanently deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  }

  // ===> Soft Delete Category <====
  function handleSoftDeleteCategory(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    const cat = categories.find((c) => c.id === id); // keep reference

    if (!cat) return;

    Swal.fire({
      title: "Soft delete category?",
      text: "This will hide the category but not delete its data.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, soft deleted",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#6c757d",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        categories = categories.map((c) =>
          c.id === id ? { ...c, isDeleted: true } : c
        );

        localStorage.setItem("categories", JSON.stringify(categories));
        renderCategories();

        // Log soft delete
        addLog("Soft Deleted Category", cat, "Category");

        Swal.fire({
          title: "Soft deleted!",
          text: "The category has been deactivated successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  }
  //apply style on js to remove layer because of positioning
  let categoryModal = document.getElementById("categoryModal");
  categoryModal.addEventListener("show.bs.modal", () => {
    document.body.appendChild(categoryModal);
  });
}
