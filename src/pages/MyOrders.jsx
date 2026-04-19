import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const token = localStorage.getItem("userToken");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${API_BASE_URL}/api/orders/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const canCancelOrder = (status) => {
    const normalized = (status || "").trim().toLowerCase();

    return ![
      "shipped",
      "out for delivery",
      "delivered",
      "cancelled",
    ].includes(normalized);
  };

  const getStatusClass = (status) => {
    return (status || "").toLowerCase().replace(/\s+/g, "-");
  };

  const handleCancel = async (orderId) => {
    try {
      setCancellingId(orderId);

      await axios.put(
        `${API_BASE_URL}/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchOrders();
    } catch (err) {
      console.error("Cancel failed:", err);
      alert(
        err?.response?.data?.message ||
          err?.response?.data ||
          "Unable to cancel this order"
      );
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="my-orders-page">
          <h1>My Orders</h1>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="my-orders-page">
        <h1>My Orders</h1>
        <p className="my-orders-subtext">
          View your complete order history, track status, and manage eligible
          orders.
        </p>

        {error && <p className="auth-error">{error}</p>}

        {!error && orders.length === 0 && (
          <div className="my-orders-empty">
            <p>No orders found yet.</p>
          </div>
        )}

        <div className="my-orders-list">
          {orders.map((order) => (
            <div className="my-order-card" key={order.id}>
              <div className="my-order-top">
                <div className="my-order-summary">
                  <h2>Order #{order.id}</h2>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`order-status-badge ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleString()
                      : "N/A"}
                  </p>

                  <p>
                    <strong>Total:</strong> ₹
                    {typeof order.totalAmount === "number"
                      ? order.totalAmount.toLocaleString()
                      : order.totalAmount}
                  </p>
                </div>

                {canCancelOrder(order.status) && (
                  <button
                    className="cancel-order-btn"
                    onClick={() => handleCancel(order.id)}
                    disabled={cancellingId === order.id}
                  >
                    {cancellingId === order.id
                      ? "Cancelling..."
                      : "Cancel Order"}
                  </button>
                )}
              </div>

              <div className="my-order-address">
                <strong>Shipping Address:</strong>
                <p>{order.address || "No address available"}</p>
              </div>

              <div className="my-order-items">
                {order.items?.map((item, index) => (
                  <div className="my-order-item" key={item.id || index}>
                    <div className="my-order-item-image-wrap">
                      <img
                        src={
                          item.imageUrl ||
                          "https://via.placeholder.com/100x100?text=Jewelry"
                        }
                        alt={item.productName || "Product"}
                        className="my-order-item-image"
                      />
                    </div>

                    <div className="my-order-item-info">
                      <h4>{item.productName || "Product"}</h4>
                      <p>
                        <strong>Quantity:</strong> {item.quantity}
                      </p>
                      <p>
                        <strong>Price:</strong> ₹{item.price}
                      </p>
                      {item.productId && (
                        <a
                          href={`/product/${item.productId}`}
                          className="my-order-product-link"
                        >
                          View Product
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}