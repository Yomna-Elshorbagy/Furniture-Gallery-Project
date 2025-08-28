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

  let prevBtn = document.getElementById("prevPage");
  let nextBtn = document.getElementById("nextPage");
  let pageInfo = document.getElementById("pageInfo");

   let products = initialProducts || JSON.parse(localStorage.getItem("products")) || [];
  let searchededProducts = [...products];

  let editingId = null;
  let currentPage = 1;
  let pageSize = 6;

  ////// search for product
  document.getElementById("searchInput").addEventListener("input", (e) => {
    let query = e.target.value.toLowerCase().trim();
    if (query === "") {
      searchededProducts = [...products];
    } else {
      searchededProducts = products.filter(
        (product) =>
          product.id.toString().toLowerCase().includes(query) ||
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }
    currentPage = 1;
    renderProducts();
  });

  // ---- >> render Products table << ----
  function renderProducts() {
    tableBody.innerHTML = "";

    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize;
    let currentProducts = searchededProducts.slice(start, end);

    currentProducts.forEach((prod) => {
      let row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${
          prod.image
        }" alt="Product" style="height:50px;width:50px;object-fit:cover;border-radius:4px;"></td>
        <td>$${prod.name}</td>
        <td>${prod.price}</td>
        <td>${prod.oldPrice ? prod.oldPrice : "—"}</td>
        <td>${prod.stock}</td>
        <td>${prod.category}</td>
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

    renderPagination();
  }

  // ---->> Pagination <<----
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

  // ---->> Add Product <<----
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

    let modal = new bootstrap.Modal(document.getElementById("productModal"));
    modal.show();
  });

  // ---->> Image files data <<----
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

  ////////// subimages

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




  // ---->> Edit Product <<----
  function handleEditProduct(e) {
    editingId = parseInt(e.currentTarget.dataset.id);
    let prod = products.find((p) => p.id === editingId);

    if (prod) {
      modalTitle.textContent = "Edit Product";
      nameInput.value = prod.name;
      priceInput.value = prod.price;
      OldPriceInput.value = prod.oldPrice ?? "";
      stockInput.value = prod.stock;
      categoryInput.value = prod.category;
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

  // ---- Save Product ----
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
      products = products.map((p) =>
        p.id === editingId
          ? {
              ...p,
              name,
              price,
              oldPrice,
              stock,
              category,
              description: desc,
              image: imgUrl,
              subImages:  tempSubImages,
            }
          : p
      );
    } else {
      // add new
      let newId = products.length
        ? Math.max(...products.map((p) => p.id)) + 1
        : 1;
      products.push({
        id: newId,
        name,
        price,
        oldPrice,
        stock,
        category,
        description: desc,
        image: imgUrl || "../../server/data/products_img/default.jpg",
        subImages:  tempSubImages,
      });
    }

    console.log(tempSubImages);

    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();

    bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
  });

  // ---- >> Delete Product << ----
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
  renderProducts();
}
