import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [token, navigate]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (id) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await axios.post(`http://localhost:5000/api/orders/${id}/cancel`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Order cancelled successfully");
        fetchOrders();
      } catch (err) {
        alert(err.response?.data?.error || "Failed to cancel order");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return "#28a745";
      case "Cancelled": return "#dc3545";
      case "Out for Delivery": return "#fd7e14";
      default: return "#007bff";
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h2 style={{ marginBottom: "30px", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>My Orders</h2>
      
      {loading ? (
        <p>Loading your orders...</p>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <p style={{ fontSize: "18px", color: "#666" }}>You haven't placed any orders yet.</p>
          <button onClick={() => navigate("/daily-products")} style={{ marginTop: "20px", padding: "12px 25px", background: "#1b5e20", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "25px" }}>
          {orders.map(order => (
            <div key={order._id} style={{ border: "1px solid #eee", borderRadius: "12px", padding: "25px", background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "#888" }}>ORDER ID: {order._id}</span>
                  <div style={{ fontSize: "14px", color: "#555", marginTop: "5px" }}>Placed on: {new Date(order.createdAt).toLocaleString("en-IN")}</div>
                </div>
                <div style={{ 
                  background: getStatusColor(order.orderStatus) + "15", 
                  color: getStatusColor(order.orderStatus), 
                  padding: "5px 15px", 
                  borderRadius: "20px", 
                  fontSize: "13px", 
                  fontWeight: "bold" 
                }}>
                  {order.orderStatus}
                </div>
              </div>

              <div style={{ borderTop: "1px solid #f9f9f9", borderBottom: "1px solid #f9f9f9", padding: "15px 0", marginBottom: "15px" }}>
                {order.products.map((p, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <img 
                        src={p.image && p.image.startsWith('http') ? p.image : (p.image && p.image.startsWith('/') ? `http://localhost:5000${p.image}` : `/media/images/${p.image || 'placeholder.png'}`)} 
                        alt={p.productName}
                        style={{ width: "40px", height: "40px", objectFit: "contain", borderRadius: "6px", border: "1px solid #eee" }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=No+Image'; }}
                      />
                      <span style={{ fontSize: "15px" }}>{p.productName} × {p.quantity}</span>
                    </div>
                    <span style={{ fontWeight: "600" }}>₹{p.price * p.quantity}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "14px", color: "#555" }}>Payment: <span style={{ textTransform: "uppercase", fontWeight: "600" }}>{order.paymentMethod}</span></div>
                  <div style={{ fontSize: "18px", fontWeight: "bold", marginTop: "5px" }}>Total: ₹{order.totalAmount}</div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button 
                    onClick={() => navigate(`/order-tracking/${order._id}`)}
                    style={{ padding: "10px 20px", background: "#007bff", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                  >
                    Track Order
                  </button>
                  {order.orderStatus !== "Cancelled" && order.orderStatus !== "Delivered" && (
                    <button 
                      onClick={() => handleCancelOrder(order._id)}
                      style={{ padding: "10px 20px", background: "#fff", color: "#dc3545", border: "1px solid #dc3545", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;