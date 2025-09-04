export function initProductsPage(filteredList = null) {
  let tableBody = document.getElementById("productsTable");
  let modalTitle = document.getElementById("productModalTitle");
  let nameInput = document.getElementById("pmTitle");
  let priceInput = document.getElementById("pmPrice");
  let OldPriceInput = document.getElementById("pmOldPrice");
  let stockInput = document.getElementById("pmStock");
  let categoryInput = document.getElementById("pmCategory");
  let descInput = document.getElementById("pmDesc");
  let imageInput = document.getElementById("pmImage");
  let pmSubImagesInput = document.getElementById("pmSubImagesInput");
  let imagePreview = document.getElementById("pmImagePreview");
  let pmSubImagesPreview = document.getElementById("pmSubImagesPreview");
  let saveBtn = document.getElementById("pmSave");

  let categoryFilter = document.getElementById("categoryFilter");
  let searchById = document.getElementById("searchById");
  let searchByName = document.getElementById("searchByName");
  let searchByStock = document.getElementById("searchByStock");

  let prevBtn = document.getElementById("prevPage");
  let nextBtn = document.getElementById("nextPage");
  let pageInfo = document.getElementById("pageInfo");

  [categoryFilter, searchById, searchByName, searchByStock].forEach((el) => {
    el?.addEventListener("input", applyFilters);
    el?.addEventListener("change", applyFilters);
  });

  // ======> Load products <======
  let allProducts = JSON.parse(localStorage.getItem("products")) || [];
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  let products = [];

  // === Helper function for role-based filtering ===
  function getProductsByRole(allProducts, loggedInUser, filteredList = null) {
    if (filteredList) {
      return filteredList;
    } else if (loggedInUser?.Role === "seller") {
      // Seller sees all their products (pending + accepted)
      return allProducts.filter(
        (p) => p.sellerId?.toString() === loggedInUser.ID.toString()
      );
    } else if (loggedInUser?.Role === "admin") {
      // Admin sees everything
      return [...allProducts];
    } else {
      // Customer sees ONLY accepted
      return allProducts.filter(
        (p) => (p.status || "").toLowerCase() === "accepted"
      );
    }
  }
  // Initial load
  products = getProductsByRole(allProducts, loggedInUser, filteredList);

  // ======> Role based filtering <======
  if (products.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-4">
          <div class="alert alert-info mb-0" role="alert" style="font-size:16px;">
            🛒 You don’t have any products yet.  
            <br>
            <small class="text-muted">Click <strong>Add Product</strong> to start selling.</small>
          </div>
        </td>
      </tr>
    `;
    pageInfo.textContent = "Page 0 of 0";
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }

  let searchededProducts = [...products];
  let editingId = null;
  let currentPage = 1;
  let pageSize = 6;

  //===> search for product
  function applyFilters() {
    let cat = categoryFilter?.value || "All";
    let idQuery = searchById?.value.trim().toLowerCase();
    let nameQuery = searchByName?.value.trim().toLowerCase();
    let stockQuery = searchByStock?.value.trim().toLowerCase();

    searchededProducts = products.filter((p) => {
      let match = true;

      // Category filter
      if (cat !== "All" && p.category.toLowerCase() !== cat.toLowerCase()) {
        match = false;
      }
      // ID filter
      if (idQuery && !p.id.toString().toLowerCase().includes(idQuery)) {
        match = false;
      }
      // Name filter
      if (nameQuery && !p.name.toLowerCase().includes(nameQuery)) {
        match = false;
      }
      // Stock filter
      if (
        stockQuery &&
        !p.stock.toString().toLowerCase().includes(stockQuery)
      ) {
        match = false;
      }
      return match;
    });

    currentPage = 1;
    renderProducts();
  }

  // ====>> render Products table <<====
  function renderProducts() {
    tableBody.innerHTML = "";

    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize;
    let currentProducts = searchededProducts.slice(start, end);

    currentProducts.forEach((prod) => {
      let row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${prod.image}" alt="Product" 
            style="height:60px;width:70px;object-fit:cover;border-radius:4px;"></td>
        <td>${prod.id}</td>
        <td>${prod.name}</td>
        <td>${prod.price}</td>
        <td>${prod.oldPrice ? prod.oldPrice : "—"}</td>
        <td>${prod.stock}</td>
        <td>${prod.category}</td>
        <td>${prod.status}</td>
        <td>
          <button class="btn btn-sm btn-warning me-2 edit-product" data-id="${
            prod.id
          }">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn btn-sm btn-danger del-product" data-id="${
            prod.id
          }">
            <i class="fa-solid fa-trash"></i>
          </button>
             <button class="btn btn-sm btn-secondary me-2 soft-del-product" data-id="${
               prod.id
             }">
          <i class="fa-solid fa-ban"></i>
        </button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    //======> Attach events <=====
    document.querySelectorAll(".edit-product").forEach((btn) => {
      btn.addEventListener("click", handleEditProduct);
    });
    document.querySelectorAll(".del-product").forEach((btn) => {
      btn.addEventListener("click", handleDeleteProduct);
    });

    document.querySelectorAll(".soft-del-product").forEach((btn) =>
      btn.addEventListener("click", function () {
        let id = this.dataset.id;

        Swal.fire({
          title: "Soft deleted Product?",
          text: "This will Soft deleted the product but not permanently delete it.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, Soft deleted",
          cancelButtonText: "Cancel",
          confirmButtonColor: "#6c757d",
          cancelButtonColor: "#d33",
        }).then((result) => {
          if (result.isConfirmed) {
            // mark product as soft deleted
            products = products.map((prod) =>
              String(prod.id) === id ? { ...prod, isDeleted: true } : prod
            );

            // save updated products
            localStorage.setItem("products", JSON.stringify(products));

            // refresh filtered list
            searchededProducts = products.filter((p) => !p.isDeleted);
            renderProducts();

            Swal.fire({
              title: "Soft deleted!",
              text: "The product has been deleted successfully.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
          }
        });
      })
    );

    renderPagination();
  }

  // ====>> Pagination <<=====
  function renderPagination() {
    let totalPages = Math.ceil(searchededProducts.length / pageSize);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
  }

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderProducts();
    }
  });

  nextBtn.addEventListener("click", () => {
    let totalPages = Math.ceil(searchededProducts.length / pageSize);
    if (currentPage < totalPages) {
      currentPage++;
      renderProducts();
    }
  });

  function populateCategories(selectedCategory = "") {
    const categories = JSON.parse(localStorage.getItem("categories")) || [];
    categoryInput.innerHTML = '<option value="">-- Select Category --</option>';

    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.name;
      option.textContent = cat.name;
      if (cat.name.toLowerCase() === selectedCategory.toLowerCase()) {
        option.selected = true;
      }
      categoryInput.appendChild(option);
    });
  }

  // =======================>> Add Product <<=====================
  let tempSubImages = [];
  document.getElementById("addProductBtn")?.addEventListener("click", () => {
    editingId = null;
    modalTitle.textContent = "Add Product";
    nameInput.value = "";
    priceInput.value = "";
    OldPriceInput.value = "";
    stockInput.value = "";
    categoryInput.value = "";
    descInput.value = "";
    imageInput.value = "";
    pmSubImagesInput.value = "";
    tempSubImages = [];
    imagePreview.style.display = "none";

    populateCategories();
    let modal = new bootstrap.Modal(document.getElementById("productModal"));
    modal.show();
  });

  // ======>> Image files data <<=======
  imageInput.addEventListener("change", () => {
    let file = imageInput.files[0];
    if (file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  //=====> subImages <======
  function readSubImages(files) {
    const readers = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });
    return Promise.all(readers);
  }

  pmSubImagesInput.addEventListener("change", async () => {
    const files = Array.from(pmSubImagesInput.files).slice(0, 4);
    pmSubImagesPreview.innerHTML = "";
    saveBtn.disabled = true;

    try {
      tempSubImages = await readSubImages(files);

      tempSubImages.forEach((imgUrl) => {
        const img = document.createElement("img");
        img.src = imgUrl;
        img.style.width = "80px";
        img.style.height = "80px";
        img.style.objectFit = "cover";
        img.classList.add("rounded", "border");
        pmSubImagesPreview.appendChild(img);
      });

      saveBtn.disabled = false;
    } catch (error) {
      console.error("Error reading sub images:", error);
      Swal.fire({
        icon: "error",
        title: "Image Error",
        text: "error in loading image ",
      });
    }
  });

  // =====================>> Edit Product <<===========================
  function handleEditProduct(e) {
    editingId = parseInt(e.currentTarget.dataset.id);
    let prod = allProducts.find((p) => p.id === editingId);

    if (prod) {
      modalTitle.textContent = "Edit Product";
      nameInput.value = prod.name;
      priceInput.value = prod.price;
      OldPriceInput.value = prod.oldPrice ?? "";
      stockInput.value = prod.stock;
      populateCategories(prod.category);
      descInput.value = prod.description;
      imagePreview.src = prod.image;
      imagePreview.style.display = "block";
      pmSubImagesPreview.innerHTML = "";
      tempSubImages = prod.subImages ? [...prod.subImages] : [];
      tempSubImages.forEach((imgUrl) => {
        let img = document.createElement("img");
        img.src = imgUrl;
        img.style.width = "80px";
        img.style.margin = "5px";
        pmSubImagesPreview.appendChild(img);
      });

      let modal = new bootstrap.Modal(document.getElementById("productModal"));
      modal.show();
    }
  }

  // =====> Save Product <======
  // =====> Save Product <======
  saveBtn.addEventListener("click", () => {
    let name = nameInput.value.trim();
    let price = priceInput.value.trim();
    let oldPrice = OldPriceInput.value.trim();
    let stock = stockInput.value.trim();
    let category = categoryInput.value;
    let desc = descInput.value.trim();
    let imgUrl = imagePreview.src;

    if (!name || !price || !stock) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all required fields",
        confirmButtonText: "OK",
      });
      return;
    }

    if (editingId) {
      // update existing
      allProducts = allProducts.map((p) =>
        p.id === editingId
          ? {
              ...p,
              name,
              price,
              oldPrice: oldPrice || "",
              stock: stock || 0,
              category: category || "",
              description: desc || "",
              image: imgUrl || "../../server/data/products_img/default.jpg",
              subImages: tempSubImages.length > 0 ? tempSubImages : [],
              // ensure defaults are preserved if missing
              reviews: p.reviews || "NOT NOW",
              dimentions: p.dimentions || { width: "0", height: "0", Length: "0" },
              sellerId: p.sellerId || (loggedInUser?.ID ?? ""),
              sellerName: p.sellerName || (loggedInUser?.Name ?? "Unknown"),
              color: p.color || { name: "", hex: "" },
              status: p.status || "pending",
              isDeleted: p.isDeleted ?? false,
            }
          : p
      );

      Swal.fire({
        icon: "success",
        title: "Product Updated",
        text: "Your product changes have been saved.",
        confirmButtonText: "OK",
      });
    } else {
      // add new
      let newId = allProducts.length
        ? Math.max(...allProducts.map((p) => p.id)) + 1
        : 1;

      allProducts.push({
        id: newId,
        name,
        price,
        oldPrice: oldPrice || "",
        stock: stock || 0,
        category: category || "",
        description: desc || "",
        image: imgUrl || "../../server/data/products_img/default.jpg",
        subImages: tempSubImages.length > 0 ? tempSubImages : [],
        // === safe defaults for new product ===
        reviews: "",
        dimentions: { width: "", height: "", Length: "" },
        sellerId: loggedInUser?.ID || "",
        sellerName: loggedInUser?.Name || "Unknown",
        color: { name: "", hex: "" },
        status: "pending", 
        isDeleted: false,
      });

      Swal.fire({
        icon: "info",
        title: "Product Submitted",
        text: "Your product is waiting for admin approval.",
        confirmButtonText: "OK",
      });
    }

    // persist all products
    localStorage.setItem("products", JSON.stringify(allProducts));

    // refresh current seller/admin/customer view
    products = getProductsByRole(allProducts, loggedInUser);
    searchededProducts = [...products];
    renderProducts();

    bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
  });

  // ====>> Delete Product <<====
  function handleDeleteProduct(e) {
    let id = Number(e.currentTarget.dataset.id);

    Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        allProducts = allProducts.filter((p) => p.id !== id);
        localStorage.setItem("products", JSON.stringify(allProducts));

        products = getProductsByRole(allProducts, loggedInUser);

        let totalPages = Math.ceil(products.length / pageSize);
        if (currentPage > totalPages) currentPage = totalPages || 1;

        searchededProducts = [...products];
        renderProducts();
        Swal.fire("Deleted!", "Product has been deleted.", "success");
      }
    });
  }

  //apply style on js to remove layer because of positioning
  let productModal = document.getElementById("productModal");
  productModal.addEventListener("show.bs.modal", () => {
    document.body.appendChild(productModal);
  });

  // Initial render
  applyFilters();
  renderProducts();
}
