let loggedInUser;
document.addEventListener("DOMContentLoaded", () => {
  let loginBtn = document.getElementById("loginBtn");
  let logoutBtn = document.getElementById("logoutBtn");
  loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

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
    updateCartBadge();
updateFavBadge();
renderFavoriteModal();
});

// cart badge
function updateCartBadge() {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  let cartproducts = loggedInUser.cart;
  let cartBadge = document.getElementById("cartbadge");
  if (cartBadge) {
    cartBadge.textContent = cartproducts.length;
  }
}
// build cart body

let cartbody = document.getElementById("cartbody");
loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || { cart: [] };
let cartproducts = loggedInUser.cart;

if (cartproducts.length === 0) {
  let noproductsdiv = document.createElement("div");
  noproductsdiv.className = "emptycart";
  noproductsdiv.innerHTML = `
    <h4 class="text-uppercase fw-light emptycarttitle">Your cart is empty</h4>
    <button class="emptycartbtn">Shop our products</button>`;
  cartbody.appendChild(noproductsdiv);

  let shopBtn = document.querySelector(".emptycartbtn");
  if (shopBtn) {
    shopBtn.addEventListener("click", () => {
      window.location.href = "../products/products.html";
    });
  }
} else {
  let carttitle = document.createElement("h4");
  carttitle.className = "emptycarttitle";
  carttitle.textContent = " CART DETAILS ";
  cartbody.appendChild(carttitle);

  let table = document.createElement("table");
  table.className = "table text-start";
  table.innerHTML = `
    <thead>
      <tr class="theadstyle">
        <th>Product</th>
        <th class="text-center">Quantity</th>
        <th class="text-end">Total</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  let tbody = table.querySelector("tbody");

  function updateGrandTotal() {
    let totals = document.querySelectorAll("[id^='total-']");
    let total = 0;
    totals.forEach((cell) => {
      total += parseFloat(cell.textContent.replace("$", ""));
    });
    document.getElementById("grand-total").textContent = `$${total}`;
  }

  cartproducts.forEach((product) => {
    let row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <div class="d-flex align-items-center">
          <img src="${product.image}" alt="${product.name}" class="me-3" style="width:80px; height:80px; object-fit:cover;">
          <div>
            <h6 class="mb-1 fw-light">${product.name}</h6>
            <p class="mb-0 text-muted">$${product.price}</p>
          </div>
        </div>
      </td>
      <td class="text-center">
        <div class="d-flex justify-content-center align-items-center">
          <button class="btn btn-sm btn-outline-secondary minus-btn" data-id="${product.id}">-</button>
          <span class="mx-2 quantity" id="quantity-${product.id}">${product.quantity}</span>
          <button class="btn btn-sm btn-outline-secondary plus-btn" data-id="${product.id}">+</button>
        </div>
        <button class="btn btn-link text-muted p-0 remove-btn mt-3" data-id="${product.id}">REMOVE</button>
      </td>
      <td class="text-end" id="total-${product.id}">$${product.price * product.quantity}</td>
    `;
    tbody.appendChild(row);
  });

  tbody.addEventListener("click", function (event) {
    let btn = event.target.closest("button");
    if (!btn) return;

    let id = parseInt(btn.dataset.id);
    let product = loggedInUser.cart.find(p => p.id === id);
    if (!product) return;

    let quantitySpan = document.getElementById(`quantity-${id}`);
    let totalCell = document.getElementById(`total-${id}`);
    let quantity = parseInt(quantitySpan.textContent);

    if (btn.classList.contains("plus-btn")) quantity++;
    if (btn.classList.contains("minus-btn") && quantity > 1) quantity--;

    if (btn.classList.contains("plus-btn") || btn.classList.contains("minus-btn")) {
      quantitySpan.textContent = quantity;
      totalCell.textContent = `$${product.price * quantity}`;
       product.quantity = quantity;
         localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

      updateGrandTotal();
    }

    if (btn.classList.contains("remove-btn")) {
      loggedInUser.cart = loggedInUser.cart.filter(p => p.id !== id);
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
      btn.closest("tr").remove();
      updateCartBadge();

      if (loggedInUser.cart.length === 0) {
        cartbody.innerHTML = "";
        let noproductsdiv = document.createElement("div");
        noproductsdiv.className = "emptycart";
        noproductsdiv.innerHTML = `
          <h4 class="text-uppercase fw-light emptycarttitle">Your cart is empty</h4>
          <button class="emptycartbtn">Shop our products</button>`;
        cartbody.appendChild(noproductsdiv);
      } else {
        updateGrandTotal();
      }
    }
  });

  let grandTotalDiv = document.createElement("div");
  grandTotalDiv.className = "text-end mt-3 alltotal";
  grandTotalDiv.innerHTML = ` Total: <span id="grand-total"></span>`;
  cartbody.appendChild(table);
  cartbody.appendChild(grandTotalDiv);
  updateGrandTotal();

  let checkoutdiv =document.createElement("div");
  checkoutdiv.className ="d-flex flex-row justify-content-end"

  let checkoutBtn = document.createElement("button");
  checkoutBtn.className="btn checkoutbtn emptycartbtn my-3";
  checkoutBtn.textContent ="CHECKOUT ";
  checkoutdiv.appendChild(checkoutBtn);
  cartbody.appendChild(checkoutdiv);
}

