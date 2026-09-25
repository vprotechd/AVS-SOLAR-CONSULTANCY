// src/pages/LogoDesigning.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './LogoDesigning.css';

export default function LogoDesigning() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      title: "Custom Logo Design",
      description: "Create a unique and memorable logo that represents your brand identity and values."
    },
    {
      title: "Brand Identity Design",
      description: "Complete brand identity packages including logos, color palettes, typography, and brand guidelines."
    },
    {
      title: "Minimalist Logo Design",
      description: "Simple, clean, and modern logo designs that make a lasting impression."
    },
    {
      title: "Corporate Logo Design",
      description: "Professional logos designed for businesses, corporations, and enterprises."
    },
    {
      title: "Creative & Artistic Logos",
      description: "Unique and artistic logo designs that stand out from the competition."
    },
    {
      title: "Logo Redesign & Refresh",
      description: "Modernize your existing logo while maintaining brand recognition and equity."
    }
  ];

  const styles = ["Minimalist", "Modern", "Classic", "Vintage", "Bold", "Elegant"];

  return (
    <>
      <Navbar />
      
      {/* ============ SERVICES SECTION ============ */}
      <section className="ld-services">
        <div className="ld-container">
          <motion.div 
            className="ld-section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="ld-section-tag">WHAT WE CREATE</span>
            <h2>Logo <span className="ld-gradient">Designing</span></h2>
            <p>Create a powerful brand identity with custom logo designs that leave a lasting impression</p>
          </motion.div>

          <div className="ld-services-grid">
            {services.map((service, index) => (
              <motion.div 
                key={index}
                className="ld-service-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STYLES SECTION ============ */}
      <section className="ld-styles">
        <div className="ld-container">
          <motion.div 
            className="ld-section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="ld-section-tag">DESIGN STYLES</span>
            <h2>Our <span className="ld-gradient">Design Styles</span></h2>
            <p>We create logos in various styles to match your brand personality</p>
          </motion.div>

          <div className="ld-styles-grid">
            {styles.map((style, index) => (
              <motion.div 
                key={index}
                className="ld-style-item"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <span className="ld-style-name">{style}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROCESS SECTION ============ */}
      <section className="ld-process">
        <div className="ld-container">
          <motion.div 
            className="ld-section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="ld-section-tag">OUR PROCESS</span>
            <h2>How We <span className="ld-gradient">Design</span></h2>
            <p>A collaborative process to bring your brand vision to life</p>
          </motion.div>

          <div className="ld-process-grid">
            {[
              { number: "01", title: "Discovery", desc: "We learn about your brand, vision, and design preferences." },
              { number: "02", title: "Research", desc: "Analyze your industry, competitors, and target audience." },
              { number: "03", title: "Sketches", desc: "Create multiple logo concepts and design directions." },
              { number: "04", title: "Design", desc: "Develop refined digital versions of the chosen concepts." },
              { number: "05", title: "Revisions", desc: "Collaborate with you to perfect the design." },
              { number: "06", title: "Delivery", desc: "Finalize and deliver all logo files and brand assets." }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className="ld-process-step"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="ld-step-number">{step.number}</div>
                <div className="ld-step-content">
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ============ CTA SECTION ============ */}
      <section className="ld-cta">
        <div className="ld-container">
          <motion.div 
            className="ld-cta-content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2>Ready to Create Your <span className="ld-gradient">Brand Identity</span>?</h2>
            <p>Let's design a logo that represents your brand and connects with your audience.</p>
            <div className="ld-cta-buttons">
              <Link to="/contact" className="ld-btn-primary">
                Get Started Now <ArrowRight size={18} />
              </Link>
              <button 
                className="ld-btn-secondary"
                onClick={() => navigate('/services')}
              >
                ← Back to Services
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}