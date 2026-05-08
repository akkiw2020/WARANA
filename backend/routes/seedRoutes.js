const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

const systemProducts = [
    // Ice Cream
    { name: "butterscotch stick", price: 30, img: "butterscotch stick.png", category: "Ice Cream", subCategory: "Stick", unit: "1 piece", isOutOfStock: false },
    { name: "familypackbutterscotch", price: 40, img: "familypackbutterscotch.png", category: "Ice Cream", subCategory: "Family Pack", unit: "750ml", isOutOfStock: false },
    { name: "Strawberry cone", price: 35, img: "Strawberry cone.png", category: "Ice Cream", subCategory: "Cone", unit: "1 piece", isOutOfStock: false },
    { name: "Strawberry cup", price: 45, img: "Strawberry cup.png", category: "Ice Cream", subCategory: "Cup", unit: "1 piece", isOutOfStock: false },
    { name: "kaju kishmish cone", price: 38, img: "kaju kishmish cone.png", category: "Ice Cream", subCategory: "Cone", unit: "1 piece", isOutOfStock: false },
    { name: "kaju kishmish", price: 50, img: "kaju kishmish.png", category: "Ice Cream", subCategory: "Cup", unit: "1 piece", isOutOfStock: false },
    { name: "Vanilla cone", price: 30, img: "1777369277157-407115057.jpg", category: "Ice Cream", subCategory: "Cone", unit: "1 piece", isOutOfStock: false },

    // Dairy / Daily Products
    { name: "Chass", price: 30, img: "Chass.jpg", category: "Daily Products", unit: "200ml", isOutOfStock: false },
    { name: "Paneer", price: 58, img: "Panner.jpg", category: "Daily Products", unit: "200gm", isOutOfStock: false },
    { name: "Cheese-Blocks", price: 105, img: "Chess.jpg", category: "Daily Products", unit: "200gm", isOutOfStock: false },
    { name: "Warana Dahi", price: 45, img: "1777282574503-293106567.webp", category: "Daily Products", unit: "500gm", isOutOfStock: false },
    { name: "Dahi", price: 10, img: "Dahi 1.jpg", category: "Daily Products", unit: "200gm", isOutOfStock: false },
    { name: "Dahi 1kg", price: 70, img: "Dahi.jpg", category: "Daily Products", unit: "1kg", isOutOfStock: false },
    { name: "Buffalo Milk 500ml", price: 37, img: "Buffalo.jpg", category: "Daily Products", unit: "500ml", isOutOfStock: false },
    { name: "Ghee-500gm", price: 90, img: "Ghee.jpg", category: "Daily Products", unit: "500gm", isOutOfStock: false },

    // Water Bottle
    { name: "Waterbottle-1L", price: 20, img: "waterbottle.jpg.png", category: "Water Bottle", unit: "1L", isOutOfStock: false },
    { name: "Waterbottle-500ml", price: 10, img: "waterbottle500.png", category: "Water Bottle", unit: "500ml", isOutOfStock: false },

    // Biscuits
    { name: "Fruit Biscuit", price: 40, img: "fruit.jpg", category: "Biscuits", unit: "200gm", isOutOfStock: false },
    { name: "Osmania Biscuit", price: 35, img: "osmania.jpg", category: "Biscuits", unit: "200gm", isOutOfStock: false },
    { name: "Cashew Biscuit", price: 40, img: "cashewbiscuit.jpg", category: "Biscuits", unit: "200gm", isOutOfStock: false },
    { name: "Choco Chip Cookies", price: 42, img: "chocochipcookies.jpg", category: "Biscuits", unit: "200gm", isOutOfStock: false },

    // Flavoured Milk
    { name: "Chocolate Milk", price: 25, img: "chocolate.png", category: "Flavoured Milk", unit: "200ml", isOutOfStock: false },
    { name: "Badam Milk", price: 30, img: "badam.png", category: "Flavoured Milk", unit: "200ml", isOutOfStock: false },
    { name: "Strawberry Milk", price: 28, img: "strawberry.png", category: "Flavoured Milk", unit: "200ml", isOutOfStock: false },
    { name: "Mango Milk", price: 26, img: "mango.png", category: "Flavoured Milk", unit: "200ml", isOutOfStock: false },
    { name: "Kesar Milk", price: 32, img: "kesar.png", category: "Flavoured Milk", unit: "200ml", isOutOfStock: false },
    { name: "Pista Milk", price: 35, img: "pista.png", category: "Flavoured Milk", unit: "200ml", isOutOfStock: false },

    // Fruits Mix
    { name: "MixFruitsJam", price: 20, img: "MixFruits.png", category: "Fruits Mix", unit: "200gm", isOutOfStock: false },

    // Festival Specials
    { name: "Shrikhand", price: 40, img: "Shrikhanda.jpg", category: "Festival Specials", unit: "200gm", isOutOfStock: false },
    { name: "Mango Shrikhand", price: 35, img: "mangoShrikhanda.png", category: "Festival Specials", unit: "200gm", isOutOfStock: false },
    { name: "Basundi", price: 50, img: "basundi.jpg", category: "Festival Specials", unit: "200gm", isOutOfStock: false },
    { name: "Gulab Jammun", price: 45, img: "gulabjammun.png", category: "Festival Specials", unit: "200gm", isOutOfStock: false },
];

router.get("/seedall", async (req, res) => {
    try {
        // DELETE ALL PRODUCTS FIRST TO ENSURE CLEAN SEEDING
        await Product.deleteMany({});
        console.log("All existing products deleted.");

        const productsToInsert = systemProducts.map(prod => ({
            name: prod.name,
            price: prod.price,
            category: prod.category,
            subCategory: prod.subCategory || "",
            image: `/media/images/${prod.img}`,
            unit: prod.unit || "",
            stock: 100,
            description: "",
            isOutOfStock: prod.isOutOfStock || false
        }));

        const addedProducts = await Product.insertMany(productsToInsert);
        const addedNames = addedProducts.map(p => p.name);

        res.json({ 
            message: `Successfully seeded ${addedNames.length} products`, 
            products: addedNames 
        });
    } catch (err) {
        console.error("Error seeding products:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;