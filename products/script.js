//=====>  handel logged in and logged out
document.addEventListener("DOMContentLoaded", () => {
  let loginBtn = document.getElementById("loginBtn");
  let logoutBtn = document.getElementById("logoutBtn");
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (loggedInUser) {
    // show logout, hide login
    loginBtn.classList.add("d-none");
    logoutBtn.classList.remove("d-none");
  } else {
    // show login, hide logout
    loginBtn.classList.remove("d-none");
    logoutBtn.classList.add("d-none");
  }
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    Swal.fire({
      title: "👋 Logged out",
      text: "You have been logged out successfully.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = "../Auth/log-in/login.html";
    });
  });
});

// ====> draw all categories on load
window.addEventListener("DOMContentLoaded", () => {
  fetch("../server/data/products.json")
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then((prod) => {
      localStorage.setItem("products", JSON.stringify(prod));
      allProducts = prod;
      displayProducts();
      renderPagination();
    })
    .catch((error) => console.error("Error fetch JSON data: ", error));
});

let allProducts = [];
let currentPage = 1;
let pageSize = 20;

products = JSON.parse(localStorage.getItem("products"));

// display products according to categories
function displayProducts() {
  let productList = document.getElementById("product-list");
  productList.innerHTML = "";

  let urlParams = new URLSearchParams(window.location.search);
  let category = urlParams.get("category");
  let filtered = allProducts.filter(
    (p) => !category || p.category === category
  );
  let start = (currentPage - 1) * pageSize;
  let end = start + pageSize;
  let currentProducts = filtered.slice(start, end);

  currentProducts.forEach((product) => {
    if (!category || product.category === category) {
      drowProduct(product, productList);
    }
  });
  if (currentProducts.length === 0) {
    productList.innerHTML = `<p class="text-center text-muted">No products found</p>`;
  }
}

// display cart of products
function drowProduct(product, productList) {
  let card = document.createElement("div");
  card.className = "col-6 col-md-3 mb-4";

  card.innerHTML = `
        <div class="card product-card">
            <div class="image-scale">
                
                <img src="${product.image}" class="card-img-top" alt="${
    product.name
  }">
            </div>
            <div class="card-body">
                <h6 class="card-title text-start">${product.name}</h6>
                <p class="card-text text-start">
                    <span class="newprice ">$${product.price}</span>
                    ${
                      product.oldPrice
                        ? `<span class="old-price ms-2 text-secondary">${product.oldPrice}</span>`
                        : ""
                    }
                </p>
            </div>
        </div>
    `;

  // عند الضغط على الكارت نروح للمنتج
  // card.addEventListener("click", () => {
  //   window.location.href = `#${product.id}`;
  // });
  card.addEventListener("click", () => {
    window.location.href = `../product details/proDetails.html?id=${product.id}`;
  });
  productList.appendChild(card);
}

//change url category
function openCategory(categoryName) {
  window.location.href = `?category=${categoryName}`;
}

// Search function
var input = document.getElementById("categorySearch");
function opensearchfun() {
  if (input.classList.contains("d-none")) {
    input.classList.remove("d-none");
  } else {
    input.classList.add("d-none");
  }
}
function searchfun(name) {
  let productList = document.getElementById("product-list");
  productList.innerHTML = "";

  let results = products.filter((product) =>
    product.name.toLowerCase().includes(name)
  );

  if (results.length > 0) {
    results.forEach((product) => drowProduct(product, productList));
  } else {
    productList.innerHTML = `<p class="text-center text-muted">No products found</p>`;
  }
}
input.addEventListener("keyup", (e) => {
  searchfun(e.target.value.toLowerCase());
  let paginationContainer = document.getElementById("pagination");
  if (paginationContainer) paginationContainer.innerHTML = "";
});

//======> filter function by value of price
let minValue = document.getElementById("minValue");
let maxValue = document.getElementById("maxValue");

minValue.addEventListener("blur", () => {
  min = minValue.value;
});
maxValue.addEventListener("blur", () => {
  max = maxValue.value;
});

function filterfun() {
  // console.log(e)
  let productList = document.getElementById("product-list");
  productList.innerHTML = "";

  console.log(+min);
  console.log(+max);

  products.forEach((pro) => {
    if (pro.price > +min && pro.price < +max) {
      console.log(pro.price);
      drowProduct(pro, productList);
    }
  });

  if (productList.innerText.length == 0) {
    productList.innerHTML = "There are no product";
  }
  let paginationContainer = document.getElementById("pagination");
  if (paginationContainer) paginationContainer.innerHTML = "";
}

//====> pagination for products
function renderPagination() {
  let paginationContainer = document.getElementById("pagination");
  if (!paginationContainer) return;
  paginationContainer.innerHTML = "";

  let urlParams = new URLSearchParams(window.location.search);
  let category = urlParams.get("category");

  let filtered = allProducts.filter(
    (p) => !category || p.category === category
  );

  let totalPages = Math.ceil(filtered.length / pageSize);

  // prev button
  let prevBtn = document.createElement("button");
  prevBtn.textContent = "Prev";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      displayProducts();
      renderPagination();
    }
  };
  paginationContainer.appendChild(prevBtn);

  // page numbers
  for (let i = 1; i <= totalPages; i++) {
    let btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.style.fontWeight = "bold";
    btn.onclick = () => {
      currentPage = i;
      displayProducts();
      renderPagination();
    };
    paginationContainer.appendChild(btn);
  }

  // next button
  let nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      displayProducts();
      renderPagination();
    }
  };
  paginationContainer.appendChild(nextBtn);
}
