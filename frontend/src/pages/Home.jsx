import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import all section components
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import ServicesSection from '../components/sections/ServicesSection';
import LogoSliderSection from '../components/sections/LogoSliderSection';
import ProcessSection from '../components/sections/ProcessSection';
import CoursesSection from '../components/sections/CoursesSection';
import GallerySection from '../components/sections/GallerySection';

// Import CSS
import "./Home.css";
import "../App.css";
import "../components/sections/ProcessSection.css";

export default function Home() {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const coursesRef = useRef(null);
  const servicesRef = useRef(null);

  const scrollToCourses = () => {
    coursesRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <>
      <HeroSection scrollToServices={scrollToServices} scrollToCourses={scrollToCourses} />
      <AboutSection />
      <ServicesSection servicesRef={servicesRef} navigate={navigate} />
      <LogoSliderSection />
      <ProcessSection />
      <CoursesSection coursesRef={coursesRef} />
      <GallerySection />
    </>
  );
}