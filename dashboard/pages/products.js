export function initProductsPage(initialProducts = null) {
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

  // reapply filters whenever any input changes
  [categoryFilter, searchById, searchByName, searchByStock].forEach((el) => {
    el?.addEventListener("input", applyFilters);
    el?.addEventListener("change", applyFilters);
  });

  // pagination
  let prevBtn = document.getElementById("prevPage");
  let nextBtn = document.getElementById("nextPage");
  let pageInfo = document.getElementById("pageInfo");

  let products =
    initialProducts || JSON.parse(localStorage.getItem("products")) || [];
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

    searchededProducts = products.filter((prod) => {
      let match = true;
      // category filter
      if (cat !== "All" && prod.category.toLowerCase() !== cat.toLowerCase()) {
        match = false;
      }
      // ID filter
      if (idQuery && !prod.id.toString().toLowerCase().includes(idQuery)) {
        match = false;
      }
      // name filter
      if (nameQuery && !prod.name.toLowerCase().includes(nameQuery)) {
        match = false;
      }
      // stock filter
      if (
        stockQuery &&
        !prod.stock.toString().toLowerCase().includes(stockQuery)
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
    let requestsBody = document.getElementById("requestsTable");
    requestsBody.innerHTML = "";

    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize;

    // Approved + rejected products (main table)
    let currentProducts = searchededProducts
      .filter((p) => !p.isDeleted && p.status !== "pending")
      .slice(start, end);

    // Pending requests (separate table)
    let requestProducts = searchededProducts.filter(
      (p) => !p.isDeleted && p.status === "pending"
    );

    // ====== Render main products table ======
    currentProducts.forEach((prod) => {
      let row = document.createElement("tr");
      row.innerHTML = `
      <td><img src="${prod.image}" alt="Product" 
          style="height:50px;width:50px;object-fit:cover;border-radius:4px;"></td>
      <td>${prod.id}</td>
      <td style="max-width:180px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
        ${prod.name}
      </td>      
      <td>${prod.price}</td>
      <td>${prod.oldPrice ? prod.oldPrice : "—"}</td>
      <td>${prod.stock}</td>
      <td>${prod.category}</td>
      <td>
        <span class="badge bg-${
          prod.status === "accepted"
            ? "success"
            : prod.status === "rejected"
            ? "danger"
            : "secondary"
        }">
          ${prod.status}
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-warning me-2 edit-product edit-btn" data-id="${
          prod.id
        }">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="btn btn-sm btn-danger me-2 del-product delete-btn" data-id="${
          prod.id
        }">
          <i class="fa-solid fa-trash"></i>
        </button>
        <button class="btn btn-sm btn-secondary soft-del-product soft-del-btn" data-id="${
          prod.id
        }">
          <i class="fa-solid fa-ban"></i>
        </button>
      </td>
    `;
      tableBody.appendChild(row);
    });

    // ====== Render requests table ======
    requestProducts.forEach((prod) => {
      let row = document.createElement("tr");
      row.innerHTML = `
      <td><img src="${prod.image}" alt="Product" 
          style="height:50px;width:50px;object-fit:cover;border-radius:4px;"></td>
      <td>${prod.id}</td>
      <td>${prod.name}</td>
      <td>${prod.price}</td>
      <td>${prod.stock}</td>
      <td>${prod.category}</td>
      <td><span class="badge bg-warning">Pending</span></td>
      <td>
        <button class="btn btn-sm btn-success me-2 accept-product edit-btn" data-id="${prod.id}">
          <i class="fa-solid fa-check"></i>
        </button>
        <button class="btn btn-sm btn-secondary me-2 reject-product" data-id="${prod.id}">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <button class="btn btn-sm btn-info view-product view-btn" data-id="${prod.id}">
          <i class="fa-solid fa-eye"></i>
        </button>
      </td>
    `;
      requestsBody.appendChild(row);
    });

    // ====== Handle accept / reject ======
    document.querySelectorAll(".accept-product").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let id = Number(e.currentTarget.dataset.id);
        products = products.map((p) =>
          p.id === id ? { ...p, status: "accepted" } : p
        );
        localStorage.setItem("products", JSON.stringify(products));
        Swal.fire("✅ Accepted", "Product has been approved.", "success");
        searchededProducts = [...products];
        renderProducts();
      });
    });

    document.querySelectorAll(".reject-product").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let id = Number(e.currentTarget.dataset.id);
        products = products.map((p) =>
          p.id === id ? { ...p, status: "rejected" } : p
        );
        localStorage.setItem("products", JSON.stringify(products));
        Swal.fire("❌ Rejected", "Product has been rejected.", "error");
        searchededProducts = [...products];
        renderProducts();
      });
    });

    // ====== Handle view (👁️ eye) ======
    document.querySelectorAll(".view-product").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let id = Number(e.currentTarget.dataset.id);
        let prod = products.find((p) => p.id === id);
        if (!prod) return;
        Swal.fire({
          title: prod.name,
          html: `
          <img src="${
            prod.image
          }" style="max-width:200px;border-radius:8px;margin-bottom:10px;">
          <p><b>Price:</b> $${prod.price}</p>
          <p><b>Stock:</b> ${prod.stock}</p>
          <p><b>Category:</b> ${prod.category}</p>
          <p><b>Description:</b> ${prod.description || "No description"}</p>
        `,
          confirmButtonText: "Close",
        });
      });
    });

    // ====== Attach edit / delete / soft delete ======
    document
      .querySelectorAll(".edit-product")
      .forEach((btn) => btn.addEventListener("click", handleEditProduct));

    document
      .querySelectorAll(".del-product")
      .forEach((btn) => btn.addEventListener("click", handleDeleteProduct));

    document.querySelectorAll(".soft-del-product").forEach((btn) =>
      btn.addEventListener("click", function () {
        let id = this.dataset.id;

        Swal.fire({
          title: "Soft Delete Product?",
          text: "This will soft delete the product but not permanently remove it.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, soft delete",
          cancelButtonText: "Cancel",
          confirmButtonColor: "#6c757d",
          cancelButtonColor: "#d33",
        }).then((result) => {
          if (result.isConfirmed) {
            products = products.map((prod) =>
              Number(prod.id) === Number(id)
                ? { ...prod, isDeleted: true }
                : prod
            );
            localStorage.setItem("products", JSON.stringify(products));
            searchededProducts = [...products];
            renderProducts();

            Swal.fire({
              title: "Soft Deleted!",
              text: "The product has been soft deleted successfully.",
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

  // ====>> Pagination <<====
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
  // ====>> Add Product <<====
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

  // ====>> Image files data <<====
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

  // subImages
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

  // =====>> Edit Product <<=====
  function handleEditProduct(e) {
    editingId = parseInt(e.currentTarget.dataset.id);
    let prod = products.find((p) => p.id === editingId);

    if (prod) {
      modalTitle.textContent = "Edit Product";
      nameInput.value = prod.name;
      priceInput.value = prod.price;
      OldPriceInput.value = prod.oldPrice ?? "";
      stockInput.value = prod.stock;
      populateCategories(prod.category);
      // categoryInput.value = prod.category;
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

  // ====>> Save Product <<=====
  // ====>> Save Product <<=====
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
      // update existing product
      products = products.map((prod) =>
        prod.id === editingId
          ? {
              ...prod,
              name,
              price,
              oldPrice: oldPrice || "",
              stock,
              category,
              description: desc || "",
              image: imgUrl || "../../server/data/products_img/default.jpg",
              subImages: tempSubImages.length > 0 ? tempSubImages : [],
            }
          : prod
      );
    } else {
      // create new product with safe defaults
      let newId = products.length
        ? Math.max(...products.map((p) => p.id)) + 1
        : 1;

      let newProduct = {
        id: newId,
        name,
        price,
        oldPrice: oldPrice || "",
        category: category || "",
        reviews: "",
        stock: stock || 0,
        description: desc || "",
        image: imgUrl || "../../server/data/products_img/default.jpg",
        subImages: tempSubImages.length > 0 ? tempSubImages : [],
        reviews: "",
        dimentions: { width: "0", height: "0", Length: "0" },
        sellerId: p.sellerId || (loggedInUser?.ID ?? ""),
        sellerName: p.sellerName || (loggedInUser?.Name ?? "Unknown"),
        color: p.color || { name: "", hex: "" },
        status: "accepted",
        isDeleted: false,
      };

      products.push(newProduct);
    }

    localStorage.setItem("products", JSON.stringify(products));
    searchededProducts = [...products];
    applyFilters();

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
        products = products.filter((p) => p.id !== id);
        localStorage.setItem("products", JSON.stringify(products));

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

  document.getElementById("requestsBtn").addEventListener("click", () => {
    let container = document.getElementById("requestsContainer");
    container.classList.toggle("d-none");

    // optional: change button text/icon dynamically
    let btn = document.getElementById("requestsBtn");
    if (container.classList.contains("d-none")) {
      btn.innerHTML = `<i class="fa-solid fa-clipboard-list"></i> Requests`;
    } else {
      btn.innerHTML = `<i class="fa-solid fa-eye-slash"></i> Hide Requests`;
    }
  });
  // Initial render
  renderProducts();
  applyFilters();
}
