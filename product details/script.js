// handel logged in and logged out
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

// product details section
let product = {
  id: 1,
  name: "Valletta 3 Seater with Chaise - Mystique Heritage",
  price: "3998",
  oldPrice: "6798",
  category: "living",
  stock: 30,
  description:
    "Elevated comfort meets timeless elegance in the Valletta 3 Seater with Chaise — a luxurious modular lounge designed for modern living with classic taste.",
  image:
    "https://thefurnituregallery.com.au/cdn/shop/files/Hero_33f2069c-7716-4b98-ad54-4fb936923eb8_1800x1800.png?v=1754888318",
  subImages: [
    "https://thefurnituregallery.com.au/cdn/shop/files/G1A4479_1800x1800.jpg?v=1754888390",
    "https://thefurnituregallery.com.au/cdn/shop/files/G1A4429_1800x1800.jpg?v=1754888740",
    "https://thefurnituregallery.com.au/cdn/shop/files/G1A4446_1800x1800.jpg?v=1754888740",
  ],
  dimensions: {
    width: "178cm",
    height: "183cm",
    length: "278cm",
  },
};

// =====> get product details
document.getElementById("details").innerHTML = `
      <h2 class="fw-bold">${product.name}</h2>
      <p>
        <span class="old-price me-2">$${product.oldPrice}</span> 
        <span class="text-color fs-4 fw-bold">$${product.price}</span>
      </p>
      <p class="text-muted">${product.description}</p>
      <p><strong>In Stock:</strong> ${product.stock}</p>
        <div class="d-flex align-items-center mb-3">
        <button class="btn btn-outline-secondary me-2" id="decrease">-</button>
        <input type="text" id="quantity" value="1" class="form-control text-center" style="width:70px;" readonly>
        <button class="btn btn-outline-secondary ms-2" id="increase">+</button>
      </div>
      <button class="btn btn-dark w-100 mb-2 mt-2 py-2 " id="gotocart">Add to Cart</button>
      <button class="btn btn-outline-secondary btnHover w-100 mt-2 py-2">ADD TO WISHLIST</button>
      <button class="btn btn-outline-secondary btnHover w-100 mt-2 py-2">FIND IN STORES</button>
      <button class="btn btn-outline-secondary btnHover w-100 mt-2 py-2">Ask A QUESTIONS</button>
      <button class="btn btn-outline-secondary btnHover w-100 mt-2 py-2">GET DELEVERY ESTIMATE</button>

       <div class="accordion py-3" id="accordionExample">
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
              <i class="fa-solid fa-ruler me-2"></i> Dimensions
            </button>
          </h2>
          <div id="collapseOne" class="accordion-collapse collapse">
            <div class="accordion-body">
              <p><i class="fa-solid fa-arrows-left-right me-2"></i> <strong>Width:</strong> ${product.dimensions.width}</p>
              <p><i class="fa-solid fa-arrows-up-down me-2"></i> <strong>Height:</strong> ${product.dimensions.height}</p>
              <p><i class="fa-solid fa-up-right-and-down-left-from-center me-2"></i> <strong>Length:</strong> ${product.dimensions.length}</p>
            </div>
          </div>
        </div>
      </div>

        <div class="social-icons mb-4">
        <span class="fw-bold d-block mb-2">Share:</span>
        <a href="#"><i class="fab fa-facebook"></i></a>
        <a href="#"><i class="fab fa-twitter"></i></a>
        <a href="#"><i class="fab fa-pinterest"></i></a>
        <a href="#"><i class="fab fa-whatsapp"></i></a>
        <a href="#"><i class="fab fa-linkedin"></i></a>
        <a href="#"><i class="fab fa-instagram"></i></a>
      </div>
    `;

    
//====> get main image
document.getElementById("mainImage").innerHTML = `
      <img src="${product.image}" id="currentImage" class="img-fluid shadow-sm" />
    `;

// ====> get sub-images
let subImagesContainer = document.getElementById("subImages");
product.subImages.forEach((img) => {
  let wrapper = document.createElement("div");
  wrapper.classList.add("blockCont");
  wrapper.classList.add("sub-image-wrapper");
  let imgEl = document.createElement("img");
  imgEl.src = img;
  imgEl.classList.add("img-fluid", "shadow-md");
  imgEl.addEventListener("click", () => {
    document.getElementById("currentImage").src = img;
  });
  wrapper.appendChild(imgEl);
  subImagesContainer.appendChild(wrapper);
});

// ===> counter logic
let quantityInput = document.getElementById("quantity");
let increaseBtn = document.getElementById("increase");
let decreaseBtn = document.getElementById("decrease");

increaseBtn.addEventListener("click", () => {
  let current = Number(quantityInput.value);
  if (current < product.stock) {
    quantityInput.value = current + 1;
  }
});

decreaseBtn.addEventListener("click", () => {
  let current = Number(quantityInput.value);
  if (current > 1) {
    quantityInput.value = current - 1;
  }
});


// go to cart page

document.getElementById("gotocart").addEventListener("click",function(){
  let caertarr=[];
  let productId= product.id;
  caertarr.push(productId);
  localStorage.setItem("cartproducts",JSON.stringify(caertarr));
  window.location.href ="../cart/cart.html";
});