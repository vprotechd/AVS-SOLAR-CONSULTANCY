// src/pages/DigitalMarketing.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './DigitalMarketing.css';

export default function DigitalMarketing() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      title: "Search Engine Optimization (SEO)",
      description: "Boost your website rankings with strategic SEO techniques that drive organic traffic and increase visibility."
    },
    {
      title: "Social Media Marketing",
      description: "Engage your audience across all major platforms with creative content and strategic social media campaigns."
    },
    {
      title: "Google Ads & PPC",
      description: "Targeted advertising campaigns that deliver measurable results and maximize your return on investment."
    },
    {
      title: "Email Marketing",
      description: "Build lasting relationships with personalized email campaigns that convert leads into loyal customers."
    },
    {
      title: "Content Marketing",
      description: "Create valuable content that attracts, engages, and converts your target audience."
    },
    {
      title: "Analytics & Reporting",
      description: "Data-driven insights to track performance, optimize campaigns, and make informed business decisions."
    }
  ];

  const platforms = ["Facebook", "Instagram", "Twitter", "LinkedIn", "YouTube", "Google"];

  return (
    <>
      <Navbar />
      
      {/* ============ SERVICES SECTION ============ */}
      <section className="dm-services">
        <div className="dm-container">
          <motion.div 
            className="dm-section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="dm-section-tag">WHAT WE OFFER</span>
            <h2>Digital <span className="dm-gradient">Marketing</span></h2>
            <p>Data-driven marketing strategies to grow your brand and boost revenue</p>
          </motion.div>

          <div className="dm-services-grid">
            {services.map((service, index) => (
              <motion.div 
                key={index}
                className="dm-service-card"
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

      {/* ============ PLATFORMS SECTION ============ */}
      <section className="dm-platforms">
        <div className="dm-container">
          <motion.div 
            className="dm-section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="dm-section-tag">PLATFORMS</span>
            <h2>We Work Across <span className="dm-gradient">All Platforms</span></h2>
            <p>Reach your audience wherever they are with our multi-platform approach</p>
          </motion.div>

          <div className="dm-platforms-grid">
            {platforms.map((platform, index) => (
              <motion.div 
                key={index}
                className="dm-platform-item"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <span className="dm-platform-name">{platform}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROCESS SECTION ============ */}
      <section className="dm-process">
        <div className="dm-container">
          <motion.div 
            className="dm-section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="dm-section-tag">OUR PROCESS</span>
            <h2>How We <span className="dm-gradient">Drive Results</span></h2>
            <p>A strategic approach to deliver measurable marketing success</p>
          </motion.div>

          <div className="dm-process-grid">
            {[
              { number: "01", title: "Research & Analysis", desc: "We analyze your business, competitors, and target audience." },
              { number: "02", title: "Strategy Development", desc: "Create a customized marketing strategy aligned with your goals." },
              { number: "03", title: "Campaign Execution", desc: "Launch targeted campaigns across multiple platforms." },
              { number: "04", title: "Monitoring & Optimization", desc: "Track performance and optimize for better results." },
              { number: "05", title: "Reporting", desc: "Data-driven reports to show ROI and campaign effectiveness." },
              { number: "06", title: "Growth & Scaling", desc: "Scale successful strategies for continuous business growth." }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className="dm-process-step"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="dm-step-number">{step.number}</div>
                <div className="dm-step-content">
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="dm-cta">
        <div className="dm-container">
          <motion.div 
            className="dm-cta-content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2>Ready to Grow Your <span className="dm-gradient">Digital Presence</span>?</h2>
            <p>Let's create a custom marketing strategy that drives real results for your business.</p>
            <div className="dm-cta-buttons">
              <Link to="/contact" className="dm-btn-primary">
                Get Started Now <ArrowRight size={18} />
              </Link>
              <button 
                className="dm-btn-secondary"
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