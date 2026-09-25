// src/pages/AndroidDevelopment.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Smartphone, 
  Layout, 
  Database, 
  Shield, 
  Zap, 
  Users,
  Award,
  Clock,
  Sparkles,
  Phone,
  Settings,
  Cloud,
  Lock
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AndroidDevelopment.css';

export default function AndroidDevelopment() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      icon: <Smartphone size={24} />,
      title: "Custom Android Apps",
      description: "Tailored Android applications built with modern technologies to meet your specific business needs."
    },
    {
      icon: <Layout size={24} />,
      title: "UI/UX Design for Mobile",
      description: "Beautiful, intuitive interfaces designed to provide exceptional user experience on Android devices."
    },
    {
      icon: <Database size={24} />,
      title: "Backend Integration",
      description: "Seamless integration with powerful backend systems, APIs, and cloud services for robust app functionality."
    },
    {
      icon: <Shield size={24} />,
      title: "App Security Solutions",
      description: "Enterprise-grade security features including encryption, authentication, and data protection."
    },
    {
      icon: <Zap size={24} />,
      title: "Performance Optimization",
      description: "Lightning-fast performance with optimized code, efficient memory management, and smooth animations."
    },
    {
      icon: <Cloud size={24} />,
      title: "Cloud & API Integration",
      description: "Seamless integration with cloud services, REST APIs, and third-party services for enhanced functionality."
    }
  ];

  return (
    <>
      <Navbar />
      
      {/* ============ SERVICES SECTION ============ */}
      <section className="ad-services">
        <div className="ad-container">
          <motion.div 
            className="ad-section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="ad-section-tag">WHAT WE BUILD</span>
            <h2>Android App <span className="ad-gradient">Development</span></h2>
            <p>Create powerful, scalable Android applications that users love</p>
          </motion.div>

          <div className="ad-services-grid">
            {services.map((service, index) => (
              <motion.div 
                key={index}
                className="ad-service-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="ad-service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TECH STACK SECTION ============ */}
      <section className="ad-tech-stack">
        <div className="ad-container">
          <motion.div 
            className="ad-section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="ad-section-tag">TECHNOLOGIES</span>
            <h2>Our Android <span className="ad-gradient">Tech Stack</span></h2>
            <p>Modern technologies we use to build exceptional Android apps</p>
          </motion.div>

          <div className="ad-tech-grid">
            {[
              { name: "Kotlin", icon: "📱", color: "#7F52FF" },
              { name: "Java", icon: "☕", color: "#007396" },
              { name: "Android SDK", icon: "🤖", color: "#3DDC84" },
              { name: "Jetpack Compose", icon: "🖌️", color: "#4285F4" },
              { name: "Firebase", icon: "🔥", color: "#FFCA28" },
              { name: "Room Database", icon: "🗄️", color: "#4CAF50" },
              { name: "Retrofit", icon: "🔄", color: "#6DB33F" },
              { name: "Gradle", icon: "📦", color: "#02303A" }
            ].map((tech, index) => (
              <motion.div 
                key={index}
                className="ad-tech-item"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <span className="ad-tech-icon" style={{ color: tech.color }}>{tech.icon}</span>
                <span className="ad-tech-name">{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROCESS SECTION ============ */}
      <section className="ad-process">
        <div className="ad-container">
          <motion.div 
            className="ad-section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="ad-section-tag">OUR PROCESS</span>
            <h2>How We <span className="ad-gradient">Build Apps</span></h2>
            <p>A streamlined approach to deliver your Android app on time</p>
          </motion.div>

          <div className="ad-process-grid">
            {[
              { number: "01", title: "Discovery", desc: "We understand your app idea, goals, and target audience." },
              { number: "02", title: "Design", desc: "Create wireframes and beautiful UI/UX designs for your app." },
              { number: "03", title: "Development", desc: "Build your Android app with clean, scalable code." },
              { number: "04", title: "Testing", desc: "Rigorous testing to ensure quality and performance." },
              { number: "05", title: "Launch", desc: "Deploy your app to Google Play Store and monitor performance." },
              { number: "06", title: "Support", desc: "Ongoing maintenance, updates, and support for your app." }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className="ad-process-step"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="ad-step-number">{step.number}</div>
                <div className="ad-step-content">
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

     

      {/* ============ CTA SECTION ============ */}
      <section className="ad-cta">
        <div className="ad-container">
          <motion.div 
            className="ad-cta-content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2>Ready to Build Your <span className="ad-gradient">Android App</span>?</h2>
            <p>Let's discuss your app idea and create something amazing together.</p>
            <div className="ad-cta-buttons">
              <Link to="/contact" className="ad-btn-primary">
                Start Your Project <ArrowRight size={18} />
              </Link>
              <button 
                className="ad-btn-secondary"
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