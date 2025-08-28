export const overviewTemplate = `
<div class="container my-4">
  <h3 class="text-center mb-4">📊 Business Overview</h3>
  
  <div class="row g-4">
    <div class="col-lg-6">
      <div class="p-3 shadow-sm rounded bg-white h-100">
        <canvas id="TotalPriceChart" style="min-height:350px;"></canvas>
      </div>
    </div>
    <div class="col-lg-6">
      <div class="p-3 shadow-sm rounded bg-white h-100">
        <div id="myPlot" style="width:100%;height:350px;"></div>
      </div>
    </div>
  </div>

  <div class="row g-4 mt-1">
    <div class="col-lg-6">
      <div class="p-3 shadow-sm rounded bg-white h-100">
        <canvas id="Status" style="min-height:350px;"></canvas>
      </div>
    </div>
     <div class="col-lg-6 d-flex justify-content-center align-items-center">
      <div class="p-3 shadow-sm rounded bg-white" style="width:100%; height:400px;">
        <canvas id="RevenueByCategoryChart" style="height:100%;"></canvas>
      </div>
    </div>
  </div>
</div>
`;
