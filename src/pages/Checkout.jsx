import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "Cash on Delivery",
  });

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const { fullName, email, phone, address, city, state, pincode } = formData;

    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim() ||
      !state.trim() ||
      !pincode.trim()
    ) {
      alert("Please fill all checkout details.");
      return;
    }

    const orderData = {
      customer: formData,
      items: cartItems,
      totalItems,
      totalAmount,
      orderedAt: new Date().toISOString(),
    };

    console.log("Order placed:", orderData);

    clearCart();
    navigate("/order-success");
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {cartItems.length === 0 ? (
        <div
          className="checkout-summary"
          style={{ maxWidth: "520px", margin: "0 auto" }}
        >
          <p className="empty-text">Your cart is empty.</p>
        </div>
      ) : (
        <div className="checkout-container">
          <form className="checkout-form" onSubmit={handlePlaceOrder}>
            <h2>Billing Details</h2>

            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Street Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your full address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter your city"
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                id="state"
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter your state"
              />
            </div>

            <div className="form-group">
              <label htmlFor="pincode">Pincode</label>
              <input
                id="pincode"
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter your pincode"
              />
            </div>

            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option>Cash on Delivery</option>
                <option>UPI</option>
                <option>Credit Card</option>
                <option>Debit Card</option>
              </select>
            </div>

            <button type="submit" className="place-order-btn">
              Place Order
            </button>
          </form>

          <div className="checkout-summary">
            <h2>Order Summary</h2>

            {cartItems.map((item) => (
              <div className="summary-row" key={item.id}>
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>
                  ₹{(Number(item.price) * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}

            <div className="summary-row">
              <span>Total Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}