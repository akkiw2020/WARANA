// import React from "react";

// function Icecream({ addToCart }) {

//   const containerStyle = {
//     display: "grid",
//     gridTemplateColumns: "repeat(3, 1fr)",
//     gap: "30px",
//     marginTop: "40px",
//     justifyItems: "center",
//   };

//   const cardStyle = {
//     width: "220px",
//     padding: "20px",
//     borderRadius: "12px",
//     boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//     textAlign: "center",
//     backgroundColor: "#fff",
//     transition: "transform 0.3s ease",
//   };

//   const buttonStyle = {
//     marginTop: "10px",
//     padding: "8px 15px",
//     border: "none",
//     borderRadius: "6px",
//     backgroundColor: "#ff4d4d",
//     color: "white",
//     cursor: "pointer",
//   };

//   const products = [
//     { name: "butterscotch stick", price: 30, img: "butterscotch stick.png" },
//     { name: "familypackbutterscotch", price: 40, img: "familypackbutterscotch.png" },
//     { name: "Strawberry cone", price: 35, img: "Strawberry cone.png" },
//     { name: "Strawberry cup", price: 45, img: "Strawberry cup.png" },
//     { name: "kaju kishmish cone", price: 38, img: "kaju kishmish cone.png" },
//     { name: "kaju kishmish", price: 50, img: "kaju kishmish.png" },
//   ];

//   return (
//     <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#f5f5f5" }}>
//       <h2>Available Ice Creams</h2>

//       <div style={containerStyle}>
//         {products.map((item, index) => (
//           <div
//             key={index}
//             style={cardStyle}
//             onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-10px)")}
//             onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
//           >
//             <img
//               src={`/media/images/${item.img}`}
//               alt={item.name}
//               width="150"
//             />
//             <p>{item.name} - ₹{item.price}</p>

