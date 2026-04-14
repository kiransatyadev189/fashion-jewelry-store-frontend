import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCategoryClick = (category) => {
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

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
            <Link to="/cart" className="cart-link">
              Cart <span className="cart-badge">{totalItems}</span>
            </Link>
            <Link to="/checkout">Checkout</Link>
          </div>
        </div>
      </nav>

      <div className="category-scroll">
        <div className="category-scroll-inner">
          <button type="button" onClick={() => handleCategoryClick("New Arrivals")}>
            New Arrivals
          </button>

          <button type="button" onClick={() => handleCategoryClick("Earring")}>
            Earrings
          </button>

          <button type="button" onClick={() => handleCategoryClick("Necklace")}>
            Necklaces
          </button>

          <button type="button" onClick={() => handleCategoryClick("Ring")}>
            Rings
          </button>

          <button type="button" onClick={() => handleCategoryClick("Bracelet")}>
            Bracelets
          </button>

          <button type="button" onClick={() => handleCategoryClick("Daily Wear")}>
            Daily Wear
          </button>

          <button type="button" onClick={() => handleCategoryClick("Party Wear")}>
            Party Wear
          </button>
        </div>
      </div>
    </>
  );
}