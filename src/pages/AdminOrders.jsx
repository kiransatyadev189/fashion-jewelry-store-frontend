import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      setError("Admin session expired. Please login again.");
      navigate("/admin/login");
      return;
    }

    try {
      setLoading(true);
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
        throw new Error(`Status ${res.status}: ${text}`);
      }

      const data = await res.json();
      console.log("Orders response:", data);

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
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

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Status ${res.status}: ${text}`);
      }

      fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update status: " + err.message);
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
      </div>

      {orders.length === 0 ? (
        <div className="admin-empty-state">
          <h3>No Orders Found</h3>
          <p>Orders will appear here after checkout.</p>
        </div>
      ) : (
        <div className="admin-orders-grid">
          {orders.map((order) => (
            <div key={order.id} className="admin-order-card">
              <h3>Order #{order.id}</h3>

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
                {Number(order.totalAmount).toLocaleString("en-IN")}
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
                <label>Status:</label>
                <select
                  value={order.status || "Pending"}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
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