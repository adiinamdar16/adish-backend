const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

const products = [
  {
    name: "ABC Fire Extinguisher 5kg",
    price: 2499,
    stock: 50,
    category: "ABC",
    image: "https://m.media-amazon.com/images/I/61v3F6vH4EL._SX679_.jpg",
    fireClass: "A, B, C",
    capacity: "5kg"
  },
  {
    name: "CO₂ Fire Extinguisher 4.5kg",
    price: 3999,
    stock: 30,
    category: "CO2",
    image: "https://m.media-amazon.com/images/I/71Lk3wXkKLL._SX679_.jpg",
    fireClass: "B, Electrical",
    capacity: "4.5kg"
  }
];

const seedDB = async () => {
  await Product.deleteMany();
  await Product.insertMany(products);
  console.log("Database Seeded");
  process.exit();
};

seedDB();
