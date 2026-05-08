import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      if (res.data.role !== "admin") {
        alert("Access Denied. Admins only. ❌");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("role", res.data.role);

      navigate("/admin");
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Admin Login Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ borderTop: "4px solid #ef6c00" }}>
        <div className="text-center mb-4">
          <img src="/media/images/Waranalogo.jpg" alt="Logo" className="mb-3" style={{ width: "70px", height: "70px", borderRadius: "50%" }} />
          <h2 style={{ color: "#ef6c00" }}>Admin Portal 🔐</h2>
          <p className="text-muted small">Restricted access for administrators only</p>
        </div>

        <form onSubmit={handleAdminLogin}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="text-end mb-3">
            <Link to="/forgot-password" style={{ fontSize: "13px", color: "#ef6c00", textDecoration: "none" }}>Forgot Password?</Link>
          </div>

          <button type="submit" disabled={loading} style={{ background: "#ef6c00" }}>
            {loading ? "Authenticating..." : "Admin Login"}
          </button>
        </form>

        <div className="admin-link mt-4">
          <Link to="/login">← Back to User Login</Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
