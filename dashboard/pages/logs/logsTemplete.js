export const logsTemplate = `
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h3>Admin Logs</h3>
    <button id="clearLogs" class="btn btn-danger btn-sm">
      <i class="fa-solid fa-trash"></i> Clear Logs
    </button>
  </div>
  <table class="table table-hover align-middle">
    <thead class="Thead">
      <tr>
        <th>ID</th>
        <th>Action</th>
        <th>Entity Type</th>
        <th>Entity ID</th>
        <th>Entity Name</th>
        <th>Admin</th>
        <th>Timestamp</th>
      </tr>
    </thead>
    <tbody id="logsTable"></tbody>
  </table>
`;
