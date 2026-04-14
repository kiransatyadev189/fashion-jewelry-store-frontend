import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="page admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Admin Dashboard</h1>
          <p className="admin-page-subtitle">
            Manage products, add new items, and check orders.
          </p>
        </div>

        <button type="button" className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="admin-dashboard-grid">
        <Link to="/admin/products" className="admin-dashboard-card">
          <h3>Products</h3>
          <p>View, edit, and delete your jewelry products.</p>
        </Link>

        <Link to="/admin/add-product" className="admin-dashboard-card">
          <h3>Add Product</h3>
          <p>Create and upload a new product to your catalog.</p>
        </Link>

        <Link to="/admin/orders" className="admin-dashboard-card">
          <h3>Orders</h3>
          <p>Track customer orders and manage order updates.</p>
        </Link>
      </div>
    </div>
  );
}