import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import Payment from "./pages/Payment";
import UPIPayment from "./pages/UPIPayment";
import MyOrders from "./pages/MyOrders";
import OrderTracking from "./pages/OrderTracking";
import OrderSuccess from "./pages/OrderSuccess";

import HomePage from "./landing_page/home/Homepage";
import DailyProductsHomepage from "./landing_page/DailyProducts/DailyProductsHomepage";
import IcecreamHomePage from "./landing_page/Icecream/IcecreamHomePage";
import WaterbottleHomepage from "./landing_page/Waterbottle/WaterbottleHomepage";
import FlavouredHomepage from "./landing_page/FlavouredMilk/FlavouredHomepage";
import BiscuitsHomepage from "./landing_page/Biscuits/BiscuitsHomepage";
import FruitsHomepage from "./landing_page/FruitsMix/FruitsHomepage";
import FestivalHomepage from "./landing_page/FestivalSpecial/FestivalHomepage";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token || role !== "admin") {
    return <Navigate to="/admin/login" />;
  }
  return children;
};

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/daily-products" element={<DailyProductsHomepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <PrivateRoute>
              <Payment />
            </PrivateRoute>
          }
        />
        <Route path="/upi-pay" element={<UPIPayment />} />
        <Route
          path="/my-orders"
          element={
            <PrivateRoute>
              <MyOrders />
            </PrivateRoute>
          }
        />
        <Route
          path="/order-tracking/:id"
          element={
            <PrivateRoute>
              <OrderTracking />
            </PrivateRoute>
          }
        />
        <Route
          path="/order-success"
          element={
            <PrivateRoute>
              <OrderSuccess />
            </PrivateRoute>
          }
        />

        <Route path="/icecream" element={<IcecreamHomePage />} />
        <Route path="/flavoured" element={<FlavouredHomepage />} />
        <Route path="/biscuits" element={<BiscuitsHomepage />} />
        <Route path="/waterbottle" element={<WaterbottleHomepage />} />
        <Route path="/fruitsMix" element={<FruitsHomepage />} />
        <Route path="/festival" element={<FestivalHomepage />} />
      </Routes>
    </>
  );
}

export default App;
