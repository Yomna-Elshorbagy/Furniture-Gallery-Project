// ordersTemplate.js
export const ordersTemplate = `
  <h3>Orders</h3>
<!-- Filter, Order ID Search & User Search -->
<div class="mb-3 d-flex align-items-center justify-content-between flex-wrap gap-3 orders-filters">
  
  <!-- Filter Dropdown -->
  <div class="filter-box d-flex align-items-center">
    <label for="statusFilter" class="form-label fw-bold me-2 mb-0">Filter:</label>
    <select id="statusFilter" class="form-select custom-select">
      <option value="All">All</option>
      <option value="Pending">Pending</option>
      <option value="Completed">Completed</option>
      <option value="Shipped">Shipped</option>
      <option value="Cancelled">Cancelled</option>
    </select>
  </div>

  <!-- Search by Order ID -->
  <div class="search-box d-flex align-items-center">
    <div class="input-group">
      <span class="input-group-text bg-light border-end-0"><i class="fa fa-hashtag"></i></span>
      <input 
        type="text" 
        id="orderSearchId" 
        class="form-control border-start-0 custom-input" 
        placeholder="🔎 Search by Order ID..."
      />
    </div>
  </div>

  <!-- Search by User -->
  <div class="search-box d-flex align-items-center">
    <div class="input-group">
      <span class="input-group-text bg-light border-end-0"><i class="fa fa-user"></i></span>
      <input 
        type="text" 
        id="orderSearch" 
        class="form-control border-start-0 custom-input" 
        placeholder="🔎 Search by User..."
      />
    </div>
  </div>
</div>


  <div class="table-responsive">
  <table class="table orders-table">
    <thead class="Thead">
      <tr>
        <th>ID</th>
        <th>User</th>
        <th>Total Price</th>
         <th>Order Products</th>
        <th>Total Quantity </th>
        <th>Status</th>
        <th>Date</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody id="ordersTable"></tbody>
  </table>
<div id="pagination" class="mt-3 d-flex justify-content-center align-items-center gap-1"></div>

  <!-- Order Modal -->
  <div class="modal fade" id="orderModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="orderModalTitle" class="modal-title">Add Order</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
        <div id="formErrorMsg" class="alert alert-danger d-none" role="alert"></div>

          <div class="mb-3">
            <label class="form-label">User Name</label>
            <input type="text" id="omUser" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Total Price</label>
            <input type="text" id="omPrice" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Status</label>
            <select id="omStatus" class="form-select">
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Shipped">Shipped</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" id="omSave" class="btn btn-color">Save</button>
        </div>
      </div>
    </div>
  </div>
  </div>
`;
