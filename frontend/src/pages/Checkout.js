import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Details, 2: Invoice, 3: Payment
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [paymentCountdown, setPaymentCountdown] = useState(30);
  const [orderStatus, setOrderStatus] = useState("idle"); // idle, processing, success
  
  const [customerName, setCustomerName] = useState(localStorage.getItem("name") || "");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  useEffect(() => {
    fetchCart();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("User Profile Data:", res.data);
      
      const profileName = res.data.name || localStorage.getItem("name") || "";
      const profilePhone = res.data.phone || "";
      const profileAddress = res.data.address || "";

      setCustomerName(profileName);
      setPhone(profilePhone);
      setLocation(profileAddress);

      // Only show the summary view if ALL details are present
      if (profileName && profilePhone && profileAddress) {
        setIsEditingAddress(false);
      } else {
        setIsEditingAddress(true);
      }
    } catch (error) {
      console.log("Error fetching profile:", error);
      setIsEditingAddress(true);
    }
  };

  useEffect(() => {
    let timer;
    if (showUPIModal && paymentCountdown > 0) {
      timer = setInterval(() => {
        setPaymentCountdown(prev => prev - 1);
      }, 1000);
    } else if (showUPIModal && paymentCountdown === 0) {
      // Automatically confirm order when countdown hits 0
      confirmOrder(true);
    }
    return () => clearInterval(timer);
  }, [showUPIModal, paymentCountdown]);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data);
    } catch (error) {
      console.log(error);
      navigate("/cart");
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleNextToInvoice = async () => {
    if (!customerName || !phone || !location) {
      alert("Please fill all shipping details first.");
      return;
    }
    
    // Auto-save address to profile when moving to next step
    try {
      const updateRes = await axios.post("http://localhost:5000/api/users/update-profile", 
        { name: customerName, phone, address: location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Profile Update Response:", updateRes.data);
      if (updateRes.data.name) {
        localStorage.setItem("name", updateRes.data.name);
      }
    } catch (error) {
      console.log("Error saving profile:", error);
    }

    setCheckoutStep(2);
  };

  const handleNextToPayment = () => {
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
    setCheckoutStep(3);
    if (paymentMethod === "upi") {
      setShowUPIModal(true);
    }
  };

  const confirmOrder = async (isUPI = false) => {
    setLoading(true);
    setOrderStatus("processing");
    try {
      await axios.post(
        "http://localhost:5000/api/orders/cod-order",
        {
          customerName,
          phone,
          location,
          products: cartItems.map((i) => ({
            productId: i.productId,
            productName: i.productName,
            price: i.price,
            quantity: i.quantity,
            image: i.image
          })),
          totalAmount: total,
          paymentMethod: isUPI ? "upi" : "cod",
          paymentStatus: isUPI ? "paid" : "pending"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setOrderStatus("success");
      
      // Delay navigation to show success message
      setTimeout(() => {
        setShowUPIModal(false);
        navigate("/");
      }, 5000);
      
    } catch (error) {
      alert("Order placement failed. Please try again.");
      setOrderStatus("idle");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p>Your cart is empty.</p>
        <button onClick={() => navigate("/cart")} style={{ marginTop: "16px", padding: "10px 20px", cursor: "pointer" }}>
          Back to Cart
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto", fontFamily: "'Inter', sans-serif" }}>
      <button 
        onClick={() => checkoutStep > 1 ? setCheckoutStep(checkoutStep - 1) : navigate(-1)} 
        style={{ marginBottom: "20px", padding: "8px 16px", background: "#f8f9fa", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
      >
        ← {checkoutStep > 1 ? "Back to Previous Step" : "Back to Cart"}
      </button>

      {/* Progress Stepper */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px", position: "relative" }}>
        {[1, 2, 3].map((step) => (
          <div key={step} style={{ zIndex: 1, textAlign: "center", flex: 1 }}>
            <div style={{
              width: "35px", height: "35px", borderRadius: "50%",
              background: checkoutStep >= step ? "#1b5e20" : "#ddd",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 10px auto", fontWeight: "bold"
            }}>{step}</div>
            <span style={{ fontSize: "12px", color: checkoutStep >= step ? "#1b5e20" : "#999", fontWeight: "600" }}>
              {step === 1 ? "Shipping" : step === 2 ? "Order Bill" : "Payment"}
            </span>
          </div>
        ))}
        <div style={{ position: "absolute", top: "17px", left: "15%", right: "15%", height: "2px", background: "#ddd", zIndex: 0 }}>
          <div style={{ height: "100%", background: "#1b5e20", width: `${(checkoutStep - 1) * 50}%`, transition: "0.3s" }} />
        </div>
      </div>

      {/* Step 1: Shipping Details */}
      {checkoutStep === 1 && (
        <div style={{ background: "#fff", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #eee" }}>
          <h3 style={{ marginBottom: "30px", color: "#1b5e20", fontWeight: "700" }}>Shipping Information</h3>
          
          {!isEditingAddress && customerName && phone && location ? (
            <div style={{ position: "relative", padding: "20px", border: "1px solid #e0e0e0", borderRadius: "10px", background: "#f9f9f9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <div>
                  <p style={{ margin: 0, fontWeight: "700", fontSize: "18px" }}>{customerName}</p>
                  <p style={{ margin: "5px 0", color: "#666" }}>{phone}</p>
                </div>
                <button 
                  onClick={() => setIsEditingAddress(true)}
                  style={{ padding: "6px 15px", background: "#fff", border: "1px solid #1b5e20", color: "#1b5e20", borderRadius: "5px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}
                >
                  Change
                </button>
              </div>
              <p style={{ margin: 0, color: "#444", lineHeight: "1.6" }}>{location}</p>
              
              <button
                onClick={handleNextToInvoice}
                style={{
                  marginTop: "25px", width: "100%", padding: "15px", background: "#1b5e20",
                  color: "#fff", border: "none", borderRadius: "10px",
                  cursor: "pointer", fontWeight: "700", fontSize: "16px",
                  boxShadow: "0 5px 15px rgba(27,94,32,0.2)"
                }}
              >
                Continue to Bill
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "25px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontWeight: "600", fontSize: "14px", color: "#444" }}>Full Name</label>
                <input 
                  type="text" placeholder="Enter your full name" value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{ padding: "12px 15px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "16px", outline: "none" }}
                />
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontWeight: "600", fontSize: "14px", color: "#444" }}>Phone Number</label>
                <input 
                  type="text" placeholder="Enter 10-digit mobile number" value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ padding: "12px 15px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "16px", outline: "none" }}
                />
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontWeight: "600", fontSize: "14px", color: "#444" }}>Delivery Address</label>
                <textarea 
                  placeholder="House No, Street, Landmark, City" value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ padding: "12px 15px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "16px", outline: "none", height: "100px", resize: "none" }}
                />
              </div>

              <button
                onClick={handleNextToInvoice}
                style={{
                  marginTop: "10px", padding: "15px", background: "#1b5e20",
                  color: "#fff", border: "none", borderRadius: "10px",
                  cursor: "pointer", fontWeight: "700", fontSize: "16px",
                  boxShadow: "0 5px 15px rgba(27,94,32,0.2)"
                }}
              >
                Continue to Bill
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Professional Invoice / Bill */}
      {checkoutStep === 2 && (
        <div style={{ background: "#fff", padding: "0", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", border: "1px solid #eee", overflow: "hidden" }}>
          <div style={{ background: "#1b5e20", padding: "30px", color: "#fff", textAlign: "center" }}>
            <h2 style={{ margin: 0, letterSpacing: "1px" }}>ORDER INVOICE</h2>
            <p style={{ margin: "5px 0 0 0", opacity: 0.8 }}>Warana Dairy Products</p>
          </div>

          <div style={{ padding: "40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
              <div>
                <h5 style={{ color: "#888", marginBottom: "10px", fontSize: "12px", textTransform: "uppercase" }}>Bill To:</h5>
                <p style={{ margin: 0, fontWeight: "700", fontSize: "18px" }}>{customerName}</p>
                <p style={{ margin: "5px 0", color: "#666" }}>{phone}</p>
                <p style={{ margin: 0, color: "#666", maxWidth: "250px" }}>{location}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <h5 style={{ color: "#888", marginBottom: "10px", fontSize: "12px", textTransform: "uppercase" }}>Invoice Date:</h5>
                <p style={{ margin: 0, fontWeight: "600" }}>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                  <th style={{ textAlign: "left", padding: "15px 0", color: "#444" }}>Product Description</th>
                  <th style={{ textAlign: "center", padding: "15px 0", color: "#444" }}>Qty</th>
                  <th style={{ textAlign: "right", padding: "15px 0", color: "#444" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item._id} style={{ borderBottom: "1px solid #f9f9f9" }}>
                    <td style={{ padding: "15px 0", fontWeight: "500" }}>{item.productName}</td>
                    <td style={{ padding: "15px 0", textAlign: "center" }}>{item.quantity}</td>
                    <td style={{ padding: "15px 0", textAlign: "right", fontWeight: "600" }}>₹{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginLeft: "auto", maxWidth: "300px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ color: "#666" }}>Subtotal:</span>
                <span style={{ fontWeight: "600" }}>₹{total}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <span style={{ color: "#666" }}>Delivery Fee:</span>
                <span style={{ color: "#28a745", fontWeight: "600" }}>FREE</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "15px 0", borderTop: "2px solid #1b5e20" }}>
                <span style={{ fontWeight: "700", fontSize: "20px" }}>Total Amount:</span>
                <span style={{ fontWeight: "800", fontSize: "22px", color: "#1b5e20" }}>₹{total}</span>
              </div>
            </div>

            <div style={{ marginTop: "40px", padding: "20px", background: "#f8f9fa", borderRadius: "10px" }}>
              <h5 style={{ margin: "0 0 15px 0", color: "#444" }}>Select Payment Method:</h5>
              <div style={{ display: "flex", gap: "20px" }}>
                <label style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px", padding: "15px", border: paymentMethod === "upi" ? "2px solid #1b5e20" : "1px solid #ddd", borderRadius: "10px", cursor: "pointer", background: paymentMethod === "upi" ? "#f1f8e9" : "#fff" }}>
                  <input type="radio" name="pay" value="upi" onChange={() => setPaymentMethod("upi")} checked={paymentMethod === "upi"} />
                  <strong>UPI Payment</strong>
                </label>
                <label style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px", padding: "15px", border: paymentMethod === "cod" ? "2px solid #1b5e20" : "1px solid #ddd", borderRadius: "10px", cursor: "pointer", background: paymentMethod === "cod" ? "#f1f8e9" : "#fff" }}>
                  <input type="radio" name="pay" value="cod" onChange={() => setPaymentMethod("cod")} checked={paymentMethod === "cod"} />
                  <strong>Cash on Delivery</strong>
                </label>
              </div>
            </div>

            <button
              onClick={handleNextToPayment}
              style={{
                width: "100%", marginTop: "30px", padding: "18px", background: "#1b5e20",
                color: "#fff", border: "none", borderRadius: "10px",
                cursor: "pointer", fontWeight: "700", fontSize: "18px",
                boxShadow: "0 5px 15px rgba(27,94,32,0.2)"
              }}
            >
              {paymentMethod === "upi" ? "Generate Scanner & Pay" : "Confirm Order (COD)"}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Payment / Final Confirmation */}
      {checkoutStep === 3 && paymentMethod === "cod" && (
        <div style={{ textAlign: "center", padding: "60px 40px", background: "#fff", borderRadius: "20px", border: "1px solid #eee" }}>
          <div style={{ width: "80px", height: "80px", background: "#e8f5e9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 30px auto" }}>
            <span style={{ fontSize: "40px" }}>🚚</span>
          </div>
          <h2 style={{ color: "#1b5e20", marginBottom: "15px" }}>Ready to confirm?</h2>
          <p style={{ color: "#666", marginBottom: "40px", fontSize: "18px" }}>Your order of <strong>₹{total}</strong> will be delivered to your address. You can pay our delivery partner in cash.</p>
          <button
            onClick={() => confirmOrder(false)}
            disabled={loading}
            style={{
              padding: "15px 50px", background: "#1b5e20", color: "#fff",
              border: "none", borderRadius: "10px", cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "700", fontSize: "18px"
            }}
          >
            {loading ? "Placing Order..." : "Yes, Confirm Order"}
          </button>
        </div>
      )}

      {/* UPI Payment Modal (Scanner) */}
      {showUPIModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center",
          alignItems: "center", zIndex: 1000, backdropFilter: "blur(5px)"
        }}>
          <div style={{
            background: "#fff", padding: "40px", borderRadius: "24px",
            width: "90%", maxWidth: "420px", textAlign: "center", position: "relative",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
          }}>
            {orderStatus === "success" ? (
              <div style={{ padding: "20px", animation: "fadeIn 0.5s ease" }}>
                <div style={{ 
                  width: "100px", height: "100px", background: "#e8f5e9", 
                  borderRadius: "50%", display: "flex", alignItems: "center", 
                  justifyContent: "center", margin: "0 auto 30px auto" 
                }}>
                  <span style={{ fontSize: "50px" }}>✅</span>
                </div>
                <h2 style={{ color: "#1b5e20", marginBottom: "10px", fontSize: "28px" }}>Payment Done!</h2>
                <p style={{ color: "#444", fontSize: "18px", marginBottom: "20px" }}>Your order has been placed successfully.</p>
                <div style={{ padding: "20px", background: "#f1f8e9", borderRadius: "15px", border: "1px solid #c8e6c9" }}>
                  <h3 style={{ margin: 0, color: "#1b5e20" }}>Thank You!</h3>
                  <p style={{ margin: "5px 0 0 0", color: "#666" }}>We appreciate your business.</p>
                </div>
                <p style={{ marginTop: "30px", color: "#999", fontSize: "14px" }}>Redirecting to home page...</p>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => { setShowUPIModal(false); setCheckoutStep(2); setPaymentCountdown(30); }}
                  style={{
                    position: "absolute", top: "20px", right: "20px", border: "none",
                    background: "#f0f0f0", width: "30px", height: "30px", borderRadius: "50%",
                    fontSize: "16px", cursor: "pointer", color: "#666", display: "flex", alignItems: "center", justifyContent: "center"
                  }}
                >✕</button>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "15px", marginBottom: "25px" }}>
                  <div style={{
                    width: "50px", height: "50px", borderRadius: "50%",
                    background: "#a6897c", color: "#fff", display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "600"
                  }}>A</div>
                  <div style={{ textAlign: "left" }}>
                    <h3 style={{ margin: 0, fontSize: "20px", color: "#333", fontWeight: "700" }}>Akanksha Mane</h3>
                    <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>Warana Authorized Merchant</p>
                  </div>
                </div>

                <div style={{
                  background: "#fff", padding: "25px", borderRadius: "20px",
                  border: "1px solid #f0f0f0", marginBottom: "25px",
                  boxShadow: "inset 0 0 10px rgba(0,0,0,0.02)"
                }}>
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=akankshamane64@oksbi&pn=Akanksha%20Mane&am=${total}&cu=INR`)}`}
                    alt="UPI QR Code"
                    style={{ width: "230px", height: "230px", marginBottom: "20px" }}
                  />
                  <p style={{ margin: "0 0 8px 0", color: "#555", fontSize: "14px" }}>Scan using PhonePe, GPay or Paytm</p>
                  <div style={{ padding: "10px", background: "#f1f8e9", borderRadius: "8px", display: "inline-block" }}>
                    <p style={{ margin: 0, color: "#1b5e20", fontWeight: "800", fontSize: "22px" }}>₹{total}.00</p>
                  </div>
                </div>

                <div style={{ marginBottom: "25px", textAlign: "left", fontSize: "13px", color: "#666", padding: "0 10px" }}>
                  <p style={{ margin: "0 0 5px 0" }}>• UPI ID: <strong>akankshamane64@oksbi</strong></p>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#1b5e20", fontWeight: "600" }}>
                    <div className="dot-pulse" style={{ width: "8px", height: "8px", background: "#1b5e20", borderRadius: "50%" }}></div>
                    <span>Detecting payment automatically in {paymentCountdown}s...</span>
                  </div>
                </div>

                <button
                  onClick={() => confirmOrder(true)}
                  disabled={loading}
                  style={{
                    width: "100%", padding: "16px", background: loading ? "#ccc" : "#007bff",
                    color: "#fff", border: "none", borderRadius: "12px",
                    cursor: loading ? "not-allowed" : "pointer", fontWeight: "700", fontSize: "16px",
                    boxShadow: "0 5px 15px rgba(0,123,255,0.2)"
                  }}
                >
                  {loading ? "Verifying with Bank..." : "I have paid manually"}
                </button>
                <p style={{ marginTop: "15px", fontSize: "12px", color: "#999" }}>Wait for automatic detection or click above if you've paid</p>
              </>
            )}
          </div>
        </div>
      )}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dot-pulse {
          animation: pulse 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default Checkout;