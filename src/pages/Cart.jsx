import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = (item) => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="page cart-page">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some beautiful jewelry to continue shopping.</p>
          <Link to="/shop" className="primary-btn empty-cart-btn">
            Go to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page cart-page">
      <h1 className="section-title">Your Cart</h1>

      <div className="cart-list">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image-wrap">
              <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
            </div>

            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p className="cart-price">Price: ₹{item.price.toLocaleString()}</p>

              <div className="quantity-controls">
                <button
                  type="button"
                  onClick={() => handleDecrease(item)}
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => handleIncrease(item)}
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  +
                </button>
              </div>

              <p className="cart-subtotal">
                Subtotal: ₹{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>

            <div className="cart-item-actions">
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <hr className="cart-divider" />

      <div className="cart-summary">
        <h2 className="cart-total">Total: ₹{totalPrice.toLocaleString()}</h2>
        <button
          type="button"
          className="checkout-btn"
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}