import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DailyProducts() {
  const navigate = useNavigate();
  const [dbProducts, setDbProducts] = useState([]);
  const [allDbProducts, setAllDbProducts] = useState([]);
  const [systemProducts, setSystemProducts] = useState([
    // Dairy / Daily Products
    { id: "s1", name: "Chass", price: 30, img: "Chass.jpg", category: "Daily Products", unit: "200ml", isOutOfStock: false },
    { id: "s2", name: "Paneer", price: 58, img: "Panner.jpg", category: "Daily Products", unit: "200gm", isOutOfStock: false },
    { id: "s3", name: "Cheese-Blocks", price: 105, img: "Chess.jpg", category: "Daily Products", unit: "200gm", isOutOfStock: false },
    { id: "s4", name: "Dahi", price: 10, img: "Dahi 1.jpg", category: "Daily Products", unit: "200gm", isOutOfStock: false },
    { id: "s6", name: "Dahi 1kg ", price: 70, img: "Dahi.jpg", category: "Daily Products", unit: "1kg", isOutOfStock: false },
    { id: "s7", name: "Buffalo Milk 500ml", price: 37, img: "Buffalo.jpg", category: "Daily Products", unit: "500ml", isOutOfStock: false },
    { id: "s8", name: "Ghee-500gm", price: 90, img: "Ghee.jpg", category: "Daily Products", unit: "500gm", isOutOfStock: false },
    { id: "s9", name: "Warana Dahi", price: 45, img: "1777282574503-293106567.webp", category: "Daily Products", unit: "500gm", isOutOfStock: false },
  ]);

  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", category: "Daily Products", image: "", unit: "", description: "", isOutOfStock: false });
  const [newProductPreview, setNewProductPreview] = useState("");
  const [editForm, setEditForm] = useState({ name: "", price: "", image: "", unit: "", isOutOfStock: false });
  const [editProductPreview, setEditProductPreview] = useState("");

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDbProducts();
    // Load hidden products from local storage if any
    const hidden = JSON.parse(localStorage.getItem("hiddenProducts") || "[]");
    if (hidden.length > 0) {
      setSystemProducts(prev => prev.filter(p => !hidden.includes(p.id)));
    }
  }, []);

  const handleImageUpload = async (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("http://localhost:5000/api/products/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = res.data.imageUrl;
      if (isEdit) {
        setEditForm({ ...editForm, image: imageUrl });
        setEditProductPreview(`http://localhost:5000${imageUrl}`);
      } else {
        setNewProduct({ ...newProduct, image: imageUrl });
        setNewProductPreview(`http://localhost:5000${imageUrl}`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to upload image";
      alert("Failed to upload image ❌: " + errorMsg);
    } finally {
      setUploadingImage(false);
    }
  };

  const fetchDbProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      const allProducts = res.data;
      
      // 1. Get products that explicitly have the "Daily Products" category
      const categoryDbProducts = allProducts.filter(p => 
        p.category.toLowerCase() === "daily products" || 
        p.category.toLowerCase() === "daily" ||
        p.category.toLowerCase() === "dairy"
      );

      // 2. Get products that match system names for THIS category
      const systemNamesForThisCategory = new Set(systemProducts
        .filter(p => p.category === "Daily Products")
        .map(p => p.name.trim().toLowerCase())
      );
      
      const matchingNameDbProducts = allProducts.filter(p => 
        systemNamesForThisCategory.has(p.name.trim().toLowerCase()) &&
        !categoryDbProducts.find(cp => cp._id === p._id) // Avoid duplicates
      );

      const finalDbList = [...categoryDbProducts, ...matchingNameDbProducts];

      setDbProducts(finalDbList.map(p => ({
        id: p._id,
        name: p.name,
        price: p.price,
        img: p.image,
        category: p.category,
        unit: p.unit || "",
        isOutOfStock: p.isOutOfStock || false,
        isDb: true
      })));
      setAllDbProducts(allProducts);
    } catch (err) {
      console.log("Error fetching products:", err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      if (!newProduct.image) {
        alert("Please upload an image first ⚠️");
        return;
      }
      await axios.post("http://localhost:5000/api/products/add", newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Product added successfully ✅");
      setNewProduct({ name: "", price: "", category: "Daily Products", image: "", unit: "", description: "", isOutOfStock: false });
      setNewProductPreview("");
      setShowAddForm(false);
      fetchDbProducts();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Failed to add product ❌";
      alert(errorMsg);
    }
  };

  const handleDelete = async (id, isDb) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      if (!isDb) {
        // Handle hardcoded product deletion (hide it)
        const hidden = JSON.parse(localStorage.getItem("hiddenProducts") || "[]");
        hidden.push(id);
        localStorage.setItem("hiddenProducts", JSON.stringify(hidden));
        setSystemProducts(prev => prev.filter(p => p.id !== id));
        alert("System product removed from view ✅");
        return;
      }

      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Product deleted successfully ✅");
        fetchDbProducts();
      } catch (err) {
        alert("Failed to delete product ❌");
      }
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditForm({ 
      name: product.name, 
      price: product.price, 
      image: product.img,
      unit: product.unit || "",
      isOutOfStock: product.isOutOfStock || false 
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct.isDb) {
        await axios.put(`http://localhost:5000/api/products/${editingProduct.id}`, {
          name: editForm.name,
          price: editForm.price,
          image: editForm.image,
          unit: editForm.unit,
          isOutOfStock: editForm.isOutOfStock
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Convert hardcoded to DB product on edit and hide original
        await axios.post("http://localhost:5000/api/products/add", {
          name: editForm.name,
          price: editForm.price,
          image: editForm.image,
          unit: editForm.unit,
          isOutOfStock: editForm.isOutOfStock,
          category: "Daily Products",
          description: "Updated version of default product"
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const hidden = JSON.parse(localStorage.getItem("hiddenProducts") || "[]");
        hidden.push(editingProduct.id);
        localStorage.setItem("hiddenProducts", JSON.stringify(hidden));
        setSystemProducts(prev => prev.filter(p => p.id !== editingProduct.id));
      }
      alert("Product updated successfully ✅");
      setEditingProduct(null);
      setEditProductPreview("");
      fetchDbProducts();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Failed to update product ❌";
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

  const cardStyle = {
    width: "220px",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
    backgroundColor: "#fff",
    transition: "transform 0.3s ease",
  };

  const buttonStyle = {
    marginTop: "10px",
    padding: "8px 15px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#ff4d4d",
    color: "white",
    cursor: "pointer",
  };

  // Combine DB products with system products, prioritizing DB products by name (resilient matching)
  const dbProdNames = new Set(allDbProducts.map(p => p.name.trim().toLowerCase()));
  
  // Filter system products to only include those in the "Daily Products" category
  // AND those that aren't already in the database
  const filteredSystem = systemProducts.filter(p => {
    const isCorrectCategory = 
      p.category.toLowerCase() === "daily products" || 
      p.category.toLowerCase() === "daily" ||
      p.category.toLowerCase() === "dairy";
    const isNotInDb = !dbProdNames.has(p.name.trim().toLowerCase());
    return isCorrectCategory && isNotInDb;
  });

  const mergedProducts = [...dbProducts, ...filteredSystem];

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
          productId: item.id || item.name.replace(/\s/g, "_"),
          productName: item.name,
          price: item.price,
          quantity: 1,
          image: item.img || item.image
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
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto", fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <button 
          onClick={() => navigate(-1)} 
          className="back-btn"
          style={{ padding: "8px 20px", background: "#fff", border: "1px solid #ddd", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "500", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}
        >
          ← Back
        </button>

        {role === "admin" && (
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            style={{ padding: "10px 25px", background: "#1b5e20", color: "#fff", border: "none", borderRadius: "50px", cursor: "pointer", fontWeight: "600", boxShadow: "0 4px 15px rgba(27,94,32,0.3)", transition: "0.3s" }}
          >
            {showAddForm ? "✕ Close Form" : "+ Add New Product"}
          </button>
        )}
      </div>

      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h2 style={{ fontSize: "36px", fontWeight: "700", color: "#1b5e20", marginBottom: "10px" }}>Daily Products</h2>
        <div style={{ width: "60px", height: "4px", background: "#4caf50", margin: "0 auto 15px auto", borderRadius: "2px" }}></div>
        <p style={{ color: "#666", fontSize: "16px" }}>
          Fresh from our farms to your doorstep. Pure dairy products for your family.
        </p>
      </div>

      {/* Admin Add Form */}
      {role === "admin" && showAddForm && (
        <div style={{ background: "#f1f8e9", padding: "40px", borderRadius: "24px", marginBottom: "50px", border: "1px solid #c8e6c9", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", animation: "fadeInUp 0.5s ease" }}>
          <h3 style={{ marginBottom: "25px", color: "#1b5e20", fontWeight: "700" }}>Add New Dairy Product</h3>
          <form onSubmit={handleAddProduct} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>Product Name</label>
              <input 
                type="text" placeholder="e.g. Fresh Paneer" required
                value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                style={{ padding: "12px 15px", borderRadius: "10px", border: "1.5px solid #e0e0e0", outline: "none" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>Price (₹)</label>
              <input 
                type="number" placeholder="Price" required
                value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                style={{ padding: "12px 15px", borderRadius: "10px", border: "1.5px solid #e0e0e0", outline: "none" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>Product Image</label>
              <input 
                type="file" accept="image/*"
                onChange={(e) => handleImageUpload(e)}
                style={{ padding: "12px 15px", borderRadius: "10px", border: "1.5px solid #e0e0e0", outline: "none" }}
              />
              {uploadingImage && <span style={{ fontSize: "12px", color: "#1b5e20" }}>Uploading...</span>}
              {newProductPreview && (
                <img 
                  src={newProductPreview} 
                  alt="Preview" 
                  style={{ width: "80px", height: "80px", objectFit: "contain", borderRadius: "5px", border: "1px solid #eee", marginTop: "10px" }}
                />
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>Unit (e.g. 200ml)</label>
              <input 
                type="text" placeholder="e.g. 200ml" required
                value={newProduct.unit} onChange={e => setNewProduct({...newProduct, unit: e.target.value})}
                style={{ padding: "12px 15px", borderRadius: "10px", border: "1.5px solid #e0e0e0", outline: "none" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>Description</label>
              <textarea 
                placeholder="Product description"
                value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                style={{ padding: "12px 15px", borderRadius: "10px", border: "1.5px solid #e0e0e0", outline: "none", minHeight: "80px" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", alignSelf: "center", paddingTop: "20px" }}>
              <input 
                type="checkbox" 
                id="isOutOfStock"
                checked={newProduct.isOutOfStock} 
                onChange={e => setNewProduct({...newProduct, isOutOfStock: e.target.checked})}
                style={{ width: "20px", height: "20px", cursor: "pointer" }}
              />
              <label htmlFor="isOutOfStock" style={{ fontSize: "16px", fontWeight: "600", cursor: "pointer", color: "#d32f2f" }}>
                Out of Stock
              </label>
            </div>
            <button 
              type="submit" 
              disabled={uploadingImage}
              style={{ alignSelf: "end", padding: "13px", background: uploadingImage ? "#ccc" : "#1b5e20", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "700", cursor: uploadingImage ? "not-allowed" : "pointer", transition: "0.3s" }}
            >
              {uploadingImage ? "Uploading..." : "Save Product"}
            </button>
          </form>
        </div>
      )}

      {/* Admin Edit Form */}
      {role === "admin" && editingProduct && (
        <div style={{ background: "#fff3e0", padding: "40px", borderRadius: "24px", marginBottom: "50px", border: "1px solid #ffe0b2", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", animation: "fadeInUp 0.5s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px" }}>
            <h3 style={{ margin: 0, color: "#e65100", fontWeight: "700" }}>Editing: {editingProduct.name}</h3>
            <button onClick={() => setEditingProduct(null)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#666" }}>✕</button>
          </div>
          <form onSubmit={handleUpdate} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>Product Name</label>
              <input 
                type="text" required
                value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
                style={{ padding: "12px 15px", borderRadius: "10px", border: "1.5px solid #e0e0e0", outline: "none" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>Price (₹)</label>
              <input 
                type="number" required
                value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})}
                style={{ padding: "12px 15px", borderRadius: "10px", border: "1.5px solid #e0e0e0", outline: "none" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>Product Image</label>
              <input 
                type="file" accept="image/*"
                onChange={(e) => handleImageUpload(e, true)}
                style={{ padding: "12px 15px", borderRadius: "10px", border: "1.5px solid #e0e0e0", outline: "none" }}
              />
              {uploadingImage && <span style={{ fontSize: "12px", color: "#e65100" }}>Uploading...</span>}
              {(editProductPreview || editForm.image) && (
                <img 
                  src={editProductPreview || (editForm.image.startsWith('http') ? editForm.image : (editForm.image.startsWith('/') ? `http://localhost:5000${editForm.image}` : `/media/images/${editForm.image}`))} 
                  alt="Preview" 
                  style={{ width: "80px", height: "80px", objectFit: "contain", borderRadius: "5px", border: "1px solid #eee", marginTop: "10px" }}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=No+Image'; }}
                />
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>Unit (e.g. 200ml)</label>
              <input 
                type="text"
                value={editForm.unit} onChange={e => setEditForm({...editForm, unit: e.target.value})}
                style={{ padding: "12px 15px", borderRadius: "10px", border: "1.5px solid #e0e0e0", outline: "none" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", alignSelf: "center", paddingTop: "20px" }}>
              <input 
                type="checkbox" 
                id="editIsOutOfStock"
                checked={editForm.isOutOfStock} 
                onChange={e => setEditForm({...editForm, isOutOfStock: e.target.checked})}
                style={{ width: "20px", height: "20px", cursor: "pointer" }}
              />
              <label htmlFor="editIsOutOfStock" style={{ fontSize: "16px", fontWeight: "600", cursor: "pointer", color: "#d32f2f" }}>
                Out of Stock
              </label>
            </div>
            <div style={{ alignSelf: "end", display: "flex", gap: "10px" }}>
              <button 
                type="submit" 
                disabled={uploadingImage}
                style={{ flex: 1, padding: "13px", background: uploadingImage ? "#ccc" : "#e65100", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "700", cursor: uploadingImage ? "not-allowed" : "pointer" }}
              >
                {uploadingImage ? "Uploading..." : "Save Changes"}
              </button>
              <button 
                type="button" 
                onClick={() => setEditingProduct(null)}
                style={{ flex: 1, padding: "13px", background: "#eee", border: "none", borderRadius: "10px", fontWeight: "600", cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={containerStyle}>
        {mergedProducts.map((item, index) => (
          <div
            key={item.id || index}
            className="product-card"
            style={{ 
              ...cardStyle, 
              position: "relative",
              overflow: "hidden",
              border: role === "admin" && item.isDb ? "2px solid #e8f5e9" : "1px solid #f0f0f0",
              opacity: item.isOutOfStock ? 0.6 : 1,
              filter: item.isOutOfStock ? "grayscale(0.4)" : "none"
            }}
          >
            {item.isOutOfStock && (
              <span style={{ position: "absolute", top: "10px", right: "10px", background: "#ffebee", color: "#c62828", padding: "4px 12px", borderRadius: "50px", fontSize: "11px", fontWeight: "700", border: "1.5px solid #ffcdd2", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", zIndex: 2 }}>OUT OF STOCK</span>
            )}
            
            <div style={{ background: "#f9f9f9", borderRadius: "15px", padding: "15px", marginBottom: "15px", height: "160px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <img
                src={item.img.startsWith('http') ? item.img : (item.img.startsWith('/') ? `http://localhost:5000${item.img}` : `/media/images/${item.img}`)}
                alt={item.name}
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
              />
              <span style={{ position: "absolute", bottom: "5px", left: "5px", background: "rgba(255,255,255,0.8)", padding: "2px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "600", color: "#666" }}>{item.category}</span>
              {item.isOutOfStock && (
                <div style={{ 
                  position: "absolute", 
                  top: "0", 
                  left: "0", 
                  width: "100%", 
                  height: "100%", 
                  background: "rgba(0,0,0,0.4)", 
                  borderRadius: "15px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  zIndex: 1
                }}>
                  <span style={{ 
                    background: "#d32f2f", 
                    color: "#fff", 
                    padding: "8px 15px", 
                    borderRadius: "5px", 
                    fontSize: "14px", 
                    fontWeight: "700",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                    transform: "rotate(-15deg)",
                    border: "2px solid #fff"
                  }}>
                    OUT OF STOCK
                  </span>
                </div>
              )}
            </div>
            
            <h4 style={{ fontSize: "18px", fontWeight: "600", margin: "0 0 5px 0", color: "#333" }}>{item.name}</h4>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
              <span style={{ fontSize: "20px", fontWeight: "700", color: "#1b5e20" }}>₹{item.price}</span>
              {item.unit && (
                <span style={{ fontSize: "12px", background: "#f0f0f0", padding: "2px 6px", borderRadius: "4px", color: "#666", fontWeight: "600" }}>
                  {item.unit}
                </span>
              )}
            </div>
            
            {role !== "admin" && (
              <button 
                className="product-btn"
                disabled={item.isOutOfStock}
                style={{ 
                  width: "100%", padding: "12px", 
                  background: item.isOutOfStock ? "#ccc" : "#1b5e20", 
                  color: "#fff", 
                  border: "none", borderRadius: "10px", fontWeight: "600", 
                  cursor: item.isOutOfStock ? "not-allowed" : "pointer",
                  transition: "0.3s"
                }} 
                onClick={() => handleAddToCart(item)}
              >
                {item.isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
            )}

            {role === "admin" && (
              <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                <button 
                  onClick={() => handleEditClick(item)}
                  style={{ flex: 1, padding: "8px", background: "#fff9c4", color: "#f57f17", border: "1.5px solid #fff176", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "700" }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(item.id, item.isDb)}
                  style={{ flex: 1, padding: "8px", background: "#ffebee", color: "#c62828", border: "1.5px solid #ffcdd2", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "700" }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DailyProducts;


