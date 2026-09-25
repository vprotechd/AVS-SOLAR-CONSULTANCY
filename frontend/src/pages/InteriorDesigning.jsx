// src/pages/InteriorDesigning.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './InteriorDesigning.css';

export default function InteriorDesigning() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      title: "Residential Interior Design",
      description: "Transform your home with beautiful, functional interior designs that reflect your personal style."
    },
    {
      title: "Commercial Interior Design",
      description: "Professional interior designs for offices, retail spaces, restaurants, and commercial establishments."
    },
    {
      title: "Office Interior Design",
      description: "Create productive workspaces with modern office interior designs that inspire creativity and efficiency."
    },
    {
      title: "Bedroom Design",
      description: "Design cozy, relaxing bedrooms that are both functional and aesthetically pleasing."
    },
    {
      title: "Kitchen & Dining Design",
      description: "Beautiful kitchen and dining spaces designed for both functionality and visual appeal."
    },
    {
      title: "Living Room Design",
      description: "Stylish living room designs that create a warm and welcoming atmosphere for your home."
    }
  ];

  return (
    <>
      <Navbar />
      
      {/* ============ SERVICES SECTION ============ */}
      <section className="id-services">
        <div className="id-container">
          <motion.div 
            className="id-section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="id-section-tag">WHAT WE CREATE</span>
            <h2>Interior <span className="id-gradient">Designing</span></h2>
            <p>Transform spaces into beautiful, functional environments that inspire and delight</p>
          </motion.div>

          <div className="id-services-grid">
            {services.map((service, index) => (
              <motion.div 
                key={index}
                className="id-service-card"
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

      {/* ============ PROCESS SECTION ============ */}
      <section className="id-process">
        <div className="id-container">
          <motion.div 
            className="id-section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="id-section-tag">OUR PROCESS</span>
            <h2>How We <span className="id-gradient">Design Spaces</span></h2>
            <p>A collaborative approach to bring your interior design vision to life</p>
          </motion.div>

          <div className="id-process-grid">
            {[
              { number: "01", title: "Consultation", desc: "We discuss your vision, style preferences, and requirements." },
              { number: "02", title: "Concept Development", desc: "Create mood boards and design concepts for your space." },
              { number: "03", title: "Space Planning", desc: "Optimize layout and functionality for your interior space." },
              { number: "04", title: "Design Execution", desc: "Develop detailed design plans, material selection, and color schemes." },
              { number: "05", title: "Implementation", desc: "Oversee the execution and installation of the design." },
              { number: "06", title: "Final Reveal", desc: "Deliver the finished space and ensure your complete satisfaction." }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className="id-process-step"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="id-step-number">{step.number}</div>
                <div className="id-step-content">
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="id-cta">
        <div className="id-container">
          <motion.div 
            className="id-cta-content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2>Ready to Transform Your <span className="id-gradient">Space</span>?</h2>
            <p>Let's create beautiful, functional interiors that reflect your style and needs.</p>
            <div className="id-cta-buttons">
              <Link to="/contact" className="id-btn-primary">
                Get Started Now <ArrowRight size={18} />
              </Link>
              <button 
                className="id-btn-secondary"
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