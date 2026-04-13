import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    address: "",
  });

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const orderData = {
      customerName: formData.customerName,
      email: formData.email,
      address: formData.address,
      totalAmount,
      items: cartItems.map((item) => ({
        productId: item.id,
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      clearCart();
      navigate("/order-success");
    } catch (error) {
      console.error("Order error:", error);
      alert("Something went wrong while placing the order.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="page checkout-page">
        <div className="empty-cart">
          <h2>Your cart is empty.</h2>
          <p>Please add products before proceeding to checkout.</p>
          <Link to="/shop" className="primary-btn empty-cart-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page checkout-page">
      <h2 className="section-title">Checkout</h2>

      <div className="checkout-container">
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <h3>Shipping Details</h3>

          <div className="form-group">
            <label htmlFor="customerName">Full Name</label>
            <input
              id="customerName"
              type="text"
              name="customerName"
              placeholder="Enter your full name"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Shipping Address</label>
            <textarea
              id="address"
              name="address"
              placeholder="Enter your shipping address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="place-order-btn">
            Place Order
          </button>
        </form>

        <div className="order-summary">
          <h3>Order Summary</h3>

          {cartItems.map((item) => (
            <div key={item.id} className="summary-item">
              <div className="summary-item-top">
                <span className="summary-name">{item.name}</span>
                <span className="summary-qty">Qty: {item.quantity}</span>
              </div>
              <p className="summary-price">
                ₹{item.price.toLocaleString()} each
              </p>
              <p className="summary-line-total">
                Line Total: ₹{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}

          <hr className="summary-divider" />

          <h4>Total: ₹{totalAmount.toLocaleString()}</h4>
        </div>
      </div>
    </div>
  );
}