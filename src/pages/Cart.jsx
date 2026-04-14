import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <div className="cart-page-header">
        <h1>Your Cart</h1>
        {cartItems.length > 0 && <p>{totalItems} item(s) in your cart</p>}
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-summary empty-cart-box">
          <p className="empty-text">Your cart is empty.</p>

          <Link to="/shop" className="full-width-link">
            <button type="button" className="continue-shopping-btn">
              Continue Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-image">
                  <img src={item.imageUrl} alt={item.name} />
                </div>

                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p className="cart-item-category">{item.category}</p>
                  <p className="cart-item-price">
                    ₹{Number(item.price).toLocaleString()}
                  </p>
                  <p className="cart-item-subtotal">
                    Subtotal: ₹
                    {(Number(item.price) * item.quantity).toLocaleString()}
                  </p>

                  <div className="cart-item-controls">
                    <div className="quantity-box">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        -
                      </button>

                      <button
                        type="button"
                        className="qty-value"
                        style={{ cursor: "default" }}
                      >
                        {item.quantity}
                      </button>

                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>

            <Link to="/checkout" className="full-width-link">
              <button type="button" className="checkout-btn">
                Proceed to Checkout
              </button>
            </Link>

            <Link to="/shop" className="full-width-link">
              <button type="button" className="continue-shopping-btn">
                Continue Shopping
              </button>
            </Link>

            <button
              type="button"
              className="clear-cart-btn"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}