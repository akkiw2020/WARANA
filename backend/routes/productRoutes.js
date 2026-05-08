const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../media/images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const imageUrl = `/media/images/${req.file.filename}`;
  res.json({ imageUrl });
});

// Add Product
router.post("/add", async (req, res) => {
  try {
    console.log("Adding product to DB:", req.body);
    const product = new Product(req.body);
    await product.save();
    console.log("Product saved successfully:", product._id);
    res.json({ message: "Product Added", product });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get All Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Product
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/addsample", async (req, res) => {
    const Product = require("../models/Product");

    const product = new Product({
        name: "Warana Milk 1L",
        price: 60,
        category: "Milk",
        image: "milk.jpg"
    });

    await product.save();
    res.json({ message: "Sample Product Added" });
});

module.exports = router;