// src/pages/Services.jsx

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  Globe2,
  Smartphone,
  Megaphone,
  Palette,
  LayoutTemplate,
  Home,
  Lightbulb,
  Search,
  PencilRuler,
  Code2,
  Rocket,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import custom from "../assets/itand custom.jpg";
import expertiseBg from "../assets/digital.jpg";
import digital from "../assets/digi.jpg";
import fullstack from "../assets/full.jpg";
import mechanical from "../assets/design.jpg";
import internship from "../assets/interior.jpg";
import servicesBg from "../assets/services.jpg";

import "./Services.css";

const services = [
  {
    id: "web-development",
    title: "Web Development",
    category: "WEB SOLUTIONS",
    shortTitle: "Web",
    desc: "Custom web applications, e-commerce websites, real estate platforms, hotel booking systems and business management solutions.",
    img: custom,
    path: "/webdevelopment",
    icon: Globe2,
    features: [
      "Business Websites",
      "Custom Web Applications",
      "E-Commerce Development",
      "Business Management Systems",
    ],
  },

  {
    id: "android-app-development",
    title: "Android App Development",
    category: "MOBILE SOLUTIONS",
    shortTitle: "Mobile",
    desc: "Custom Android applications designed for startups, businesses and organizations with smooth, reliable digital experiences.",
    img: expertiseBg,
    path: "/mobile-apps",
    icon: Smartphone,
    features: [
      "Custom Android Apps",
      "Business Applications",
      "API Integration",
      "Mobile Solutions",
    ],
  },

  {
    id: "digital-marketing",
    title: "Digital Marketing",
    category: "DIGITAL GROWTH",
    shortTitle: "Growth",
    desc: "Data-driven digital marketing strategies that help businesses improve visibility, connect with customers and generate leads.",
    img: digital,
    path: "/digital-marketing",
    icon: Megaphone,
    features: [
      "Search Engine Optimization",
      "Social Media Marketing",
      "Google Ads",
      "Lead Generation",
    ],
  },

  {
    id: "logo-designing",
    title: "Logo Designing",
    category: "BRAND IDENTITY",
    shortTitle: "Branding",
    desc: "Creative logo and visual identity solutions designed to give your business a professional and memorable brand presence.",
    img: fullstack,
    path: "/logo-designing",
    icon: Palette,
    features: [
      "Custom Logo Design",
      "Brand Identity",
      "Creative Concepts",
      "Marketing Graphics",
    ],
  },

  {
    id: "website-design",
    title: "Website Design",
    category: "UI / UX DESIGN",
    shortTitle: "Design",
    desc: "Beautiful, responsive and user-focused website designs created to represent your brand and provide an engaging experience.",
    img: mechanical,
    path: "/website-design",
    icon: LayoutTemplate,
    features: [
      "Responsive Design",
      "UI / UX Design",
      "Corporate Websites",
      "Portfolio Websites",
    ],
  },

  {
    id: "interior-designing",
    title: "Interior Designing",
    category: "SPACE DESIGN",
    shortTitle: "Interior",
    desc: "Thoughtful residential and commercial interior design solutions that combine functionality, aesthetics and modern design.",
    img: internship,
    path: "/interior-designing",
    icon: Home,
    features: [
      "Residential Interiors",
      "Commercial Interiors",
      "Space Planning",
      "Modern Design Concepts",
    ],
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

export default function Services() {
  const navigate = useNavigate();

  const handleExplore = (path) => {
    navigate(path);
  };

  const scrollToServices = () => {
    document.getElementById("services-list")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="services-page">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        className="services-hero"
        style={{
          backgroundImage: `url("${servicesBg}")`,
        }}
      >
        <div className="services-hero-overlay"></div>

        <div className="services-hero-grid"></div>

        <div className="services-hero-content">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="services-eyebrow">
              <Sparkles size={15} />
              OUR SERVICES
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.75,
              delay: 0.1,
            }}
          >
            Digital Solutions
            <span> Built Around Your Business.</span>
          </motion.h1>

          <motion.p
            className="services-hero-description"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.2,
            }}
          >
            From websites and mobile applications to digital
            marketing, branding and design, we create practical
            digital solutions that help businesses move forward.
          </motion.p>

          <motion.div
            className="hero-service-points"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.3,
            }}
          >
            <div>
              <CheckCircle2 size={17} />
              <span>Business-focused solutions</span>
            </div>

            <div>
              <CheckCircle2 size={17} />
              <span>Modern technology & design</span>
            </div>

            <div>
              <CheckCircle2 size={17} />
              <span>Support from idea to launch</span>
            </div>
          </motion.div>

          <motion.button
            className="services-hero-btn"
            onClick={scrollToServices}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.4,
            }}
          >
            Explore Our Services
            <ArrowUpRight size={19} />
          </motion.button>
        </div>

        {/* Hero visual panel */}

        <motion.div
          className="hero-services-panel"
          initial={{
            opacity: 0,
            x: 60,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.35,
          }}
        >
          <div className="hero-panel-top">
            <div className="hero-panel-icon">
              <Lightbulb size={20} />
            </div>

            <div>
              <span>WHAT WE BUILD</span>
              <strong>Digital Experiences</strong>
            </div>
          </div>

          <div className="hero-panel-services">

            <div>
              <span>01</span>
              <p>Web Development</p>
              <ArrowUpRight size={16} />
            </div>

            <div>
              <span>02</span>
              <p>Mobile Applications</p>
              <ArrowUpRight size={16} />
            </div>

            <div>
              <span>03</span>
              <p>Digital Marketing</p>
              <ArrowUpRight size={16} />
            </div>

            <div>
              <span>04</span>
              <p>Brand & Design</p>
              <ArrowUpRight size={16} />
            </div>

          </div>

          <div className="hero-panel-footer">
            <span>VProTech Digital</span>
            <span>Ideas → Solutions</span>
          </div>
        </motion.div>
      </section>


      {/* =====================================================
          INTRO
      ====================================================== */}

      <section className="services-intro">

        <motion.div
          className="services-intro-inner"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
        >
          <div className="intro-label-row">
            <span className="section-label">
              WHAT WE OFFER
            </span>

            <span className="intro-line"></span>
          </div>

          <div className="intro-content">

            <h2>
              Everything You Need For Your
              <span> Digital Journey.</span>
            </h2>

            <p>
              We combine technology, creativity and business
              understanding to deliver digital solutions that
              are designed around your requirements — from the
              initial idea to the final product.
            </p>

          </div>
        </motion.div>

      </section>


      {/* =====================================================
          SERVICES
      ====================================================== */}

      <section
        className="services-list-section"
        id="services-list"
      >

        <div className="services-section-heading">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="section-label">
              OUR EXPERTISE
            </span>

            <h2>
              Explore Our
              <span> Services.</span>
            </h2>

            <p>
              Discover our range of professional services and
              choose the solution that fits your business needs.
            </p>
          </motion.div>

        </div>


        <motion.div
          className="services-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.05,
          }}
        >

          {services.map((service, index) => {

            const Icon = service.icon;

            return (
              <motion.article
                className="service-card-wrapper"
                key={service.id}
                variants={cardVariants}
              >

                {/* SERVICE CARD */}

                <div className="service-card">

                  <div className="service-card-image">

                    <img
                      src={service.img}
                      alt={service.title}
                    />

                    <div className="service-image-overlay"></div>

                    <div className="service-image-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="service-image-icon">
                      <Icon size={23} />
                    </div>

                  </div>


                  <div className="service-card-content">

                    <div className="service-card-category">
                      {service.category}
                    </div>

                    <h3>
                      {service.title}
                    </h3>

                    <p>
                      {service.desc}
                    </p>


                    <div className="service-feature-list">

                      {service.features.map((feature) => (
                        <div
                          className="service-feature"
                          key={feature}
                        >
                          <CheckCircle2 size={15} />
                          <span>{feature}</span>
                        </div>
                      ))}

                    </div>

                  </div>

                </div>


                {/* EXPLORE BUTTON OUTSIDE CARD */}

                <button
                  className="explore-btn"
                  onClick={() =>
                    handleExplore(service.path)
                  }
                  aria-label={`Explore ${service.title}`}
                >
                  <span>Explore More</span>

                  <span className="explore-arrow">
                    <ArrowUpRight size={17} />
                  </span>
                </button>

              </motion.article>
            );
          })}

        </motion.div>

      </section>


      {/* =====================================================
          PROCESS
      ====================================================== */}

      <section className="services-process">

        <div className="process-container">

          <motion.div
            className="process-heading"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="section-label">
              HOW WE WORK
            </span>

            <h2>
              From Idea To
              <span> Launch.</span>
            </h2>

            <p>
              A simple and transparent process helps us turn
              your requirements into a reliable digital solution.
            </p>
          </motion.div>


          <motion.div
            className="process-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.1,
            }}
          >

            <div className="process-item">
              <div className="process-icon">
                <Search size={21} />
              </div>

              <span className="process-number">01</span>

              <h3>Discover</h3>

              <p>
                We understand your business, goals, audience
                and project requirements.
              </p>
            </div>


            <div className="process-item">
              <div className="process-icon">
                <PencilRuler size={21} />
              </div>

              <span className="process-number">02</span>

              <h3>Plan</h3>

              <p>
                We define the right technology, features,
                structure and project direction.
              </p>
            </div>


            <div className="process-item">
              <div className="process-icon">
                <Palette size={21} />
              </div>

              <span className="process-number">03</span>

              <h3>Design</h3>

              <p>
                We create intuitive interfaces and experiences
                aligned with your brand.
              </p>
            </div>


            <div className="process-item">
              <div className="process-icon">
                <Code2 size={21} />
              </div>

              <span className="process-number">04</span>

              <h3>Develop</h3>

              <p>
                Our development team turns the approved concept
                into a functional product.
              </p>
            </div>


            <div className="process-item">
              <div className="process-icon">
                <Rocket size={21} />
              </div>

              <span className="process-number">05</span>

              <h3>Test & Launch</h3>

              <p>
                We test, deploy and help you move your digital
                solution into the real world.
              </p>
            </div>

          </motion.div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ====================================================== */}

      <section className="services-cta">

        <div className="cta-decoration cta-decoration-one"></div>
        <div className="cta-decoration cta-decoration-two"></div>

        <motion.div
          className="cta-content"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >

          <span className="section-label">
            LET'S BUILD TOGETHER
          </span>

          <h2>
            Have An Idea?
            <span> Let's Bring It To Life.</span>
          </h2>

          <p>
            Tell us what you want to build and our team will
            help you find the right digital solution.
          </p>

          <button
            className="cta-button"
            onClick={() => navigate("/contact")}
          >
            Start a Conversation
            <ArrowUpRight size={20} />
          </button>

        </motion.div>

      </section>

    </main>
  );
}