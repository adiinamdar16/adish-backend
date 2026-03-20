const Order = require("../models/Order");

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { products, customer, subtotal, gst, shipping, totalAmount, paymentStatus, razorpayOrderId, razorpayPaymentId } = req.body;

    const order = await Order.create({
      userId: req.user ? req.user._id : null,
      products,
      customer,
      subtotal,
      gst,
      shipping,
      totalAmount,
      paymentStatus: paymentStatus || "Pending",
      orderStatus: "Pending",
      razorpayOrderId: razorpayOrderId || "",
      razorpayPaymentId: razorpayPaymentId || "",
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL ORDERS (ADMIN)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ORDER STATUS (ADMIN)
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = req.body.status;
    if (req.body.paymentStatus) order.paymentStatus = req.body.paymentStatus;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ORDER BY ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};