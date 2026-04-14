import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function Shop({ products = [] }) {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || "All";

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(products.map((p) => p.category).filter(Boolean)),
    ];
    return ["All", ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return products.filter((product) => {
      const productCategory = (product.category || "").toLowerCase();
      const selected = selectedCategory.toLowerCase();

      let matchesCategory = false;

      if (selectedCategory === "All") {
        matchesCategory = true;
      } else if (selected === "new arrivals") {
        matchesCategory = true;
      } else {
        matchesCategory = productCategory === selected;
      }

      const matchesSearch =
        !search ||
        product.name?.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search) ||
        product.category?.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  return (
    <div className="page">
      <div className="section-heading">
        <p className="mini-title">Our Collection</p>
        <h2>Shop Jewelry</h2>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search jewelry..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="category-scroll">
        <div className="category-scroll-inner">
          <button
            type="button"
            className={selectedCategory === "All" ? "active-category" : ""}
            onClick={() => setSelectedCategory("All")}
          >
            All
          </button>

          {categories
            .filter((category) => category !== "All")
            .map((category) => (
              <button
                key={category}
                type="button"
                className={selectedCategory === category ? "active-category" : ""}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
        </div>
      </div>

      <div className="products-grid" style={{ marginTop: "24px" }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="empty-text">No products found.</p>
        )}
      </div>
    </div>
  );
}