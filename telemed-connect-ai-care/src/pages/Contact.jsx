
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Phone, Mail, MapPin, Clock, Users, MousePointerClick, Check } from 'lucide-react';
import { submitContactForm } from "../api"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiry: 'general',
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRadioChange = (value) => {
    setFormData(prev => ({ ...prev, inquiry: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      await submitContactForm(formData);
      setIsSubmitted(true);
      setIsLoading(false);
  
      // Reset after 5s
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          inquiry: "general",
        });
      }, 5000);
    } catch (error) {
      setIsLoading(false);
      alert("Something went wrong. Please try again later.");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar loggedIn={false} />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-medblue to-medteal bg-clip-text text-transparent">
                Contact Us
              </h1>
              <p className="text-lg text-gray-700">
                Have questions or need assistance? Our team is here to help you navigate your healthcare journey.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Details Section */}
        <section className="py-12">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Card className="card-hover">
                <CardHeader className="pb-2">
                  <div className="flex items-center mb-2">
                    <div className="h-10 w-10 rounded-full bg-medblue/10 flex items-center justify-center mr-3">
                      <Phone className="h-5 w-5 text-medblue" />
                    </div>
                    <CardTitle>Call Us</CardTitle>
                  </div>
                  <CardDescription>We're available 24/7 to assist you</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mt-2 space-y-1">
                    <p className="font-semibold text-lg">Customer Service</p>
                    <p className="text-gray-700">(800) 555-1234</p>
                  </div>
                  <div className="mt-4 space-y-1">
                    <p className="font-semibold text-lg">Technical Support</p>
                    <p className="text-gray-700">(800) 555-5678</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardHeader className="pb-2">
                  <div className="flex items-center mb-2">
                    <div className="h-10 w-10 rounded-full bg-medteal/10 flex items-center justify-center mr-3">
                      <Mail className="h-5 w-5 text-medteal" />
                    </div>
                    <CardTitle>Email Us</CardTitle>
                  </div>
                  <CardDescription>We'll respond as quickly as possible</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mt-2 space-y-1">
                    <p className="font-semibold text-lg">General Inquiries</p>
                    <p className="text-gray-700">info@telemedconnect.com</p>
                  </div>
                  <div className="mt-4 space-y-1">
                    <p className="font-semibold text-lg">Support</p>
                    <p className="text-gray-700">support@telemedconnect.com</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardHeader className="pb-2">
                  <div className="flex items-center mb-2">
                    <div className="h-10 w-10 rounded-full bg-medblue/10 flex items-center justify-center mr-3">
                      <MapPin className="h-5 w-5 text-medblue" />
                    </div>
                    <CardTitle>Visit Us</CardTitle>
                  </div>
                  <CardDescription>Our headquarters location</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mt-2">
                    <p className="font-semibold text-lg">Main Office</p>
                    <address className="not-italic text-gray-700">
                      123 Health Avenue<br />
                      San Francisco, CA 94103<br />
                      United States
                    </address>
                  </div>
                  <div className="mt-4 flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-gray-700">9:00 AM - 5:00 PM (PT), Mon-Fri</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Contact Form & FAQ Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-2xl">Get in Touch</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isSubmitted ? (
                      <div className="text-center py-12">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Check className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                        <p className="text-gray-600 mb-4">
                          Thank you for contacting us. We'll respond to your inquiry shortly.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                              id="name" 
                              name="name"
                              placeholder="John Doe"
                              value={formData.name}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              name="email"
                              type="email"
                              placeholder="john@example.com"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number (optional)</Label>
                            <Input 
                              id="phone" 
                              name="phone"
                              placeholder="(123) 456-7890"
                              value={formData.phone}
                              onChange={handleChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input 
                              id="subject" 
                              name="subject"
                              placeholder="How can we help?"
                              value={formData.subject}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Type of Inquiry</Label>
                          <RadioGroup 
                            defaultValue="general" 
                            value={formData.inquiry} 
                            onValueChange={handleRadioChange}
                            className="flex flex-wrap gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="general" id="general" />
                              <Label htmlFor="general">General</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="support" id="support" />
                              <Label htmlFor="support">Technical Support</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="billing" id="billing" />
                              <Label htmlFor="billing">Billing</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="partnership" id="partnership" />
                              <Label htmlFor="partnership">Partnership</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea 
                            id="message" 
                            name="message"
                            placeholder="Please provide details about your inquiry..."
                            value={formData.message}
                            onChange={handleChange}
                            className="min-h-[120px]"
                            required
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-medblue hover:bg-medblue-dark"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Sending...' : 'Send Message'}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-1">
                <Tabs defaultValue="faq">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="faq">FAQ</TabsTrigger>
                    <TabsTrigger value="hours">Hours</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="faq" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">How do I schedule an appointment?</h3>
                        <p className="text-gray-700">
                          You can schedule an appointment through your patient dashboard after logging in, or by calling our customer service at (800) 555-1234.
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Is my data secure?</h3>
                        <p className="text-gray-700">
                          Yes, we use industry-leading encryption and security measures to protect your data, and we are fully HIPAA compliant.
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">What insurance plans do you accept?</h3>
                        <p className="text-gray-700">
                          We accept most major insurance providers. Please contact us with your specific insurance information for confirmation.
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Can I get prescriptions through your service?</h3>
                        <p className="text-gray-700">
                          Yes, our doctors can prescribe medications when appropriate. Prescriptions are sent electronically to your preferred pharmacy.
                        </p>
                      </div>
                      
                      <div className="mt-6">
                        <Button variant="outline" className="w-full">
                          View All FAQs
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="hours" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Service Hours</h3>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Telemedicine Services</span>
                            <span className="text-medteal font-semibold">24/7</span>
                          </div>
                          
                          <Separator />
                          
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Customer Support</span>
                            <span>Mon-Fri: 8AM-8PM (ET)</span>
                          </div>
                          
                          <Separator />
                          
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Technical Support</span>
                            <span>Mon-Sun: 9AM-6PM (ET)</span>
                          </div>
                          
                          <Separator />
                          
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Billing Department</span>
                            <span>Mon-Fri: 9AM-5PM (ET)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-start">
                          <Clock className="h-5 w-5 text-medblue mt-0.5 mr-3" />
                          <p className="text-sm text-gray-700">
                            Our doctors are available 24/7 for urgent care needs. Specialist appointments may have different availability hours.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </section>
        
        {/* Additional Contact Options */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10">More Ways to Connect</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center card-hover">
                <CardContent className="pt-8">
                  <div className="h-16 w-16 bg-medblue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-medblue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Patient Community</h3>
                  <p className="text-gray-700 mb-6">
                    Connect with other patients in our community forums to share experiences and get peer support.
                  </p>
                  <Button variant="outline">Join Community</Button>
                </CardContent>
              </Card>
              
              <Card className="text-center card-hover">
                <CardContent className="pt-8">
                  <div className="h-16 w-16 bg-medteal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MousePointerClick className="h-8 w-8 text-medteal" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Live Chat Support</h3>
                  <p className="text-gray-700 mb-6">
                    Get immediate assistance through our live chat service available on our website and mobile app.
                  </p>
                  <Button variant="outline">Start Chat</Button>
                </CardContent>
              </Card>
              
              <Card className="text-center card-hover">
                <CardContent className="pt-8">
                  <div className="h-16 w-16 bg-medblue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-medblue" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Social Media</h3>
                  <p className="text-gray-700 mb-6">
                    Follow us on social media for health tips, company updates, and to connect with our community.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" size="icon" className="rounded-full">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                      </svg>
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.25c7.55 0 11.68-6.25 11.68-11.67 0-.18 0-.36-.02-.53A8.35 8.35 0 0022 5.92a8.19 8.19 0 01-2.36.65 4.12 4.12 0 001.8-2.27 8.22 8.22 0 01-2.6 1A4.1 4.1 0 0012 8.13a11.65 11.65 0 01-8.46-4.29 4.1 4.1 0 001.27 5.48A4.07 4.07 0 012.8 8.72v.05c0 1.99 1.41 3.65 3.29 4.02a4.1 4.1 0 01-1.86.07 4.11 4.11 0 003.83 2.85A8.23 8.23 0 012 18.41a11.62 11.62 0 006.29 1.84" />
                      </svg>
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12">
          <div className="container px-4 mx-auto">
            <div className="bg-gray-100 rounded-xl p-4 h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Interactive Map</h3>
                <p className="text-gray-600">Map will be displayed here</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
