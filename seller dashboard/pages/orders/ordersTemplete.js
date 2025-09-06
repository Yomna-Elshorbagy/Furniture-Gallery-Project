// ordersTemplate.js
export const ordersTemplate = `
  <h3>Orders</h3>
  
    <!-- Filter Dropdown -->
  <div class="mb-3">
    <label class="form-label me-2 fw-bold">Filter by Status:</label>
    <select id="statusFilter" class="form-select w-auto d-inline-block">
      <option value="All">All</option>
      <option value="Pending">Pending</option>
      <option value="Completed">Completed</option>
      <option value="Shipped">Shipped</option>
      <option value="Cancelled">Cancelled</option>
    </select>
  </div>
 <div class="table-responsive">
  <table class="table p-2">
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
  </div>
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
`;
