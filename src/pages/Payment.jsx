import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import API_BASE_URL from "../api";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const { orderData } = location.state || {};
  const [loading, setLoading] = useState(false);

  const loadScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-checkout-script")) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.id = "razorpay-checkout-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  if (!orderData) {
    return (
      <div className="payment-page">
        <div className="no-payment-data">
          <h2>No payment data found</h2>
          <button onClick={() => navigate("/checkout")}>
            Go Back to Checkout
          </button>
        </div>
      </div>
    );
  }

  const loadRazorpayCheckout = async () => {
    try {
      setLoading(true);

      const loaded = await loadScript();

      if (!loaded) {
        alert("Razorpay SDK failed to load");
        setLoading(false);
        return;
      }

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay SDK not loaded. Please refresh the page and try again."
        );
      }

      const token = localStorage.getItem("userToken");

      const createRes = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(orderData),
      });

      if (!createRes.ok) {
        const text = await createRes.text();
        throw new Error(text || "Failed to create payment order");
      }

      const paymentOrder = await createRes.json();

      const options = {
        key: paymentOrder.key,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "LuxeGlow Jewelry",
        description: "Secure payment for your order",
        order_id: paymentOrder.razorpayOrderId,

        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/api/payments/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify({
                razorpayOrderId: paymentOrder.razorpayOrderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                ...orderData,
              }),
            });

            if (!verifyRes.ok) {
              const text = await verifyRes.text();
              throw new Error(text || "Payment verification failed");
            }

            const savedOrder = await verifyRes.json();

            clearCart();

            navigate("/order-success", {
              state: { orderId: savedOrder.id },
            });
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment completed but verification failed: " + err.message);
          } finally {
            setLoading(false);
          }
        },

        prefill: {
          name: paymentOrder.customerName,
          email: paymentOrder.email,
          contact: orderData.contact || "",
        },

        theme: {
          color: "#7a2e4d",
        },

        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay via UPI",
                instruments: [{ method: "upi" }],
              },
              other: {
                name: "Other Options",
                instruments: [
                  { method: "card" },
                  { method: "netbanking" },
                  { method: "wallet" },
                ],
              },
            },
            sequence: ["block.upi", "block.other"],
            preferences: {
              show_default_blocks: true,
            },
          },
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        alert(response.error.description || "Payment failed");
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      console.error("Razorpay error:", err);
      alert("Unable to start payment: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <h1>Secure Payment</h1>

      <div className="payment-container">
        <h2>Total: ₹{Number(orderData.totalAmount).toLocaleString()}</h2>
        <p>Your payment details will be entered securely in Razorpay Checkout.</p>

        <div className="payment-actions">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/checkout")}
            disabled={loading}
          >
            Back
          </button>

          <button
            type="button"
            className="pay-now-btn"
            onClick={loadRazorpayCheckout}
            disabled={loading}
          >
            {loading ? "Starting Secure Payment..." : "Pay Securely"}
          </button>
        </div>
      </div>
    </div>
  );
}