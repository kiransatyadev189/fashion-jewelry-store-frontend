import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProduct({ fetchProducts, apiBaseUrl }) {
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
  const [loading, setLoading] = useState(false);

  const categories = ["Ring", "Necklace", "Earring", "Bracelet", "Anklet"];

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
      navigate("/admin");
      return;
    }

    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/products/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch product");
      }

      const data = await res.json();

      setFormData({
        name: data.name || "",
        description: data.description || "",
        price: data.price || "",
        category: data.category || "",
      });

      setExistingImageUrl(data.imageUrl || "");
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Failed to load product details.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.price ||
      !formData.category
    ) {
      alert("Please fill all product details.");
      return;
    }

    try {
      setLoading(true);

      const adminToken = localStorage.getItem("adminToken");

      if (!adminToken) {
        alert("Admin not logged in.");
        return;
      }

      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);

      if (newImage) {
        data.append("image", newImage);
      }

      const res = await fetch(`${apiBaseUrl}/api/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        body: data,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update product");
      }

      alert("Product updated successfully.");
      fetchProducts?.();
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="section-heading" style={{ marginBottom: "20px" }}>
        <p className="mini-title">Admin Panel</p>
        <h2>Edit Product</h2>
      </div>

      <form
        className="admin-form"
        onSubmit={handleUpdateProduct}
        style={{ maxWidth: "760px", margin: "0 auto" }}
      >
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Product Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter product price"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {existingImageUrl && (
          <div className="form-group">
            <label>Current Image</label>
            <img
              src={existingImageUrl}
              alt="Current product"
              style={{
                width: "160px",
                height: "160px",
                objectFit: "cover",
                borderRadius: "16px",
                border: "1px solid #ecdcd2",
                background: "#f8f2ee",
              }}
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="newImage">Upload New Image</label>
          <input
            id="newImage"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="admin-actions">
          <button type="submit" className="edit-btn" disabled={loading}>
            {loading ? "Updating..." : "Update Product"}
          </button>

          <button
            type="button"
            className="delete-btn"
            onClick={() => navigate("/admin/dashboard")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}