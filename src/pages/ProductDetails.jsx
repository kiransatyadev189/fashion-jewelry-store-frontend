import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, API_BASE_URL]);

  if (loading) {
    return (
      <div className="product-details-page">
        <p className="loading-text">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <p className="empty-text">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="product-details">
        <div className="product-details-image">
          <img src={product.imageUrl} alt={product.name} />
        </div>

        <div className="product-details-info">
          <span className="category">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="price">₹{Number(product.price).toLocaleString()}</div>

          <p>{product.description}</p>

          <div className="product-details-actions">
            <button type="button" onClick={() => addToCart(product)}>
              Add to Cart
            </button>

            <Link to="/shop">
              <button
                type="button"
                style={{
                  width: "100%",
                  minHeight: "48px",
                  borderRadius: "999px",
                  background: "transparent",
                  color: "#8a5a3b",
                  border: "1px solid #8a5a3b",
                  fontWeight: "600",
                }}
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}