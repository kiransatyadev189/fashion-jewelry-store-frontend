import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="product-image"
      />

      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <h4>₹{product.price.toLocaleString()}</h4>
      <p>{product.category}</p>

      <div className="product-card-actions">
        <button type="button" onClick={() => addToCart(product)}>
          Add to Cart
        </button>

        <Link to={`/product/${product.id}`}>
          <button type="button">View Details</button>
        </Link>
      </div>
    </div>
  );
}