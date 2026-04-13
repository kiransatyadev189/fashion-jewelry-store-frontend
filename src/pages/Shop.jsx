import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Ring", "Necklace", "Earring", "Bracelet"];

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/products")
      .then((res) => {
        console.log("Backend products:", res.data);
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  const normalizeCategory = (category) => {
    return category?.toLowerCase().replace(/s$/, "");
  };

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) =>
            normalizeCategory(product.category) ===
            normalizeCategory(selectedCategory)
        );

  return (
    <div className="page shop-page">
      <div className="shop-header">
        <h1 className="section-title">Our Collection</h1>

        <div className="filter-buttons">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={selectedCategory === category ? "active-filter" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-products">
          <h3>No products found</h3>
          <p>Try choosing another category.</p>
        </div>
      )}
    </div>
  );
}