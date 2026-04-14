import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <div className="success-page">
      <div className="success-card">
        <p className="mini-title">Order Confirmed</p>
        <h1>Thank You for Your Purchase</h1>
        <p>
          Your order has been placed successfully. We are getting your jewelry
          ready with care and elegance. You will receive updates soon.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "20px",
          }}
        >
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