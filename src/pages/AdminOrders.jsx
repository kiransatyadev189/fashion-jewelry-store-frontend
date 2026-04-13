import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      alert("Admin token missing. Please login again.");
      navigate("/admin/login");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://jewelry-backend-docker.onrender.com/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        alert("Unauthorized. Please login again.");
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      alert("Admin token missing. Please login again.");
      navigate("/admin/login");
      return;
    }

    try {
      const response = await fetch(
        `https://jewelry-backend-docker.onrender.com/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.status === 401 || response.status === 403) {
        alert("Unauthorized. Please login again.");
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Status update failed:", error);
      alert("Could not update order status.");
    }
  };

  if (loading) {
    return (
      <div className="page admin-orders-page">
        <h2 className="admin-page-title">Admin Orders</h2>
        <p className="admin-page-subtitle">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="page admin-orders-page">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Admin Orders</h2>
          <p className="admin-page-subtitle">
            Track and update customer orders.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="admin-empty-state">
          <h3>No orders found</h3>
          <p>Orders will appear here once customers place them.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-top">
                <h3>Order #{order.id}</h3>
                <span
                  className={`status-badge status-${(
                    order.status || "pending"
                  ).toLowerCase()}`}
                >
                  {order.status || "Pending"}
                </span>
              </div>

              <div className="order-details-grid">
                <p><strong>Name:</strong> {order.customerName}</p>
                <p><strong>Email:</strong> {order.email}</p>
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>Total:</strong> ₹{Number(order.totalAmount || 0).toFixed(2)}</p>
                <p>
                  <strong>Date:</strong>{" "}
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleString()
                    : "N/A"}
                </p>
              </div>

              <div className="order-items-box">
                <h4>Items</h4>

                {order.items && order.items.length > 0 ? (
                  order.items.map((item) => (
                    <div key={item.id} className="order-item-row">
                      <span>{item.productName}</span>
                      <span>
                        {item.quantity} x ₹{Number(item.price || 0).toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p>No items found.</p>
                )}
              </div>

              <div className="order-actions">
                <label>Update Status:</label>
                <select
                  value={order.status || "Pending"}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}