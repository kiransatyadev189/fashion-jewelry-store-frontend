import { useState } from "react";
import { useLocation } from "react-router-dom";
import API_BASE_URL from "../api";

export default function TrackOrder() {
  const location = useLocation();

  const [orderId, setOrderId] = useState(location.state?.orderId || "");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getStatusClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return "status-badge pending";
      case "confirmed":
        return "status-badge confirmed";
      case "shipped":
        return "status-badge shipped";
      case "out for delivery":
        return "status-badge out-for-delivery";
      case "delivered":
        return "status-badge delivered";
      case "cancelled":
        return "status-badge cancelled";
      default:
        return "status-badge";
    }
  };

  const getStatusIcon = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return "🟠";
      case "confirmed":
        return "🔵";
      case "shipped":
        return "🚚";
      case "out for delivery":
        return "📦";
      case "delivered":
        return "✅";
      case "cancelled":
        return "❌";
      default:
        return "📌";
    }
  };

  const handleTrackOrder = async (e) => {
    e.preventDefault();

    if (!orderId || !email) {
      setError("Please enter both Order ID and Email.");
      setOrder(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setOrder(null);

      const res = await fetch(
        `${API_BASE_URL}/api/orders/track?id=${orderId}&email=${encodeURIComponent(email)}`
      );

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Order not found");
      }

      const data = await res.json();
      setOrder(data);
    } catch (err) {
      console.error("Error tracking order:", err);
      setError("Order not found. Please check your Order ID and Email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page track-order-page">
      <div className="track-order-container">
        <h1>Track Your Order</h1>
        <p className="track-order-subtitle">
          Enter your Order ID and Email to view your latest order status.
        </p>

        <form className="track-order-form" onSubmit={handleTrackOrder}>
          <input
            type="number"
            placeholder="Enter Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />

          <input
            type="email"
            placeholder="Enter Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Tracking..." : "Track Order"}
          </button>
        </form>

        {error && <p className="track-order-error">{error}</p>}

        {order && (
          <div className="track-order-result">
            <div className="track-order-header">
              <h2>Order #{order.id}</h2>
              <span className={getStatusClass(order.status)}>
                {getStatusIcon(order.status)} {order.status}
              </span>
            </div>

            <p>
              <strong>Name:</strong> {order.customerName}
            </p>
            <p>
              <strong>Email:</strong> {order.email}
            </p>
            <p>
              <strong>Address:</strong> {order.address}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {order.orderDate
                ? new Date(order.orderDate).toLocaleString()
                : "N/A"}
            </p>
            <p>
              <strong>Total Amount:</strong> ₹
              {Number(order.totalAmount || 0).toLocaleString("en-IN")}
            </p>

            <div className="track-order-items">
              <h3>Items</h3>
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div key={index} className="track-order-item">
                    <span>{item.productName}</span>
                    <span>
                      ₹{item.price} × {item.quantity}
                    </span>
                  </div>
                ))
              ) : (
                <p>No items found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}