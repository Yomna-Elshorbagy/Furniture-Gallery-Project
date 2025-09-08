// ========> Reports Template <========
export const reportsTemplate = `
  <div class="container my-4">
    <h3 class="text-center mb-4">📑 Business Reports</h3>
  <!-- Print Button -->
    <div class="text-end mb-3 text-center">
      <button id="SellerReportsCSVBtn" class="btn btn-color3">
        📥 CSV
      </button>
      <button id="printReportsBtn" class="btn btn-color3">
        🖨️ Print Reports
      </button>
    </div>

  <!-- Filters -->
  <div class="row mb-4">
    <div class="col-md-4">
      <label class="form-label">From:</label>
      <input type="date" id="filterFromDate" class="form-control" />
    </div>
  <div class="col-md-4">
      <label class="form-label">To:</label>
      <input type="date" id="filterToDate" class="form-control" />
  </div>
  <div class="col-md-4">
      <label class="form-label">Order Status:</label>
    <select id="filterStatus" class="form-select">
      <option value="">All</option>
      <option value="Completed">Completed</option>
      <option value="Pending">Pending</option>
      <option value="Shipped">Shipped</option>
      <option value="Cancelled">Cancelled</option>
    </select>
  </div>
</div>

<div class="text-end mb-3 text-center">
  <div class="text-end mb-3 text-center">
    <button id="applyFiltersBtn" class="btn btn-color3">
    🔍 Apply Filters
    </button>
    <button id="resetFiltersBtn" class="btn btn-color3">
    ♻️ Reset
    </button>
</div>
</div>

    <!-- Monthly Income Report -->
    <div class="p-3 shadow-sm rounded bg-white mb-4">
      <h5>💰 Monthly Income Report</h5>
      <table class="table table-bordered table-striped">
        <thead class="table-light">
          <tr>
            <th>Month-Year</th>
            <th>Total Income ($)</th>
          </tr>
        </thead>
        <tbody id="monthlyIncomeReport"></tbody>
      </table>
    </div>

    <!-- Products by Category Report -->
    <div class="p-3 shadow-sm rounded bg-white mb-4">
      <h5>🛒 Products by Category</h5>
      <table class="table table-bordered table-striped">
        <thead class="Thead">
          <tr>
            <th>Category</th>
            <th>Number of Products</th>
          </tr>
        </thead>
        <tbody id="productsCategoryReport"></tbody>
      </table>
    </div>

    <!-- Orders by Status Report -->
    <div class="p-3 shadow-sm rounded bg-white mb-4">
      <h5>📦 Orders by Status</h5>
      <table class="table table-bordered table-striped">
        <thead class="table-light">
          <tr>
            <th>Status</th>
            <th>Orders Count</th>
          </tr>
        </thead>
        <tbody id="ordersStatusReport"></tbody>
      </table>
    </div>

    <!-- Revenue by Category Report -->
    <div class="p-3 shadow-sm rounded bg-white mb-4">
      <h5>📊 Revenue by Category</h5>
      <table class="table table-bordered table-striped">
        <thead class="table-light">
          <tr>
            <th>Category</th>
            <th>Total Revenue ($)</th>
          </tr>
        </thead>
        <tbody id="revenueCategoryReport"></tbody>
      </table>
    </div>
  </div>
`;
