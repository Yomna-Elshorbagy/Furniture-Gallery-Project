export const UsersTemplate = `
  <h3>Users</h3>
  <table class="table">
    <thead class="table-light">
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody id="usersTable"></tbody>
  </table>

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
              <label class="form-label">Name</label>
              <input type="text" id="editUserName" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" id="editUserEmail" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Role</label>
              <select id="editUserRole" class="form-select">
                <option value="user">user</option>
                <option value="admin">admin</option>
                <option value="seller">seller</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary w-100">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  </div>
`;
