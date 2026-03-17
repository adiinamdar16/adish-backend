const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/payment", paymentRoutes);

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Routes
//app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));
app.get("/", (req, res) => {
  res.send("API Running...");
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
