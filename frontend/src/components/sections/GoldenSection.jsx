import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import aboutImage from "../../assets/aboutt.jpg";

export default function GoldenSection() {
  return (
    <section className="golden-section">

      {/* Background */}
      <motion.div
        className="golden-background-image"
        style={{
          backgroundImage: `url(${aboutImage})`,
        }}
        animate={{
          scale: [1, 1.04, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="golden-background-overlay" />
      <div className="golden-light-overlay" />

      {/* Decorative elements */}
      <div className="golden-decoration golden-decoration-left" />
      <div className="golden-decoration golden-decoration-right" />

      <div className="golden-container">

        <motion.div
          className="golden-content-card"
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.9,
            ease: "easeOut",
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
        >

          {/* Badge */}
          <motion.div
            className="golden-badge"
            initial={{
              opacity: 0,
              y: 15,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            viewport={{
              once: true,
            }}
          >
            <span className="badge-line" />

            <Sparkles size={16} />

            <span>ABOUT US</span>

            <span className="badge-line" />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="golden-title"
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: "easeOut",
            }}
            viewport={{
              once: true,
            }}
          >
            Building Digital
            <span className="golden-highlight">
              {" "}Excellence
            </span>
            <br />
            That Creates Real Impact
          </motion.h1>

          {/* Divider */}
          <motion.div
            className="golden-divider"
            initial={{
              width: 0,
              opacity: 0,
            }}
            whileInView={{
              width: 75,
              opacity: 1,
            }}
            transition={{
              duration: 0.7,
              delay: 0.25,
            }}
            viewport={{
              once: true,
            }}
          />

          {/* Description */}
          <motion.p
            className="golden-subtitle"
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.3,
            }}
            viewport={{
              once: true,
            }}
          >
            We create premium digital experiences that help businesses
            grow, connect with their customers, and move confidently
            into the future.
          </motion.p>

          <motion.p
            className="golden-subtitle-2"
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.45,
            }}
            viewport={{
              once: true,
            }}
          >
            From custom software and modern web applications to
            AI-powered solutions, our team combines creativity,
            technology, and strategy to turn ambitious ideas into
            meaningful digital products.
          </motion.p>

          {/* Features */}
          <motion.div
            className="golden-features"
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.6,
            }}
            viewport={{
              once: true,
            }}
          >

            <div className="golden-feature">
              <span className="feature-number">01</span>

              <div>
                <strong>Innovation</strong>
                <small>
                  Ideas that move businesses forward
                </small>
              </div>
            </div>

            <div className="golden-feature">
              <span className="feature-number">02</span>

              <div>
                <strong>Technology</strong>
                <small>
                  Modern solutions built to perform
                </small>
              </div>
            </div>

            <div className="golden-feature">
              <span className="feature-number">03</span>

              <div>
                <strong>Excellence</strong>
                <small>
                  Quality in every digital experience
                </small>
              </div>
            </div>

          </motion.div>

          {/* CTA */}
          <motion.div
            className="golden-cta"
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
            }}
            transition={{
              duration: 0.7,
              delay: 0.75,
            }}
            viewport={{
              once: true,
            }}
          >
            <span>
              Let's build something exceptional
            </span>

            <ArrowRight size={18} />
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}