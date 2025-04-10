
import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Family Medicine',
    rating: 4.9,
    reviews: 124,
    availability: 'Available Today',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Cardiology',
    rating: 4.8,
    reviews: 98,
    availability: 'Available Tomorrow',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 3,
    name: 'Dr. Lisa Rodriguez',
    specialty: 'Pediatrics',
    rating: 4.9,
    reviews: 156,
    availability: 'Available Today',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 4,
    name: 'Dr. James Wilson',
    specialty: 'Psychiatry',
    rating: 4.7,
    reviews: 87,
    availability: 'Available in 2 days',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
];

const FeaturedDoctors = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Doctors</h2>
            <p className="mt-2 text-lg text-gray-600">
              Experienced healthcare professionals ready to provide the care you need.
            </p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0" asChild>
            <Link to="/doctors">View All Doctors</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="card-hover overflow-hidden border-0 shadow-md">
              <div className="relative">
                <img 
                  src={doctor.image} 
                  alt={doctor.name}
                  className="w-full h-48 object-cover object-center"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <span className="text-white text-sm font-medium px-2 py-1 rounded-full bg-green-500/90 inline-block">
                    {doctor.availability}
                  </span>
                </div>
              </div>
              
              <CardContent className="pt-4">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{doctor.name}</h3>
                <p className="text-medteal font-medium">{doctor.specialty}</p>
                
                <div className="flex items-center mt-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 font-medium">{doctor.rating}</span>
                  </div>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-gray-600 text-sm">{doctor.reviews} reviews</span>
                </div>
              </CardContent>
              
              <CardFooter className="pt-0">
                <Button className="w-full bg-medblue hover:bg-medblue-dark" asChild>
                  <Link to={`/doctors/${doctor.id}`}>Book Appointment</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDoctors;
