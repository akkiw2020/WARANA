// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//     name: String,
//     price: Number,
//     category: String,
//     image: String
// });

// module.exports = mongoose.model("Product", productSchema);
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, default: "" },
  image: { type: String, required: true },
  unit: { type: String },
  stock: { type: Number },
  description: { type: String },
  isOutOfStock: { type: Boolean, default: false }
});

module.exports = mongoose.model("Product", productSchema);