# 🛋️ Furniture Gallery Project

A responsive and modern furniture e-commerce web application built with **HTML, CSS, and JavaScript**.  
It includes features for **users, sellers, and admins**, making it a complete platform for exploring, managing, and selling furniture products.

---

## 📂 Project Structure

```
Furniture-Gallery-Project/
│── .vscode/               # VSCode settings
│── Auth/                  # Authentication (Signup & Signin)
│   ├── log-in/
├── ├── ├── images
│   │   ├── login.html
│   │   ├── style.css
│   │   └── script.js
│   └── signup/
├──     ├── images
│       ├── signup.html
│       ├── style.css
│       └── script.js
│── home/                  # Home page
├── ├── images
│   ├── home.html
│   ├── style.css
│   └── script.js
│── products/              # Products listing page
├── ├── images
│   ├── products.html
│   ├── style.css
│   └── script.js
│── cart/                  # Shopping cart
├── ├── images
│   ├── cart.html
│   ├── style.css
│   └── script.js
│── checkout/              # Checkout page
├── ├── images
│   ├── checkout.html
│   ├── style.css
│   └── script.js
│── contact-us/            # Contact page
├── ├── images
│   ├── contact.html
│   ├── style.css
│   └── script.js
│── dashboard/             # Admin dashboard
├── ├── images
├── ├── pages              # contain folder for each targeted element with its functionality
│   ├── dashboard.html
│   ├── style.css
│   └── script.js
│── seller dashboard/      # Seller dashboard
├── ├── images
├── ├── pages              # contain folder for each targeted element with its functionality
│   ├── seller.html
│   ├── style.css
│   └── script.js
│── findStore/             # Store locations and client reviews
├── ├── images
│   ├── findStore.html
│   ├── style.css
│   └── script.js
│── about/                  # About page
├── ├── images
│   ├── about.html
│   ├── style.css
│   └── script.js
│── product details/       # Product details page
├── ├── images
│   ├── productDetails.html
│   ├── style.css
│   └── script.js
│── profile/               # User profile page
├── ├── images
│   ├── profile.html
│   ├── style.css
│   └── script.js
│── server/data/           # JSON/mock data for products
│   ├── products.json
│   ├── categories.json
│   ├── orders.json
│   ├── users.json
│── index.html             # Main entry point
```

---

## 🚀 Features

### 👤 Authentication

- User **Signup** & **Signin**
- Validation & error handling
- Bcrypted password for security
- oAuth Google Log in for secure Authentication

### 👤 Authorization

- Each user has role (admin - seller - user)
- Admin Have full access and controles for all project
- Seller have limited access only for his products and orders
- user have access for the shopping project

### 🏠 User Features

- Browse products with categories
- Add/remove products from **Cart**
- **Checkout** with order summary
- View & update **Profile**

### 🛍️ Seller Features

- **Seller Dashboard** to manage products
- Add, edit, or delete product listings and orders status
- Analytics & reporting (orders, users, products) of his orders only

### ⚙️ Admin Features

- **Admin Dashboard** for managing users, sellers, and products
- Analytics & reporting (orders, users, products) for all site

### 📌 Additional Pages

- **About Us** – Info about the company
- **Contact Us** – Send queries or feedback
- **Find Store** – Locate nearby branches
- **Product Details** – Detailed product view

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Styling**: Bootstrap, Animation CSS
- **Alerts & Popups**: SweetAlert2 , Padges , toaster
- **Deployment**: [Vercel](https://furnature-gallery-project.vercel.app/home/home.html)

---

## 📦 Installation & Setup

1. Clone the repository
   ```bash
   git clone https://github.com/Yomna-Elshorbagy/Furniture-Gallery-Project.git
   ```
2. Open the project folder
   ```bash
   cd Furniture-Gallery-Project
   ```
3. Open `index.html` in your browser (or use Live Server in VSCode)

---

## 🌐 Live Demo

🔗 [Furniture Gallery Live Project](https://furnature-gallery-project.vercel.app/home/home.html)

---

## 👨‍💻 Contributors

- Designed & Developed by **Team Furniture Gallery**
- Special thanks to contributors for Frontend designs and functionality improvements

---

## 📜 License

This project is licensed under the **Our Team** – feel free to use and modify it.
