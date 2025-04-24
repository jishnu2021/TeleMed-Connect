
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { StarIcon, Search, ArrowUpRight, Calendar, MessageSquare, ThumbsUp } from 'lucide-react';

const DoctorCard = ({ doctor }) => {
  return (
    <Card className="card-hover h-full">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img 
              src={doctor.image} 
              alt={doctor.name} 
              className="object-cover rounded-md w-20 h-20 md:w-24 md:h-24"
            />
            {doctor.online && (
              <span className="absolute bottom-1 right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{doctor.name}</h3>
              {doctor.verified && (
                <Badge variant="outline" className="bg-medteal/10 text-medteal border-medteal/20">
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{doctor.specialty}</p>
            <div className="flex items-center mt-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon 
                    key={i} 
                    size={14} 
                    className={i < doctor.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-sm ml-1">
                {doctor.rating} ({doctor.reviewCount})
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-2">
          <div className="flex items-start">
            <ThumbsUp size={16} className="mr-2 text-medteal mt-0.5" />
            <p className="text-sm">{doctor.experience} years experience</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {doctor.languages.map((language, index) => (
              <Badge variant="secondary" key={index} className="font-normal">
                {language}
              </Badge>
            ))}
          </div>
          <CardDescription className="mt-2">
            {doctor.bio.length > 120 ? `${doctor.bio.substring(0, 120)}...` : doctor.bio}
          </CardDescription>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button variant="outline" className="flex-1" asChild>
          <Link to={`/message/${doctor.id}`}>
            <MessageSquare size={16} className="mr-2" /> Chat
          </Link>
        </Button>
        <Button className="bg-medblue hover:bg-medblue-dark flex-1" asChild>
          <Link to={`/book/${doctor.id}`}>
            <Calendar size={16} className="mr-2" /> Book
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const DoctorProfile = ({ doctor }) => {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <div className="sticky top-24">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name} 
                    className="object-cover rounded-xl w-32 h-32"
                  />
                  {doctor.online && (
                    <span className="absolute bottom-2 right-2 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-center">{doctor.name}</h2>
                <p className="text-muted-foreground text-center">{doctor.specialty}</p>
                <div className="flex items-center justify-center mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon 
                        key={i} 
                        size={16} 
                        className={i < doctor.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-sm ml-2">
                    {doctor.rating} ({doctor.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-around border-y py-4">
                <div className="text-center">
                  <p className="font-bold text-lg">{doctor.experience}+</p>
                  <p className="text-xs text-muted-foreground">Years</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">{doctor.patients}+</p>
                  <p className="text-xs text-muted-foreground">Patients</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">{doctor.consultations}+</p>
                  <p className="text-xs text-muted-foreground">Consults</p>
                </div>
              </div>
              <div className="space-y-4 mt-4">
                <Button className="w-full bg-medblue hover:bg-medblue-dark">
                  <Calendar size={16} className="mr-2" /> Book Appointment
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageSquare size={16} className="mr-2" /> Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="md:col-span-2">
        <Tabs defaultValue="about">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="expertise">Expertise</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="about" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Biography</h3>
              <p className="text-gray-700">{doctor.bio}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {doctor.languages.map((language, index) => (
                  <Badge variant="secondary" key={index}>
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="expertise">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Areas of Expertise</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {doctor.expertise.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-medblue/10 flex items-center justify-center mr-3">
                        <ArrowUpRight className="h-5 w-5 text-medblue" />
                      </div>
                      <div>
                        <h4 className="font-medium">{item.area}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="education" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Education & Training</h3>
              <div className="space-y-4">
                {doctor.education.map((item, index) => (
                  <div key={index} className="border-l-2 border-medblue pl-4 pb-4">
                    <span className="text-sm text-muted-foreground">{item.years}</span>
                    <h4 className="font-medium">{item.degree}</h4>
                    <p className="text-sm">{item.institution}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Certifications</h3>
              <div className="space-y-2">
                {doctor.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-medteal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Patient Reviews</h3>
              <Badge variant="outline" className="bg-medblue/10 text-medblue">
                {doctor.rating} Overall Rating
              </Badge>
            </div>
            
            <div className="space-y-4">
              {doctor.reviews.map((review, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <span className="font-medium text-gray-600">{review.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-medium">{review.name}</h4>
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            size={14} 
                            className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const Doctors = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      rating: 4.8,
      reviewCount: 124,
      experience: 12,
      bio: "Dr. Sarah Johnson is a board-certified cardiologist with over 12 years of experience in treating various heart conditions. She specializes in preventive cardiology and heart health.",
      languages: ["English", "Spanish"],
      online: true,
      verified: true,
      patients: 1500,
      consultations: 3240,
      expertise: [
        { area: "Preventive Cardiology", description: "Heart disease prevention and risk assessment" },
        { area: "Echocardiography", description: "Advanced heart imaging techniques" },
        { area: "Heart Failure Management", description: "Comprehensive treatment plans for heart failure" },
        { area: "Hypertension", description: "Blood pressure management and monitoring" }
      ],
      education: [
        { years: "2005-2009", degree: "Doctor of Medicine (MD)", institution: "Johns Hopkins University" },
        { years: "2009-2012", degree: "Residency in Internal Medicine", institution: "Mayo Clinic" },
        { years: "2012-2015", degree: "Fellowship in Cardiology", institution: "Stanford Medical Center" }
      ],
      certifications: [
        "American Board of Internal Medicine",
        "American Board of Cardiology",
        "Advanced Cardiac Life Support (ACLS)"
      ],
      reviews: [
        { name: "James Wilson", date: "March 15, 2023", rating: 5, comment: "Dr. Johnson was incredibly thorough and took the time to explain everything in detail. She made me feel comfortable and addressed all my concerns." },
        { name: "Emma Garcia", date: "February 3, 2023", rating: 4, comment: "Very knowledgeable doctor who provided clear guidance for my heart condition management. The wait time was a bit long though." },
        { name: "Robert Chen", date: "January 18, 2023", rating: 5, comment: "Excellent physician. She detected an issue that previous doctors had missed. Forever grateful for her expertise." }
      ]
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Pediatrician",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      rating: 4.9,
      reviewCount: 156,
      experience: 10,
      bio: "Dr. Michael Chen is a dedicated pediatrician who focuses on child development and preventive care. With 10 years of experience, he's known for his gentle approach with young patients.",
      languages: ["English", "Mandarin"],
      online: true,
      verified: true,
      patients: 2200,
      consultations: 4100,
      expertise: [],
      education: [],
      certifications: [],
      reviews: []
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Dermatologist",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      rating: 4.7,
      reviewCount: 98,
      experience: 8,
      bio: "Dr. Emily Rodriguez specializes in medical and cosmetic dermatology. She has expertise in treating acne, eczema, psoriasis, and skin cancer detection.",
      languages: ["English", "Spanish", "Portuguese"],
      online: false,
      verified: true,
      patients: 1800,
      consultations: 2700,
      expertise: [],
      education: [],
      certifications: [],
      reviews: []
    },
    {
      id: 4,
      name: "Dr. David Williams",
      specialty: "Psychiatrist",
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      rating: 4.6,
      reviewCount: 87,
      experience: 15,
      bio: "Dr. David Williams is a psychiatrist specializing in mood disorders, anxiety, and trauma. He takes a holistic approach to mental health treatment.",
      languages: ["English", "French"],
      online: false,
      verified: true,
      patients: 950,
      consultations: 2800,
      expertise: [],
      education: [],
      certifications: [],
      reviews: []
    }
  ];

  const specialties = [
    { id: 'all', name: 'All Specialists' },
    { id: 'cardio', name: 'Cardiology' },
    { id: 'pedia', name: 'Pediatrics' },
    { id: 'derma', name: 'Dermatology' },
    { id: 'psych', name: 'Psychiatry' },
    { id: 'neuro', name: 'Neurology' }
  ];
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
                         
    const matchesSpecialty = activeTab === 'all' || 
                            (activeTab === 'cardio' && doctor.specialty === 'Cardiologist') || 
                            (activeTab === 'pedia' && doctor.specialty === 'Pediatrician') ||
                            (activeTab === 'derma' && doctor.specialty === 'Dermatologist') ||
                            (activeTab === 'psych' && doctor.specialty === 'Psychiatrist');
                            
    return matchesSearch && matchesSpecialty;
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar loggedIn={false} />
      
      <main className="flex-grow">
        {selectedDoctor ? (
          <section className="py-12">
            <div className="container px-4 mx-auto">
              <Button 
                variant="ghost" 
                className="mb-6"
                onClick={() => setSelectedDoctor(null)}
              >
                ← Back to Doctors
              </Button>
              
              <DoctorProfile doctor={selectedDoctor} />
            </div>
          </section>
        ) : (
          <>
            <section className="bg-gradient-to-b from-blue-50 to-white py-12 md:py-20">
              <div className="container px-4 mx-auto">
                <div className="text-center max-w-3xl mx-auto">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-medblue to-medteal bg-clip-text text-transparent">
                    Find Your Specialist
                  </h1>
                  <p className="text-lg text-gray-700 mb-8">
                    Connect with board-certified doctors online for consultations, diagnoses, and treatment plans.
                  </p>
                </div>
              </div>
            </section>
            
            <section className="py-12">
              <div className="container px-4 mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                  <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 md:gap-4">
                    {specialties.map((specialty) => (
                      <Button 
                        key={specialty.id}
                        variant={activeTab === specialty.id ? "default" : "outline"}
                        className={activeTab === specialty.id ? "bg-medblue" : ""}
                        onClick={() => setActiveTab(specialty.id)}
                      >
                        {specialty.name}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search doctors by name or specialty" 
                      className="pl-9"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
                
                {filteredDoctors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors.map((doctor) => (
                      <div key={doctor.id} onClick={() => setSelectedDoctor(doctor)} className="cursor-pointer">
                        <DoctorCard doctor={doctor} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <h3 className="text-xl font-medium">No doctors found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </section>
            
            <section className="py-12 bg-gray-50">
              <div className="container px-4 mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Help Finding the Right Doctor?</h2>
                <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                  Our medical concierge service can match you with the perfect specialist based on your symptoms and medical history.
                </p>
                <Button size="lg" className="bg-medblue hover:bg-medblue-dark">
                  <Link to="/getpersonalized">Get Personalized Recommendations</Link>
                </Button>
              </div>
            </section>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Doctors;