function renderFavoriteModal() {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || { wishlist: [] };

  let favmodalbody = document.getElementById("favmodalbody");
  favmodalbody.innerHTML = "";

  if (loggedInUser.wishlist.length === 0) {
    var nofav = document.createElement("div");
    nofav.className = "nofavoritediv";
    nofav.innerHTML = `
      <h5>Love It? Add to My Favorites</h5>
      <p>My Favorites allows you to keep track of all of your favorites and shopping activity whether <br> 
        you're on your computer, phone, or tablet. You won't have to waste time searching all over <br>
         again for that item you loved on your phone the other day - it's all here in one place!</p>
         <button class="continueShop">Continue Shopping</button>
    `;
    favmodalbody.appendChild(nofav);
    let shopBtn = document.querySelector(".continueShop");
    if (shopBtn) {
      shopBtn.addEventListener("click", () => {
        window.location.href = "../products/products.html";
      });
    }
  } else {
    let favdiv = document.createElement("div");
    favdiv.className = "favdiv";
    loggedInUser.wishlist.forEach((product) => {
      let card = document.createElement("div");
      card.className = "cardstyle";
      card.innerHTML = `
        <div class="card product-card">
          <img src="${product.image}" class="card-img-top" alt="${product.name
        }">
          <div class="card-body text-center ">
            <div class="d-flex flex-column text-start mb-0">
              <h5 class=" text-truncate producttitlefav">${product.name}</h5>
              <h4 class="card-text">
                <h4 class="newprice fw-bold text-danger">$${product.price}</h4>
                ${product.oldPrice
          ? `<h4 class="old-price  text-secondary text-decoration-line-through">${product.oldPrice}</h4>`
          : ""
        }
              </h4>
            </div>
            <button class="btn btn-dark w-100 btnaddtocard" data-id="${product.id
        }">ADD TO CART</button>
          </div>
        </div>
      `;
      favdiv.appendChild(card);
    });
    favmodalbody.appendChild(favdiv);
  }
}
document.addEventListener("click", function (e) {
  let loggedInUser =JSON.parse(localStorage.getItem("loggedInUser"))||[];
  if (e.target.classList.contains("btnaddtocard")) {
    let products =JSON.parse(localStorage.getItem("products"))
    let productId = parseInt(e.target.getAttribute("data-id"));

    let quantity = 1;

    if (!loggedInUser.cart) {
      loggedInUser.cart = [];
    }

    // هات المنتج نفسه من الـ products
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

let favBadge = document.getElementById("favBadge");

function updateFavBadge() {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || { wishlist: [] };

  favBadge.textContent =
    loggedInUser.wishlist.length > 0 ? loggedInUser.wishlist.length : 0;
}


function updateCartBadge() {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))|| { cart: [] };

  let cartBadge = document.getElementById("cartbadge");
  if (cartBadge) {
    cartBadge.textContent = loggedInUser.cart.length;
  }
}



