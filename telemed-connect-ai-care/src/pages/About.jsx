
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { Users, Award, Zap, Globe, Heart, Smile, CheckCircle } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar loggedIn={false} />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-medblue to-medteal bg-clip-text text-transparent">
                  Revolutionizing Healthcare Access
                </h1>
                <p className="text-lg text-gray-700 mb-8">
                  TeleMed Connect was founded with a mission to make quality healthcare accessible to everyone, 
                  anywhere, anytime. Our platform brings together advanced technology and compassionate care to 
                  create a seamless telemedicine experience.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-medblue hover:bg-medblue-dark" asChild>
                    <Link to="/services">Our Services</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-medteal/10 rounded-lg"></div>
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-medblue/10 rounded-lg"></div>
                  <img 
                    src="data:image/jpeg;base64,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" 
                    alt="Medical team" 
                    className="rounded-xl shadow-lg relative z-10"
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2 order-2 md:order-1">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="card-hover bg-gradient-to-br from-white to-blue-50">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-full bg-medblue/10 flex items-center justify-center mb-4">
                        <Users className="h-6 w-6 text-medblue" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Patient-Centered</h3>
                      <p className="text-sm text-gray-600">
                        We put patients first in everything we do, focusing on their unique health needs.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="card-hover bg-gradient-to-br from-white to-blue-50">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-full bg-medteal/10 flex items-center justify-center mb-4">
                        <Award className="h-6 w-6 text-medteal" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Excellence</h3>
                      <p className="text-sm text-gray-600">
                        We strive for excellence in healthcare delivery and technological innovation.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="card-hover bg-gradient-to-br from-white to-blue-50">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-full bg-medteal/10 flex items-center justify-center mb-4">
                        <Zap className="h-6 w-6 text-medteal" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Innovation</h3>
                      <p className="text-sm text-gray-600">
                        We constantly innovate to improve the healthcare experience for all users.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="card-hover bg-gradient-to-br from-white to-blue-50">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-full bg-medblue/10 flex items-center justify-center mb-4">
                        <Globe className="h-6 w-6 text-medblue" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Accessibility</h3>
                      <p className="text-sm text-gray-600">
                        We break down barriers to ensure healthcare is accessible to everyone.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="md:w-1/2 order-1 md:order-2">
                <Badge className="mb-2 bg-medblue/10 text-medblue border-none">Our Mission</Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  Making Quality Healthcare Accessible for All
                </h2>
                <p className="text-gray-700 mb-6">
                  At TeleMed Connect, we're on a mission to transform how people access and experience healthcare. 
                  We believe that everyone deserves access to quality medical care regardless of location, mobility, 
                  or schedule constraints.
                </p>
                <p className="text-gray-700 mb-6">
                  By leveraging cutting-edge technology and partnering with top medical professionals, we've created 
                  a platform that bridges the gap between patients and healthcare providers, making healthcare more 
                  convenient, efficient, and personalized than ever before.
                </p>
                <p className="text-gray-700">
                  Our core values guide everything we do, from developing new features to training our medical 
                  professionals. We're committed to excellence, innovation, and most importantly, improving health 
                  outcomes for our patients.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge className="mb-2 bg-medteal/10 text-medteal border-none">Our Story</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                From Vision to Reality
              </h2>
              <p className="text-gray-700">
                The journey of TeleMed Connect began with a simple but powerful vision: to make quality healthcare accessible to everyone.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex flex-col items-center md:items-start">
                    <div className="h-14 w-14 rounded-full bg-medblue/10 flex items-center justify-center mb-2">
                      <span className="text-xl font-bold text-medblue">2018</span>
                    </div>
                    <div className="hidden md:block h-full w-0.5 bg-gray-200 ml-7"></div>
                  </div>
                  <div className="md:w-3/4 bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-xl font-semibold mb-2">The Beginning</h3>
                    <p className="text-gray-700">
                      Our founders, Dr. Emma Thompson and tech entrepreneur James Wilson, recognized a critical gap in healthcare access. 
                      After witnessing numerous patients struggle with accessing timely care due to distance, mobility issues, or busy schedules, 
                      they envisioned a platform that could bring quality healthcare to anyone with an internet connection.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex flex-col items-center md:items-start">
                    <div className="h-14 w-14 rounded-full bg-medblue/10 flex items-center justify-center mb-2">
                      <span className="text-xl font-bold text-medblue">2020</span>
                    </div>
                    <div className="hidden md:block h-full w-0.5 bg-gray-200 ml-7"></div>
                  </div>
                  <div className="md:w-3/4 bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-xl font-semibold mb-2">Launch & Early Growth</h3>
                    <p className="text-gray-700">
                      TeleMed Connect launched its beta version with a small group of doctors and patients. The COVID-19 pandemic 
                      highlighted the urgent need for telemedicine, accelerating our growth as we quickly expanded our network of 
                      healthcare providers to meet the surging demand for remote healthcare services.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex flex-col items-center md:items-start">
                    <div className="h-14 w-14 rounded-full bg-medblue/10 flex items-center justify-center mb-2">
                      <span className="text-xl font-bold text-medblue">2022</span>
                    </div>
                    <div className="hidden md:block h-full w-0.5 bg-gray-200 ml-7"></div>
                  </div>
                  <div className="md:w-3/4 bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-xl font-semibold mb-2">Innovation & Expansion</h3>
                    <p className="text-gray-700">
                      We introduced our AI-powered symptom checker and expanded our specialty offerings to include mental health, 
                      pediatrics, dermatology, and more. We also established partnerships with major insurance providers to make 
                      our services more affordable and accessible to patients nationwide.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex flex-col items-center md:items-start">
                    <div className="h-14 w-14 rounded-full bg-medblue/10 flex items-center justify-center">
                      <span className="text-xl font-bold text-medblue">2025</span>
                    </div>
                  </div>
                  <div className="md:w-3/4 bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-xl font-semibold mb-2">Looking to the Future</h3>
                    <p className="text-gray-700">
                      Today, TeleMed Connect serves millions of patients around the country, with plans for global expansion. 
                      We continue to innovate with advanced diagnostic tools, expanded specialty offerings, and enhanced patient experiences. 
                      Our vision remains the same: making quality healthcare accessible to everyone, everywhere.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge className="mb-2 bg-medblue/10 text-medblue border-none">Our Team</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Meet the People Behind TeleMed Connect
              </h2>
              <p className="text-gray-700">
                Our diverse team of healthcare professionals, technologists, and industry experts are united by a shared mission to transform healthcare access.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="card-hover">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 rounded-full overflow-hidden h-32 w-32">
                    <img 
                      src="https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                      alt="Dr. Emma Thompson" 
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">Dr. Emma Thompson</h3>
                  <p className="text-medteal mb-3">Co-Founder & Chief Medical Officer</p>
                  <p className="text-sm text-gray-600 mb-4">
                    Board-certified family physician with over 15 years of experience in both traditional and telemedicine settings.
                  </p>
                  <div className="flex space-x-3">
                    <a href="#" className="text-gray-400 hover:text-medblue">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.093 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-medblue">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-medblue">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.3 1.5 4s1-2.4 2.5-2.4c1.6 0 2.5 1 2.6 2.5 0 1.4-1 2.5-2.6 2.5zm11.5 6c-1 0-2 1-2 2v7h-5v-13h5v1.5c1-1.6 2.7-2.5 4.5-2.5 3.5 0 6 2.5 6 6.5v7.5h-5v-7c0-1-1-2-3.5-2z" />
                      </svg>
                    </a>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 rounded-full overflow-hidden h-32 w-32">
                    <img 
                      src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                      alt="James Wilson" 
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">James Wilson</h3>
                  <p className="text-medteal mb-3">Co-Founder & CEO</p>
                  <p className="text-sm text-gray-600 mb-4">
                    Former tech executive with a passion for healthcare innovation and improving patient access to care.
                  </p>
                  <div className="flex space-x-3">
                    <a href="#" className="text-gray-400 hover:text-medblue">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.093 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-medblue">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-medblue">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.3 1.5 4s1-2.4 2.5-2.4c1.6 0 2.5 1 2.6 2.5 0 1.4-1 2.5-2.6 2.5zm11.5 6c-1 0-2 1-2 2v7h-5v-13h5v1.5c1-1.6 2.7-2.5 4.5-2.5 3.5 0 6 2.5 6 6.5v7.5h-5v-7c0-1-1-2-3.5-2z" />
                      </svg>
                    </a>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 rounded-full overflow-hidden h-32 w-32">
                    <img 
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                      alt="Dr. Sarah Chen" 
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">Dr. Sarah Chen</h3>
                  <p className="text-medteal mb-3">Chief Technology Officer</p>
                  <p className="text-sm text-gray-600 mb-4">
                    MD/PhD with expertise in medical informatics, leading our technological innovations and AI development.
                  </p>
                  <div className="flex space-x-3">
                    <a href="#" className="text-gray-400 hover:text-medblue">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.093 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-medblue">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-medblue">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.3 1.5 4s1-2.4 2.5-2.4c1.6 0 2.5 1 2.6 2.5 0 1.4-1 2.5-2.6 2.5zm11.5 6c-1 0-2 1-2 2v7h-5v-13h5v1.5c1-1.6 2.7-2.5 4.5-2.5 3.5 0 6 2.5 6 6.5v7.5h-5v-7c0-1-1-2-3.5-2z" />
                      </svg>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-b from-white to-blue-50">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge className="mb-2 bg-medteal/10 text-medteal border-none">Our Impact</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Making a Difference in Healthcare
              </h2>
              <p className="text-gray-700">
                We're proud of the positive impact we've had on patients' lives and healthcare access.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="h-16 w-16 bg-medblue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-medblue" />
                </div>
                <h3 className="text-3xl font-bold mb-2 text-medblue">2M+</h3>
                <p className="text-gray-600">Patients Served</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="h-16 w-16 bg-medteal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smile className="h-8 w-8 text-medteal" />
                </div>
                <h3 className="text-3xl font-bold mb-2 text-medteal">95%</h3>
                <p className="text-gray-600">Patient Satisfaction</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="h-16 w-16 bg-medblue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-medblue" />
                </div>
                <h3 className="text-3xl font-bold mb-2 text-medblue">5K+</h3>
                <p className="text-gray-600">Verified Doctors</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="h-16 w-16 bg-medteal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-medteal" />
                </div>
                <h3 className="text-3xl font-bold mb-2 text-medteal">50+</h3>
                <p className="text-gray-600">Healthcare Awards</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <div className="bg-gradient-to-r from-medblue to-medteal rounded-2xl px-6 py-12 md:p-12 text-center text-white">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  Ready to Experience the Future of Healthcare?
                </h2>
                <p className="mb-8 opacity-90">
                  Join thousands of patients who have already discovered the convenience and quality of TeleMed Connect. 
                  Sign up today and take the first step toward better healthcare access.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" className="bg-white text-medblue hover:bg-gray-100" asChild>
                    <Link to="/signup">Create an Account</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-medblue hover:bg-white/20" asChild>
                    <Link to="/contact">Contact Our Team</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
