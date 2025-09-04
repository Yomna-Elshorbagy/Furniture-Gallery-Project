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

  // ---- Render Categories ----
  function renderCategories() {
    let allCategories = JSON.parse(localStorage.getItem("categories")) || [];

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
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Attach events
    document.querySelectorAll(".edit-cat").forEach((btn) => {
      btn.addEventListener("click", handleEditCategory);
    });
    document.querySelectorAll(".del-cat").forEach((btn) => {
      btn.addEventListener("click", handleDeleteCategory);
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
    } else {
      // Add new
      const newId = categories.length
        ? Math.max(...categories.map((c) => c.id)) + 1
        : 1;
      categories.push({ id: newId, name, description: desc });
    }

    // Save + re-render
    localStorage.setItem("categories", JSON.stringify(categories));
    renderCategories();

    // Close modal
    bootstrap.Modal.getInstance(
      document.getElementById("categoryModal")
    ).hide();
  });

  // ---- Delete Category ----
  function handleDeleteCategory(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    categories = categories.filter((c) => c.id !== id);
    localStorage.setItem("categories", JSON.stringify(categories));
    renderCategories();
  }
  //apply style on js to remove layer because of positioning
  let categoryModal = document.getElementById("categoryModal");
  categoryModal.addEventListener("show.bs.modal", () => {
    document.body.appendChild(categoryModal);
  });
}
