// const serverDataFiles = {
//    products: "../../server/data/products.json",
//   categories: "../../server/data/categories.json",
//   orders: "../../server/data/orders.json",
//   users: "../../server/data/users.json",
// };
// window.addEventListener("DOMContentLoaded", () => {
//   Object.entries(serverDataFiles).forEach(([key, url]) => {
//     if (!localStorage.getItem(key)) {
//       fetch(url)
//         .then((res) => res.json())
//         .then((data) => {
//           localStorage.setItem(key, JSON.stringify(data));
//           console.log(`${key} saved`, data);
//         })
//         .catch((err) =>
//           console.error(`Error loading ${key} from ${url}:`, err)
//         );
//     } else {
//       console.log(`${key} already in localStorage`);
//     }
    
//   });

//   let loginBtn = document.getElementById("loginBtn");
//   let logoutBtn = document.getElementById("logoutBtn");
//   loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

//   if (loggedInUser) {
//     // show logout, hide login
//     loginBtn.classList.add("d-none");
//     logoutBtn.classList.remove("d-none");

//   } else {
//     // show login, hide logout
//     loginBtn.classList.remove("d-none");
//     logoutBtn.classList.add("d-none");
//   }
//   logoutBtn.addEventListener("click", () => {
//     localStorage.removeItem("loggedInUser");
//     localStorage.removeItem("loggedInUserId");
//     Swal.fire({
//       title: "👋 Logged out",
//       text: "You have been logged out successfully.",
//       icon: "success",
//       timer: 2000,
//       showConfirmButton: false,
//     }).then(() => {
//       window.location.href = "../Auth/log-in/login.html";
//     });
//   });
//   // renderFavoriteModal();
//   updateCartBadge();
// });

// function getLoggedInUser() {
//   return JSON.parse(localStorage.getItem("loggedInUser"));
// }
// let products = JSON.parse(localStorage.getItem("products")) || [];

// let users = JSON.parse(localStorage.getItem("users")) || [];
// let loggedInUserId = localStorage.getItem("loggedInUserId");
// let loggedInUser =getLoggedInUser();
// let userIndex = users.findIndex((user) => user.ID === loggedInUserId);
//  loggedInUser = users[userIndex];

// function saveUsers() {
//   localStorage.setItem("users", JSON.stringify(users));
//   localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
//   localStorage.setItem("loggedInUserId", loggedInUser.ID);

// }

// let productList = document.getElementById("product-list");
// let homeproducts = products.slice(0, 8);
// homeproducts.forEach((product) => {
//   let card = document.createElement("div");
//   card.className = "col-6 col-md-3 mb-4";
//   loggedInUser = getLoggedInUser();
//   let isFavorite = loggedInUser.wishlist.some((p) => p.id === product.id);

//   card.innerHTML = `
//     <div class="card product-card homecardproduct">
//           <div class="image-scale">

//       <button class="favorite-btn ${isFavorite ? "active" : ""}" data-id="${
//     product.id
//   }">
//        <i class="bi ${isFavorite ? "bi-heart-fill" : "bi-heart"}"></i>
//       </button>
//       <img src="${product.image}" class="card-img-top" alt="${product.name}">
//       </div>
//      <div class="card-body text-center">
//   <h6 class=" card-title text-truncate">${product.name}</h6>
//   <div class="card-text mb-2">
//     <span class="newprice fw-bold">$${product.price}</span>
//     ${
//       product.oldPrice
//         ? `<span class="old-price text-secondary text-decoration-line-through">${product.oldPrice}</span>`
//         : ""
//     }
//   </div>
// </div>
//     </div>
//   `;

//   card.addEventListener("click", () => {
//     window.location.href = `/product%20details/proDetails.html?id=${product.id}`;
//   });

//   productList.appendChild(card);
// });

// ///////// add favorite button fuctionality
// let allfavoritebtn = document.querySelectorAll(".favorite-btn");

// function renderFavoriteModal() {
//   let favmodalbody = document.getElementById("favmodalbody");
//   let loggedInUser = getLoggedInUser();

//   favmodalbody.innerHTML = "";

