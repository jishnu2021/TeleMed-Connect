
import React from 'react';
import { Link } from 'react-router-dom';
import { Video, MessageSquare, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <div className="hero-gradient py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Virtual Healthcare <span className="bg-gradient-to-r from-medblue to-medteal bg-clip-text text-transparent">For You</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Connect with licensed doctors from the comfort of your home. Get medical advice, prescriptions, and care—all online, anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-medblue hover:bg-medblue-dark text-white" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-medteal text-medteal hover:bg-medteal hover:text-white" asChild>
                <Link to="/doctors">Find a Doctor</Link>
              </Button>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-medblue/10 flex items-center justify-center mr-3">
                  <Video size={20} className="text-medblue" />
                </div>
                <span className="text-gray-700">24/7 Video Consultations</span>
              </div>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-medteal/10 flex items-center justify-center mr-3">
                  <MessageSquare size={20} className="text-medteal" />
                </div>
                <span className="text-gray-700">AI Symptom Checker</span>
              </div>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-medblue/10 flex items-center justify-center mr-3">
                  <Calendar size={20} className="text-medblue" />
                </div>
                <span className="text-gray-700">Easy Scheduling</span>
              </div>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-medteal/10 flex items-center justify-center mr-3">
                  <FileText size={20} className="text-medteal" />
                </div>
                <span className="text-gray-700">Digital Prescriptions</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -top-5 -left-5 h-24 w-24 bg-medblue/10 rounded-full"></div>
            <div className="absolute -bottom-5 -right-5 h-32 w-32 bg-medteal/10 rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Doctor consulting with patient online" 
              className="rounded-2xl shadow-xl w-full h-auto object-cover z-10 relative"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
