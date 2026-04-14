import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  return (
    <div className="page admin-dashboard-page">
      <div className="admin-dashboard-container">
        <div className="admin-header">
          <div>
            <h2>LuxeGlow Admin Panel</h2>
            <p className="admin-header-subtext">
              Manage your jewelry store from one place.
            </p>
          </div>

          <button className="admin-danger-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="admin-content">
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">
            Manage your jewelry business from here.
          </p>

          <div className="admin-cards">
            <Link to="/admin/products" className="admin-card">
              <h3>📦 Products</h3>
              <p>View, edit, and delete products</p>
            </Link>

            <Link to="/admin/add-product" className="admin-card">
              <h3>➕ Add Product</h3>
              <p>Add new jewelry items</p>
            </Link>

            <Link to="/admin/orders" className="admin-card">
              <h3>🧾 Orders</h3>
              <p>Track and review customer orders</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}