//   if (loggedInUser != null &&loggedInUser.wishlist.length === 0) {
//     var nofav = document.createElement("div");
//     nofav.className = "nofavoritediv";
//     nofav.innerHTML = `
//       <h5>Love It? Add to My Favorites</h5>
//       <p>My Favorites allows you to keep track of all of your favorites and shopping activity whether <br> 
//         you're on your computer, phone, or tablet. You won't have to waste time searching all over <br>
//          again for that item you loved on your phone the other day - it's all here in one place!</p>
//          <button class="continueShop">Continue Shopping</button>
//     `;
//     favmodalbody.appendChild(nofav);
//     let shopBtn = document.querySelector(".continueShop");
//     if (shopBtn) {
//       shopBtn.addEventListener("click", () => {
//         window.location.href = "../products/products.html";
//       });
//     }
//   } else if (loggedInUser !=null && loggedInUser .wishlist.length > 0) {
//     let favdiv = document.createElement("div");
//     favdiv.className = "favdiv";
//     loggedInUser.wishlist.forEach((product) => {
//       let card = document.createElement("div");
//       card.className = "cardstyle";
//       card.innerHTML = `
//         <div class="card product-card">
//           <img src="${product.image}" class="card-img-top" alt="${
//         product.name
//       }">
//           <div class="card-body text-center ">
//             <div class="d-flex flex-column text-start mb-0">
//               <h5 class=" text-truncate producttitlefav">${product.name}</h5>
//               <h4 class="card-text">
//                 <h4 class="newprice fw-bold text-danger">$${product.price}</h4>
//                 ${
//                   product.oldPrice
//                     ? `<h4 class="old-price  text-secondary text-decoration-line-through">${product.oldPrice}</h4>`
//                     : ""
//                 }
//               </h4>
//             </div>
//             <button class="btn btn-dark w-100 btnaddtocard" data-id="${
//               product.id
//             }">ADD TO CART</button>
//           </div>
//         </div>
//       `;
//       favdiv.appendChild(card);
//     });
//     favmodalbody.appendChild(favdiv);
//   }
// }

// //go to cart

// document.addEventListener("click", function (e) {
//   if (e.target.classList.contains("btnaddtocard")) {
//     let productId = parseInt(e.target.getAttribute("data-id"));
//     let quantity = 1;

//     if (!loggedInUser.cart) {
//       loggedInUser.cart = [];
//     }

//     let productToAdd = products.find((p) => p.id === productId);

//     if (productToAdd && !loggedInUser.cart.some((p) => p.id === productId)) {
//       let productCopy = { ...productToAdd };
//       productCopy.quantity = 1;
//       loggedInUser.cart.push(productCopy);
//     }

//     saveUsers();
//     updateCartBadge();
//     updateFavBadge();

//     window.location.href = "../cart/cart.html";
//     console.log(loggedInUser.wishlist);
//   }
// });

// let favoriteLabel = document.getElementById("favoritelabel");
// if (loggedInUser && loggedInUser.Email) {
//   favoriteLabel.textContent = loggedInUser.Email;
// } else {
//   favoriteLabel.textContent = "example@gmail.com";
// }

// // if user Not logged in redirect him to login page
// document.addEventListener("click", (e) => {
//   let link = e.target.closest("a.userData");
//   if (!link) return;
//   let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
//   if (!loggedInUser) {
//     e.preventDefault();
//     Swal.fire({
//       title: "🔒 Login Required",
//       text: "You must be logged in to access this page.",
//       icon: "warning",
//       showConfirmButton: true,
//       confirmButtonText: "Go to Login",
//     }).then(() => {
//       window.location.href = "../Auth/log-in/login.html";
//     });
//   } else {
//     window.location.href = link.href;
//   }
// });

// // update favorite badge
// let favBadge = document.getElementById("favBadge");

// function updateFavBadge() {
//   let loggedInUser = getLoggedInUser();
//  if(loggedInUser &&loggedInUser.wishlist && loggedInUser.wishlist.length>0){
// favBadge.textContent = loggedInUser.wishlist.length;
//     console.log(loggedInUser.wishlist);
//  }else if(!loggedInUser){
//   favBadge.textContent = 0 ;
//   }else{
//     favBadge.textContent =0;
//   }

// }
// updateFavBadge();
// allfavoritebtn.forEach((btn) => {
//   let id = parseInt(btn.getAttribute("data-id"));
//   let icon = btn.querySelector("i");
//   let isFavorite = loggedInUser.wishlist.some((p) => p.id === id);

