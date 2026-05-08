import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: "20px", padding: "8px 16px", background: "#f8f9fa", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
      >
        ← Back
      </button>
      <h2>My Cart 🛒</h2>

      {cartItems.length === 0 ? (
        <p>No items in cart. <a href="/" style={{ color: "#0d6efd" }}>Continue shopping</a></p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                borderBottom: "1px solid #eee",
                marginBottom: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <img 
                  src={item.image && item.image.startsWith('http') ? item.image : (item.image && item.image.startsWith('/') ? `http://localhost:5000${item.image}` : `/media/images/${item.image || 'placeholder.png'}`)} 
                  alt={item.productName}
                  style={{ width: "60px", height: "60px", objectFit: "contain", borderRadius: "8px", border: "1px solid #eee" }}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/60?text=No+Image'; }}
                />
                <div>
                  <h4 style={{ margin: "0 0 8px 0" }}>{item.productName}</h4>
                  <p style={{ margin: "0", color: "#666" }}>
                    ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRemove(item._id)}
                style={{
                  padding: "6px 12px",
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          ))}
          <div
            style={{
              marginTop: "24px",
              padding: "20px",
              background: "#f8f9fa",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <strong>Total: ₹{total}</strong>
            <button
              onClick={() => navigate("/checkout")}
              style={{
                padding: "12px 24px",
                background: "#198754",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;