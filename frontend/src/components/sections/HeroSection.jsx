import React, { useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Code,
  Smartphone,
  Globe,
  Cpu,
  CheckCircle2,
  TrendingUp,
  Lightbulb,
  Target,
  ShieldCheck,
} from "lucide-react";

import backgroundImage from "../../assets/backk.jpg";
import itemsImage from "../../assets/items.png";

import "./HeroSection.css";


/* ============================================================
   WORD ANIMATION
============================================================ */

const container = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.25,
      staggerChildren: 0.035,
    },
  },
};

const child = {
  hidden: {
    opacity: 0,
    y: 25,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};


/* ============================================================
   HERO SECTION
============================================================ */

export default function HeroSection({
  
  scrollToServices,
  scrollToCourses,
}) {

  const [hoveredStrategy, setHoveredStrategy] =
    useState(null);

const navigate = useNavigate();
  /* ==========================================================
     CURSOR MOVEMENT VALUES
  ========================================================== */

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 180,
    damping: 22,
    mass: 0.7,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 180,
    damping: 22,
    mass: 0.7,
  });


  /* ==========================================================
     CURSOR MOVE
  ========================================================== */

  const handleMouseMove = (e) => {

    const rect =
      e.currentTarget.getBoundingClientRect();

    const x =
      e.clientX - rect.left;

    const y =
      e.clientY - rect.top;

    const centerX =
      rect.width / 2;

    const centerY =
      rect.height / 2;

    const distanceX =
      x - centerX;

    const distanceY =
      y - centerY;

    const distance =
      Math.sqrt(
        distanceX * distanceX +
        distanceY * distanceY
      );

    const maxDistance =
      Math.sqrt(
        centerX * centerX +
        centerY * centerY
      );

    /*
      The closer the cursor is,
      the stronger the movement.
    */

    const proximity =
      1 -
      Math.min(
        distance / maxDistance,
        1
      );

    const movementPower =
      4 + proximity * 18;

    const normalizedX =
      centerX === 0
        ? 0
        : distanceX / centerX;

    const normalizedY =
      centerY === 0
        ? 0
        : distanceY / centerY;

    mouseX.set(
      normalizedX * movementPower
    );

    mouseY.set(
      normalizedY * movementPower
    );
  };


  /* ==========================================================
     CURSOR LEAVE
  ========================================================== */

  const handleMouseLeave = () => {

    mouseX.set(0);
    mouseY.set(0);

  };


  /* ============================================================
     SERVICES
  ============================================================ */

  const services = [

    {
      icon: Code,
      title: "Web Development",
      description: "Modern responsive websites",
      color: "#1557D6",
    },

    {
      icon: Smartphone,
      title: "Mobile Apps",
      description: "iOS & Android solutions",
      color: "#2563EB",
    },

    {
      icon: Globe,
      title: "Digital Marketing",
      description: "Grow your online presence",
      color: "#20B486",
    },

    {
      icon: Cpu,
      title: "AI Solutions",
      description: "Intelligent automation",
      color: "#0EA5A4",
    },

  ];


  /* ============================================================
     STRATEGIES
  ============================================================ */

  const strategies = [

    {
      icon: TrendingUp,
      title: "Digital Growth",
      text:
        "Build scalable digital solutions that help businesses grow faster.",
      color: "#1557D6",
    },

    {
      icon: Lightbulb,
      title: "Innovation",
      text:
        "Transform ideas into practical and innovative technology solutions.",
      color: "#20B486",
    },

    {
      icon: Target,
      title: "Smart Strategy",
      text:
        "Create technology strategies focused on measurable business results.",
      color: "#2563EB",
    },

    {
      icon: ShieldCheck,
      title: "Trusted Technology",
      text:
        "Deliver secure, reliable and future-ready digital experiences.",
      color: "#0EA5A4",
    },

  ];


  /* ============================================================
     HERO TEXT
  ============================================================ */

  const titleText =
    "Shaping the Future Through Technology and Purpose";

  const descriptionText =
    "At VProTech Digital, success goes beyond profit — we focus on creating value through advanced digital capabilities, empowering businesses to scale with purpose.";


  /* ============================================================
     RETURN
  ============================================================ */

  return (

    <section
      className="vpro-hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >

      {/* ======================================================
          BACKGROUND IMAGE

          backk.png
      ====================================================== */}

      <div
        className="vpro-background-image"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />


      {/* ======================================================
          BACKGROUND LIGHT OVERLAY
      ====================================================== */}

      <div className="vpro-background-overlay" />


      {/* ======================================================
          DECORATIVE LIGHT
      ====================================================== */}

      <div className="vpro-glow vpro-glow-blue" />

      <div className="vpro-glow vpro-glow-green" />


      {/* ======================================================
          MAIN HERO
      ====================================================== */}

      <div className="vpro-hero-container">


        {/* ====================================================
            LEFT SIDE CONTENT
        ==================================================== */}

        <motion.div
          className="vpro-hero-content"

          initial={{
            opacity: 0,
            x: -60,
          }}

          animate={{
            opacity: 1,
            x: 0,
          }}

          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >



           
      


          {/* ==================================================
              HEADING
          ================================================== */}

          <motion.h1
            className="vpro-hero-title"

            variants={container}

            initial="hidden"

            animate="visible"
          >

            {titleText
              .split(" ")
              .map((word, index) => (

                <motion.span
                  key={`${word}-${index}`}
                  variants={child}
                  className="vpro-title-word"
                >
                  {word}
                </motion.span>

              ))}

          </motion.h1>


          {/* ==================================================
              SUBTITLE
          ================================================== */}

          <motion.h2
            className="vpro-hero-subtitle"

            initial={{
              opacity: 0,
              y: 20,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              delay: 0.8,
              duration: 0.6,
            }}
          >

            <span>
              Innovation.
            </span>

            <span>
              Sustainability.
            </span>

            <span>
              Impact.
            </span>

          </motion.h2>


          {/* ==================================================
              DESCRIPTION
          ================================================== */}

          <motion.p
            className="vpro-hero-description"

            initial={{
              opacity: 0,
              y: 25,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              delay: 1,
              duration: 0.7,
            }}
          >

            {descriptionText}

          </motion.p>


          {/* ==================================================
              BUTTONS
          ================================================== */}

          <motion.div
            className="vpro-hero-buttons"

            initial={{
              opacity: 0,
              y: 25,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              delay: 1.2,
              duration: 0.6,
            }}
          >

           <motion.button
  type="button"
  className="vpro-primary-btn"
  onClick={() => navigate("/services")}
  whileHover={{
    scale: 1.05,
  }}
  whileTap={{
    scale: 0.96,
  }}
>
  <span>Our Services</span>
  <ArrowRight size={18} />
</motion.button>

            <motion.button
              type="button"
              className="vpro-secondary-btn"

              onClick={scrollToCourses}

              whileHover={{
                scale: 1.05,
              }}

              whileTap={{
                scale: 0.96,
              }}
            >

              <span>
                Explore Courses
              </span>

              <Sparkles size={18} />

            </motion.button>

          </motion.div>


          {/* ==================================================
              TRUST POINTS
          ================================================== */}

          <motion.div
            className="vpro-trust-row"

            initial={{
              opacity: 0,
              y: 20,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              delay: 1.45,
              duration: 0.6,
            }}
          >

            <div className="vpro-trust-item">

              <CheckCircle2 size={17} />

              <span>
                Innovative Solutions
              </span>

            </div>


            <div className="vpro-trust-item">

              <CheckCircle2 size={17} />

              <span>
                Business Focused
              </span>

            </div>


            <div className="vpro-trust-item">

              <CheckCircle2 size={17} />

              <span>
                Future Ready
              </span>

            </div>

          </motion.div>

        </motion.div>


        {/* ====================================================
            RIGHT SIDE
        ==================================================== */}

        <motion.div
          className="vpro-hero-visual"

          initial={{
            opacity: 0,
            scale: 0.85,
            x: 60,
          }}

          animate={{
            opacity: 1,
            scale: 1,
            x: 0,
          }}

          transition={{
            duration: 0.9,
            delay: 0.3,
            ease: "easeOut",
          }}
        >


          {/* ==================================================
              ITEMS IMAGE

              items.png

              THIS IS COMPLETELY SEPARATE
              FROM THE BACKGROUND.
          ================================================== */}

          <motion.div
            className="vpro-items-wrapper"

            style={{
              x: smoothX,
              y: smoothY,
            }}

            animate={{
              rotate: [0, 1.2, 0, -1.2, 0],
            }}

            transition={{
              rotate: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >

            <img
              src={itemsImage}
              alt="VProTech Digital technology"
              className="vpro-items-image"
              draggable="false"
            />

          </motion.div>


          {/* ==================================================
              DECORATIVE RING
          ================================================== */}

          <motion.div
            className="vpro-ring"

            animate={{
              rotate: 360,
            }}

            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "linear",
            }}
          >

            <span />

          </motion.div>


          {/* ==================================================
              FLOATING BLUE DOT
          ================================================== */}

          <motion.div
            className="vpro-floating-dot dot-blue"

            animate={{
              y: [0, -16, 0],
              x: [0, 5, 0],
            }}

            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />


          {/* ==================================================
              FLOATING GREEN DOT
          ================================================== */}

          <motion.div
            className="vpro-floating-dot dot-green"

            animate={{
              y: [0, 15, 0],
              x: [0, -5, 0],
            }}

            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

        </motion.div>

      </div>


      {/* ======================================================
          OUR STRATEGIES
      ====================================================== */}

      <motion.div
        className="vpro-strategy-section"

        initial={{
          opacity: 0,
          y: 40,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        transition={{
          delay: 1.4,
          duration: 0.7,
        }}
      >


        {/* ====================================================
            STRATEGY HEADER
        ==================================================== */}

        <div className="vpro-strategy-heading">

          <span className="strategy-small-title">
            OUR STRATEGIES
          </span>

          <h3>
            Technology That Creates{" "}
            <span>
              Real Impact
            </span>
          </h3>

        </div>


        {/* ====================================================
            STRATEGY CARDS
        ==================================================== */}

        <div className="vpro-strategy-grid">

          {strategies.map(
            (strategy, index) => {

              const Icon =
                strategy.icon;

              return (

                <motion.div
                  key={strategy.title}

                  className={`vpro-strategy-card ${
                    hoveredStrategy === index
                      ? "strategy-active"
                      : ""
                  }`}

                  onMouseEnter={() =>
                    setHoveredStrategy(index)
                  }

                  onMouseLeave={() =>
                    setHoveredStrategy(null)
                  }

                  whileHover={{
                    y: -7,
                  }}
                >



                  <div
                    className="strategy-icon"

                    style={{
                      color:
                        strategy.color,

                      backgroundColor:
                        `${strategy.color}12`,
                    }}
                  >

                    <Icon size={22} />

                  </div>


                  <div className="strategy-content">

                    <h4>
                      {strategy.title}
                    </h4>

                    <p>
                      {strategy.text}
                    </p>

                  </div>


                  <ArrowRight
                    className="strategy-arrow"
                    size={18}

                    style={{
                      color:
                        strategy.color,
                    }}
                  />

                </motion.div>

              );
            }
          )}

        </div>

      </motion.div>

    </section>
  );
}