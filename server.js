const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middlewares
app.use(cors({
  origin: ["http://localhost:3000", "https://your-frontend.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/auth", authRoutes);  // ← was missing!

// Simple contact form handler
app.post("/api/contact", (req, res) => {
  console.log("📧 Contact form:", req.body);
  res.json({ success: true });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("Mongo Error ❌", err));

app.get("/", (req, res) => res.send("FireGuard API Running ✅"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));