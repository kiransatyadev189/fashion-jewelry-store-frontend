import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="page home">
      <section className="home-hero">
        <div className="home-hero-content">
          <h1>Luxury Jewelry That Elevates Your Style</h1>
          <p>
            Explore timeless rings, elegant necklaces, sparkling earrings, and
            beautiful bracelets crafted for every occasion.
          </p>

          <div className="home-hero-actions">
            <Link to="/shop">
              <button className="primary-btn">Explore Collection</button>
            </Link>
          </div>
        </div>

        <div className="home-hero-image">
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80"
            alt="Luxury Jewelry"
          />
        </div>
      </section>
    </div>
  );
}