import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState(""); // For demo purposes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage("If an account exists with this email, you will receive a reset link.");
      if (res.data.resetToken) {
        setResetToken(res.data.resetToken);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-4">
          <img src="/media/images/Waranalogo.jpg" alt="Logo" className="mb-3" style={{ width: "70px", height: "70px", borderRadius: "50%" }} />
          <h2>Forgot Password</h2>
          <p className="text-muted small">Enter your email to reset your password</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <div className={`mt-3 alert ${message.includes("wrong") ? "alert-danger" : "alert-success"}`} style={{ fontSize: "14px", padding: "10px", borderRadius: "5px", marginTop: "15px" }}>
            {message}
          </div>
        )}

        {resetToken && (
          <div className="mt-3 p-3 bg-light border rounded">
            <p className="small mb-1"><strong>Demo Mode:</strong> Use the link below to reset password (this replaces the email link)</p>
            <Link to={`/reset-password/${resetToken}`} className="btn btn-sm btn-outline-primary w-100">Reset Password Now</Link>
          </div>
        )}

        <div className="text-center mt-4">
          <Link to="/login" className="small">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
