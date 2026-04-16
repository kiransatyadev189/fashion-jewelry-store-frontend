import { Link, useLocation } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();

  // get orderId if passed from checkout
  const orderId = location.state?.orderId;

  return (
    <div className="success-page">
      <div className="success-card">
        <p className="mini-title">Order Confirmed</p>
        <h1>Thank You for Your Purchase</h1>

        <p>
          Your order has been placed successfully. We are getting your jewelry
          ready with care and elegance.
        </p>

        {/* ✅ Show Order ID */}
        {orderId && (
          <p style={{ marginTop: "10px", fontWeight: "600" }}>
            Order ID: #{orderId}
          </p>
        )}

        <p>You will receive updates via email shortly.</p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          {/* ✅ NEW: Track Order Button */}
          <Link
            to="/track-order"
            state={{ orderId: orderId }}
          >
            <button
              type="button"
              className="continue-shopping-btn"
              style={{ background: "#000", color: "#fff" }}
            >
              Track Your Order
            </button>
          </Link>

          <Link to="/shop">
            <button type="button" className="continue-shopping-btn">
              Continue Shopping
            </button>
          </Link>

          <Link to="/">
            <button
              type="button"
              className="continue-shopping-btn"
              style={{
                background: "transparent",
                color: "#8a5a3b",
                border: "1px solid #8a5a3b",
              }}
            >
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}