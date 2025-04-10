
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MessageCircle, 
  FileText, 
  Activity, 
  User, 
  Heart, 
  Video, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const Dashboard = () => {
  // Dummy data - in a real app, these would come from API calls
  const upcomingAppointments = [
    {
      id: 1,
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Family Medicine',
      date: 'Today',
      time: '3:00 PM',
      type: 'video',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 2,
      doctorName: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      date: 'Tomorrow',
      time: '10:30 AM',
      type: 'video',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    },
  ];
  
  const recentMessages = [
    {
      id: 1,
      name: 'Dr. Lisa Rodriguez',
      message: 'Your test results are ready. Let me know if you have any questions.',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 2,
      name: 'TeleMed Support',
      message: 'Your appointment with Dr. Chen has been confirmed for tomorrow.',
      time: '1 day ago',
      unread: false,
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar loggedIn={true} />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, John</h1>
              <p className="text-gray-600">Here's an overview of your healthcare</p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Button className="bg-medblue hover:bg-medblue-dark text-white" asChild>
                <Link to="/appointments/new">Book New Appointment</Link>
              </Button>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-medblue/10 flex items-center justify-center mb-2">
                  <Video className="h-6 w-6 text-medblue" />
                </div>
                <p className="text-sm font-medium">Video Consult</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-medteal/10 flex items-center justify-center mb-2">
                  <MessageCircle className="h-6 w-6 text-medteal" />
                </div>
                <p className="text-sm font-medium">AI Symptom Check</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-sm font-medium">Appointments</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <p className="text-sm font-medium">Records</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Appointments */}
              <Card className="border-0 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-xl">Upcoming Appointments</CardTitle>
                    <CardDescription>Your scheduled consultations</CardDescription>
                  </div>
                  <Link to="/appointments" className="text-sm text-medblue hover:underline">View all</Link>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="mb-4 last:mb-0 bg-white rounded-lg p-4 border border-gray-100">
                      <div className="flex items-center">
                        <img 
                          src={appointment.image} 
                          alt={appointment.doctorName} 
                          className="h-14 w-14 rounded-full object-cover mr-4"
                        />
                        <div className="flex-grow">
                          <h3 className="font-semibold text-gray-900">{appointment.doctorName}</h3>
                          <p className="text-sm text-gray-500">{appointment.specialty}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-sm font-medium text-medteal mb-1">
                            <Clock className="h-4 w-4 mr-1" />
                            {appointment.date}, {appointment.time}
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Video className="h-3 w-3 mr-1" />
                            Video Consultation
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between mt-4">
                        <Button variant="outline" size="sm" className="text-gray-600">Reschedule</Button>
                        <Button size="sm" className="bg-medblue hover:bg-medblue-dark">Join Now</Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" className="w-full border-dashed border-gray-300 text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule New Appointment
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Health Metrics */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">Health Metrics</CardTitle>
                  <CardDescription>Track your health progress</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Heart className="h-5 w-5 text-red-500 mr-2" />
                        <span className="font-medium text-gray-700">Heart Rate</span>
                      </div>
                      <span className="text-xl font-semibold">72 <span className="text-sm text-gray-500">bpm</span></span>
                    </div>
                    <Progress value={72} className="h-2 bg-gray-100" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>40</span>
                      <span>140</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Activity className="h-5 w-5 text-medblue mr-2" />
                        <span className="font-medium text-gray-700">Blood Pressure</span>
                      </div>
                      <span className="text-xl font-semibold">120/80 <span className="text-sm text-gray-500">mmHg</span></span>
                    </div>
                    <Progress value={65} className="h-2 bg-gray-100" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>90/60</span>
                      <span>140/90</span>
                    </div>
                  </div>
                  
                  <div className="col-span-1 sm:col-span-2">
                    <Button variant="outline" className="w-full text-medblue border-medblue">
                      View All Health Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Prescriptions */}
              <Card className="border-0 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-xl">Recent Prescriptions</CardTitle>
                    <CardDescription>Your medication details</CardDescription>
                  </div>
                  <Link to="/prescriptions" className="text-sm text-medblue hover:underline">View all</Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Amoxicillin</h4>
                        <p className="text-sm text-gray-500">500mg, 3 times daily, 7 days</p>
                        <p className="text-xs text-gray-400 mt-1">Prescribed by Dr. Johnson on Apr 5, 2023</p>
                      </div>
                      <Button variant="outline" size="sm">Refill</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Loratadine</h4>
                        <p className="text-sm text-gray-500">10mg, once daily, as needed</p>
                        <p className="text-xs text-gray-400 mt-1">Prescribed by Dr. Chen on Mar 22, 2023</p>
                      </div>
                      <Button variant="outline" size="sm">Refill</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column */}
            <div className="space-y-8">
              {/* Messages */}
              <Card className="border-0 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-xl">Messages</CardTitle>
                    <CardDescription>Recent communications</CardDescription>
                  </div>
                  <Link to="/messages" className="text-sm text-medblue hover:underline">View all</Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentMessages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`p-4 rounded-lg border ${message.unread ? 'bg-blue-50 border-blue-100' : 'border-gray-100'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{message.name}</h4>
                          <span className="text-xs text-gray-500">{message.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{message.message}</p>
                        <Button variant="ghost" size="sm" className="text-medblue p-0 h-auto">Reply</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" className="w-full border-dashed">New Message</Button>
                </CardFooter>
              </Card>
              
              {/* Health Reminders */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">Health Reminders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900">Annual Physical Due</h4>
                        <p className="text-sm text-gray-600">It's been 11 months since your last check-up</p>
                      </div>
                    </div>
                    
                    <div className="flex p-3 bg-medblue/5 border border-medblue/10 rounded-lg">
                      <Clock className="h-5 w-5 text-medblue mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900">Medication Reminder</h4>
                        <p className="text-sm text-gray-600">Take your prescription at 8:00 PM today</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Profile Summary */}
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                        <User className="h-8 w-8 text-gray-500" />
                      </div>
                    </div>
                    <div>
                      <CardTitle>John Smith</CardTitle>
                      <CardDescription>Patient ID: #123456</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Age</span>
                      <span className="font-medium text-gray-900">34</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Blood Type</span>
                      <span className="font-medium text-gray-900">O+</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Primary Doctor</span>
                      <span className="font-medium text-gray-900">Dr. Sarah Johnson</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/profile">
                      <User className="h-4 w-4 mr-2" />
                      View Full Profile
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
