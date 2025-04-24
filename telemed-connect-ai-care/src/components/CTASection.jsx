
import React,{useEffect} from 'react';
import { Shield, Award, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const CTASection = () => {
    const [showSignUp, setShowSignUp] = useState(true);
  
    useEffect(() => {
      const patientExists = localStorage.getItem('telemed-patient');
      const doctorExists = localStorage.getItem('telemed-doctor');
      if (patientExists || doctorExists) {
        setShowSignUp(false);
      }
    }, []);
  return (
    <section className="py-16 bg-medblue-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Healthcare Made Simple, <br />
              <span className="text-medteal">Anytime, Anywhere</span>
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Join thousands who've already discovered a better way to access quality healthcare services from the comfort of their own homes.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start">
                <div className="mr-4 p-2 bg-white/10 rounded-lg">
                  <Shield className="h-6 w-6 text-medteal" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">HIPAA Compliant</h3>
                  <p className="text-sm text-white/80">Your data is secure and protected</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 p-2 bg-white/10 rounded-lg">
                  <Award className="h-6 w-6 text-medteal" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Board-Certified Doctors</h3>
                  <p className="text-sm text-white/80">Quality care from verified providers</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 p-2 bg-white/10 rounded-lg">
                  <Clock className="h-6 w-6 text-medteal" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">24/7 Availability</h3>
                  <p className="text-sm text-white/80">Get care whenever you need it</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
            {showSignUp && (
            <button className="px-6 py-3 bg-medblue hover:bg-medblue-dark text-white font-medium rounded-lg transition-colors">
              Sign Up Free
            </button>
          )}
              <Button size="lg" variant="outline" className="border-white text-medblue hover:bg-white/10" asChild>
                <Link to="/services">Learn More</Link>
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -top-5 -left-5 h-32 w-32 bg-medteal/30 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-5 -right-5 h-40 w-40 bg-medblue-light/30 rounded-full blur-2xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Doctor using tablet for telemedicine" 
              className="rounded-2xl shadow-2xl w-full h-auto object-cover z-10 relative"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
