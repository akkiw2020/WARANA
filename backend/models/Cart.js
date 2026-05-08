const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  addedOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Cart", cartSchema);