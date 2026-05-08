import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Admin() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") || "orders";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  const [dbProducts, setDbProducts] = useState([]);
  const [systemProducts] = useState([
    // Dairy / Daily Products
    { id: "s1", name: "Chass", price: 30, image: "Chass.jpg", category: "Daily Products", unit: "200ml", isOutOfStock: false },
    { id: "s2", name: "Paneer", price: 58, image: "Panner.jpg", category: "Daily Products", unit: "200gm", isOutOfStock: false },
    { id: "s3", name: "Chess-Blocks", price: 105, image: "Chess.jpg", category: "Daily Products", unit: "200gm", isOutOfStock: false },
    { id: "s4", name: "Dahi", price: 10, image: "Dahi 1.jpg", category: "Daily Products", unit: "200gm", isOutOfStock: false },
    { id: "s6", name: "Dahi 1kg ", price: 70, image: "Dahi.jpg", category: "Daily Products", unit: "1kg", isOutOfStock: false },
    { id: "s7", name: "Buffalo Milk 500ml", price: 37, image: "Buffalo.jpg", category: "Daily Products", unit: "500ml", isOutOfStock: false },
    { id: "s8", name: "Ghee-500gm", price: 90, image: "Ghee.jpg", category: "Daily Products", unit: "500gm", isOutOfStock: false },

    // Ice Cream
    { id: "i1", name: "butterscotch stick", price: 30, image: "butterscotch stick.png", category: "Ice Cream", unit: "1 piece", isOutOfStock: false },
    { id: "i2", name: "familypackbutterscotch", price: 40, image: "familypackbutterscotch.png", category: "Ice Cream", unit: "750ml", isOutOfStock: false },
    { id: "i3", name: "Strawberry cone", price: 35, image: "Strawberry cone.png", category: "Ice Cream", unit: "1 piece", isOutOfStock: false },
    { id: "i4", name: "Strawberry cup", price: 45, image: "Strawberry cup.png", category: "Ice Cream", unit: "1 piece", isOutOfStock: false },
    { id: "i5", name: "kaju kishmish cone", price: 38, image: "kaju kishmish cone.png", category: "Ice Cream", unit: "1 piece", isOutOfStock: false },
    { id: "i6", name: "kaju kishmish", price: 50, image: "kaju kishmish.png", category: "Ice Cream", unit: "1 piece", isOutOfStock: false },

    // Water Bottle
    { id: "s9", name: "Waterbottle-1L", price: 20, image: "waterbottle.jpg.png", category: "Water Bottle", unit: "1L", isOutOfStock: false },
    { id: "s10", name: "Waterbottle-500ml", price: 10, image: "waterbottle500.png", category: "Water Bottle", unit: "500ml", isOutOfStock: false },
    
    // Biscuits
    { id: "b1", name: "Fruit Biscuit", price: 40, image: "fruit.jpg", category: "Biscuits", unit: "200gm", isOutOfStock: false },
    { id: "b2", name: "Osmania Biscuit", price: 35, image: "osmania.jpg", category: "Biscuits", unit: "200gm", isOutOfStock: false },
 
    // Flavoured Milk
    { id: "s11", name: "Chocolate Milk", price: 25, image: "chocolate.png", category: "Flavoured Milk", unit: "200ml", isOutOfStock: false },
    { id: "s12", name: "Badam Milk", price: 30, image: "badam.png", category: "Flavoured Milk", unit: "200ml", isOutOfStock: false },
    { id: "s13", name: "Strawberry Milk", price: 28, image: "strawberry.png", category: "Flavoured Milk", unit: "200ml", isOutOfStock: false },
    { id: "s14", name: "Mango Milk", price: 26, image: "mango.png", category: "Flavoured Milk", unit: "200ml", isOutOfStock: false },
    { id: "s15", name: "Kesar Milk", price: 32, image: "kesar.png", category: "Flavoured Milk", unit: "200ml", isOutOfStock: false },
    { id: "s16", name: "Pista Milk", price: 35, image: "pista.png", category: "Flavoured Milk", unit: "200ml", isOutOfStock: false },
    
    // Fruits Mix
    { id: "s17", name: "MixFruitsJam", price: 20, image: "MixFruits.png", category: "Fruits Mix", unit: "200gm", isOutOfStock: false },
    
    // Festival Specials
    { id: "f1", name: "Shrikhand", price: 40, image: "Shrikhanda.jpg", category: "Festival Specials", isOutOfStock: false },
    { id: "f2", name: "Mango Shrikhand", price: 35, image: "mangoShrikhanda.png", category: "Festival Specials", isOutOfStock: false },
    { id: "f3", name: "Basundi", price: 50, image: "basundi.jpg", category: "Festival Specials", isOutOfStock: false },
    { id: "f4", name: "Gulab Jammun", price: 45, image: "gulabjammun.png", category: "Festival Specials", isOutOfStock: false },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    unit: "",
    description: "",
    isOutOfStock: false
  });
  const [newProductPreview, setNewProductPreview] = useState("");

  // Edit Product State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    image: "",
    unit: "",
    isOutOfStock: false
  });
  const [editProductPreview, setEditProductPreview] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const BACKEND_URL = "http://localhost:5000";

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/')) return `${BACKEND_URL}${imagePath}`;
    return `/media/images/${imagePath}`;
  };

  useEffect(() => {
    if (!token || role !== "admin") {
      navigate("/login");
      return;
    }
    fetchData();

    // Handle anchor scrolling
    if (location.hash === "#add-product-form") {
      setTimeout(() => {
        const element = document.getElementById("add-product-form");
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [token, role, navigate, activeTab, location.hash]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "orders") {
        const res = await axios.get("http://localhost:5000/api/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } else {
        const res = await axios.get("http://localhost:5000/api/products");
        // Combine DB products with system products that aren't "replaced" by a DB product of the same name (resilient matching)
        const dbProdNames = new Set(res.data.map(p => p.name.trim().toLowerCase()));
        const filteredSystem = systemProducts.filter(p => !dbProdNames.has(p.name.trim().toLowerCase()));
        
        setDbProducts([
          ...res.data.map(p => ({ ...p, isDb: true })),
          ...filteredSystem.map(p => ({ ...p, _id: p.id, isDb: false }))
        ]);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id, isDb) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      if (!isDb) {
        alert("Cannot delete system products from the dashboard. You can hide them in the individual category pages.");
        return;
      }
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDbProducts(dbProducts.filter(p => p._id !== id));
        alert("Product deleted successfully");
      } catch (err) {
        alert("Failed to delete product");
      }
    }
  };

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
      alert("Failed to upload image: " + errorMsg);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      if (!newProduct.image) {
        alert("Please upload an image first");
        return;
      }
      console.log("Adding product:", newProduct);
      const res = await axios.post("http://localhost:5000/api/products/add", newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Add product response:", res.data);
      alert("Product added successfully");
      setNewProduct({ name: "", price: "", category: "", image: "", unit: "", description: "", isOutOfStock: false });
      setNewProductPreview("");
      setShowAddForm(false);
      fetchData();
    } catch (err) {
      console.error("Add product error:", err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to add product";
      alert(errorMsg);
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      unit: product.unit || "",
      isOutOfStock: product.isOutOfStock || false,
      isDb: product.isDb
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      if (!editForm.image) {
        alert("Please upload an image first");
        return;
      }
      if (editForm.isDb) {
        await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, editForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Create new DB product from system product
        await axios.post("http://localhost:5000/api/products/add", {
          ...editForm,
          description: "Customized version of system product"
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      alert("Product updated successfully");
      setEditingProduct(null);
      setEditProductPreview("");
      fetchData();
    } catch (err) {
      console.error("Update product error:", err);
      alert(err.response?.data?.error || "Failed to update product");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleString("en-IN");
  };

  const tabStyle = (tab) => ({
    padding: "10px 20px",
    cursor: "pointer",
    borderBottom: activeTab === tab ? "3px solid #007bff" : "none",
    fontWeight: activeTab === tab ? "bold" : "normal",
    color: activeTab === tab ? "#007bff" : "#555",
    background: "none",
    border: "none",
    fontSize: "16px"
  });

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: "20px", padding: "8px 16px", background: "#f8f9fa", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
      >
        ← Back
      </button>
      <h2 style={{ marginBottom: "20px" }}>Admin Dashboard</h2>
      
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px", borderBottom: "1px solid #ddd" }}>
        <button style={tabStyle("orders")} onClick={() => setActiveTab("orders")}>Orders</button>
        <button style={tabStyle("products")} onClick={() => setActiveTab("products")}>Manage Products</button>
      </div>

      {editingProduct && (
        <div style={{ background: "#fff3e0", padding: "25px", borderRadius: "12px", border: "1px solid #ffe0b2", marginBottom: "30px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ margin: 0, color: "#e65100" }}>Edit Product: {editingProduct.name}</h3>
            <button 
              onClick={() => setEditingProduct(null)}
              style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "20px" }}
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleUpdateProduct} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", alignItems: "end" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>Product Name</label>
              <input 
                type="text" required
                value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
                style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc", width: "100%", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>Price (₹)</label>
              <input 
                type="number" required
                value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})}
                style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc", width: "100%", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>Choose Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, true)}
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc", width: "100%", boxSizing: "border-box" }}
              />
              {uploadingImage && <p style={{ fontSize: "12px", color: "#666" }}>Uploading...</p>}
              {(editForm.image || editProductPreview) && (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={editProductPreview || (editForm.image.startsWith('http') ? editForm.image : (editForm.image.startsWith('/') ? `http://localhost:5000${editForm.image}` : `/media/images/${editForm.image}`))}
                    alt="Preview"
                    style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "contain", borderRadius: "4px", border: "1px solid #ddd" }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=No+Image'; }}
                  />
                </div>
              )}
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>Unit (e.g. 200ml, 1kg)</label>
              <input 
                type="text"
                value={editForm.unit} onChange={e => setEditForm({...editForm, unit: e.target.value})}
                style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc", width: "100%", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingBottom: "10px" }}>
              <input 
                type="checkbox" 
                id="editIsOutOfStock"
                checked={editForm.isOutOfStock} 
                onChange={e => setEditForm({...editForm, isOutOfStock: e.target.checked})}
                style={{ width: "20px", height: "20px", cursor: "pointer" }}
              />
              <label htmlFor="editIsOutOfStock" style={{ fontSize: "14px", fontWeight: "bold", cursor: "pointer", color: "#d32f2f" }}>
                Out of Stock
              </label>
            </div>
            <div style={{ gridColumn: "span 3", display: "flex", gap: "10px", marginTop: "10px" }}>
              <button 
                type="submit" 
                disabled={uploadingImage}
                style={{ 
                  padding: "12px 25px", 
                  background: uploadingImage ? "#ccc" : "#ef6c00", 
                  color: "#fff", 
                  border: "none", 
                  borderRadius: "6px", 
                  cursor: uploadingImage ? "not-allowed" : "pointer", 
                  fontWeight: "bold" 
                }}
              >
                {uploadingImage ? "Uploading..." : "Save Changes"}
              </button>
              <button type="button" onClick={() => setEditingProduct(null)} style={{ padding: "12px 25px", background: "#eee", color: "#333", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "#dc3545" }}>{error}</p>
      ) : activeTab === "orders" ? (
        <div>
          <h3>Client Orders</h3>
          {orders.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <thead>
                  <tr style={{ background: "#f8f9fa" }}>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Date</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Customer</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Phone</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Products</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Status</th>
                    <th style={{ padding: "12px", textAlign: "right", borderBottom: "2px solid #dee2e6" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} style={{ borderBottom: "1px solid #dee2e6" }}>
                      <td style={{ padding: "12px" }}>{formatDate(order.createdAt)}</td>
                      <td style={{ padding: "12px" }}>{order.customerName || "—"}</td>
                      <td style={{ padding: "12px" }}>{order.phone || "—"}</td>
                      <td style={{ padding: "12px" }}>
                        {order.products.map(p => `${p.productName} (x${p.quantity})`).join(", ")}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <select 
                          value={order.orderStatus} 
                          onChange={async (e) => {
                            try {
                              await axios.put(`http://localhost:5000/api/admin/orders/${order._id}/status`, { status: e.target.value }, {
                                headers: { Authorization: `Bearer ${token}` }
                              });
                              fetchData();
                            } catch (err) {
                              alert("Failed to update status");
                            }
                          }}
                          style={{ padding: "5px", borderRadius: "4px" }}
                        >
                          {["Order Confirmed", "Processing", "Packed", "Out for Delivery", "Delivered", "Cancelled"].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: "12px", textAlign: "right", fontWeight: "bold" }}>₹{order.totalAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div style={{ marginTop: "20px" }}>
          {!showAddForm ? (
            <div style={{ textAlign: "center", padding: "50px", background: "#f8f9fa", borderRadius: "12px", border: "1px dashed #ccc" }}>
              <button 
                onClick={() => setShowAddForm(true)}
                style={{ 
                  padding: "15px 30px", 
                  background: "#007bff", 
                  color: "#fff", 
                  border: "none", 
                  borderRadius: "8px", 
                  cursor: "pointer", 
                  fontSize: "18px", 
                  fontWeight: "bold",
                  boxShadow: "0 4px 6px rgba(0,123,255,0.2)",
                  transition: "transform 0.2s"
                }}
                onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
              >
                + Add New Product
              </button>
            </div>
          ) : (
            <div style={{ 
              maxWidth: "800px", 
              margin: "0 auto", 
              background: "#f9f9f9", 
              padding: "30px", 
              borderRadius: "10px", 
              border: "1px solid #e0e0e0",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                <h2 style={{ margin: 0, fontSize: "24px", color: "#333", fontWeight: "500" }}>Add New Product</h2>
                <button 
                  onClick={() => setShowAddForm(false)}
                  style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: "18px" }}
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleAddProduct} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <input 
                  type="text" placeholder="Product Name" required
                  value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  style={{ padding: "12px 15px", borderRadius: "5px", border: "1px solid #ddd", fontSize: "16px", outline: "none" }}
                />
                <input 
                  type="number" placeholder="Price" required
                  value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                  style={{ padding: "12px 15px", borderRadius: "5px", border: "1px solid #ddd", fontSize: "16px", outline: "none" }}
                />
                <input 
                  type="text" placeholder="Category" required
                  value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  style={{ padding: "12px 15px", borderRadius: "5px", border: "1px solid #ddd", fontSize: "16px", outline: "none" }}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, false)}
                  style={{ padding: "12px 15px", borderRadius: "5px", border: "1px solid #ddd", fontSize: "16px", outline: "none" }}
                />
                {uploadingImage && <p style={{ fontSize: "12px", color: "#666" }}>Uploading...</p>}
                {(newProduct.image || newProductPreview) && (
                  <div style={{ marginTop: "5px", textAlign: "center", border: "1px dashed #ccc", padding: "10px", borderRadius: "5px" }}>
                    <p style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>Image Preview:</p>
                    <img
                      src={newProductPreview || getImageUrl(newProduct.image)}
                      alt="Preview"
                      style={{ maxWidth: "200px", maxHeight: "150px", objectFit: "contain", borderRadius: "5px" }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/200x150?text=No+Image'; }}
                    />
                  </div>
                )}
                <input 
                  type="text" placeholder="Unit (e.g. 200ml, 1kg)"
                  value={newProduct.unit} onChange={e => setNewProduct({...newProduct, unit: e.target.value})}
                  style={{ padding: "12px 15px", borderRadius: "5px", border: "1px solid #ddd", fontSize: "16px", outline: "none" }}
                />
                <textarea 
                  placeholder="Description"
                  value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                  style={{ padding: "12px 15px", borderRadius: "5px", border: "1px solid #ddd", fontSize: "16px", outline: "none", height: "100px", resize: "vertical" }}
                />
                
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "5px" }}>
                  <input 
                    type="checkbox" 
                    id="isOutOfStock"
                    checked={newProduct.isOutOfStock} 
                    onChange={e => setNewProduct({...newProduct, isOutOfStock: e.target.checked})}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <label htmlFor="isOutOfStock" style={{ fontSize: "15px", fontWeight: "500", cursor: "pointer", color: "#333" }}>
                    Mark as Out of Stock
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={uploadingImage}
                  style={{ 
                    marginTop: "10px",
                    padding: "14px", 
                    background: uploadingImage ? "#ccc" : "#007bff", 
                    color: "#fff", 
                    border: "none", 
                    borderRadius: "5px", 
                    cursor: uploadingImage ? "not-allowed" : "pointer", 
                    fontWeight: "600",
                    fontSize: "16px"
                  }}
                >
                  {uploadingImage ? "Uploading..." : "Save Product"}
                </button>
              </form>
            </div>
          )}

          {/* Product List styled like user page */}
          <div style={{ marginTop: "40px" }}>
            <h3 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px", marginBottom: "30px" }}>All Products</h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "30px",
              justifyItems: "center",
            }}>
              {dbProducts.map((product) => (
                <div
                  key={product._id}
                  style={{
                    width: "220px",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    textAlign: "center",
                    backgroundColor: "#fff",
                    position: "relative",
                    opacity: product.isOutOfStock ? 0.7 : 1,
                    border: "1px solid #eee"
                  }}
                >
                  {product.isOutOfStock && (
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
                      src={product.image.startsWith('http') ? product.image : (product.image.startsWith('/') ? `http://localhost:5000${product.image}` : `/media/images/${product.image}`)}
                      alt={product.name}
                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", opacity: product.isOutOfStock ? 0.5 : 1 }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                    />
                    {!product.isDb && (
                      <span style={{ 
                        position: "absolute", 
                        bottom: "0", 
                        left: "0", 
                        background: "#555", 
                        color: "#fff", 
                        padding: "2px 6px", 
                        borderRadius: "4px", 
                        fontSize: "9px",
                        fontWeight: "bold"
                      }}>
                        SYSTEM
                      </span>
                    )}
                  </div>
                  <h4 style={{ fontSize: "16px", margin: "10px 0" }}>{product.name}</h4>
                  <p style={{ margin: "0 0 5px 0", fontSize: "12px", color: "#666" }}>Category: {product.category}</p>
                  <p style={{ fontWeight: "bold", color: "#1b5e20", fontSize: "18px" }}>₹{product.price}</p>
                  {product.unit && <p style={{ fontSize: "12px", color: "#888", margin: "5px 0" }}>Unit: {product.unit}</p>}

                  <div style={{ display: "flex", gap: "8px", marginTop: "15px" }}>
                    <button
                      onClick={() => handleEditClick(product)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        background: "#ffc107",
                        color: "#000",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "13px"
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id, product.isDb)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        background: "#dc3545",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "13px"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