//   if (isFavorite) {
//     btn.classList.add("active");
//     icon.classList.remove("bi-heart");
//     icon.classList.add("bi-heart-fill");
//   }

//   btn.addEventListener("click", (e) => {
//     e.stopPropagation();

//     let toastEl = document.getElementById("favToast");
//     let toastBody = document.getElementById("favToastBody");
//     let toast = new bootstrap.Toast(toastEl);
//     let product = products.find((p) => p.id === id);

//     let inWishlist = loggedInUser.wishlist.some((p) => p.id === id);

//     if (inWishlist) {
//       // remove from favorites
//       loggedInUser.wishlist = loggedInUser.wishlist.filter((p) => p.id !== id);
//       btn.classList.remove("active");
//       icon.classList.remove("bi-heart-fill");
//       icon.classList.add("bi-heart");

//       toastBody.innerHTML = `<p class=" text-black text-center ">${product.name} has been removed from Favorites!`;
//       toastEl.className =
//         "opacity-100 toast align-items-center border-0 toaststyle";
//     } else {
//       // add to favorites
//       loggedInUser.wishlist.push(product);
//       btn.classList.add("active");
//       icon.classList.remove("bi-heart");
//       icon.classList.add("bi-heart-fill");

//       toastBody.innerHTML = `<p class="text-black text-center "> ${product.name}  has been added to Favorites!</p>`;
//       toastEl.className =
//         "opacity-100 toast align-items-center  border-0 toaststyle";
//     }

//     // Update localStorage
//     saveUsers();
//     // Update the modal content
//     renderFavoriteModal();

//     updateFavBadge();

//     // Show toast
//     toast.show();
//   });
// });
// function updateCartBadge() {
//   let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {
//     cart: [],
//   };
//   let cartBadge = document.getElementById("cartbadge");
//   if (cartBadge) {
//     cartBadge.textContent = loggedInUser.cart.length;
//   }
// }

// renderFavoriteModal();

// // ===>redirect to products page with category query
// function goToCategory(categoryName) {
//   window.location.href = `../products/products.html?category=${encodeURIComponent(
//     categoryName
//   )}`;
// }

// تحميل البيانات من السيرفر وتخزينها محليًا
const serverDataFiles = {
  products: "../../server/data/products.json",
  categories: "../../server/data/categories.json",
  orders: "../../server/data/orders.json",
  users: "../../server/data/users.json",
};

window.addEventListener("DOMContentLoaded", () => {
  Object.entries(serverDataFiles).forEach(([key, url]) => {
    if (!localStorage.getItem(key)) {
      fetch(url)
        .then(res => res.json())
        .then(data => localStorage.setItem(key, JSON.stringify(data)))
        .catch(err => console.error(`Error loading ${key}:`, err));
    }
  });

  handleAuthButtons();
  renderProducts();
  renderFavoriteModal();
  updateCartBadge();
  updateFavBadge();
});

function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("loggedInUser"));
}

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

function renderProducts() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const productList = document.getElementById("product-list");
  const user = getLoggedInUser() || { wishlist: [] };

  const homeproducts = products.slice(0, 8);
  homeproducts.forEach(product => {
    const isFavorite = user.wishlist?.some(p => p.id === product.id);
    const card = document.createElement("div");
    card.className = "col-6 col-md-3 mb-4";
    card.innerHTML = `
      <div class="card product-card homecardproduct">
        <div class="image-scale">
          <button class="favorite-btn ${isFavorite ? "active" : ""}" data-id="${product.id}">
            <i class="bi ${isFavorite ? "bi-heart-fill" : "bi-heart"}"></i>
          </button>
          <img src="${product.image}" class="card-img-top" alt="${product.name}">
        </div>
        <div class="card-body text-center">
          <h6 class="card-title text-truncate">${product.name}</h6>
          <div class="card-text mb-2">
            <span class="newprice fw-bold">$${product.price}</span>
            ${product.oldPrice ? `<span class="old-price text-secondary text-decoration-line-through">${product.oldPrice}</span>` : ""}
          </div>
        </div>
      </div>
    `;
    card.addEventListener("click", () => {
      window.location.href = `/product%20details/proDetails.html?id=${product.id}`;
    });
    productList.appendChild(card);
  });

  setupFavoriteButtons(products);
}

