

// const express = require("express");
// const router = express.Router();
// const Cart = require("../models/Cart");
// const authMiddleware = require("../middleware/authMiddleware");

// // 🔒 Protect Route
// router.post("/add", authMiddleware, async (req, res) => {
//   try {
//     const { productId, productName, price, quantity } = req.body;

//     const newCartItem = new Cart({
//       userId: req.user.id,  // 🔥 get userId from token
//       productId,
//       productName,
//       price,
//       quantity
//     });

//     const savedItem = await newCartItem.save();
//     res.status(201).json({ message: "Added to Cart", item: savedItem });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// // 🔒 Protect Route
// router.post("/add", authMiddleware, async (req, res) => {
//   try {
//     const { productId, productName, price, quantity } = req.body;

//     const newCartItem = new Cart({
//       userId: req.user.id,  // 🔥 get userId from token
//       productId,
//       productName,
//       price,
//       quantity
//     });

//     const savedItem = await newCartItem.save();
//     res.status(201).json({ message: "Added to Cart", item: savedItem });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

// 🔒 Add to Cart
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { productId, productName, price, quantity, image } = req.body;

    // Check if product is out of stock in the database
    // Some productIds might be from hardcoded items (e.g., "s1"), 
    // but the user specifically asked about the admin-updated products (MongoDB _ids)
    if (productId && productId.match(/^[0-9a-fA-F]{24}$/)) {
      const product = await Product.findById(productId);
      if (product && product.isOutOfStock) {
        return res.status(400).json({ message: "Sorry, this product is currently Out of Stock!" });
      }
    }

    const newCartItem = new Cart({
      userId: req.user.id,
      productId,
      productName,
      price,
      quantity,
      image
    });

    const savedItem = await newCartItem.save();
    res.status(201).json({ message: "Added to Cart", item: savedItem });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 Get Cart Items
router.get("/", authMiddleware, async (req, res) => {
  try {
    const items = await Cart.find({ userId: req.user.id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔒 Clear Cart (must be before /:id)
router.delete("/clear", authMiddleware, async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.user.id });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔒 Remove from Cart
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Cart.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Removed from cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
