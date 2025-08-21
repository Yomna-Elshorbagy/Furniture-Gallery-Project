import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { generateId, validateProduct } from "./Helpers/productHelpers.js";

// ===== Get __dirname in ES Modules =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();
const port = 4000;

server.use(express.json());
server.use(cors());
server.use(
  "/products_img",
  express.static(path.join(__dirname, "data/products_img"))
);

// ========== multer images ===================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./data/products_img";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 }, // 6MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/jpg",
    ];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, and GIF files are allowed"));
    }
    cb(null, true);
  },
});
// ==============> File Paths <==========
const productsPath = path.join(__dirname, "data", "products.json");
const categoriesPath = path.join(__dirname, "data", "categories.json");
const couponsPath = path.join(__dirname, "data", "coupons.json");
const ordersPath = path.join(__dirname, "data", "orders.json");

// ==============> Read Files <==========
let products = fs.existsSync(productsPath)
  ? JSON.parse(fs.readFileSync(productsPath, "utf-8"))
  : [];
let categories = fs.existsSync(categoriesPath)
  ? JSON.parse(fs.readFileSync(categoriesPath, "utf-8"))
  : [];
let coupons = fs.existsSync(couponsPath)
  ? JSON.parse(fs.readFileSync(couponsPath, "utf-8"))
  : [];
let orders = fs.existsSync(ordersPath)
  ? JSON.parse(fs.readFileSync(ordersPath, "utf-8"))
  : [];

// ===== Helper to Save =====
const saveData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

/////////////////////////////////////////////////////////////////////////////////////////////////////
// ============================== PRODUCTS ==============================

server.get("/products", (req, res) =>
  res.status(200).json({ message: "All products:", products })
);

server.get("/product/:id", (req, res) => {
  const product = products.find((p) => p.id === +req.params.id);
  product
    ? res.json({ product })
    : res.status(404).json({ message: "Product not found" });
});

server.post("/product", upload.single("image"), (req, res) => {
  const { name, price, stock, category, description } = req.body;
  const errors = validateProduct({ name, price, stock, category }, false);
  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  const newProduct = {
    id: generateId(products),
    name,
    price: parseFloat(price),
    stock: parseInt(stock),
    category,
    image: req.file ? `/products_img/${req.file.filename}` : "",
    description: description || "",
  };

  products.push(newProduct);
  saveData(productsPath, products);
  res
    .status(201)
    .json({ message: "Product added", product: newProduct, products });
});

// ================== Update product ==================
server.put("/product/:id", upload.single("image"), (req, res) => {
  const id = +req.params.id;
  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex === -1)
    return res.status(404).json({ message: "Product not found" });

  const { name, price, stock, category, description } = req.body;
  const errors = validateProduct({ name, price, stock, category }, true);
  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  const updatedProduct = {
    ...products[productIndex],
    name,
    price: parseFloat(price),
    stock: parseInt(stock),
    category,
    description: description || products[productIndex].description,
  };

  if (req.file) {
    updatedProduct.image = `/products_img/${req.file.filename}`;
  }

  products[productIndex] = updatedProduct;
  saveData(productsPath, products);
  res.json({ message: "Product updated", product: updatedProduct, products });
});

server.delete("/product/:id", (req, res) => {
  const productIndex = products.findIndex((p) => p.id === +req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const deletedProduct = products.splice(productIndex, 1);
  saveData(productsPath, products);

  res.json({
    message: "Product deleted",
    product: deletedProduct[0],
    products,
  });
});
// Undefined routes
server.all(/.*/, (req, res) =>
  res.status(404).json({ message: "Route not found" })
);

server.listen(port, () => console.log(`Server running on port ${port}`));