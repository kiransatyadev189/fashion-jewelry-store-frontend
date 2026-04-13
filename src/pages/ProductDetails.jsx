import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.error("Error fetching product details:", err);
      });
  }, [id]);

  if (!product) {
    return (
      <div className="page">
        <p className="loading-text">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="page product-details-page">
      <div className="product-details">
        {/* IMAGE */}
        <div className="product-details-image">
          <img src={product.imageUrl} alt={product.name} />
        </div>

        {/* INFO */}
        <div className="product-details-info">
          <h1>{product.name}</h1>

          <p className="product-description">
            {product.description}
          </p>

          <h2 className="product-price">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </h2>

          <p className="product-category">
            <strong>Category:</strong> {product.category}
          </p>

          <button
            className="primary-btn"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}