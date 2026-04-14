import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function Home({ products = [] }) {
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <p className="hero-tag">Curated Elegance</p>
            <h1>Jewelry That Completes Every Look</h1>
            <p className="hero-subtext">
              Discover timeless pieces crafted to elevate your everyday and
              occasion wear with grace and luxury.
            </p>
            <Link to="/shop" className="hero-btn">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <section className="shop-category-section page">
        <div className="section-heading">
          <p className="mini-title">Collections</p>
          <h2>Shop by Category</h2>
        </div>

        <div className="category-grid">
          <div className="category-box">Earrings</div>
          <div className="category-box">Necklaces</div>
          <div className="category-box">Rings</div>
          <div className="category-box">Bracelets</div>
        </div>
      </section>

      <section className="collection-banner page">
        <div className="collection-card">
          <div className="collection-text">
            <p className="mini-title">New Season</p>
            <h2>Daily Wear Collection</h2>
            <p>
              Minimal, graceful, and modern jewelry pieces made for effortless
              styling every day.
            </p>
            <Link to="/shop" className="shop-now-btn">
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      <section className="featured-section page">
        <div className="section-heading">
          <p className="mini-title">Featured Picks</p>
          <h2>Best Sellers</h2>
        </div>

        <div className="products-grid">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="empty-text">No products available.</p>
          )}
        </div>
      </section>

      <section className="why-us-section page">
        <div className="section-heading">
          <p className="mini-title">Why Choose Us</p>
          <h2>Luxury You Can Trust</h2>
        </div>

        <div className="why-us-grid">
          <div className="why-card">
            <h3>Premium Finish</h3>
            <p>Elegant designs with a refined and luxurious finish.</p>
          </div>
          <div className="why-card">
            <h3>Modern Styling</h3>
            <p>Made for daily wear, gifting, and occasion-ready looks.</p>
          </div>
          <div className="why-card">
            <h3>Affordable Luxury</h3>
            <p>Beautiful jewelry that feels premium without extreme pricing.</p>
          </div>
        </div>
      </section>
    </div>
  );
}