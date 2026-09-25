import React from "react";
import { motion } from "framer-motion";
import { FaCloudUploadAlt, FaUsers, FaAward } from "react-icons/fa";
import { HiArrowLongRight } from "react-icons/hi2";

export default function ProcessSection() {
  const steps = [
    {
      icon: FaCloudUploadAlt,
      title: "Share Your Requirements",
      desc: "Tell us about your business goals, website requirements, application needs, or digital challenges.",
    },
    {
      icon: FaUsers,
      title: "Strategy & Planning",
      desc: "We prepare the perfect roadmap including design, development, timeline and execution plan.",
    },
    {
      icon: FaAward,
      title: "Design, Launch & Growth",
      desc: "Our experts build, test and launch your project while providing continuous support.",
    },
  ];

  return (
    <section className="process-section">

      {/* Background decoration */}
      <div className="process-bg-circle process-bg-one"></div>
      <div className="process-bg-circle process-bg-two"></div>

      {/* Heading */}
      <motion.h4
        className="small-heading"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        WORKING PROCESS
      </motion.h4>

      <motion.h2
        className="main-heading"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        viewport={{ once: true }}
      >
        How Can You Start?
      </motion.h2>

      <motion.p
        className="process-subtitle"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        viewport={{ once: true }}
      >
        A simple and transparent process designed to turn your ideas into
        successful digital solutions.
      </motion.p>

      {/* Process */}
      <div className="process-container">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <React.Fragment key={index}>

              <motion.div
                className="step"
                initial={{
                  opacity: 0,
                  y: 70,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.2,
                  duration: 0.7,
                  type: "spring",
                  stiffness: 90,
                }}
                whileHover={{
                  y: -14,
                  scale: 1.025,
                }}
                viewport={{ once: true }}
              >

                {/* Top glow */}
                <div className="card-glow"></div>

                {/* Icon */}
                <motion.div
                  className="icon-circle"
                  whileHover={{
                    rotate: 8,
                    scale: 1.08,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className="step-icon" />

                  <div className="step-number">
                    0{index + 1}
                  </div>
                </motion.div>

                {/* Content */}
                <h3 className="step-title">
                  {step.title}
                </h3>

                <p className="step-desc">
                  {step.desc}
                </p>

                {/* Bottom line */}
                <div className="step-line"></div>

              </motion.div>

              {/* Arrow */}
              {index < steps.length - 1 && (
                <motion.div
                  className="process-arrow-wrapper"
                  initial={{
                    opacity: 0,
                    scale: 0.5,
                  }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    delay: index * 0.2 + 0.4,
                    duration: 0.5,
                  }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    animate={{
                      x: [0, 8, 0],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <HiArrowLongRight className="process-arrow" />
                  </motion.div>
                </motion.div>
              )}

            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}