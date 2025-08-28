export function initCategoriesPage() {
  let tableBody = document.getElementById("categoriesTable");
  let searchInput = document.getElementById("searchInput");
  let filterSelect = document.getElementById("filterSelect");

  let allCategories = JSON.parse(localStorage.getItem("categories")) || [];
  let filteredCategories = [...allCategories];

  // ====> 1- populate filter dropdown with unique category names <====
  function populateFilterOptions() {
    let uniqueNames = [...new Set(allCategories.map((cat) => cat.name))];
    filterSelect.innerHTML = `<option value="">All Categories</option>`;
    uniqueNames.forEach((name) => {
      let option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      filterSelect.appendChild(option);
    });
  }

  // =====> 2- render categories <=====
  function renderCategories() {
    tableBody.innerHTML = "";
    if (filteredCategories.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="3" class="text-center text-muted py-4">
            🚫 No categories match your search/filter
          </td>
        </tr>
      `;
      return;
    }

    filteredCategories.forEach((cat) => {
      let row = document.createElement("tr");
      row.innerHTML = `
        <td>${cat.id}</td>
        <td>${cat.name}</td>
        <td>${cat.description}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  // =====> 3- search Logic <=====
  searchInput.addEventListener("input", (e) => {
    let query = e.target.value.toLowerCase().trim();
    applyFilters(query, filterSelect.value);
  });

  // =====> 4- filter Logic <=====
  filterSelect.addEventListener("change", (e) => {
    let selectedName = e.target.value;
    applyFilters(searchInput.value.toLowerCase().trim(), selectedName);
  });

  // ====> 5- Apply both search + filter <====
  function applyFilters(searchQuery, filterName) {
    filteredCategories = allCategories.filter((cat) => {
      let matchesSearch =
        cat.id.toString().includes(searchQuery) ||
        cat.name.toLowerCase().includes(searchQuery);
      let matchesFilter = !filterName || cat.name === filterName;
      return matchesSearch && matchesFilter;
    });

    renderCategories();
  }

  // ====> 6- finally Initial setup
  populateFilterOptions();
  renderCategories();
}
