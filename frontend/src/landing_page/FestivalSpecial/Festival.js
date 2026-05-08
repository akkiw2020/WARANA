import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Festival() {
  const [dbProducts, setDbProducts] = useState([]);
  const [allDbProducts, setAllDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [systemProducts, setSystemProducts] = useState([
    { id: "f1", name: "Shrikhand", price: 40, image: "Shrikhanda.jpg", isOutOfStock: false },
    { id: "f2", name: "Mango Shrikhand", price: 35, image: "mangoShrikhanda.png", isOutOfStock: false },
    { id: "f3", name: "Basundi", price: 50, image: "basundi.jpg", isOutOfStock: false },
    { id: "f4", name: "Gulab Jammun", price: 45, image: "gulabjammun.png", isOutOfStock: false },
  ]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      const allProducts = res.data;
      
      // 1. Get products that explicitly have the "Festival Special" category
      const categoryDbProducts = allProducts.filter(p => 
        p.category.trim().toLowerCase() === "festival specials" || 
        p.category.trim().toLowerCase() === "festival" ||
        p.category.trim().toLowerCase() === "festivalspecial"
      );

      // 2. Get products that match system names (even if category was changed)
      const systemNames = new Set(systemProducts.map(p => p.name.trim().toLowerCase()));
      const matchingNameDbProducts = allProducts.filter(p => 
        systemNames.has(p.name.trim().toLowerCase()) &&
        !categoryDbProducts.find(cp => cp._id === p._id) // Avoid duplicates
      );

      setDbProducts([...categoryDbProducts, ...matchingNameDbProducts]);
      setAllDbProducts(allProducts);
    } catch (err) {
      console.error("Error fetching festival specials:", err);
    } finally {
      setLoading(false);
    }
  };

  // Combine DB products with system products, prioritizing DB products by name (resilient matching)
  const dbProdNames = new Set(dbProducts.map(p => p.name.trim().toLowerCase()));
  const filteredSystem = systemProducts.filter(p => !dbProdNames.has(p.name.trim().toLowerCase()));

  const products = [
    ...dbProducts,
    ...filteredSystem.map(p => ({
      _id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      isOutOfStock: p.isOutOfStock,
      isSystem: true
    }))
  ];

  const handleAddToCart = async (item) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          productId: item._id,
          productName: item.name,
          price: item.price,
          quantity: 1,
          image: item.image
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Added to Cart ✅");
      navigate("/cart");
    } catch (error) {
      console.log(error);
      const errorMsg = error.response?.data?.message || "Error adding to cart";
      alert(errorMsg);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: "20px", padding: "8px 16px", background: "#f8f9fa", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
      >
        ← Back
      </button>
      <h2 style={{ textAlign: "center", color: "#333" }}>Available Festival Specials</h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading products...</p>
      ) : products.length === 0 ? (
        <p style={{ textAlign: "center" }}>No products found in this category.</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "30px",
          marginTop: "40px",
          justifyItems: "center",
        }}>
          {products.map((item) => (
            <div
              key={item._id}
              style={{
                width: "220px",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                textAlign: "center",
                backgroundColor: "#fff",
                position: "relative",
                opacity: item.isOutOfStock ? 0.7 : 1
              }}
            >
              {item.isOutOfStock && (
                <span style={{ 
                  position: "absolute", 
                  top: "10px", 
                  right: "10px", 
                  background: "#d32f2f", 
                  color: "#fff", 
                  padding: "4px 10px", 
                  borderRadius: "4px", 
                  fontSize: "11px", 
                  fontWeight: "bold", 
                  zIndex: 2 
                }}>
                  OUT OF STOCK
                </span>
              )}

              <div style={{ height: "150px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px", position: "relative" }}>
                <img
                  src={item.image.startsWith('http') ? item.image : (item.image.startsWith('/') ? `http://localhost:5000${item.image}` : `/media/images/${item.image}`)}
                  alt={item.name}
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", opacity: item.isOutOfStock ? 0.5 : 1 }}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                />
                {item.isOutOfStock && (
                  <div style={{ position: "absolute", background: "rgba(0,0,0,0.4)", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}>
                    <span style={{ color: "#fff", fontWeight: "bold", transform: "rotate(-15deg)", border: "2px solid #fff", padding: "5px" }}>OUT OF STOCK</span>
                  </div>
                )}
              </div>

              <h4 style={{ fontSize: "16px", margin: "10px 0" }}>{item.name}</h4>
              <p style={{ fontWeight: "bold", color: "#1b5e20" }}>₹{item.price}</p>

              {role !== "admin" && (
                <button
                  disabled={item.isOutOfStock}
                  style={{
                    marginTop: "10px",
                    padding: "8px 15px",
                    border: "none",
                    borderRadius: "6px",
                    backgroundColor: item.isOutOfStock ? "#ccc" : "#0d6efd",
                    color: "white",
                    cursor: item.isOutOfStock ? "not-allowed" : "pointer",
                    width: "100%",
                    fontWeight: "bold"
                  }}
                  onClick={() => handleAddToCart(item)}
                >
                  {item.isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Festival;