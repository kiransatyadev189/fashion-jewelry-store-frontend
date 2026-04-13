import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = ["Ring", "Necklace", "Earring", "Bracelet"];

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await fetch(
        `https://jewelry-backend-docker.onrender.com/api/products/${id}`
      );
      const data = await res.json();

      setFormData({
        name: data.name || "",
        description: data.description || "",
        price: data.price || "",
        category: data.category || "",
      });

      setExistingImageUrl(data.imageUrl || "");
      setPreviewUrl(data.imageUrl || "");
    } catch (err) {
      console.error("Failed to fetch product:", err);
      alert("Failed to load product");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setNewImage(file);

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(existingImageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");

    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/admin/login");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);

      if (newImage) {
        data.append("image", newImage);
      }

      const res = await fetch(
        `https://jewelry-backend-docker.onrender.com/api/products/${id}/with-image`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      const responseText = await res.text();

      if (res.status === 401 || res.status === 403) {
        alert("Unauthorized. Please login again.");
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      if (res.ok) {
        alert("Product updated successfully");
        navigate("/admin/products");
      } else {
        alert(`Update failed: Status ${res.status} ${responseText}`);
      }
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Error updating product: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page admin-form-page">
      <div className="admin-form-layout">
        <div className="admin-form-card">
          <div className="admin-page-header small">
            <div>
              <h1 className="admin-page-title">Edit Product</h1>
              <p className="admin-page-subtitle">
                Update product details and image.
              </p>
            </div>
          </div>

          <form className="admin-form premium" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Price (₹)"
              value={formData.price}
              onChange={handleChange}
              required
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input type="file" accept="image/*" onChange={handleFileChange} />

            <p className="admin-helper-text">
              Leave image empty if you want to keep the current one.
            </p>

            <button
              type="submit"
              className="admin-primary-btn"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </form>
        </div>

        <div className="admin-preview-panel">
          <h3>Image Preview</h3>
          <p>
            Review the current image or check the new image before updating.
          </p>

          {previewUrl ? (
            <div className="admin-preview-box">
              <img
                src={previewUrl}
                alt="Product preview"
                className="admin-preview-image"
              />
            </div>
          ) : (
            <div className="admin-preview-empty">
              <span>No image available</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}