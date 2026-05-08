import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        token,
        newPassword
      });
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to reset password. Link may be expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-4">
          <img src="/media/images/Waranalogo.jpg" alt="Logo" className="mb-3" style={{ width: "70px", height: "70px", borderRadius: "50%" }} />
          <h2>Reset Password</h2>
          <p className="text-muted small">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength="6"
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength="6"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <div className={`mt-3 alert ${message.includes("successful") ? "alert-success" : "alert-danger"}`} style={{ fontSize: "14px", padding: "10px", borderRadius: "5px", marginTop: "15px" }}>
            {message}
          </div>
        )}

        <div className="text-center mt-4">
          <Link to="/login" className="small">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
