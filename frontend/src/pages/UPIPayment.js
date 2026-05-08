import React, { useState, useEffect } from "react";

function UPIPayment() {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [paymentStep, setPaymentStep] = useState("input"); // input, waiting, success

  const MERCHANT_UPI_ID = "9370907332@ibl";
  const MERCHANT_NAME = "Warana Dairy";

  useEffect(() => {
    const checkMobile = /Android|iPhone|iPad|iPod|webOS|Blackberry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(checkMobile);
  }, []);

  const generateUPILink = (amt) => {
    return `upi://pay?pa=${MERCHANT_UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amt}&cu=INR&tn=${encodeURIComponent("Payment to Warana Dairy")}&tr=TXN${Date.now()}`;
  };

  const validateAmount = (amt) => {
    if (!amt || amt.trim() === "") {
      setError("Please enter an amount");
      return false;
    }
    const numAmt = parseFloat(amt);
    if (isNaN(numAmt) || numAmt <= 0) {
      setError("Amount must be greater than 0");
      return false;
    }
    setError("");
    return true;
  };

  const handlePay = () => {
    if (!validateAmount(amount)) return;

    setLoading(true);
    setError("");

    if (isMobile) {
      // On mobile, open UPI app
      const upiLink = generateUPILink(amount);
      window.location.href = upiLink;

      // Switch to waiting screen after a small delay
      setTimeout(() => {
        setLoading(false);
        setPaymentStep("waiting");
      }, 1500);
    } else {
      // On desktop, show QR code
      setTimeout(() => {
        setLoading(false);
        setShowQR(true);
      }, 1000);
    }
  };

  const handleManualConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPaymentStep("success");
    }, 1500);
  };

  const handleCloseQR = () => {
    setShowQR(false);
    setPaymentStep("waiting");
  };

  if (paymentStep === "waiting") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        textAlign: "center",
        fontFamily: "'Google Sans', Roboto, Arial, sans-serif"
      }}>
        <div style={{
          width: "80px",
          height: "80px",
          background: "#f8f9ff",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "40px",
          marginBottom: "40px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
        }}>📱</div>

        <h2 style={{ fontSize: "24px", fontWeight: "500", color: "#202124", marginBottom: "16px" }}>
          Complete Payment in UPI App
        </h2>

        <p style={{ color: "#5f6368", fontSize: "16px", lineHeight: "1.5", maxWidth: "320px", marginBottom: "40px" }}>
          We have opened your UPI app. Please complete the transaction of <strong>₹{amount}</strong> and return here.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", maxWidth: "320px" }}>
          <button
            onClick={handleManualConfirm}
            disabled={loading}
            style={{
              padding: "16px 32px",
              background: "#1a73e8",
              color: "#fff",
              border: "none",
              borderRadius: "24px",
              fontWeight: "500",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "0.2s",
              boxShadow: "0 1px 3px rgba(60,64,67,0.3)"
            }}
          >
            {loading ? "Verifying..." : "I have completed payment"}
          </button>

          <button
            onClick={() => setPaymentStep("input")}
            style={{
              padding: "12px",
              background: "none",
              border: "none",
              color: "#1a73e8",
              fontWeight: "500",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            Payment not working? Try again
          </button>
        </div>
      </div>
    );
  }

  if (paymentStep === "success") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        textAlign: "center",
        fontFamily: "'Google Sans', Roboto, Arial, sans-serif"
      }}>
        <div style={{
          width: "100px",
          height: "100px",
          background: "#e6f4ea",
          color: "#1e8e3e",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "50px",
          marginBottom: "30px",
          animation: "scaleUp 0.5s ease-out"
        }}>✓</div>
        <h2 style={{ fontSize: "28px", fontWeight: "500", color: "#202124", marginBottom: "10px" }}>Payment Successful</h2>
        <p style={{ color: "#5f6368", fontSize: "16px" }}>Your transaction of ₹{amount} was successful.</p>
        <button
          onClick={() => setPaymentStep("input")}
          style={{
            marginTop: "40px",
            padding: "12px 30px",
            background: "#1a73e8",
            color: "#fff",
            border: "none",
            borderRadius: "24px",
            fontWeight: "500",
            cursor: "pointer"
          }}
        >Make Another Payment</button>
        <style>{`
          @keyframes scaleUp { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    }}>
      {/* Payment Card */}
      <div style={{
        background: "#fff",
        borderRadius: "24px",
        padding: "40px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Header Pattern */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "8px",
          background: "linear-gradient(90deg, #4caf50, #8bc34a, #cddc39)"
        }}></div>

        {/* Logo/Icon */}
        <div style={{
          width: "64px",
          height: "64px",
          background: "linear-gradient(135deg, #4caf50, #8bc34a)",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px",
          boxShadow: "0 8px 20px rgba(76, 175, 80, 0.3)"
        }}>
          <span style={{ fontSize: "32px" }}>💳</span>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: "28px",
          fontWeight: "700",
          color: "#1a1a2e",
          textAlign: "center",
          marginBottom: "8px"
        }}>
          Make Payment
        </h1>
        <p style={{
          fontSize: "14px",
          color: "#666",
          textAlign: "center",
          marginBottom: "32px"
        }}>
          Pay securely via UPI
        </p>

        {/* Amount Input */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "600",
            color: "#333",
            marginBottom: "8px"
          }}>
            Enter Amount
          </label>
          <div style={{
            display: "flex",
            alignItems: "center",
            border: "2px solid #e8e8e8",
            borderRadius: "12px",
            overflow: "hidden",
            transition: "border-color 0.3s",
            focusWithin: { borderColor: "#4caf50" }
          }}>
            <span style={{
              padding: "16px",
              background: "#f8f8f8",
              color: "#333",
              fontSize: "20px",
              fontWeight: "700",
              borderRight: "2px solid #e8e8e8"
            }}>₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (error) validateAmount(e.target.value);
              }}
              placeholder="0.00"
              style={{
                flex: 1,
                padding: "16px",
                border: "none",
                outline: "none",
                fontSize: "24px",
                fontWeight: "600",
                color: "#1a1a2e"
              }}
            />
          </div>
          {error && (
            <p style={{
              color: "#e53935",
              fontSize: "12px",
              marginTop: "8px",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}>
              <span>⚠️</span> {error}
            </p>
          )}
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePay}
          disabled={loading}
          style={{
            width: "100%",
            padding: "18px",
            background: loading ? "#ccc" : "linear-gradient(135deg, #4caf50, #45a049)",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontSize: "18px",
            fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.3s",
            boxShadow: loading ? "none" : "0 8px 20px rgba(76, 175, 80, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px"
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(76, 175, 80, 0.5)";
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(76, 175, 80, 0.4)";
          }}
        >
          {loading ? (
            <>
              <div style={{
                width: "20px",
                height: "20px",
                border: "3px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }}></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>⚡</span>
              <span>Pay ₹{amount || "0"}</span>
            </>
          )}
        </button>

        {/* Success Message */}
        {success && (
          <div style={{
            marginTop: "20px",
            padding: "16px",
            background: "#e8f5e9",
            borderRadius: "12px",
            textAlign: "center",
            animation: "fadeIn 0.3s ease"
          }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>✅</div>
            <p style={{ color: "#2e7d32", fontWeight: "600", margin: 0 }}>
              Payment initiated! Complete it in your UPI app.
            </p>
          </div>
        )}

        {/* Footer Note */}
        <p style={{
          textAlign: "center",
          fontSize: "12px",
          color: "#999",
          marginTop: "24px"
        }}>
          🔒 Scan QR or use UPI app to complete payment
        </p>

        {/* UPI Apps */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          marginTop: "16px"
        }}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png" alt="GPay" style={{ height: "24px", opacity: 0.7 }} />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/512px-PhonePe_Logo.svg.png" alt="PhonePe" style={{ height: "24px", opacity: 0.7 }} />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/512px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" style={{ height: "24px", opacity: 0.7 }} />
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(4px)"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "32px",
            textAlign: "center",
            maxWidth: "360px",
            width: "90%",
            animation: "slideUp 0.3s ease"
          }}>
            <button
              onClick={handleCloseQR}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#999"
              }}
            >✕</button>

            <h3 style={{ marginBottom: "8px", color: "#1a1a2e" }}>Scan QR Code</h3>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
              Pay <strong>₹{amount}</strong> to Warana Dairy
            </p>

            <div style={{
              background: "#f8f8f8",
              padding: "16px",
              borderRadius: "16px",
              display: "inline-block",
              marginBottom: "20px"
            }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(generateUPILink(amount))}`}
                alt="Payment QR"
                style={{ width: "200px", height: "200px" }}
              />
            </div>

            <p style={{ fontSize: "12px", color: "#999", marginBottom: "16px" }}>
              Open any UPI app and scan this QR code
            </p>

            <button
              onClick={handleCloseQR}
              style={{
                width: "100%",
                padding: "14px",
                background: "#4caf50",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              I've Completed Payment
            </button>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default UPIPayment;