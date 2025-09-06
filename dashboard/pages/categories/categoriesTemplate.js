// categoriesTemplate.js
export const categoriesTemplate = `
  <h3>Categories</h3>


  <div class="mb-3 d-flex align-items-center justify-content-between flex-wrap gap-3 orders-filters">

    <!-- Search by category ID -->
    <div class="search-box d-flex align-items-center">
      <div class="input-group">
        <span class="input-group-text bg-light border-end-0"><i class="fa fa-hashtag"></i></span>
        <input 
          type="text" 
          id="catSearchId" 
          class="form-control border-start-0 custom-input" 
          placeholder="🔎 Search by category ID..."
        />
      </div>
    </div>

    <!-- Search by category name  -->
    <div class="search-box d-flex align-items-center">
      <div class="input-group">
        <span class="input-group-text bg-light border-end-0"><i class="fa fa-user"></i></span>
        <input 
          type="text" 
          id="catSearch" 
          class="form-control border-start-0 custom-input" 
          placeholder="🔎 Search by name"
        />
      </div>
    </div>

    <!-- Add Category Button -->
    <button id="addCategoryBtn" class="btn btn-secondary">
      <i class="fa fa-plus"></i> Add Category
    </button>
  </div>

</div>
  <div class="table-responsive">
  <table class="table orders-table p-2">
    <thead class="Thead">
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
          <div id="nameFeedback" class="invalid-feedback"></div>
        </div>
        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea id="cmDesc" class="form-control"></textarea>
          <div id="categoryFeedback" class="invalid-feedback"></div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" id="cmSave" class="btn btn-color">Save</button>
      </div>
    </div>
  </div>
</div>
</div>
`;
