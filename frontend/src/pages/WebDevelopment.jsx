// src/pages/WebDevelopment.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Code, 
  Globe, 
  ShoppingCart, 
  Building2, 
  Hotel, 
  Layout,
  Database,
  Users,
  Award,
  Clock,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './WebDevelopment.css';

export default function WebDevelopment() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      icon: <Globe size={24} />,
      title: "Custom Web Applications",
      description: "Tailored web solutions built with modern technologies to meet your specific business needs."
    },
    {
      icon: <ShoppingCart size={24} />,
      title: "E-Commerce Development",
      description: "Feature-rich online stores with seamless payment integration and exceptional user experience."
    },
    {
      icon: <Building2 size={24} />,
      title: "Real Estate Websites",
      description: "Powerful property listing platforms with advanced search and virtual tour capabilities."
    },
    {
      icon: <Hotel size={24} />,
      title: "Hotel Booking Systems",
      description: "Complete hotel management solutions with real-time booking and availability systems."
    },
    {
      icon: <Layout size={24} />,
      title: "Business Management Systems",
      description: "Comprehensive business solutions to streamline operations and boost productivity."
    },
    {
      icon: <Database size={24} />,
      title: "Custom CMS Solutions",
      description: "User-friendly content management systems tailored to your business requirements."
    }
  ];
 

  return (
    <>
      <Navbar />
      
      
      {/* ============ SERVICES SECTION ============ */}
      <section className="wd-services">
        <div className="wd-container">
          <motion.div 
            className="wd-section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="wd-section-tag">WHAT WE BUILD</span>
            <h2>Our Web Development <span className="wd-gradient">Services</span></h2>
            <p>Comprehensive web solutions to bring your digital vision to life</p>
          </motion.div>

          <div className="wd-services-grid">
            {services.map((service, index) => (
              <motion.div 
                key={index}
                className="wd-service-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="wd-service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROCESS SECTION ============ */}
      <section className="wd-process">
        <div className="wd-container">
          <motion.div 
            className="wd-section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="wd-section-tag">OUR PROCESS</span>
            <h2>How We <span className="wd-gradient">Work</span></h2>
            <p>A streamlined approach to deliver your project on time</p>
          </motion.div>

          <div className="wd-process-grid">
            {[
              { number: "01", title: "Discovery", desc: "We understand your goals, requirements, and target audience." },
              { number: "02", title: "Design", desc: "Create wireframes and visual designs that align with your brand." },
              { number: "03", title: "Development", desc: "Build your application with clean, scalable code." },
              { number: "04", title: "Testing", desc: "Rigorous testing to ensure quality and performance." },
              { number: "05", title: "Launch", desc: "Deploy your application and monitor its performance." },
              { number: "06", title: "Support", desc: "Ongoing maintenance and support for your peace of mind." }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className="wd-process-step"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="wd-step-number">{step.number}</div>
                <div className="wd-step-content">
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="wd-cta">
        <div className="wd-container">
          <motion.div 
            className="wd-cta-content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2>Ready to Build Your <span className="wd-gradient">Web Project</span>?</h2>
            <p>Let's discuss your requirements and create something amazing together.</p>
            <div className="wd-cta-buttons">
              <Link to="/contact" className="wd-btn-primary">
                Contact Us Now <ArrowRight size={18} />
              </Link>
              <button 
                className="wd-btn-secondary"
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