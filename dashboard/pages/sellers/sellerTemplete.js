export const SellersTemplate = `
  <h3>Sellers</h3>
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
    <tbody id="sellersTable"></tbody>
  </table>
  <div id="pagination" class="mt-3 d-flex justify-content-center align-items-center gap-1"></div>

  <!-- Edit Seller Modal -->
  <div class="modal fade" id="editSellerModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Seller</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form id="editSellerForm">
            <input type="hidden" id="editSellerId" />
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input type="text" id="editSellerName" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" id="editSellerEmail" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Role</label>
              <select id="editSellerRole" class="form-select">
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
