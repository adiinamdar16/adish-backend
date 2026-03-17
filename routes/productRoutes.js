const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("../models/Product");

/* ===============================
   Multer Storage Setup
================================= */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ===============================
   GET ALL PRODUCTS  ✅ IMPORTANT
================================= */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
   ADD PRODUCT
================================= */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      category,
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    await newProduct.save();

    res.status(201).json({ message: "Product added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
