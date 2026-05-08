import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const statuses = ["Order Confirmed", "Processing", "Packed", "Out for Delivery", "Delivered"];

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrder(res.data);
    } catch (err) {
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: "100px", textAlign: "center" }}>Loading tracking info...</div>;
  if (!order) return <div style={{ padding: "100px", textAlign: "center" }}>Order not found.</div>;

  const currentStatusIndex = statuses.indexOf(order.orderStatus);

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <button 
        onClick={() => navigate("/my-orders")} 
        style={{ marginBottom: "20px", padding: "8px 16px", background: "#f8f9fa", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
      >
        ← Back to My Orders
      </button>

      <div style={{ background: "#fff", padding: "30px", borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        <h2 style={{ marginBottom: "10px", color: "#1b5e20" }}>Track Your Order</h2>
        <p style={{ color: "#666", fontSize: "14px", marginBottom: "40px" }}>Order ID: {order._id}</p>

        {/* Tracking Timeline */}
        <div style={{ position: "relative", marginBottom: "50px", padding: "0 20px" }}>
          <div style={{ 
            position: "absolute", 
            top: "15px", 
            left: "40px", 
            right: "40px", 
            height: "4px", 
            background: "#eee", 
            zIndex: 1 
          }}></div>
          <div style={{ 
            position: "absolute", 
            top: "15px", 
            left: "40px", 
            width: `${(currentStatusIndex / (statuses.length - 1)) * 90}%`, 
            height: "4px", 
            background: "#4caf50", 
            zIndex: 2,
            transition: "width 1s ease-in-out"
          }}></div>

          <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 3 }}>
            {statuses.map((s, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              
              return (
                <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100px" }}>
                  <div style={{ 
                    width: "35px", 
                    height: "35px", 
                    borderRadius: "50%", 
                    background: isCompleted ? "#4caf50" : "#fff", 
                    border: isCompleted ? "none" : "4px solid #eee",
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    color: "#fff",
                    marginBottom: "10px",
                    boxShadow: isCurrent ? "0 0 15px rgba(76, 175, 80, 0.5)" : "none"
                  }}>
                    {isCompleted ? "✓" : ""}
                  </div>
                  <span style={{ 
                    fontSize: "12px", 
                    textAlign: "center", 
                    fontWeight: isCurrent ? "bold" : "normal",
                    color: isCompleted ? "#333" : "#aaa"
                  }}>
                    {s}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {order.orderStatus === "Cancelled" && (
          <div style={{ background: "#fff5f5", color: "#c53030", padding: "15px", borderRadius: "8px", textAlign: "center", fontWeight: "bold", marginBottom: "30px" }}>
            This order has been cancelled.
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", borderTop: "1px solid #eee", paddingTop: "30px" }}>
          <div>
            <h4 style={{ marginBottom: "15px" }}>Delivery Details</h4>
            <div style={{ fontSize: "14px", lineHeight: "1.6", color: "#555" }}>
              <strong>Customer:</strong> {order.customerName}<br />
              <strong>Phone:</strong> {order.phone}<br />
              <strong>Address:</strong> {order.location}
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: "15px" }}>Estimated Delivery</h4>
            <div style={{ fontSize: "14px", color: "#555" }}>
              {order.orderStatus === "Delivered" ? (
                <span style={{ color: "#28a745", fontWeight: "bold" }}>Order Delivered</span>
              ) : (
                <span>Expected by: {new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;