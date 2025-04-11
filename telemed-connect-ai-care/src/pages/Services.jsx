
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { Video, MessageSquare, FileText, Stethoscope, Pill, Heart, Brain, Activity, Clock } from 'lucide-react';
import Appointment from './Appointment';
const ServiceCard = ({ title, description, icon, price, popular }) => {
  const Icon = icon;
  
  return (
    <Card className={`card-hover border ${popular ? 'border-medblue/30 shadow-lg shadow-medblue/10' : 'border-gray-200'}`}>
      <CardHeader>
        {popular && <Badge className="absolute right-4 top-4 bg-medblue">Popular</Badge>}
        <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-medblue" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center">
            <svg className="mr-2 h-4 w-4 text-medteal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            24/7 service availability
          </li>
          <li className="flex items-center">
            <svg className="mr-2 h-4 w-4 text-medteal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Board-certified specialists
          </li>
          <li className="flex items-center">
            <svg className="mr-2 h-4 w-4 text-medteal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Secure medical record access
          </li>
          <li className="flex items-center">
            <svg className="mr-2 h-4 w-4 text-medteal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Prescription delivery options
          </li>
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2">
        <div className="flex justify-between items-center w-full">
          <span className="text-2xl font-bold">${price}</span>
          <span className="text-sm text-muted-foreground">per consultation</span>
        </div>
        <Button className="w-full bg-medblue hover:bg-medblue-dark" asChild>
          <Link to="/appointment">Get Started</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const Services = () => {
  const services = [
    {
      title: 'Video Consultation',
      description: 'Connect face-to-face with doctors from anywhere',
      icon: Video,
      price: "Free",
      popular: true
    },
    {
      title: 'Chat Consultation',
      description: 'Text-based consultation with quick responses',
      icon: MessageSquare,
      price: 29,
      popular: false
    },
    {
      title: 'E-Prescription',
      description: 'Get prescriptions sent electronically to your pharmacy',
      icon: FileText,
      price: 19,
      popular: false
    },
    {
      title: 'Specialist Referrals',
      description: 'Get connected with the right specialist for your needs',
      icon: Stethoscope,
      price: 59,
      popular: false
    }
  ];

  const specialtyServices = [
    { name: 'Cardiology', icon: Heart, description: 'Heart health consultations and monitoring' },
    { name: 'Neurology', icon: Brain, description: 'Neurological disorder diagnosis and treatment' },
    { name: 'General Medicine', icon: Stethoscope, description: 'Primary care for common health concerns' },
    { name: 'Pediatrics', icon: Heart, description: 'Healthcare services for children and adolescents' },
    { name: 'Dermatology', icon: Pill, description: 'Skin condition diagnosis and treatment' },
    { name: 'Mental Health', icon: Brain, description: 'Counseling and therapy for mental wellbeing' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar loggedIn={false} />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-medblue to-medteal bg-clip-text text-transparent">
                Our Telemedicine Services
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Access quality healthcare from the comfort of your home with our range of 
                digital health services designed to meet your needs.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-medblue hover:bg-medblue-dark">
                    <Appointment /> {/* Triggers the popup */}
                </Button>
                <Button size="lg" variant="outline">
                  Explore Plans
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Services */}
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Comprehensive Telemedicine Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <ServiceCard 
                  key={index}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  price={service.price}
                  popular={service.popular}
                />
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">How Our Services Work</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Getting the care you need is simple, secure, and convenient with our telemedicine platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="h-16 w-16 bg-medblue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-medblue">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Sign Up</h3>
                <p className="text-gray-600">
                  Create your account and complete your health profile to help doctors understand your needs better
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="h-16 w-16 bg-medblue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-medblue">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Book a Service</h3>
                <p className="text-gray-600">
                  Choose the type of consultation you need and select your preferred doctor and time slot
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="h-16 w-16 bg-medblue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-medblue">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Receive Care</h3>
                <p className="text-gray-600">
                  Connect with your doctor through video, chat, or phone and get diagnosis, treatment, and follow-up care
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Specialty Services */}
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Medical Specialties
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {specialtyServices.map((specialty, index) => {
                const Icon = specialty.icon;
                return (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start">
                      <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center mr-4">
                        <Icon className="h-6 w-6 text-medblue" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{specialty.name}</h3>
                        <p className="text-gray-600">{specialty.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Insurance */}
        <section className="py-16 bg-gradient-to-b from-white to-blue-50">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Insurance Coverage</h2>
              <p className="text-gray-600 mb-8">
                We work with most major insurance providers to ensure you get the care you need without breaking the bank.
              </p>
              <div className="flex flex-wrap justify-center gap-8 mb-8">
                {/* Insurance company logos would go here */}
                <div className="h-16 w-28 bg-white rounded-md shadow-sm flex items-center justify-center">
                  <span className="text-gray-400 font-semibold">BlueCross</span>
                </div>
                <div className="h-16 w-28 bg-white rounded-md shadow-sm flex items-center justify-center">
                  <span className="text-gray-400 font-semibold">Aetna</span>
                </div>
                <div className="h-16 w-28 bg-white rounded-md shadow-sm flex items-center justify-center">
                  <span className="text-gray-400 font-semibold">Cigna</span>
                </div>
                <div className="h-16 w-28 bg-white rounded-md shadow-sm flex items-center justify-center">
                  <span className="text-gray-400 font-semibold">United</span>
                </div>
              </div>
              <Button variant="outline" size="lg">
                Check Your Coverage
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Services;
// when i click Get Started in Video Consaltation as patient then a form open that you have to your name email mobile number ,doctor list(what ever doctor present in the backend) showing a dropdown format the patient select and appoint and waiting for the approval . that doctor got and Appointmnet then he or she aprove it after aproval a message go to patient and patient ask for time doctor put the time and then at that time 

// paitent video call the doctor the doctor recive and solve the patients disease


// i give you all the apis if this help you cause  many apis are already ready and if not please give me the comple code 