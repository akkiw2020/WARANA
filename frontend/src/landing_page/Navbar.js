

// import { Link } from "react-router-dom";

// function Navbar() {
//   return (
//     <nav className="navbar">
//       <div className="logo">Warana Dairy</div>

//       <div className="nav-links">
//         <Link to="/login">Login</Link>
//         <Link to="/register">Register</Link>
//         <Link to="/cart">🛒 Cart (0)</Link>
//       </div>
//     </nav>
//   );
// }
// export default Navbar;

// import { Link } from "react-router-dom";

// function Navbar() {

//   const token = localStorage.getItem("token");

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     window.location.href = "/";
//   };

//   return (
//     <nav className="navbar">
//       <div className="logo">Warana Dairy</div>

//       <div className="nav-links">
//         {!token ? (
//           <>
//             <Link to="/login">Login</Link>
//             <Link to="/register">Register</Link>
//           </>
//         ) : (
//           <>
//             <Link to="/cart">🛒 Cart (0)</Link>
//             <button onClick={handleLogout}>Logout</button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

// export default Navbar;
