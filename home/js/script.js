let homeProducts = [
  {
    id: 1,
    name: "Clove Console Table",
    price: "700",
    oldPrice: null,
    image:
      "https://thefurnituregallery.com.au/cdn/shop/files/G1A4277_800x.jpg?v=1752558496",
  },
  {
    id: 2,
    name: "Seville Nest of Coffee Tables",
    price: "899",
    oldPrice: "$1599",
    image:
      "https://thefurnituregallery.com.au/cdn/shop/files/G1A4111_800x.jpg?v=1754356774",
  },
  {
    id: 3,
    name: "Reeves 6 Seater with Ottoman - Exclusive Cobblestone",
    price: "6198",
    oldPrice: "$10296",
    image:
      "https://thefurnituregallery.com.au/cdn/shop/files/Hero_5310cd76-5b6b-4368-9f9d-ce5ebc820ba5_800x.png?v=1753264119",
  },
  {
    id: 4,
    name: "Allure Bed with Drawers",
    price: "1399",
    oldPrice: "$1999",
    image:
      "https://thefurnituregallery.com.au/cdn/shop/files/G1A3666copy_800x.jpg?v=1753456616",
  },
  {
    id: 5,
    name: "Coco Dining Chair",
    price: "299",
    oldPrice: "$399",
    image:
      "https://thefurnituregallery.com.au/cdn/shop/files/G1A4176_3_800x.jpg?v=1752558760",
  },
  {
    id: 6,
    name: "Juni 2400 Dining Table - White",
    price: "3699",
    oldPrice: "$7699",
    image:
      "https://thefurnituregallery.com.au/cdn/shop/files/IMG_7996_800x.jpg?v=1752561036",
  },
  {
    id: 7,
    name: "Nolan Bedside Table - Oak",
    price: "499",
    oldPrice: "$599",
    image:
      "https://thefurnituregallery.com.au/cdn/shop/files/G1A3791_800x.jpg?v=1752711759",
  },
  {
    id: 8,
    name: "Florabelle Arm Chair - Cookie",
    price: "1699",
    oldPrice: "$2399",
    image:
      "https://thefurnituregallery.com.au/cdn/shop/files/G1A3826_800x.jpg?v=1753852623",
  },
];

localStorage.setItem("homeproducts", JSON.stringify(homeProducts));
let products = JSON.parse(localStorage.getItem("homeproducts"));
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

let productList = document.getElementById("product-list");

products.forEach((product) => {
  let card = document.createElement("div");
  card.className = "col-6 col-md-3 mb-4";
  let isFavorite = favorites.includes(product.id);

  card.innerHTML = `
    <div class="card product-card">
          <div class="image-scale">

      <button class="favorite-btn ${isFavorite ? "active" : ""}" data-id="${
    product.id
  }">
       <i class="bi ${isFavorite ? "bi-heart-fill" : "bi-heart"}"></i>
      </button>
      <img src="${product.image}" class="card-img-top" alt="${product.name}">
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

  card.addEventListener("click", () => {
    window.location.href = `#${product.id}`;
  });

  productList.appendChild(card);
});
let allfavoritebtn = document.querySelectorAll(".favorite-btn");
// هنا بعمل check علشان لما اعمل reload  favorite products تبقي موجوده
allfavoritebtn.forEach((btn) => {
  let id = parseInt(btn.getAttribute("data-id"));
  let icon = btn.querySelector("i");

  if (favorites.includes(id)) {
    btn.classList.add("active");
    icon.classList.remove("bi-heart");
    icon.classList.add("bi-heart-fill");
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    if (favorites.includes(id)) {
      favorites = favorites.filter((f) => f !== id);
      btn.classList.remove("active");
      icon.classList.remove("bi-heart-fill");
      icon.classList.add("bi-heart");
    } else {
      favorites.push(id);
      btn.classList.add("active");
      icon.classList.remove("bi-heart");
      icon.classList.add("bi-heart-fill");
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));

    let favoriteProducts = products.filter((p) => favorites.includes(p.id));
    localStorage.setItem("favoriteProducts", JSON.stringify(favoriteProducts));
  });
});
