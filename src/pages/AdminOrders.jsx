import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/admin/login");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
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
      alert("Session expired. Please login again.");
      navigate("/admin/login");
      return;
    }

    try {
      setUpdatingId(orderId);

      const response = await fetch(
        `${API_BASE_URL}/api/orders/${orderId}/status`,
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

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Status update failed:", error);
      alert("Could not update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="page admin-orders-page">
        <div className="admin-page-header">
          <div>
            <h2 className="admin-page-title">Admin Orders</h2>
            <p className="admin-page-subtitle">Loading orders...</p>
          </div>
        </div>
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
            <article key={order.id} className="order-card">
              <div className="order-top">
                <div className="order-top-left">
                  <h3 className="order-id">Order #{order.id}</h3>
                  <p className="order-date">
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleString()
                      : "N/A"}
                  </p>
                </div>

                <span
                  className={`status-badge status-${(
                    order.status || "pending"
                  ).toLowerCase()}`}
                >
                  {order.status || "Pending"}
                </span>
              </div>

              <div className="order-details-list">
                <div className="detail-row">
                  <span className="detail-label">Name</span>
                  <span className="detail-value">{order.customerName}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{order.email}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Address</span>
                  <span className="detail-value">{order.address}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Total</span>
                  <span className="detail-value">
                    ₹{Number(order.totalAmount || 0).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              <div className="order-items-box">
                <h4>Items</h4>

                {order.items?.length > 0 ? (
                  order.items.map((item) => (
                    <div key={item.id} className="order-item-row">
                      <div className="item-left">
                        <span className="item-name">{item.productName}</span>
                      </div>

                      <div className="item-right">
                        {item.quantity} × ₹
                        {Number(item.price || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-items-text">No items found.</p>
                )}
              </div>

              <div className="order-actions">
                <label htmlFor={`status-${order.id}`}>Update Status</label>

                <select
                  id={`status-${order.id}`}
                  value={order.status || "Pending"}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  disabled={updatingId === order.id}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}