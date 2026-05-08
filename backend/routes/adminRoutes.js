const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all orders with user info - Admin only
router.get("/orders", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const isAdmin = user && (user.role === "admin" || user.email === "admin@warana.com");
    if (!isAdmin) {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean();

    const ordersWithUser = await Promise.all(
      orders.map(async (order) => {
        const user = await User.findById(order.userId).select("name email").lean();
        return {
          ...order,
          userName: user?.name || "Unknown",
          userEmail: user?.email || "Unknown",
        };
      })
    );

    res.json(ordersWithUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status - Admin only
router.put("/orders/:id/status", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: status }, { new: true });
    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
