import React from "react";
import { motion } from "framer-motion";

import custom from "../../assets/itand custom.jpg";
import expertiseBg from "../../assets/digital.jpg";
import digital from "../../assets/digi.jpg";
import fullstack from "../../assets/full.jpg";
import mechanical from "../../assets/design.jpg";
import internship from "../../assets/interior.jpg";
import "./ServicesSection.css";

export default function ServicesSection({ servicesRef, navigate }) {
  const services = [
    {
      title: "Web Development",
      desc: "Custom web applications, E-commerce website development, Real estate websites, Hotel booking websites, Business management systems",
      img: custom,
      path: "/webdevelopment",
    },
    {
      title: "Android App Development",
      desc: "Custom Android applications, Business apps, Mobile solutions for startups and enterprises.",
      img: expertiseBg,
      path: "/mobile-apps",
    },
    {
      title: "Digital Marketing",
      desc: "Search Engine Optimization (SEO), Social Media Marketing (SMM), Google Ads, Online branding, Business promotion and lead generation.",
      img: digital,
      path: "/digital-marketing",
    },
    {
      title: "Logo Designing",
      desc: "Custom logo creation, Brand identity design.",
      img: fullstack,
      path: "/logo-designing",
    },
    {
      title: "Website Design",
      desc: "Responsive website design, UI/UX design, Business and portfolio websites, Corporate websites.",
      img: mechanical,
      path: "/website-design",
    },
    {
      title: "Interior Designing",
      desc: "Residential and commercial interior design services.",
      img: internship,
      path: "/interior-designing",
    },
  ];

  return (
    <section
      ref={servicesRef}
      className="services-section"
      style={{
        background: "#bfd1e3",
      }}
    >
      <div className="services-overlay"></div>

      <div className="section-content">
        {/* Small Heading */}
        <motion.h5
          className="small-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          WHAT WE OFFER
        </motion.h5>

        {/* Main Heading */}
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="services-title-dark">Services</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          className="section-text"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true }}
        >
          Empowering businesses with innovative digital solutions
        </motion.p>

        {/* Cards */}
        <div className="card-grid">
          {services.map((service, index) => (
            <motion.div
              className="service-card-wrapper"
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.08,
                duration: 0.6,
              }}
              viewport={{ once: true }}
            >
              {/* FLIPPING CARD */}
              <div className="flip-card">
                <div className="flip-card-inner">

                  {/* FRONT */}
                  <div className="flip-card-front">
                    <div className="service-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <h3>{service.title}</h3>

                    <p>{service.desc}</p>

                    <div className="flip-hint">
                      <span>↻</span>
                      Hover to preview
                    </div>
                  </div>

                  {/* BACK */}
                  <div
                    className="flip-card-back"
                    style={{
                      backgroundImage: `url(${service.img})`,
                    }}
                  >
                    <div className="image-overlay"></div>

                    <div className="back-content">
                      <span>OUR SERVICE</span>
                      <h3>{service.title}</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* EXPLORE BUTTON OUTSIDE CARD */}
              <button
                className="explore-btn"
                onClick={() => navigate(service.path)}
                aria-label={`Explore ${service.title}`}
              >
                <span>Explore More</span>
                <span className="explore-arrow">→</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}