function renderFavoriteModal() {
  const favmodalbody = document.getElementById("favmodalbody");
  const user = getLoggedInUser();
  favmodalbody.innerHTML = "";

  if (!user || !user.wishlist || user.wishlist.length === 0) {
    favmodalbody.innerHTML = `
      <div class="nofavoritediv">
        <h5>Love It? Add to My Favorites</h5>
        <p>Track your favorite items across devices.</p>
        <button class="continueShop">Continue Shopping</button>
      </div>
    `;
    document.querySelector(".continueShop").addEventListener("click", () => {
      window.location.href = "../products/products.html";
    });
    return;
  }

  const favdiv = document.createElement("div");
  favdiv.className = "favdiv";
  user.wishlist.forEach(product => {
    const card = document.createElement("div");
    card.className = "cardstyle";
    card.innerHTML = `
      <div class="card product-card">
        <img src="${product.image}" class="card-img-top" alt="${product.name}">
        <div class="card-body text-center">
          <h5 class="producttitlefav">${product.name}</h5>
          <h4 class="newprice fw-bold text-danger">$${product.price}</h4>
          ${product.oldPrice ? `<h4 class="old-price text-secondary text-decoration-line-through">${product.oldPrice}</h4>` : ""}
          <button class="btn btn-dark w-100 btnaddtocard" data-id="${product.id}">ADD TO CART</button>
        </div>
      </div>
    `;
    favdiv.appendChild(card);
  });
  favmodalbody.appendChild(favdiv);
}

document.addEventListener("click", e => {
  if (e.target.classList.contains("btnaddtocard")) {
    const productId = parseInt(e.target.getAttribute("data-id"));
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const product = products.find(p => p.id === productId);
    const user = getLoggedInUser();

    if (!user) {
      Swal.fire({
        title: "🔒 Login Required",
        text: "You must be logged in to add items to your cart.",
        icon: "warning",
        confirmButtonText: "Go to Login",
      }).then(() => {
        window.location.href = "../Auth/log-in/login.html";
      });
      return;
    }

    if (!user.cart) user.cart = [];
    if (!user.cart.some(p => p.id === productId)) {
      user.cart.push({ ...product, quantity: 1 });
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const index = users.findIndex(u => u.ID === user.ID);
    users[index] = user;
    saveUsers(users, user);
    updateCartBadge();
    updateFavBadge();
    window.location.href = "../cart/cart.html";
  }
});

function setupFavoriteButtons(products) {
  const buttons = document.querySelectorAll(".favorite-btn");
  const user = getLoggedInUser();

  buttons.forEach(btn => {
    const id = parseInt(btn.getAttribute("data-id"));
    const icon = btn.querySelector("i");

    btn.addEventListener("click", e => {
      e.stopPropagation();

      if (!user) {
        Swal.fire({
          title: "🔒 Login Required",
          text: "You must be logged in to add favorites.",
          icon: "warning",
          confirmButtonText: "Go to Login",
        }).then(() => {
          window.location.href = "../Auth/log-in/login.html";
        });
        return;
      }

      const product = products.find(p => p.id === id);
      const inWishlist = user.wishlist.some(p => p.id === id);
let toastEl = document.getElementById("favToast");
  let toastBody = document.getElementById("favToastBody");
  let toast = new bootstrap.Toast(toastEl);
      if (inWishlist) {
        user.wishlist = user.wishlist.filter(p => p.id !== id);
        btn.classList.remove("active");
        icon.classList.replace("bi-heart-fill", "bi-heart");
         toastBody.innerHTML = `<p class=" text-black text-center ">${product.name} has been removed from Favorites!`;
    toastEl.className =
      "opacity-100 toast align-items-center border-0 toaststyle";
      } else {
        user.wishlist.push(product);
        btn.classList.add("active");
        icon.classList.replace("bi-heart", "bi-heart-fill");
        toastBody.innerHTML = `<p class="text-black text-center "> ${product.name}  has been added to Favorites!</p>`;
    toastEl.className =
      "opacity-100 toast align-items-center  border-0 toaststyle";
      }


      const users = JSON.parse(localStorage.getItem("users")) || [];
      const index = users.findIndex(u => u.ID === user.ID);
      users[index] = user;
      saveUsers(users, user);
      renderFavoriteModal();
      updateFavBadge();
      toast.show();
    });
  });
}

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
