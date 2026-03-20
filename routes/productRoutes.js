const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("../models/Product");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// GET ALL PRODUCTS (with optional category filter)
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured === "true") filter.isFeatured = true;
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET SINGLE PRODUCT BY ID  ← was missing!
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD PRODUCT
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, stock, category, fireClass, capacity, isFeatured } = req.body;

    const newProduct = new Product({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      category,
      fireClass,   // ← was missing from save
      capacity,    // ← was missing from save
      isFeatured: isFeatured === "true",
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE PRODUCT  ← was missing!
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.image = `/uploads/${req.file.filename}`;
    if (updates.price) updates.price = Number(updates.price);
    if (updates.stock) updates.stock = Number(updates.stock);
    if (updates.isFeatured !== undefined) updates.isFeatured = updates.isFeatured === "true";

    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE PRODUCT
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;