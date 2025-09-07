// ========== Admin Reports Template ==========
export const adminReportsTemplate = `
  <div class="container my-4">
    <h3 class="text-center mb-4">📑 Admin Business Reports</h3>

    <!-- Print Button -->
    <div class="text-end mb-3">
       <!-- Download CSV Button -->
      <button id="downloadAllReportsCSVBtn" class="btn btn-color2">
        📥 CSV
      </button>
      <button id="printReportsBtn" class="btn btn-color2">
        🖨️ Print Reports
      </button>
   

</div>

    </div>
    <!-- Monthly Income Report -->
    <div class="p-3 shadow-sm rounded bg-white mb-4">
      <h5>💰 Monthly Income Report</h5>
      <table class="table table-bordered table-striped">
        <thead class="Thead">
          <tr>
            <th>Month-Year</th>
            <th>Total Income ($)</th>
          </tr>
        </thead>
        <tbody id="adminMonthlyIncomeReport"></tbody>
      </table>
    </div>

    <!-- Products by Category Report -->
    <div class="p-3 shadow-sm rounded bg-white mb-4">
      <h5>🛒 Products by Category</h5>
      <table class="table table-bordered table-striped">
        <thead class="table-light">
          <tr>
            <th>Category</th>
            <th>Number of Products</th>
          </tr>
        </thead>
        <tbody id="adminProductsCategoryReport"></tbody>
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
        <tbody id="adminOrdersStatusReport"></tbody>
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
        <tbody id="adminRevenueCategoryReport"></tbody>
      </table>
    </div>

    <!-- Users Report -->
    <div class="p-3 shadow-sm rounded bg-white mb-4">
      <h5>👤 Active vs Inactive Users</h5>
      <table class="table table-bordered table-striped">
        <thead class="table-light">
          <tr>
            <th>Type</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody id="adminUsersReport"></tbody>
      </table>
    </div>

    <!-- Top Selling Products -->
    <div class="p-3 shadow-sm rounded bg-white mb-4">
      <h5>🏆 Top Selling Products</h5>
      <table class="table table-bordered table-striped">
        <thead class="table-light">
          <tr>
            <th>Product Name</th>
            <th>Units Sold</th>
          </tr>
        </thead>
        <tbody id="adminTopProductsReport"></tbody>
      </table>
    </div>

    <!-- Seller Performance -->
    <div class="p-3 shadow-sm rounded bg-white mb-4">
      <h5>💼 Seller Performance Ranking</h5>
      <table class="table table-bordered table-striped">
        <thead class="table-light">
          <tr>
            <th>Seller</th>
            <th>Total Revenue ($)</th>
          </tr>
        </thead>
        <tbody id="adminSellerPerformanceReport"></tbody>
      </table>
    </div>
  </div>
`;
