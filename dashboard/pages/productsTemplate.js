export const productsTemplate = `
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h3>Products</h3>
    <input type="text" id="searchInput" placeholder="&#128269; Search For Product" class="form-control mb-3 productSearch">

    <button type="button" id="addProductBtn" class="btn btn-secondary btn-sm me-5 p-2">
      <i class="fa-solid fa-plus"></i> Add Product
    </button>
  </div>
  <table class="table table-hover align-middle">
    <thead class="table-light">
      <tr>
        <th>Image</th>
        <th>Name</th>
        <th>Price ($)</th>
        <th>old price</th>
        <th>Stock</th>
        <th>Category</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody id="productsTable"></tbody>
  </table>
  <div class="d-flex justify-content-between mt-3">
    <button id="prevPage" class="btn btn-outline-secondary btn-sm">Previous</button>
    <span id="pageInfo" class="align-self-center">Page 1</span>
    <button id="nextPage" class="btn btn-outline-secondary btn-sm">Next</button>
  </div>

  <!-- Product Modal -->
  <div class="modal fade" id="productModal" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content border-0 shadow-lg rounded-4">
        <div class="modal-header text-white">          
          <h5 class="modal-title fw-semibold" id="productModalTitle">Add Product</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body p-4">
          <div class="row g-4">
            
            <!-- Left Column: Details -->
            <div class="col-md-7">
              <div class="card border-0 shadow-sm rounded-3 p-3">
                <h6 class="fw-bold mb-3">Product Details</h6>
                <div class="row g-3">
                  
                  <div class="col-md-6">
                    <label class="form-label">Name</label>
                    <div class="input-group">
                      <span class="input-group-text"><i class="fa-solid fa-tag"></i></span>
                      <input id="pmTitle" type="text" class="form-control" placeholder="Product Name" />
                    </div>
                  </div>
                  
                  <div class="col-md-3">
                    <label class="form-label">Price ($)</label>
                    <div class="input-group">
                      <span class="input-group-text"><i class="fa-solid fa-dollar-sign"></i></span>
                      <input id="pmPrice" type="number" step="0.01" class="form-control" placeholder="0.00" />
                    </div>
                  </div>

                  <div class="col-md-3">
                    <label class="form-label">Old Price ($)</label>
                    <div class="input-group">
                      <span class="input-group-text"><i class="fa-solid fa-tag"></i></span>
                      <input id="pmOldPrice" type="number" step="0.01" class="form-control" placeholder="0.00" />
                    </div>
                  </div>
                  
                  <div class="col-md-4">
                    <label class="form-label">Stock</label>
                    <div class="input-group">
                      <span class="input-group-text"><i class="fa-solid fa-box"></i></span>
                      <input id="pmStock" type="number" class="form-control" placeholder="0" />
                    </div>
                  </div>
                  
                  <div class="col-md-8">
                    <label class="form-label">Category</label>
                    <select id="pmCategory" class="form-select">
                      <option value="">Select Category</option>
                      <option value="Living">Living</option>
                      <option value="Dining">Dining</option>
                      <option value="Bedroom">Bedroom</option>
                      <option value="Outdoor">Outdoor</option>
                    </select>
                  </div>

                <div class="col-12 mt-3">
                    <label class="form-label">Sub Images </label>
                      <textarea id="pmSubImages" class="form-control" rows="3" placeholder="Enter image URLs..."></textarea>
                    </div>


                  <div class="col-12">
                    <label class="form-label">Description</label>
                    <textarea id="pmDesc" class="form-control" rows="3" placeholder="Write product description..."></textarea>
                  </div>
                </div>
              </div>
            </div>



            <!-- Right Column: Images -->
            <div class="col-md-5">
              <div class="card border-0 shadow-sm rounded-3 p-3 text-center">
                <label class="form-label">Main Image</label>
                <input id="pmImage" type="file" class="form-control" />
                <img id="pmImagePreview" src="" alt="Preview" style="display:none;max-height:200px;margin-top:5px;">
                <hr/>
                <label class="form-label">Sub Images</label>
                <input id="pmSubImagesInput" type="file" class="form-control" multiple />
                <div id="pmSubImagesPreview" class="d-flex flex-wrap gap-2 mt-2"></div>
              </div>
            </div>

          </div>
        </div>
        
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
          <button id="pmSave" type="button" class="btn text-white" style="background-color:#0d9488;">
            <i class="fa-solid fa-floppy-disk"></i> Save Product
          </button>
        </div>
      </div>
    </div>
  </div>
`;
