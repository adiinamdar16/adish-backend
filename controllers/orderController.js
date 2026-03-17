const Order = require("../models/Order");

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const {
      products,
      customer,
      subtotal,
      gst,
      shipping,
      totalAmount,
    } = req.body;

    const order = await Order.create({
      userId: req.user ? req.user._id : null,
      products,
      customer,
      subtotal,
      gst,
      shipping,
      totalAmount,
      paymentStatus: "Pending",
      orderStatus: "Pending",
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET USER ORDERS
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id });
  res.json(orders);
};

// GET ALL ORDERS (ADMIN)
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};

// UPDATE ORDER STATUS (ADMIN)
exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.orderStatus = req.body.status;
    await order.save();
    res.json(order);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};
