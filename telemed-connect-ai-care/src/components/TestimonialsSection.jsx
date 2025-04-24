import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    content: "TeleMed Connect made it so easy to see a doctor during the pandemic. I got the care I needed without leaving home, and the doctor was thorough and attentive.",
    author: "Jessica T.",
    location: "Portland, OR",
    rating: 5,
  },
  {
    id: 2,
    content: "As a busy parent, finding time to visit the doctor is challenging. This platform lets me talk to healthcare professionals around my schedule. It's been a life-saver!",
    author: "Michael R.",
    location: "Chicago, IL",
    rating: 5,
  },
  {
    id: 3,
    content: "The AI symptom checker helped identify my issue before I even spoke with the doctor. The entire experience was efficient and the care was excellent.",
    author: "Samantha K.",
    location: "Atlanta, GA",
    rating: 4,
  },
];

const TestimonialsSection = () => {
  const [showSignUp, setShowSignUp] = useState(true);

  useEffect(() => {
    const patientExists = localStorage.getItem('telemed-patient');
    const doctorExists = localStorage.getItem('telemed-doctor');
    if (patientExists || doctorExists) {
      setShowSignUp(false);
    }
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">What Our Patients Say</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Thousands of satisfied patients have experienced better healthcare through our telemedicine platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all hover:shadow-lg"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              
              <p className="text-gray-700 italic mb-6">"{testimonial.content}"</p>
              
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-medblue to-medteal text-white flex items-center justify-center font-bold">
                  {testimonial.author.charAt(0)}
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-medblue/10 to-medteal/10 rounded-xl p-8 flex flex-col md:flex-row items-center">
          <div className="mb-6 md:mb-0 md:mr-8 text-center md:text-left flex-1">
            <div className="flex justify-center md:justify-start mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
            <h3 className="text-2xl font-bold mb-2">Join over 100,000 satisfied patients</h3>
            <p className="text-gray-600">
              Experience healthcare that fits your life, not the other way around.
            </p>
          </div>

          {showSignUp && (
            <button className="px-6 py-3 bg-medblue hover:bg-medblue-dark text-white font-medium rounded-lg transition-colors">
              Sign Up Free
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
