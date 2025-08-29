// categoriesTemplate.js
export const categoriesTemplate = `
  <h3>Categories</h3>
  <table class="table orders-table">
    <thead class="table-light">
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Description</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody id="categoriesTable"></tbody>
  </table>

  <!-- Category Modal -->
<div class="modal fade" id="categoryModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 id="categoryModalTitle" class="modal-title">Add Category</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div class="mb-3">
          <label class="form-label">Name</label>
          <input type="text" id="cmName" class="form-control" />
        </div>
        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea id="cmDesc" class="form-control"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" id="cmSave" class="btn btn-color">Save</button>
      </div>
    </div>
  </div>
</div>
`;
