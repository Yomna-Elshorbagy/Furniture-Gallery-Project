export async function initProductsPage() {
  const tableBody = document.getElementById("productsTable");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  const pageInfo = document.getElementById("pageInfo");
  const addBtn = document.getElementById("addProductBtn");

  let products = [];
  let currentPage = 1;
  const itemsPerPage = 6;
  let editProductId = null;

  const API_URL = "http://localhost:4000";

  // ===== Load products from API =====
  async function loadProducts() {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      products = (data.products || []).map((p) => ({
        ...p,
        price: Number(p.price),
        stock: Number(p.stock),
      }));
      renderPage(currentPage);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }

  // ===== Render table =====
  function renderPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = products.slice(start, end);

    tableBody.innerHTML = "";

    paginatedItems.forEach((product) => {
      const row = document.createElement("tr");

      // Always build from backend URL
      let imgSrc;
      if (product.image && product.image.trim() !== "") {
        // If it's already an external URL (starts with http/https), use as is
        if (product.image.startsWith("http")) {
          imgSrc = product.image;
        } else {
          imgSrc = `${API_URL}${product.image}`;
        }
      } else {
        imgSrc = `${API_URL}/products_img/default.jpg`;
      }

      row.innerHTML = `
      <td>
        <img
          src="${imgSrc}"
          onerror="this.src='http://localhost:4000/products_img/default.jpg'"
          class="img-thumbnail"
          style="width:90px;height:90px;object-fit:cover"
        >
      </td>
      <td>${product.name}</td>
      <td>${parseFloat(product.price).toFixed(2)}</td>
      <td>${product.stock}</td>
      <td>${product.category}</td>
      <td>
        <button type="button" class="btn btn-sm btn-warning me-2 edit-btn" data-id="${
          product.id
        }">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button type="button" class="btn btn-sm btn-danger delete-btn" data-id="${
          product.id
        }">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;

      tableBody.appendChild(row);
    });

    pageInfo.textContent = `Page ${page} of ${Math.ceil(
      products.length / itemsPerPage
    )}`;
    prevBtn.disabled = page === 1;
    nextBtn.disabled = page >= Math.ceil(products.length / itemsPerPage);

    attachEventListeners();
  }

  // ===== Attach edit/delete events =====
  function attachEventListeners() {
    // Delete product
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const id = this.dataset.id;
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.isConfirmed) {
            fetch(`${API_URL}/product/${id}`, { method: "DELETE" })
              .then((res) => res.json())
              .then((data) => {
                products = data.products;
                renderPage(currentPage);
                Swal.fire("Deleted!", "Product has been deleted.", "success");
              })
              .catch((err) => console.error("Delete failed:", err));
          }
        });
      });
    });

    // Edit product
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const id = this.dataset.id;
        const product = products.find((p) => p.id == id);
        if (product) {
          editProductId = id;
          document.getElementById("productModalTitle").textContent =
            "Edit Product";
          document.getElementById("pmTitle").value = product.name;
          document.getElementById("pmPrice").value = Number(product.price);
          document.getElementById("pmStock").value = Number(product.stock);
          document.getElementById("pmCategory").value = product.category;
          const imgPreview = document.getElementById("pmImagePreview");
          if (product.image && product.image.trim() !== "") {
            if (product.image.startsWith("http")) {
              imgPreview.src = product.image;
            } else {
              imgPreview.src = `${API_URL}${product.image}`;
            }
            imgPreview.style.display = "block";
          } else {
            imgPreview.src = `${API_URL}/products_img/default.jpg`;
            imgPreview.style.display = "block";
          }
          document.getElementById("pmImage").value = "";
          document.getElementById("pmDesc").value = product.description || "";
          new bootstrap.Modal(document.getElementById("productModal")).show();
        }
      });
    });
  }

  // ===== Save product (Add or Edit) =====
  document.getElementById("pmSave").addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const formData = new FormData();
    formData.append("name", document.getElementById("pmTitle").value);
    formData.append(
      "price",
      parseFloat(document.getElementById("pmPrice").value)
    );
    formData.append(
      "stock",
      parseFloat(document.getElementById("pmStock").value)
    );

    formData.append("category", document.getElementById("pmCategory").value);
    formData.append("description", document.getElementById("pmDesc").value);

    const imageFile = document.getElementById("pmImage").files[0];
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const method = editProductId ? "PUT" : "POST";
    const url = editProductId
      ? `${API_URL}/product/${editProductId}`
      : `${API_URL}/product`;

    await fetch(url, { method, body: formData })
      .then((res) => res.json())
      .then((data) => {
        if (data.errors) {
          Swal.fire("Error", data.errors.join("\n"), "error");
          return;
        }
        products = data.products;
        renderPage(currentPage);
        bootstrap.Modal.getInstance(
          document.getElementById("productModal")
        ).hide();
      })
      .catch((err) => console.error("Save failed:", err));
  });

  // ===== Add Product Button =====
  addBtn.addEventListener("click", () => {
    editProductId = null;
    document.getElementById("productModalTitle").textContent = "Add Product";
    document.getElementById("pmTitle").value = "";
    document.getElementById("pmPrice").value = "";
    document.getElementById("pmStock").value = "";
    document.getElementById("pmCategory").value = "";
    document.getElementById("pmImage").value = "";
    document.getElementById("pmDesc").value = "";
    new bootstrap.Modal(document.getElementById("productModal")).show();
  });

  // ===== Pagination =====
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage(currentPage);
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentPage < Math.ceil(products.length / itemsPerPage)) {
      currentPage++;
      renderPage(currentPage);
    }
  });

  // ===== Initial load =====
  loadProducts();
}
