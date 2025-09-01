export const overviewTemplate = `
<div class="container my-4">
  <h3 class="text-center mb-4">📊 Business Overview</h3>
  
  <!-- Row 1-->
  <div class="row g-4">

    <div class="col-lg-4">
      <div class="p-4 shadow-sm rounded bg-white h-100">
        <canvas id="ActiveUsersChart" style="max-height:300px;"></canvas>
      </div>
    </div>
        <div class="col-lg-4">
      <div class="p-3 shadow-sm rounded bg-white h-100">
        <div id="myPlot" style="width:100%;max-height:320px;"></div>
      </div>
    </div>
    <div class="col-lg-4">
      <div class="p-3 shadow-sm rounded bg-white h-100">
        <canvas id="RevenueByCategoryChart" style="max-height:300px;"></canvas>
      </div>
    </div>
  </div>

  <!-- Row  2-->
  <div class="row g-4 mt-1">
    <div class="col-lg-6">
      <div class="p-3 shadow-sm rounded bg-white h-100">
        <canvas id="TotalPriceChart" style="min-height:350px;"></canvas>
      </div>
    </div>
    <div class="col-lg-6">
      <div class="p-3 shadow-sm rounded bg-white h-100">
        <canvas id="Status" style="min-height:350px;"></canvas>
      </div>
    </div>
  </div>

  <!-- Row 3-->
  <div class="row g-4 mt-1">
    <div class="col-lg-6">
      <div class="p-3 shadow-sm rounded bg-white h-100">
        <canvas id="TopProductsChart" style="min-height:350px;"></canvas>
      </div>
    </div>
    <div class="col-lg-6">
      <div class="p-3 shadow-sm rounded bg-white h-100">
        <canvas id="SellerPerformanceChart"></canvas>
      </div>
    </div>    
  </div>
</div>
`;
