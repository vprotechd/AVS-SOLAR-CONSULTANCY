
import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TeamSection from '../components/TeamSection';

// Import all section components
import GoldenSection from '../components/sections/GoldenSection';
import FounderSection from '../components/sections/FounderSection';
import AboutContentSection from '../components/sections/AboutContentSection';
import TeamVisionSection from '../components/sections/TeamVisionSection';
import WhyChooseSection from '../components/sections/WhyChooseSection';


// Import CSS
import "./About.css";
import "../components/sections/GoldenSection.css";

export default function About() {
  return (
    <>
      <Navbar />
      <GoldenSection />
      <FounderSection />
      <TeamSection />
      <AboutContentSection />
      <TeamVisionSection />
      <WhyChooseSection />
    </>
  );
}