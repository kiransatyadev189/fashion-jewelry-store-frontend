import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";

export default function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = ["Ring", "Necklace", "Earring", "Bracelet"];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile =
      e.target.files && e.target.files[0] ? e.target.files[0] : null;

    setImage(selectedFile);

    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl("");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
    });
    setImage(null);
    setPreviewUrl("");

    const fileInput = document.getElementById("fileInput");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");

    if (!token) {
      alert("Your session has expired. Please login again.");
      navigate("/admin");
      return;
    }

    if (!image) {
      alert("Please select an image");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("image", image);

      const res = await fetch(`${API_BASE_URL}/api/products/with-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const responseText = await res.text();

      if (res.status === 401 || res.status === 403) {
        alert("Unauthorized. Please login again.");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminAuth");
        navigate("/admin");
        return;
      }

      if (res.ok) {
        alert("Product added successfully!");
        resetForm();
      } else {
        alert(`Upload failed: Status ${res.status} ${responseText}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error: " + error.message);
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
              <h1 className="admin-page-title">Add Product</h1>
              <p className="admin-page-subtitle">
                Create a new jewelry product for your catalog.
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

            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />

            <button
              type="submit"
              className="admin-primary-btn"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Add Product"}
            </button>
          </form>
        </div>

        <div className="admin-preview-panel">
          <h3>Image Preview</h3>
          <p>Check how your product image will look before uploading.</p>

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
              <span>No image selected</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}