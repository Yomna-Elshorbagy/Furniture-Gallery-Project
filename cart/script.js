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


  updateCartBadge();
});


// cart badge
function updateCartBadge() {
  let cartproducts = JSON.parse(localStorage.getItem("cartproducts")) || [];
  let cartBadge = document.getElementById("cartbadge");
  if (cartBadge) {
    cartBadge.textContent = cartproducts.length;
  }
}
// build cart body

let cartbody = document.getElementById("cartbody");
let cartproducts = JSON.parse(localStorage.getItem("cartproducts")) || [];

if (cartproducts.length === 0) {
  let noproductsdiv = document.createElement("div");
  noproductsdiv.className = "emptycart";
  noproductsdiv.innerHTML = `
    <h4 class="text-uppercase fw-light emptycarttitle">Your cart is empty</h4>
    <button class="emptycartbtn">Shop our products</button>`;
  cartbody.appendChild(noproductsdiv);
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
  let products = JSON.parse(localStorage.getItem("products"));

  function updateGrandTotal() {
    let totals = document.querySelectorAll("[id^='total-']");
    let total = 0;
    totals.forEach(cell => {
      total += parseFloat(cell.textContent.replace("$", ""));
    });
    document.getElementById("grand-total").textContent = `$${total}`;
  }

  cartproducts.forEach(id => {
    let product = products.find(p => p.id === id);
    if (product) {
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
            <span class="mx-2 quantity" id="quantity-${product.id}">1</span>
            <button class="btn btn-sm btn-outline-secondary plus-btn" data-id="${product.id}">+</button>
          </div>
          <button class="btn btn-link text-muted p-0 remove-btn mt-3" data-id="${product.id}">REMOVE</button>
        </td>
        <td class="text-end" id="total-${product.id}">$${product.price}</td>
      `;
      tbody.appendChild(row);
    }
  });

  let grandTotalDiv = document.createElement("div");
  grandTotalDiv.className = "text-end mt-3 alltotal";
  grandTotalDiv.innerHTML = ` Total: <span id="grand-total"></span>`;
  
  let divbtn = document.createElement("div");
  divbtn.className="d-flex flex-row justify-content-end checkoutbtn"
  let checkoutbtn= document.createElement("button");
  checkoutbtn.classList=" emptycartbtn ";
  checkoutbtn.textContent="CHECKOUT";

  divbtn.appendChild(checkoutbtn);

  tbody.addEventListener("click", function (event) {
    let btn = event.target.closest("button");
    if (!btn) return;

    let id = parseInt(btn.dataset.id);
    let product = products.find(p => p.id === id);

    if (btn.classList.contains("plus-btn") || btn.classList.contains("minus-btn")) {
      let quantitySpan = document.getElementById(`quantity-${id}`);
      let totalCell = document.getElementById(`total-${id}`);
      let quantity = parseInt(quantitySpan.textContent);

      if (btn.classList.contains("plus-btn")) {
        quantity++;
      } else if (btn.classList.contains("minus-btn") && quantity > 1) {
        quantity--;
      }

      quantitySpan.textContent = quantity;
      totalCell.textContent = `$${(product.price * quantity)}`;
      updateGrandTotal();
    }

    if (btn.classList.contains("remove-btn")) {
      cartproducts = cartproducts.filter(pid => pid !== id);
      localStorage.setItem("cartproducts", JSON.stringify(cartproducts));

      btn.closest("tr").remove();
      updateCartBadge();

      if (cartproducts.length === 0) {
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

  

  cartbody.appendChild(table);
  cartbody.appendChild(grandTotalDiv);
  cartbody.appendChild(divbtn);
  updateGrandTotal();
}

updateCartBadge();

