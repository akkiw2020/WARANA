const Razorpay = require("razorpay");
const crypto = require("crypto");
const express = require("express");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const razorpay = process.env.RAZORPAY_KEY && process.env.RAZORPAY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_SECRET,
    })
  : null;

// Get Razorpay public key (for frontend)
router.get("/razorpay-key", (req, res) => {
  const key = process.env.RAZORPAY_KEY || "";
  res.json({ key });
});

// Create Razorpay order
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(500).json({ error: "Payment gateway not configured. Add RAZORPAY_KEY and RAZORPAY_SECRET to .env" });
    }
    const { amount } = req.body;
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify payment and save order (online payment)
router.post("/verify-payment", authMiddleware, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      products,
      totalAmount,
      customerName,
      phone,
      location,
    } = req.body;
    const userId = req.user.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment details" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    const newOrder = new Order({
      userId,
      customerName: customerName || "",
      phone: phone || "",
      location: location || "",
      products: products || [],
      totalAmount: totalAmount || 0,
      paymentStatus: "paid",
      paymentMethod: "online",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      deliveryCharges: totalAmount > 500 ? 0 : 40,
    });

    await newOrder.save();
    
    // Auto-save address to user profile
    await User.findByIdAndUpdate(userId, {
      phone: phone || "",
      address: location || ""
    });

    await Cart.deleteMany({ userId });
    res.json({ message: "Payment successful", orderId: newOrder._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cash on Delivery order (no online payment)
router.post("/cod-order", authMiddleware, async (req, res) => {
  try {
    const { customerName, phone, location, products, totalAmount } = req.body;
    const userId = req.user.id;

    if (!customerName || !phone || !location) {
      return res.status(400).json({ error: "Please provide name, phone and location" });
    }

    const newOrder = new Order({
      userId,
      customerName,
      phone,
      location,
      products: products || [],
      totalAmount: totalAmount || 0,
      paymentStatus: "cod", // to be collected at delivery
      paymentMethod: "cod",
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      deliveryCharges: totalAmount > 500 ? 0 : 40,
    });

    await newOrder.save();

    // Auto-save address to user profile
    await User.findByIdAndUpdate(userId, {
      phone: phone || "",
      address: location || ""
    });

    await Cart.deleteMany({ userId });

    res.json({ message: "Order placed with Cash on Delivery", orderId: newOrder._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User Orders
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single Order Details
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel Order
router.post("/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.orderStatus === "Delivered") return res.status(400).json({ error: "Cannot cancel a delivered order" });
    
    order.orderStatus = "Cancelled";
    await order.save();
    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;