//             <button
//               style={buttonStyle}
//               onClick={addToCart}
//             >
//               Add to Cart
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Icecream;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Icecream() {
  const navigate = useNavigate();
  const [dbProducts, setDbProducts] = useState([]);
  const [allDbProducts, setAllDbProducts] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [systemProducts, setSystemProducts] = useState([
    { id: "i1", name: "butterscotch stick", price: 30, image: "butterscotch stick.png", unit: "1 piece", isOutOfStock: false, subCategory: "Stick" },
    { id: "i2", name: "familypackbutterscotch", price: 40, image: "familypackbutterscotch.png", unit: "750ml", isOutOfStock: false, subCategory: "Family Pack" },
    { id: "i3", name: "Strawberry cone", price: 35, image: "Strawberry cone.png", unit: "1 piece", isOutOfStock: false, subCategory: "Cone" },
    { id: "i4", name: "Strawberry cup", price: 45, image: "Strawberry cup.png", unit: "1 piece", isOutOfStock: false, subCategory: "Cup" },
    { id: "i5", name: "kaju kishmish cone", price: 38, image: "kaju kishmish cone.png", unit: "1 piece", isOutOfStock: false, subCategory: "Cone" },
    { id: "i6", name: "kaju kishmish", price: 50, image: "kaju kishmish.png", unit: "1 piece", isOutOfStock: false, subCategory: "Cup" },
    { id: "i7", name: "Vanilla cone", price: 30, image: "1777369277157-407115057.jpg", unit: "1 piece", isOutOfStock: false, subCategory: "Cone" },
  ]);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      const allProducts = res.data;
      
      // 1. Get products that explicitly have the "Ice Cream" category
      const categoryDbProducts = allProducts.filter(p => 
        p.category.toLowerCase() === "ice cream" || 
        p.category.toLowerCase() === "icecream"
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
      console.error("Error fetching ice cream:", err);
    } finally {
      setLoading(false);
    }
  };

  // Combine DB products with system products, prioritizing DB products by name (resilient matching)
  // We use allDbProducts to ensure that if a product is edited anywhere, it overrides system defaults
  const dbProdNames = new Set(allDbProducts.map(p => p.name.trim().toLowerCase()));
  const filteredSystem = systemProducts.filter(p => !dbProdNames.has(p.name.trim().toLowerCase()));

  const products = [
    ...dbProducts.map(p => ({
      ...p,
      subCategory: p.name.toLowerCase().includes("stick") ? "Stick" : (p.subCategory || (
        p.name.toLowerCase().includes("cone") ? "Cone" : 
        p.name.toLowerCase().includes("family") ? "Family Pack" : "Cup"
      ))
    })),
    ...filteredSystem.map(p => ({
      _id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      unit: p.unit,
      subCategory: p.subCategory,
      isOutOfStock: p.isOutOfStock,
      isSystem: true
    }))
  ];

  // Group products by subCategory
  const groupedProducts = products.reduce((groups, product) => {
    const subCat = product.subCategory || "Other";
    if (!groups[subCat]) {
      groups[subCat] = [];
    }
    groups[subCat].push(product);
    return groups;
  }, {});

  const subCategories = [
    { name: "Cone", image: "Strawberry cone.png" },
    { name: "Cup", image: "Strawberry cup.png" },
    { name: "Family Pack", image: "familypackbutterscotch.png" },
    { name: "Stick", image: "butterscotch stick.png" }
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

  const containerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "30px",
    marginTop: "40px",
    justifyItems: "center",
  };

  const categoryCardStyle = {
    width: "220px",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
    backgroundColor: "#fff",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <button 
        onClick={() => selectedSubCategory ? setSelectedSubCategory(null) : navigate(-1)} 
        style={{ marginBottom: "20px", padding: "8px 16px", background: "#f8f9fa", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
      >
        ← Back
      </button>
      
      <h2 style={{ textAlign: "center", color: "#333", marginBottom: "40px" }}>
        {selectedSubCategory ? `${selectedSubCategory}s` : "Ice Cream Categories"}
      </h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading products...</p>
      ) : (
        <>
          {!selectedSubCategory ? (
            <div style={containerStyle}>
              {subCategories.map((cat) => (
                <div
                  key={cat.name}
                  style={categoryCardStyle}
                  onClick={() => setSelectedSubCategory(cat.name)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                  }}
                >
                  <img
                    src={`/media/images/${encodeURI(cat.image)}`}
                    alt={cat.name}
                    style={{ width: "150px", height: "150px", objectFit: "contain", marginBottom: "15px" }}
                    onError={(e) => {
                      e.target.src = `http://localhost:5000/media/images/${encodeURI(cat.image)}`;
                    }}
                  />
                  <h3 style={{ color: "#333", margin: "10px 0" }}>{cat.name}</h3>
                </div>
              ))}
            </div>
          ) : (
            <div style={containerStyle}>
              {groupedProducts[selectedSubCategory]?.length > 0 ? (
                groupedProducts[selectedSubCategory].map((item) => (
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
                      transition: "transform 0.3s ease",
                      opacity: item.isOutOfStock ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => !item.isOutOfStock && (e.currentTarget.style.transform = "translateY(-10px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
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
                        zIndex: 1
                      }}>
                        Out of Stock
                      </span>
                    )}
                    <img
                      src={
                        item.image.startsWith("http") 
                          ? item.image 
                          : item.image.startsWith("/") 
                            ? `http://localhost:5000${encodeURI(item.image)}` 
                            : `/media/images/${encodeURI(item.image)}`
                      }
                      alt={item.name}
                      style={{ width: "100%", height: "150px", objectFit: "contain", marginBottom: "15px" }}
                      onError={(e) => {
                        const encodedImg = encodeURI(item.image);
                        if (!e.target.src.includes("localhost:5000")) {
                          // Try backend if frontend public fails
                          e.target.src = `http://localhost:5000/media/images/${encodedImg}`;
                        } else {
                          // Final fallback
                          e.target.src = "https://via.placeholder.com/150?text=No+Image";
                        }
                      }}
                    />
                    <h4 style={{ margin: "10px 0", fontSize: "16px", color: "#333" }}>{item.name}</h4>
                    <p style={{ color: "#ff4d4d", fontWeight: "bold", fontSize: "18px", margin: "5px 0" }}>
                      ₹{item.price} <span style={{ fontSize: "12px", color: "#666", fontWeight: "normal" }}>/ {item.unit}</span>
                    </p>
                    
                    <button
                      style={{
                        width: "100%",
                        padding: "10px",
                        marginTop: "15px",
                        border: "none",
                        borderRadius: "6px",
                        backgroundColor: item.isOutOfStock ? "#ccc" : "#ff4d4d",
                        color: "white",
                        fontWeight: "bold",
                        cursor: item.isOutOfStock ? "not-allowed" : "pointer",
                        transition: "background 0.3s"
                      }}
                      onClick={() => !item.isOutOfStock && handleAddToCart(item)}
                      disabled={item.isOutOfStock}
                    >
                      {item.isOutOfStock ? "Unavailable" : "Add to Cart"}
                    </button>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: "center", gridColumn: "1 / -1" }}>No products found in this category.</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Icecream;