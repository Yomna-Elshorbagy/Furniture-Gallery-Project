// ========> Reports Template <========
export const reportsTemplate = `
  <div class="container my-4">
    <h3 class="text-center mb-4">📑 Business Reports</h3>

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
