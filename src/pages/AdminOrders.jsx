import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = async (showLoader = true) => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      setError("Admin session expired. Please login again.");
      navigate("/admin/login");
      return;
    }

    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminAuth");
        navigate("/admin/login");
        return;
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch orders.");
      }

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders(true);

    const interval = setInterval(() => {
      fetchOrders(false);
    }, 10000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchOrders(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const getStatusClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return "status-badge pending";
      case "shipped":
        return "status-badge shipped";
      case "delivered":
        return "status-badge delivered";
      case "cancelled":
        return "status-badge cancelled";
      default:
        return "status-badge";
    }
  };

  const parseErrorMessage = async (res) => {
    const text = await res.text();

    try {
      const data = JSON.parse(text);
      return data.message || data.error || "Something went wrong.";
    } catch {
      return text || "Something went wrong.";
    }
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("adminToken");

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminAuth");
        navigate("/admin/login");
        return;
      }

      if (!res.ok) {
        const message = await parseErrorMessage(res);
        throw new Error(message);
      }

      const updatedOrder = await res.json();

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? updatedOrder : order
        )
      );
    } catch (err) {
      console.error("Error updating order status:", err);
      alert(err.message || "Failed to update order status.");
    }
  };

  if (loading) {
    return (
      <div className="page admin-page">
        <div className="admin-empty-state">
          <h3>Loading orders...</h3>
          <p>Please wait while orders are being fetched.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page admin-page">
        <div className="admin-empty-state">
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button
            className="admin-refresh-btn"
            onClick={() => fetchOrders(true)}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Orders</h1>
          <p className="admin-page-subtitle">
            Manage customer orders and update status.
          </p>
        </div>

        <button
          className="admin-refresh-btn"
          onClick={() => fetchOrders(false)}
        >
          {refreshing ? "Refreshing..." : "Refresh Orders"}
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="admin-empty-state">
          <h3>No Orders Found</h3>
          <p>Orders will appear here after checkout.</p>
        </div>
      ) : (
        <div className="admin-orders-grid">
          {orders.map((order) => {
            const currentStatus = order.status || "Pending";
            const lowerStatus = currentStatus.toLowerCase();

            const canCancel =
              lowerStatus !== "cancelled" &&
              lowerStatus !== "delivered" &&
              lowerStatus !== "shipped";

            const disableSelect =
              lowerStatus === "cancelled" || lowerStatus === "delivered";

            return (
              <div key={order.id} className="admin-order-card">
                <div className="order-card-top">
                  <h3>Order #{order.id}</h3>
                  <span className={getStatusClass(currentStatus)}>
                    {currentStatus}
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
                  <strong>Total:</strong> ₹
                  {Number(order.totalAmount || 0).toLocaleString("en-IN")}
                </p>

                <div className="order-items">
                  <strong>Items:</strong>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <span>{item.productName}</span>
                        <span>
                          ₹{item.price} × {item.quantity}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p>No items</p>
                  )}
                </div>

                <div className="order-status">
                  <label htmlFor={`status-${order.id}`}>Update Status:</label>
                  <select
                    id={`status-${order.id}`}
                    value={currentStatus}
                    disabled={disableSelect}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {canCancel && (
                  <button
                    className="cancel-order-btn"
                    onClick={() => updateStatus(order.id, "Cancelled")}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}