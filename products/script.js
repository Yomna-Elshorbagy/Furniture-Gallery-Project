const serverDataFiles = {
  // products: "../../server/data/products.json",
  categories: "../../server/data/categories.json",
  orders: "../../server/data/orders.json",
  users: "../../server/data/users.json",
};
window.addEventListener("DOMContentLoaded", () => {
  Object.entries(serverDataFiles).forEach(([key, url]) => {
    if (!localStorage.getItem(key)) {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem(key, JSON.stringify(data));
          console.log(`${key} saved`, data);
        })
        .catch((err) =>
          console.error(`Error loading ${key} from ${url}:`, err)
        );
    } else {
      console.log(`${key} already in localStorage`);
    }

    let storedProducts = localStorage.getItem("products");

    if (storedProducts) {
      allProducts = JSON.parse(storedProducts);
      displayProducts();
      renderPagination();
    } else {
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
    }
  });
  //=====>  handel logged in and logged out
  handleAuthButtons();
  renderFavoriteModal();
});
function saveUsers(users, loggedInUser) {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
  localStorage.setItem("loggedInUserId", loggedInUser.ID);
}

function handleAuthButtons() {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const loggedInUser = getLoggedInUser();

  if (loggedInUser) {
    loginBtn.classList.add("d-none");
    logoutBtn.classList.remove("d-none");
  } else {
    loginBtn.classList.remove("d-none");
    logoutBtn.classList.add("d-none");
  }

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInUserId");
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
}

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
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {
    wishlist: [],
  };
  let isFavorite = loggedInUser.wishlist.some((p) => p.id === product.id);
  let card = document.createElement("div");
  card.className = "col-6 col-md-3 mb-4";

  card.innerHTML = `
        <div class="card product-card">
            <div class="image-scale">
                 <button class="favorite-btn ${
                   isFavorite ? "active" : ""
                 }" data-id="${product.id}">
       <i class="bi ${isFavorite ? "bi-heart-fill" : "bi-heart"}"></i>
      </button>
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

  card.querySelector(".product-card").addEventListener("click", (e) => {
    if (!e.target.closest(".favorite-btn")) {
      window.location.href = `../product details/proDetails.html?id=${product.id}`;
    }
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
let minValueDesctop =document.getElementById("minValueDesctop");
let maxValueDesctop = document.getElementById("maxValueDesctop");
function filterfun() {
  let productList = document.getElementById("product-list");
  productList.innerHTML = "";

  let minValMob = minValue.value.trim();
  let maxValMob = maxValue.value.trim();
  let minValDesk =minValueDesctop.value.trim();
  let maxValDesk = maxValueDesctop.value.trim();
  if (minValMob === "" && maxValMob === ""  && minValDesk === "" && maxValDesk === "") {
    products.forEach((pro) => drowProduct(pro, productList));
    return;
  }
  minValMob = +minValMob || 0;
  maxValMob = +maxValMob || Infinity;

  minValDesk =+minValDesk ||0;
  maxValDesk =+ maxValDesk || Infinity;

let minVal = minValMob > 0 || maxValMob < Infinity ? minValMob : minValDesk;
let maxVal = minValMob > 0 || maxValMob < Infinity ? maxValMob : maxValDesk;

  if (minVal > maxVal) {
    productList.innerHTML = `<p class="text-danger text-center"> minimum value is greater than maximum value</p>`;
    return;
  }
  let filtered = products.filter(
    (pro) => pro.price >= minVal && pro.price <= maxVal
  );

  if (filtered.length > 0) {
    filtered.forEach((pro) => drowProduct(pro, productList));
  } else {
    productList.innerHTML = `<p class="text-muted text-center">No products found in this range</p>`;
  }
  let paginationContainer = document.getElementById("pagination");
  if (paginationContainer) paginationContainer.innerHTML = "";
}

// ===============Sort Function

// from min to max
var sortbtnMintoMAx = document.getElementById("sortbtnMintoMAx");

sortbtnMintoMAx.addEventListener("click", () => {
  let productList = document.getElementById("product-list");
  productList.innerHTML = "";

  let AllproductSorted = [];
  let categorySorted = [];
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");

  // لو مفيش category اعرض الكل
  if (!category) {
    AllproductSorted = products.slice();
    AllproductSorted.sort((a, b) => a.price - b.price);
    AllproductSorted.forEach((pro) => {
      drowProduct(pro, productList);
    });
  } else {
    categorySorted = products.filter((pro) => pro.category === category);
    console.log(categorySorted);

    categorySorted.sort((a, b) => a.price - b.price);
    categorySorted.forEach((pro) => {
      drowProduct(pro, productList);
    });
  }
});

// from max to min
var sortbtnMaxtoMin = document.getElementById("sortbtnMaxtoMin");

sortbtnMaxtoMin.addEventListener("click", () => {
  let productList = document.getElementById("product-list");
  productList.innerHTML = "";

  let AllproductSorted = [];
  let categorySorted = [];

  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");

  // if not categries display all
  if (!category) {
    AllproductSorted = products.slice();
    AllproductSorted.sort((a, b) => b.price - a.price);
    AllproductSorted.forEach((pro) => {
      drowProduct(pro, productList);
    });
  } else {
    categorySorted = products.filter((pro) => pro.category === category);
    console.log(categorySorted);

    categorySorted.sort((a, b) => b.price - a.price);
    categorySorted.forEach((pro) => {
      drowProduct(pro, productList);
    });
  }
});

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

// build favorite functionality

//update padge in favorite
// let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {
//   wishlist: [],
// };

function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("loggedInUser"));
}


// draw favorite in model
function renderFavoriteModal() {
  const favmodalbody = document.getElementById("favmodalbody");
  const user = getLoggedInUser();
  let favoriteLabel = document.getElementById("favoritelabel");
if (user && user.Email) {
  favoriteLabel.textContent = user.Email;
} else {
  favoriteLabel.textContent = "example@gmail.com";
}
  favmodalbody.innerHTML = "";

  if (!user || !user.wishlist || user.wishlist.length === 0) {
    var nofav = document.createElement("div");
    nofav.className = "nofavoritediv";
    nofav.innerHTML = `<h5>Love It? Add to My Favorites</h5>
      <p>My Favorites allows you to keep track of all of your favorites and shopping activity whether <br> 
        you're on your computer, phone, or tablet. You won't have to waste time searching all over <br>
         again for that item you loved on your phone the other day - it's all here in one place!</p>
         <button class="continueShop">Continue Shopping</button>
    `;
    favmodalbody.appendChild(nofav);
    document.querySelector(".continueShop").addEventListener("click", () => {
      window.location.href = "../products/products.html";
    });
    return;
  }
  let clearBtn = document.getElementById("clearBtn");
if (clearBtn) {
  clearBtn.replaceWith(clearBtn.cloneNode(true)); 
  clearBtn = document.getElementById("clearBtn");
  clearBtn.addEventListener("click", () => {
    let user = getLoggedInUser();
    user.wishlist = [];
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    renderFavoriteModal();
    updateFavBadge();
    document.querySelectorAll(".favorite-btn").forEach(btn => {
      btn.classList.remove("active");
      let icon = btn.querySelector("i");
      if (icon) {
        icon.classList.remove("bi-heart-fill");
        icon.classList.add("bi-heart");
      }
    });
  });
}



  const favdiv = document.createElement("div");
  favdiv.className = "favdiv";
  user.wishlist.forEach(product => {
    const card = document.createElement("div");
    card.className = "cardstyle";
    card.innerHTML = `
      <div class="card product-card">
       <div class="position-relative">
        <img src="${product.image}" class="card-img-top" alt="${product.name}">
        <button class="removeFavBtn btn btn-sm bg-white position-absolute top-0 end-0 m-2" data-id="${product.id}">
            <i class="bi bi-x-lg"></i>
          </button>
       </div>
        <div class="card-body text-center">
          <h5 class="producttitlefav">${product.name}</h5>
          <h4 class="newprice fw-bold text-danger">$${product.price}</h4>
          ${product.oldPrice ? `<h4 class="old-price text-secondary text-decoration-line-through">$${product.oldPrice}</h4>` : ""}
          <button class="btn btn-dark w-100 btnaddtocard" data-id="${product.id}">ADD TO CART</button>
        </div>
      </div>
    `;
    favdiv.appendChild(card);
  });
  favmodalbody.appendChild(favdiv);
document.querySelectorAll(".removeFavBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      user.wishlist = user.wishlist.filter(p => p.id !== id);
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      updateFavBadge();
      renderFavoriteModal();
            let favBtn = document.querySelector(`.favorite-btn[data-id="${id}"]`);
      if (favBtn) {
        favBtn.classList.remove("active");
        let icon = favBtn.querySelector("i");
        if (icon) {
          icon.classList.remove("bi-heart-fill");
          icon.classList.add("bi-heart");
        }
      }
    });
  
  });


}


// check if user logged in or not to access userData links
document.addEventListener("click", (e) => {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  let link = e.target.closest("a.userData");
  if (!link) return;
  if (!loggedInUser) {
    e.preventDefault();
    Swal.fire({
      title: "🔒 Login Required",
      text: "You must be logged in to access this page.",
      icon: "warning",
      showConfirmButton: true,
      confirmButtonText: "Go to Login",
    }).then(() => {
      window.location.href = "../Auth/log-in/login.html";
    });
  } else {
    window.location.href = link.href;
  }
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btnaddtocard")) {
    let productId = parseInt(e.target.getAttribute("data-id"));
    let loggedInUser = getLoggedInUser();
    let quantity = 1;

    if (!loggedInUser.cart) {
      loggedInUser.cart = [];
    }

    let productToAdd = products.find((p) => p.id === productId);

    if (productToAdd && !loggedInUser.cart.some((p) => p.id === productId)) {
      let productCopy = { ...productToAdd };
      productCopy.quantity = 1;
      loggedInUser.cart.push(productCopy);
    }

    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    updateCartBadge();

    window.location.href = "../cart/cart.html";
    console.log(loggedInUser.wishlist);
  }
});

// make check when reload favorite still exist
document.addEventListener("click", (e) => {
  let btn = e.target.closest(".favorite-btn");
  if (!btn) return;
  e.stopPropagation();
  let loggedInUser =getLoggedInUser();
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let id = parseInt(btn.getAttribute("data-id"));
  let product = products.find((p) => p.id === id);
  let icon = btn.querySelector("i");
  if (!product) return;

  let toastEl = document.getElementById("favToast");
  let toastBody = document.getElementById("favToastBody");
  let toast = new bootstrap.Toast(toastEl);

  if (loggedInUser.wishlist.some((p) => p.id === id)) {
    // remove from favorites
    loggedInUser.wishlist = loggedInUser.wishlist.filter((p) => p.id !== id);
    btn.classList.remove("active");
    icon.classList.remove("bi-heart-fill");
    icon.classList.add("bi-heart");

    toastBody.innerHTML = `<p class=" text-black text-center ">${product.name} has been removed from Favorites!`;
    toastEl.className =
      "opacity-100 toast align-items-center border-0 toaststyle";
  } else {
    // add to favorites
    loggedInUser.wishlist.push(product);
    btn.classList.add("active");
    icon.classList.remove("bi-heart");
    icon.classList.add("bi-heart-fill");

    toastBody.innerHTML = `<p class="text-black text-center "> ${product.name}  has been added to Favorites!</p>`;
    toastEl.className =
      "opacity-100 toast align-items-center  border-0 toaststyle";
  }

  // Update localStorage
  localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

  // Update the modal content
  renderFavoriteModal();

  updateFavBadge();

  // Show toast
  toast.show();
});
function updateFavBadge() {
    const favBadge = document.getElementById("favBadge");
  const user = getLoggedInUser();
  favBadge.textContent = user?.wishlist?.length || 0;
}

function updateCartBadge() {
const cartBadge = document.getElementById("cartbadge");
  const user = getLoggedInUser();
  cartBadge.textContent = user?.cart?.length || 0;
}
// display
updateFavBadge();
renderFavoriteModal();
updateCartBadge();
