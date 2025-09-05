export const categoriesTemplate = `
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h3> Categories</h3>
    <div class="d-flex gap-2">
      <input 
        type="text" 
        id="searchInput" 
        class="form-control" 
        placeholder="🔎 Search by ID or Name..."
        style="width: 250px;"
      />
      <select id="filterSelect" class="form-select" style="width: 200px;">
        <option value="">All Categories</option>
      </select>
    </div>
  </div>
  <div class="table-responsive">
  <table class="table table-hover align-middle shadow-sm p-2">
    <thead class="table-light">
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody id="categoriesTable">
      <tr>
        <td colspan="3" class="text-center text-muted py-4">No categories found</td>
      </tr>
    </tbody>
  </table>
  </div>
`;
