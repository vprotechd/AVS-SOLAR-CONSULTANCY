import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import img1 from "../../assets/img1.jpg";
import img2 from "../../assets/img2.jpg";
import img3 from "../../assets/img3.jpg";
import img4 from "../../assets/img4.jpg";
import img5 from "../../assets/img5.jpg";
import img6 from "../../assets/img6.jpeg";
import img7 from "../../assets/img7.jpg";
import img8 from "../../assets/img8.jpg";

import "./GallerySection.css";

const images = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),

  center: {
    x: 0,
    opacity: 1,
  },

  exit: (direction) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
  }),
};

export default function GallerySection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  /* =========================================================
     AUTO SLIDE
  ========================================================= */

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);

      setCurrentIndex((prev) =>
        (prev + 1) % images.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  /* =========================================================
     PREVIOUS
  ========================================================= */

  const goToPrevious = () => {
    setDirection(-1);

    setCurrentIndex((prev) =>
      prev === 0
        ? images.length - 1
        : prev - 1
    );
  };

  /* =========================================================
     NEXT
  ========================================================= */

  const goToNext = () => {
    setDirection(1);

    setCurrentIndex((prev) =>
      (prev + 1) % images.length
    );
  };

  /* =========================================================
     THUMBNAIL
  ========================================================= */

  const goToSlide = (index) => {
    if (index === currentIndex) return;

    setDirection(
      index > currentIndex ? 1 : -1
    );

    setCurrentIndex(index);
  };

  return (
    <section className="gallery-section">

      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}

      <div className="gallery-decoration gallery-circle-left"></div>

      <div className="gallery-decoration gallery-circle-right"></div>

      <div className="gallery-dots-decoration dots-left">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="gallery-dots-decoration dots-right">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="gallery-gold-curve curve-left"></div>

      <div className="gallery-gold-curve curve-right"></div>


      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="gallery-container">

        {/* ===================================================
            HEADER
        =================================================== */}

        <motion.div
          className="gallery-header"
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          viewport={{
            once: true,
          }}
        >

          <div className="gallery-eyebrow">

            <span className="eyebrow-line"></span>

            <span>
              OUR JOURNEY
            </span>

            <span className="eyebrow-line"></span>

          </div>


          <h2 className="gallery-title">
            Moments That Define Us
          </h2>


          <p className="gallery-subtitle">
            From humble beginnings to growth, every step has
            been a part of our story.
            <br />

            Here are some glimpses of our journey so far.
          </p>

        </motion.div>


        {/* ===================================================
            GALLERY AREA
        =================================================== */}

        <motion.div
          className="gallery-slider-area"
          initial={{
            opacity: 0,
            y: 35,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.1,
          }}
          viewport={{
            once: true,
          }}
        >

          {/* =================================================
              MAIN IMAGE
          ================================================= */}

          <div className="gallery-main-wrapper">

            <AnimatePresence
              initial={false}
              custom={direction}
              mode="popLayout"
            >

              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.55,
                  ease: "easeInOut",
                }}
                className="gallery-slide"
              >

                <img
                  src={images[currentIndex]}
                  alt={`Journey ${currentIndex + 1}`}
                  className="gallery-main-image"
                  width="1200"
                  height="600"
                />

                <div className="gallery-image-overlay"></div>

              </motion.div>

            </AnimatePresence>


            {/* =================================================
                COUNTER
            ================================================= */}

            <div className="gallery-counter">

              <span className="counter-active">
                {String(currentIndex + 1).padStart(2, "0")}
              </span>

              <span className="counter-divider">
                /
              </span>

              <span className="counter-total">
                {String(images.length).padStart(2, "0")}
              </span>

            </div>


            {/* =================================================
                LEFT ARROW
            ================================================= */}

            <button
              className="gallery-arrow gallery-arrow-left"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft size={25} />
            </button>


            {/* =================================================
                RIGHT ARROW
            ================================================= */}

            <button
              className="gallery-arrow gallery-arrow-right"
              onClick={goToNext}
              aria-label="Next image"
            >
              <ChevronRight size={25} />
            </button>

          </div>


          {/* ===================================================
              THUMBNAILS
          =================================================== */}

          <div className="gallery-thumbnails">

            {images.map((image, index) => (

              <button
                key={index}
                className={`gallery-thumbnail ${
                  index === currentIndex
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  goToSlide(index)
                }
                aria-label={`View image ${index + 1}`}
              >

                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                />

              </button>

            ))}

          </div>


          {/* ===================================================
              PAGINATION DOTS
          =================================================== */}

          <div className="gallery-pagination">

            {images.map((_, index) => (

              <button
                key={index}
                className={`gallery-pagination-dot ${
                  index === currentIndex
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  goToSlide(index)
                }
                aria-label={`Go to slide ${index + 1}`}
              />

            ))}

          </div>

        </motion.div>

      </div>

    </section>
  );
}