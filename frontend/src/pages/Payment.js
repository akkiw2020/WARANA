import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, total, customerName, phone, address } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState("card"); // "card" or "upi"
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Card details state
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });

  // UPI state
  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (paymentMethod === "card" && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)) {
      alert("Please fill in all card details");
      return;
    }
    
    if (paymentMethod === "upi" && !upiId) {
      alert("Please enter your UPI ID");
      return;
    }

    setLoading(true);
    // Simulate payment processing
    setTimeout(async () => {
      try {
        await axios.post(
          "http://localhost:5000/api/orders/cod-order", // Using existing route for simulation
          {
            customerName,
            phone,
            location: address,
            products: cartItems.map((i) => ({
              productId: i.productId,
              productName: i.productName,
              price: i.price,
              quantity: i.quantity,
            })),
            totalAmount: total,
            paymentMethod: paymentMethod === "card" ? "online_card" : "online_upi",
            paymentStatus: "paid"
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Payment Successful! Your order has been placed.");
        navigate("/");
      } catch (error) {
        alert("Payment failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: "20px", padding: "8px 16px", background: "#f8f9fa", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer" }}
      >
        ← Back to Checkout
      </button>
      
      <h2 style={{ marginBottom: "30px" }}>Online Payment</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        {/* Left Side: Payment Options */}
        <div>
          <div style={{ background: "#fff", padding: "25px", borderRadius: "10px", border: "1px solid #eee", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <h4 style={{ marginBottom: "20px" }}>Select Payment Method</h4>
            
            <div style={{ display: "grid", gap: "15px", marginBottom: "30px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "15px", border: paymentMethod === "card" ? "2px solid #007bff" : "1px solid #eee", borderRadius: "8px", background: paymentMethod === "card" ? "#f0f7ff" : "#fff" }}>
                <input type="radio" name="method" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
                <div>
                  <div style={{ fontWeight: "bold" }}>Credit / Debit Card</div>
                  <div style={{ fontSize: "12px", color: "#666" }}>Visa, Mastercard, RuPay</div>
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "15px", border: paymentMethod === "upi" ? "2px solid #007bff" : "1px solid #eee", borderRadius: "8px", background: paymentMethod === "upi" ? "#f0f7ff" : "#fff" }}>
                <input type="radio" name="method" value="upi" checked={paymentMethod === "upi"} onChange={() => setPaymentMethod("upi")} />
                <div>
                  <div style={{ fontWeight: "bold" }}>UPI Payment</div>
                  <div style={{ fontSize: "12px", color: "#666" }}>Google Pay, PhonePe, Paytm</div>
                </div>
              </label>
            </div>

            <form onSubmit={handlePayment}>
              {paymentMethod === "card" && (
                <div style={{ display: "grid", gap: "15px", animation: "fadeIn 0.5s" }}>
                  <input 
                    type="text" placeholder="Card Number" 
                    value={cardDetails.number} onChange={e => setCardDetails({...cardDetails, number: e.target.value})}
                    style={{ padding: "12px", borderRadius: "6px", border: "1px solid #ddd" }}
                  />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    <input 
                      type="text" placeholder="MM/YY" 
                      value={cardDetails.expiry} onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})}
                      style={{ padding: "12px", borderRadius: "6px", border: "1px solid #ddd" }}
                    />
                    <input 
                      type="password" placeholder="CVV" 
                      value={cardDetails.cvv} onChange={e => setCardDetails({...cardDetails, cvv: e.target.value})}
                      style={{ padding: "12px", borderRadius: "6px", border: "1px solid #ddd" }}
                    />
                  </div>
                  <input 
                    type="text" placeholder="Name on Card" 
                    value={cardDetails.name} onChange={e => setCardDetails({...cardDetails, name: e.target.value})}
                    style={{ padding: "12px", borderRadius: "6px", border: "1px solid #ddd" }}
                  />
                </div>
              )}

              {paymentMethod === "upi" && (
                <div style={{ animation: "fadeIn 0.5s" }}>
                  <input 
                    type="text" placeholder="Enter UPI ID (e.g. user@okaxis)" 
                    value={upiId} onChange={e => setUpiId(e.target.value)}
                    style={{ padding: "12px", borderRadius: "6px", border: "1px solid #ddd", width: "100%", boxSizing: "border-box" }}
                  />
                  <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>A payment request will be sent to your UPI app</p>
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                style={{ 
                  width: "100%", marginTop: "25px", padding: "15px", 
                  background: "#1b5e20", color: "#fff", border: "none", 
                  borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "bold", fontSize: "16px"
                }}
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div style={{ position: "sticky", top: "20px", height: "fit-content" }}>
          <div style={{ background: "#fff", padding: "25px", borderRadius: "10px", border: "1px solid #eee" }}>
            <h4 style={{ marginBottom: "20px" }}>Payment Summary</h4>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span>Order Amount</span>
              <span>₹{total}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span>Delivery Charges</span>
              <span style={{ color: "#28a745" }}>FREE</span>
            </div>
            <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid #eee" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "bold" }}>
              <span>Total to Pay</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Payment;