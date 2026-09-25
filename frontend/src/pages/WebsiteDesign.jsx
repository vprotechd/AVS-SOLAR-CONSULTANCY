// src/pages/WebsiteDesign.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './WebsiteDesign.css';

export default function WebsiteDesign() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      title: "Responsive Website Design",
      description: "Mobile-first designs that look perfect on all devices from desktops to smartphones."
    },
    {
      title: "UI/UX Design",
      description: "User-centered designs that enhance engagement and deliver exceptional user experiences."
    },
    {
      title: "Business & Corporate Websites",
      description: "Professional website designs for businesses, corporations, and enterprises."
    },
    {
      title: "Portfolio Websites",
      description: "Beautiful portfolio designs that showcase your work and talent effectively."
    },
    {
      title: "E-commerce Website Design",
      description: "Engaging and conversion-focused designs for online stores and e-commerce platforms."
    },
    {
      title: "Landing Page Design",
      description: "High-converting landing pages designed to drive leads and sales."
    }
  ];

  return (
    <>
      <Navbar />
      
      {/* ============ SERVICES SECTION ============ */}
      <section className="ws-services">
        <div className="ws-container">
          <motion.div 
            className="ws-section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="ws-section-tag">WHAT WE DESIGN</span>
            <h2>Website <span className="ws-gradient">Design</span></h2>
            <p>Create stunning, user-friendly websites that captivate your audience and drive results</p>
          </motion.div>

          <div className="ws-services-grid">
            {services.map((service, index) => (
              <motion.div 
                key={index}
                className="ws-service-card"
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
      <section className="ws-process">
        <div className="ws-container">
          <motion.div 
            className="ws-section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="ws-section-tag">OUR PROCESS</span>
            <h2>How We <span className="ws-gradient">Design Websites</span></h2>
            <p>A structured approach to deliver beautiful, functional websites</p>
          </motion.div>

          <div className="ws-process-grid">
            {[
              { number: "01", title: "Discovery", desc: "We understand your goals, audience, and requirements." },
              { number: "02", title: "Wireframing", desc: "Create layout structures and user flow diagrams." },
              { number: "03", title: "Design", desc: "Develop visual designs that align with your brand." },
              { number: "04", title: "Review", desc: "Collaborate with you to refine and perfect the design." },
              { number: "05", title: "Delivery", desc: "Provide design files and assets for development." },
              { number: "06", title: "Support", desc: "Ongoing support and design assistance as needed." }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className="ws-process-step"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="ws-step-number">{step.number}</div>
                <div className="ws-step-content">
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="ws-cta">
        <div className="ws-container">
          <motion.div 
            className="ws-cta-content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2>Ready to Design Your <span className="ws-gradient">Website</span>?</h2>
            <p>Let's create a stunning website that represents your brand and engages your audience.</p>
            <div className="ws-cta-buttons">
              <Link to="/contact" className="ws-btn-primary">
                Get Started Now <ArrowRight size={18} />
              </Link>
              <button 
                className="ws-btn-secondary"
                onClick={() => navigate('/services')}
              >
                ← Back to Services
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}