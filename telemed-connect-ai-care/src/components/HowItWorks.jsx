
import React , {useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import { 
  UserPlus, 
  ClipboardList, 
  Video, 
  Pill, 
  ArrowRight 
} from 'lucide-react';

const steps = [
  {
    icon: <UserPlus className="h-10 w-10 text-medblue" />,
    title: 'Sign Up',
    description: 'Create your account with basic information and health history.',
  },
  {
    icon: <ClipboardList className="h-10 w-10 text-medteal" />,
    title: 'Describe Symptoms',
    description: 'Use our AI symptom checker or fill out a simple questionnaire.',
  },
  {
    icon: <Video className="h-10 w-10 text-medblue" />,
    title: 'Meet Your Doctor',
    description: 'Connect with a qualified healthcare professional via video call.',
  },
  {
    icon: <Pill className="h-10 w-10 text-medteal" />,
    title: 'Get Treatment',
    description: 'Receive diagnosis, prescriptions, and follow-up care instructions.',
  },
];

const HowItWorks = () => {
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
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Getting the care you need is simple, quick, and convenient with our streamlined telehealth process.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-6 bg-white p-4 rounded-full shadow-md">
                {step.icon}
              </div>
              
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute transform translate-x-32 translate-y-10">
                  <ArrowRight className="h-8 w-8 text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
        {/* <marquee> */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-8 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h3 className="text-2xl font-bold mb-2">Ready to get started?</h3>
            <p className="text-gray-600">
              Join thousands of patients who have already experienced the convenience of virtual healthcare.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
             {showSignUp && (
           <Link to="/signup"> <button className="px-6 py-3 bg-medblue hover:bg-medblue-dark text-white font-medium rounded-lg transition-colors">
              Sign Up Free
            </button></Link>
          )}
            <Link to="#"><button className="px-6 py-3 border border-medteal text-medteal hover:bg-medteal hover:text-white font-medium rounded-lg transition-colors">
              Browse Doctors
            </button></Link>
          </div>
        </div>
        {/* </marquee> */}
      </div>
    </section>
  );
};

export default HowItWorks;
