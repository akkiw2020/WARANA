import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("role", res.data.role || "user");

      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("Google login success:", credentialResponse);
    setLoading(true);
    try {
      // Send the credential to your backend for verification and login/registration
      const res = await axios.post("http://localhost:5000/api/auth/google-login", {
        token: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("role", res.data.role || "user");

      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
      window.location.reload();
    } catch (error) {
      console.error("Google login failed on backend:", error);
      alert(error.response?.data?.message || "Google Login Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google Login Failed:', error);
    alert("Google Login Failed. If you see 'invalid_client' or 'no registered origin', please check your Google Cloud Console settings.");
  };

  const isGoogleConfigured = process.env.REACT_APP_GOOGLE_CLIENT_ID && process.env.REACT_APP_GOOGLE_CLIENT_ID !== "your_google_client_id_here";

  return (
    <GoogleOAuthProvider clientId={isGoogleConfigured ? process.env.REACT_APP_GOOGLE_CLIENT_ID : "placeholder"}>
      <div className="auth-container">
        <div className="auth-card">
          <div className="text-center mb-4">
            <img src="/media/images/Waranalogo.jpg" alt="Logo" className="mb-3" style={{ width: "70px", height: "70px", borderRadius: "50%" }} />
            <h2>Welcome Back 👋</h2>
            <p className="text-muted small">Login to order fresh dairy products</p>
          </div>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email Address"
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
              <Link to="/forgot-password" style={{ fontSize: "13px", color: "#2e7d32", textDecoration: "none" }}>Forgot Password?</Link>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="text-center my-3">
            <p>— OR —</p>
            {isGoogleConfigured ? (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="continue_with"
                shape="rectangular"
                width="100%"
              />
            ) : (
              <div className="alert alert-warning small">
                Google Login is not configured. Please set your Client ID in .env
              </div>
            )}
          </div>

          <p className="text-center mt-4 small">
            Don't have an account? <Link to="/register">Register</Link>
          </p>

          <div className="admin-link mt-3">
            <Link to="/admin/login">Admin Login</Link>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
