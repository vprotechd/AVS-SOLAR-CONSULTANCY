import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Store.css";
import {
  FiShoppingBag,
  FiArrowRight,
  FiCheckCircle,
  FiZap,
  FiShield,
  FiTruck,
} from "react-icons/fi";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80";

const Store = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/products/public");

        const data = response?.data;

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data?.products)) {
          setProducts(data.products);
        } else if (Array.isArray(data?.data)) {
          setProducts(data.data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Store products error:", err);
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const getImage = (image) => {
    if (!image) return PLACEHOLDER_IMAGE;

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:image")
    ) {
      return image;
    }

   if (image.startsWith("/")) {
  return `${import.meta.env.VITE_API_URL.replace("/api", "")}${image}`;
}

    return image;
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });
  };

  const getDiscount = (product) => {
    if (
      product.discountPrice &&
      product.price &&
      Number(product.discountPrice) < Number(product.price)
    ) {
      return Math.round(
        ((Number(product.price) - Number(product.discountPrice)) /
          Number(product.price)) *
          100
      );
    }

    return 0;
  };

  return (
    <div className="store-page">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="store-hero">
        <div className="store-hero-content">
          <span className="store-label">
            <FiShoppingBag />
            AVS SOLAR STORE
          </span>

          <h1>
            Power Your Future
            <span> With Solar Energy</span>
          </h1>

          <p>
            Explore reliable solar panels, inverters, batteries and energy
            solutions designed for efficient and sustainable power.
          </p>

          <button
            className="store-hero-btn"
            onClick={() =>
              document
                .getElementById("store-products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore Products
            <FiArrowRight />
          </button>
        </div>

        <div className="store-hero-image">
          <img
            src={PLACEHOLDER_IMAGE}
            alt="Solar energy"
          />

          <div className="hero-floating-card">
            <FiZap />
            <div>
              <strong>Clean Energy</strong>
              <span>Smart Solar Solutions</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      <section className="store-benefits">
        <div className="store-benefit">
          <div className="benefit-icon">
            <FiCheckCircle />
          </div>
          <div>
            <h3>Quality Products</h3>
            <p>Reliable solar equipment</p>
          </div>
        </div>

        <div className="store-benefit">
          <div className="benefit-icon">
            <FiShield />
          </div>
          <div>
            <h3>Trusted Solutions</h3>
            <p>Built for long-term use</p>
          </div>
        </div>

        <div className="store-benefit">
          <div className="benefit-icon">
            <FiTruck />
          </div>
          <div>
            <h3>Easy Ordering</h3>
            <p>Simple and convenient</p>
          </div>
        </div>

        <div className="store-benefit">
          <div className="benefit-icon">
            <FiZap />
          </div>
          <div>
            <h3>Energy Efficient</h3>
            <p>Save more with solar</p>
          </div>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="store-products-section" id="store-products">
        <div className="store-section-heading">
          <div>
            <span>OUR PRODUCTS</span>
            <h2>Solar Solutions For You</h2>
          </div>

          <p>
            Choose from our range of solar products and energy solutions.
          </p>
        </div>

        {loading && (
          <div className="store-loading">
            <div className="store-spinner"></div>
            <p>Loading products...</p>
          </div>
        )}

        {!loading && error && (
          <div className="store-error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="store-empty">
            <div className="empty-icon">
              <FiShoppingBag />
            </div>

            <h3>No Products Available</h3>

            <p>
              Our solar products will appear here once they are added to the
              store.
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="store-products-grid">
            {products.map((product) => {
              const discount = getDiscount(product);

              const finalPrice =
                product.discountPrice &&
                Number(product.discountPrice) < Number(product.price)
                  ? product.discountPrice
                  : product.price;

              return (
                <article className="store-product-card" key={product._id}>
                  {/* IMAGE */}
                  <div className="product-image-container">
                    {discount > 0 && (
                      <span className="product-discount">
                        {discount}% OFF
                      </span>
                    )}

                    {product.featured && (
                      <span className="product-featured">
                        Featured
                      </span>
                    )}

                    <img
                      src={getImage(product.image)}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="product-card-content">
                    <div className="product-category">
                      {product.category || "SOLAR"}
                    </div>

                    <h3>{product.name}</h3>

                    {product.brand && (
                      <p className="product-brand">
                        <span>Brand:</span> {product.brand}
                      </p>
                    )}

                    {product.description && (
                      <p className="product-description">
                        {product.description.length > 85
                          ? `${product.description.substring(0, 85)}...`
                          : product.description}
                      </p>
                    )}

                    <div className="product-price-row">
                      <strong>
                        ₹{formatPrice(finalPrice)}
                      </strong>

                      {discount > 0 && (
                        <del>
                          ₹{formatPrice(product.price)}
                        </del>
                      )}
                    </div>

                    <button
                      className="product-view-btn"
                      onClick={() =>
                        navigate(`/product/${product._id}`)
                      }
                    >
                      View Product
                      <FiArrowRight />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ================= CTA ================= */}
      <section className="store-cta">
        <div>
          <span>GO SOLAR WITH AVS</span>

          <h2>
            Ready to switch to
            <br />
            clean energy?
          </h2>

          <p>
            Get the right solar solution for your home or business with
            professional guidance from AVS Solar Consultancy.
          </p>
        </div>

        <button onClick={() => navigate("/contact")}>
          Contact Us
          <FiArrowRight />
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default Store;