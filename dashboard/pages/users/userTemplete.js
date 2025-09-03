export const UsersTemplate = `
  <h3>Users</h3>

  <div class="mb-3 d-flex align-items-center justify-content-between flex-wrap gap-3 orders-filters">

  <!-- Search by user ID -->
  <div class="search-box d-flex align-items-center">
    <div class="input-group">
      <span class="input-group-text bg-light border-end-0"><i class="fa fa-hashtag"></i></span>
      <input 
        type="text" 
        id="userSearchId" 
        class="form-control border-start-0 custom-input" 
        placeholder="🔎 Search by User ID..."
      />
    </div>
  </div>

  <!-- Search by User name or email -->
  <div class="search-box d-flex align-items-center">
    <div class="input-group">
      <span class="input-group-text bg-light border-end-0"><i class="fa fa-user"></i></span>
      <input 
        type="text" 
        id="userSearch" 
        class="form-control border-start-0 custom-input" 
        placeholder="🔎 Search by Name or Email..."
      />
    </div>
  </div>
</div>
  <div class="table-responsive">
  <table class="table orders-table">
    <thead class="table-light">
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Role</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody id="usersTable"></tbody>
  </table>
  <div id="pagination" class="mt-3 d-flex justify-content-center align-items-center gap-1"></div>

  <!-- Edit User Modal -->
  <div class="modal fade" id="editUserModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit User</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form id="editUserForm">
            <input type="hidden" id="editUserId" />

            <div class="mb-3">
              <label for="editUserName" class="form-label">Name</label>
              <input type="text" id="editUserName" class="form-control" required />
            </div>

            <div class="mb-3">
              <label for="editUserEmail" class="form-label">Email</label>
              <input type="email" id="editUserEmail" class="form-control" required />
            </div>
               <div class="mb-3">
              <label class="form-label">Phone</label>
              <input type="text" id="editUserPhone" class="form-control" required />
            </div>

            <div class="mb-3">
              <label for="editUserRole" class="form-label">Role</label>
              <select id="editUserRole" class="form-select">
                <option value="user">user</option>
                <option value="admin">admin</option>
                <option value="seller">seller</option>
              </select>
            </div>

            <button type="submit" class="btn btn-color w-100">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- View User Modal -->
<div class="modal fade" id="viewUserModal" tabindex="-1">
  <div class="modal-dialog modal-xl">
    <div class="modal-content shadow-lg border-0 rounded-3">
      <div class="modal-header bg-info text-white">
        <h5 class="modal-title"><i class="fa fa-user-circle"></i> User Details</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">

        <!-- User Info -->
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title mb-3">👤 Basic Information</h5>
            <p><b>ID:</b> <span id="viewUserId"></span></p>
            <p><b>Name:</b> <span id="viewUserName"></span></p>
            <p><b>Email:</b> <span id="viewUserEmail"></span></p>
            <p><b>Phone:</b> <span id="viewUserPhone"></span></p>
            <p><b>Role:</b> <span id="viewUserRole"></span></p>
          </div>
        </div>

        <!-- Tabs -->
        <ul class="nav nav-tabs" id="userTabs" role="tablist">
          <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#cartTab">🛒 Cart</button></li>
          <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#ordersTab">📦 Orders</button></li>
          <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#wishlistTab">❤️ Wishlist</button></li>
        </ul>

        <!-- Tabs Content -->
        <div class="tab-content mt-3">
          <div class="tab-pane fade show active" id="cartTab">
            <ul id="viewUserCart" class="list-group"></ul>
          </div>
          <div class="tab-pane fade" id="ordersTab">
            <ul id="viewUserOrders" class="list-group"></ul>
          </div>
          <div class="tab-pane fade" id="wishlistTab">
            <ul id="viewUserWishlist" class="list-group"></ul>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>

  </div>
`;

