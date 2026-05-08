const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: String,
    // Customer details captured at checkout
    customerName: String,
    phone: String,
    location: String,

    products: Array,
    totalAmount: Number,

    // "paid" for online, "cod" / "pending" for cash on delivery
    paymentStatus: String,
    paymentMethod: {
      type: String,
      enum: ["online", "cod"],
      default: "online",
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,

    orderStatus: {
      type: String,
      enum: ["Order Confirmed", "Processing", "Packed", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Order Confirmed",
    },
    estimatedDelivery: Date,
    couponCode: String,
    discountAmount: { type: Number, default: 0 },
    deliveryCharges: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);