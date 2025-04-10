
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Video, 
  MessageCircle, 
  Calendar, 
  FileText, 
  Heart, 
  ShieldCheck, 
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const services = [
  {
    icon: <Video size={24} />,
    title: 'Video Consultations',
    description: 'Meet with licensed doctors face-to-face through secure video calls.',
    link: '/services/video-consultations',
    color: 'bg-blue-50 text-medblue',
  },
  {
    icon: <MessageCircle size={24} />,
    title: 'AI Symptom Checker',
    description: 'Get an initial assessment of your symptoms with our AI-powered tool.',
    link: '/services/ai-diagnosis',
    color: 'bg-teal-50 text-medteal',
  },
  {
    icon: <Calendar size={24} />,
    title: 'Easy Scheduling',
    description: 'Book appointments with specialists that fit your schedule.',
    link: '/services/scheduling',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: <FileText size={24} />,
    title: 'Digital Prescriptions',
    description: 'Receive prescriptions online and get them delivered or picked up locally.',
    link: '/services/prescriptions',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: <Heart size={24} />,
    title: 'Chronic Care',
    description: 'Ongoing support and management for chronic health conditions.',
    link: '/services/chronic-care',
    color: 'bg-red-50 text-red-600',
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'Secure Health Records',
    description: 'Access and manage your medical records in one secure place.',
    link: '/services/health-records',
    color: 'bg-green-50 text-green-600',
  },
];

const ServiceCards = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Services</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive healthcare solutions designed to provide convenient access to quality medical care from anywhere.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="card-hover border border-gray-100">
              <CardHeader>
                <div className={`w-12 h-12 rounded-full ${service.color} flex items-center justify-center mb-4`}>
                  {service.icon}
                </div>
                <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">{service.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="text-medblue hover:text-medblue-dark hover:bg-blue-50" asChild>
                  <Link to={service.link}>Learn More →</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button className="bg-medblue hover:bg-medblue-dark text-white" size="lg" asChild>
            <Link to="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServiceCards;
