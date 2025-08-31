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
        placeholder="Search by User ID..."
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
        placeholder="Search by Name or Email..."
      />
    </div>
  </div>
</div>
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
`;

