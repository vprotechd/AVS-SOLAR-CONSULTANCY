import React from "react";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiArrowUpRight,
  FiLinkedin,
  FiFacebook,
  FiInstagram,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import logoImage from "../assets/images (2.png";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">

      {/* =====================================================
          MAIN FOOTER
          ===================================================== */}

      <div className="footer-container">

        {/* ================= BRAND ================= */}

        <div className="footer-brand">

          <img
            src={logoImage}
            alt="VProTech Digital"
            className="footer-logo"
          />

          <p className="footer-description">
            Empowering students and businesses through innovative technology,
            professional IT training, software development, web solutions,
            AI, digital marketing, and industry-ready skills.
          </p>

          {/* Social Media */}

          <div className="footer-socials">

            <a
              href="https://in.linkedin.com/company/vprotechdigital"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="social-icon"
            >
              <FiLinkedin />
            </a>

            <a
              href="https://www.facebook.com/vprotechdigital/?_rdr"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="social-icon"
            >
              <FiFacebook />
            </a>

            <a
              href="https://www.instagram.com/vprotech_digitalx/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="social-icon"
            >
              <FiInstagram />
            </a>

          </div>
        </div>


        {/* ================= QUICK LINKS ================= */}

        <div className="footer-column">

          <h3>Quick Links</h3>

          <Link to="/" className="footer-link">
            <span>Home</span>
            <FiArrowUpRight />
          </Link>

          <Link to="/about" className="footer-link">
            <span>About Us</span>
            <FiArrowUpRight />
          </Link>

          <Link to="/blogs" className="footer-link">
            <span>Blogs</span>
            <FiArrowUpRight />
          </Link>

          <Link to="/careers" className="footer-link">
            <span>Careers</span>
            <FiArrowUpRight />
          </Link>

          <Link to="/contact" className="footer-link">
            <span>Contact</span>
            <FiArrowUpRight />
          </Link>

        </div>


        {/* ================= CONTACT ================= */}

        <div className="footer-column">

          <h3>Contact Us</h3>

          {/* Phone 1 */}

          <a
            href="tel:+918894110026"
            className="contact-item"
          >
            <span className="contact-icon">
              <FiPhone />
            </span>

            <span>
              +91 88941 10026
            </span>
          </a>


          {/* Phone 2 */}

          <a
            href="tel:+918146759497"
            className="contact-item"
          >
            <span className="contact-icon">
              <FiPhone />
            </span>

            <span>
              +91 81467 59497
            </span>
          </a>


          {/* Email */}

          <a
            href="mailto:vprotechdigitalmohali@gmail.com"
            className="contact-item"
          >
            <span className="contact-icon">
              <FiMail />
            </span>

            <span>
              vprotechdigitalmohali@gmail.com
            </span>
          </a>


          {/* Location */}

          <div className="contact-item">

            <span className="contact-icon">
              <FiMapPin />
            </span>

            <span>
              Mohali, Punjab, India
            </span>

          </div>

        </div>

      </div>


      {/* =====================================================
          BOTTOM FOOTER
          ===================================================== */}

      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} VProTech Digital.
          All Rights Reserved.
        </p>

        <div className="footer-bottom-links">

          <Link to="/privacy-policy">
            Privacy Policy
          </Link>

          <span>|</span>

          <Link to="/terms">
            Terms &amp; Conditions
          </Link>

        </div>

      </div>

    </footer>
  );
}