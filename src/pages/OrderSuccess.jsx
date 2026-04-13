import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <div
      className="page success-page"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        padding: "20px",
      }}
    >
      <div
        className="success-card"
        style={{
          textAlign: "center",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        {/* ✅ Success Icon */}
        <div style={{ fontSize: "50px", marginBottom: "10px" }}>✅</div>

        <h1>Order Placed Successfully</h1>

        <p style={{ marginTop: "10px", color: "#555" }}>
          Thank you for shopping with <strong>LuxeGlow Jewelry</strong>.
        </p>

        <p style={{ marginTop: "5px", color: "#777" }}>
          Your order has been received and is being processed.
        </p>

        {/* 💡 Optional fake order ID */}
        <p style={{ marginTop: "15px", fontSize: "14px", color: "#999" }}>
          Order ID: #{Math.floor(Math.random() * 1000000)}
        </p>

        <div
          className="success-actions"
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link to="/shop">
            <button style={{ padding: "10px 18px", borderRadius: "8px" }}>
              Continue Shopping
            </button>
          </Link>

          <Link to="/">
            <button
              className="secondary-btn"
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                backgroundColor: "#eee",
              }}
            >
              Go to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}