import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [auth, setAuth] = useState({
    userToken: "",
    userName: "",
    userRole: "",
  });

  useEffect(() => {
    setAuth({
      userToken: localStorage.getItem("userToken") || "",
      userName: localStorage.getItem("userName") || "",
      userRole: localStorage.getItem("userRole") || "",
    });
  }, [location]);

  const handleCategoryClick = (category) => {
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    setAuth({
      userToken: "",
      userName: "",
      userRole: "",
    });

    navigate("/login");
  };

  const isAdmin =
    auth.userRole === "ADMIN" || auth.userRole === "ROLE_ADMIN";

  return (
    <>
      <div className="top-strip">
        <p>Elegant Jewelry for Every Occasion ✨</p>
      </div>

      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="brand-logo">
            LuxeGlow
          </Link>

          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/track-order">Track Order</Link>

            <Link to="/cart" className="cart-link">
              Cart <span className="cart-badge">{totalItems}</span>
            </Link>

            <Link to="/checkout">Checkout</Link>

            {!auth.userToken ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup" className="signup-link">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link to="/my-orders">My Orders</Link>

                <Link to="/my-account" className="user-name-link">
                  Hi, {auth.userName || "User"}
                </Link>

                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>

                {isAdmin && (
                  <Link to="/admin/dashboard" className="admin-link">
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="category-scroll">
        <div className="category-scroll-inner">
          <button onClick={() => handleCategoryClick("New Arrivals")}>
            New Arrivals
          </button>

          <button onClick={() => handleCategoryClick("Earring")}>
            Earrings
          </button>

          <button onClick={() => handleCategoryClick("Necklace")}>
            Necklaces
          </button>

          <button onClick={() => handleCategoryClick("Ring")}>Rings</button>

          <button onClick={() => handleCategoryClick("Bracelet")}>
            Bracelets
          </button>

          <button onClick={() => handleCategoryClick("Daily Wear")}>
            Daily Wear
          </button>

          <button onClick={() => handleCategoryClick("Party Wear")}>
            Party Wear
          </button>
        </div>
      </div>
    </>
  );
}