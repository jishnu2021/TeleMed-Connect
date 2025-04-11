import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ServiceCards from '@/components/ServiceCards';
import HowItWorks from '@/components/HowItWorks';
import FeaturedDoctors from '@/components/FeaturedDoctors';
import TestimonialsSection from '@/components/TestimonialsSection';
import SymptomCheckerSection from '@/components/SymptomCheckerSection';
import CTASection from '@/components/CTASection';

const Index = () => {
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        <ServiceCards />
        <HowItWorks />
        <SymptomCheckerSection />
        <FeaturedDoctors />
        <TestimonialsSection />
        <CTASection />
        
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
