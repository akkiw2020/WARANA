import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const name = localStorage.getItem("name") || "";
  const role = localStorage.getItem("role") || "user";

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const handleCartClick = () => {
    if (!token) {
      alert("Please login to access cart");
      navigate("/login");
    } else {
      navigate("/cart");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    setToken(null);
    navigate("/");
  };

  return (
    <nav className="navbar glass">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link to="/" className="logo d-flex align-items-center" style={{ textDecoration: 'none' }}>
          <img src="/media/images/Waranalogo.jpg" alt="Logo" width="45" height="45" className="me-2 rounded-circle" />
          <span>WARANA <span style={{ color: '#4caf50' }}>DAIRY</span></span>
        </Link>

        <div className="nav-links">
          <Link to="/" className="d-none d-md-block">Home</Link>
          <Link to="/daily-products" className="d-none d-md-block">Products</Link>
          
          {!token ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="register-btn">Register</Link>
            </>
          ) : (
            <>
              <span className="welcome-text d-none d-lg-block">
                {name ? `Welcome, ${name} 👋` : ""}
              </span>

              {role === "admin" && (
                <>
                  <button
                    onClick={() => navigate("/admin")}
                    className="admin-badge"
                  >
                    Admin Portal
                  </button>
                  <button
                    onClick={() => navigate("/admin?tab=products#add-product-form")}
                    className="quick-add-btn"
                  >
                    <i className="bi bi-plus-circle me-1"></i> Add Product
                  </button>
                </>
              )}

              {role === "admin" && (
                <button onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("name");
                  localStorage.removeItem("role");
                  navigate("/admin/login");
                  window.location.reload();
                }} className="logout-btn">
                  Logout
                </button>
              )}

              {role !== "admin" && (
                <>
                  <button onClick={() => navigate("/my-orders")} className="orders-btn" style={{ background: "none", border: "none", cursor: "pointer", color: "#333", marginRight: "15px" }}>
                    My Orders
                  </button>
                  <button onClick={handleCartClick} className="cart-btn">
                    <i className="bi bi-cart3 me-1"></i> My Cart
                  </button>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <style>{`
        .welcome-text {
          font-size: 14px;
          color: #555;
          margin-right: 15px;
        }
        .admin-badge {
          background: #fff3e0;
          color: #ef6c00;
          border: 1px solid #ffe0b2;
          padding: 6px 12px;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 600;
          margin-right: 10px;
        }
        .quick-add-btn {
          background: #e3f2fd;
          color: #1976d2;
          border: 1px solid #bbdefb;
          padding: 6px 12px;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 600;
          margin-right: 10px;
          transition: 0.3s;
        }
        .quick-add-btn:hover {
          background: #1976d2;
          color: white;
        }
        .register-btn {
          background: #4caf50 !important;
          color: white !important;
          padding: 8px 20px !important;
          border-radius: 50px !important;
          font-weight: 600 !important;
        }
        .register-btn:hover {
          background: #43a047 !important;
          box-shadow: 0 4px 10px rgba(76, 175, 80, 0.2);
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
