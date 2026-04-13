import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await fetch("https://jewelry-backend-docker.onrender.com/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/admin/login");
      return;
    }

    if (!window.confirm("Delete this product?")) return;

    try {
      const res = await fetch(`https://jewelry-backend-docker.onrender.com/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        alert("Unauthorized. Please login again.");
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      if (res.ok) {
        alert("Product deleted successfully");
        fetchProducts();
      } else {
        const errorText = await res.text();
        alert("Delete failed: " + errorText);
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

  return (
    <div className="page admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Admin Products</h1>
          <p className="admin-page-subtitle">
            Manage your jewelry products from here.
          </p>
        </div>

        <Link to="/admin/add-product">
          <button className="admin-primary-btn">+ Add Product</button>
        </Link>
      </div>

      <div className="admin-products-grid">
        {products.length === 0 ? (
          <div className="admin-empty-state">
            <h3>No products found</h3>
            <p>Add your first product to start building your catalog.</p>
          </div>
        ) : (
          products.map((p) => (
            <div key={p.id} className="admin-product-card">
              <div className="admin-product-image-wrap">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="admin-product-image"
                />
              </div>

              <div className="admin-product-content">
                <h3>{p.name}</h3>
                <p className="admin-product-description">{p.description}</p>
                <p className="admin-product-price">
                  ₹{Number(p.price).toLocaleString("en-IN")}
                </p>
                <span className="admin-product-badge">{p.category}</span>
              </div>

              <div className="admin-card-actions">
                <button
                  className="admin-secondary-btn"
                  onClick={() => handleEdit(p.id)}
                >
                  Edit
                </button>

                <button
                  className="admin-danger-btn"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}