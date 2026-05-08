import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, total, items, address, estimatedDelivery, transactionId } = location.state || {};

  useEffect(() => {
    if (!orderId) {
      navigate("/");
    }
  }, [orderId, navigate]);

  const handleDownloadInvoice = () => {
    alert("Invoice downloading... (This is a simulation)");
  };

  if (!orderId) return null;

  return (
    <div style={{ padding: "60px 20px", maxWidth: "700px", margin: "0 auto", textAlign: "center", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div style={{ marginBottom: "30px" }}>
        <div style={{ 
          width: "80px", height: "80px", background: "#e8f5e9", color: "#4caf50", 
          borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", 
          fontSize: "40px", margin: "0 auto 20px" 
        }}>
          ✓
        </div>
        <h1 style={{ color: "#1b5e20", marginBottom: "10px" }}>Order Placed Successfully!</h1>
        <p style={{ color: "#666" }}>Thank you for shopping with Warana Dairy. Your order has been received.</p>
      </div>

      <div style={{ background: "#fff", padding: "30px", borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", textAlign: "left", marginBottom: "30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
          <span style={{ fontWeight: "bold" }}>Order ID:</span>
          <span style={{ color: "#007bff" }}>{orderId}</span>
        </div>
        
        {transactionId && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>Transaction ID:</span>
            <span style={{ color: "#666", fontSize: "14px" }}>{transactionId}</span>
          </div>
        )}

        <div style={{ marginBottom: "20px" }}>
          <h4 style={{ marginBottom: "10px", fontSize: "16px" }}>Order Summary</h4>
          {items && items.map((item, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", fontSize: "14px", color: "#555" }}>
              <span>{item.productName} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", paddingTop: "10px", borderTop: "1px dashed #eee", fontWeight: "bold", fontSize: "18px" }}>
            <span>Total Amount</span>
            <span style={{ color: "#1b5e20" }}>₹{total}</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div>
            <h4 style={{ marginBottom: "10px", fontSize: "16px" }}>Delivery Address</h4>
            <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.5" }}>{address}</p>
          </div>
          <div>
            <h4 style={{ marginBottom: "10px", fontSize: "16px" }}>Estimated Delivery</h4>
            <p style={{ fontSize: "14px", color: "#666" }}>
              {new Date(estimatedDelivery).toLocaleDateString("en-IN", { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
        <button 
          onClick={() => navigate(`/order-tracking/${orderId}`)}
          style={{ padding: "12px 30px", background: "#1b5e20", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}
        >
          Track Order
        </button>
        <button 
          onClick={handleDownloadInvoice}
          style={{ padding: "12px 30px", background: "#007bff", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}
        >
          Download Invoice
        </button>
        <button 
          onClick={() => navigate("/")}
          style={{ padding: "12px 30px", background: "#fff", color: "#1b5e20", border: "2px solid #1b5e20", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default OrderSuccess;