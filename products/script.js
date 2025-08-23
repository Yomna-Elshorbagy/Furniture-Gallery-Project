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
      showConfirmButton: false
    }).then(() => {
      window.location.href = "../Auth/log-in/login.html";
    });
  });
});



// draw all categorys 


window.addEventListener("DOMContentLoaded", () => {
  fetch("../server/data/products.json")
    .then(res => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then(prod => {
      // حفظ البيانات
      localStorage.setItem("products", JSON.stringify(prod));
      // عرض المنتجات
      displayProducts(prod);
    })
    .catch(error => console.error("Error fetch JSON data: ", error));
});


products = JSON.parse(localStorage.getItem("products"))


// دالة عرض المنتجات حسب الكاتيجوري أو كلها
function displayProducts(products) {
  let productList = document.getElementById("product-list");
  productList.innerHTML = ""; // مسح القديم قبل ما نرسم جديد

  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");

  products.forEach(product => {
    // لو مفيش category اعرض الكل
    if (!category || product.category === category) {
      drowProduct(product, productList);
    }
  });
}

// دالة رسم الكارت
function drowProduct(product, productList) {
  let card = document.createElement("div");
  card.className = "col-6 col-md-3 mb-4";

  card.innerHTML = `
        <div class="card product-card">
            <div class="image-scale">
                
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
            </div>
            <div class="card-body">
                <h6 class="card-title text-start">${product.name}</h6>
                <p class="card-text text-start">
                    <span class="newprice ">$${product.price}</span>
                    ${product.oldPrice
      ? `<span class="old-price ms-2 text-secondary">${product.oldPrice}</span>`
      : ""}
                </p>
            </div>
        </div>
    `;

  // عند الضغط على الكارت نروح للمنتج
  card.addEventListener("click", () => {
    window.location.href = `#${product.id}`;
  });

  productList.appendChild(card);
}

// دالة تغيير الكاتيجوري في الرابط
function openCategory(categoryName) {
  window.location.href = `?category=${categoryName}`;
}


// Search function

var input = document.getElementById("categorySearch")
function opensearchfun() {
  if (input.classList.contains("d-none")) {

    input.classList.remove("d-none")
  } else {

    input.classList.add("d-none")
  }
}
function searchfun(name) {


  let productList = document.getElementById("product-list");
  productList.innerHTML = "";

  let results = products.filter(product =>
    product.name.toLowerCase().includes(name)
  );

  if (results.length > 0) {
    results.forEach(product => drowProduct(product, productList));
  } else {
    productList.innerHTML = `<p class="text-center text-muted">No products found</p>`;
  }
}
input.addEventListener("keyup", (e) => {
  searchfun(e.target.value.toLowerCase())
})


//Felter function

let minValue = document.getElementById("minValue")
let maxValue = document.getElementById("maxValue")

minValue.addEventListener("blur", () => {
  min = minValue.value
})
maxValue.addEventListener("blur", () => {
  max = maxValue.value
})


function filterfun() {
  // console.log(e)
  let productList = document.getElementById("product-list");
  productList.innerHTML = "";

  console.log(+min);
  console.log(+max);

  products.forEach((pro) => {

    if (pro.price > +min && pro.price < +max) {
      console.log(pro.price);
      drowProduct(pro, productList)
    }
  })

  if (productList.innerText.length == 0) {
    productList.innerHTML = "There are no product";
  }
}