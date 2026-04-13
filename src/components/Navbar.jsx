import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cartItems } = useCart();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <h2 className="brand-logo">LuxeGlow Jewelry</h2>

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
  );
}