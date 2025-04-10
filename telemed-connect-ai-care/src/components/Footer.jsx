
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-medblue to-medteal flex items-center justify-center">
                <span className="text-white font-bold">TC</span>
              </div>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-medblue to-medteal bg-clip-text text-transparent">
                TeleMed Connect
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Bridging the gap between patients and healthcare providers through innovative telemedicine solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-medblue">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-medblue">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-medblue">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-medblue">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-gray-600 hover:text-medblue">Our Services</Link>
              </li>
              <li>
                <Link to="/doctors" className="text-gray-600 hover:text-medblue">Find a Doctor</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-medblue">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-medblue">Contact Us</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-medblue">Health Blog</Link>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services/video-consultations" className="text-gray-600 hover:text-medblue">Video Consultations</Link>
              </li>
              <li>
                <Link to="/services/ai-diagnosis" className="text-gray-600 hover:text-medblue">AI Symptom Checker</Link>
              </li>
              <li>
                <Link to="/services/prescription" className="text-gray-600 hover:text-medblue">E-Prescriptions</Link>
              </li>
              <li>
                <Link to="/services/records" className="text-gray-600 hover:text-medblue">Medical Records</Link>
              </li>
              <li>
                <Link to="/services/specialty" className="text-gray-600 hover:text-medblue">Specialist Referrals</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="text-medteal mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">
                  123 Healing Way, Health District<br />
                  San Francisco, CA 94102
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-medteal mr-2 flex-shrink-0" />
                <a href="tel:+11234567890" className="text-gray-600 hover:text-medblue">
                  +1 (123) 456-7890
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-medteal mr-2 flex-shrink-0" />
                <a href="mailto:info@telemedconnect.com" className="text-gray-600 hover:text-medblue">
                  info@telemedconnect.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} TeleMed Connect. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-medblue">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-medblue">
              Terms of Service
            </Link>
            <Link to="/accessibility" className="text-sm text-gray-500 hover:text-medblue">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
