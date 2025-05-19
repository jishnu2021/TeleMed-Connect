import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { getdoctorspeciality, getAllDoctors, getAllSpecialists, getRegisteredDoctors } from '../api'; // Added getRegisteredDoctors
import { bookAppointment } from '../api'; // Import the bookAppointment function from the API file

const Appointment = () => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    symptoms: '',
    doctor: '', // Store selected doctor
    doctorId: '', // Store selected doctorId
    time: '', // Store selected time
    status: 'pending', // Default status
    patientId: localStorage.getItem('telemed-patient'), // Retrieve patientId from localStorage using correct key
  });

  const [doctors, setDoctors] = useState([]);
  const [isDoctorLoading, setIsDoctorLoading] = useState(false);
  const [showDoctorList, setShowDoctorList] = useState(false);
  const patient = JSON.parse(localStorage.getItem('telemed-patient'));
  const idres = patient ? patient._id : null;
  console.log("The id :",idres)
  useEffect(() => {
    if (open) {
      // Reset form data when the dialog is opened
      setFormData({
        name: '',
        email: '',
        phone: '',
        symptoms: '',
        doctor: '',
        doctorId: '',
        time: '',
        status: 'pending', // Default status
        patientId: idres, // Retrieve patientId from localStorage
      });
      setSelectedDate(new Date());
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const appointmentData = {
      patientId: formData.patientId,  // Ensure patientId is passed correctly
      doctorId: formData.doctorId,    // Using selected doctorId
      date: selectedDate,
      time: formData.time,            // Using selected time
      symptoms: formData.symptoms,
      status: formData.status,        // Default status set to 'pending'
    };

    try {
      const response = await bookAppointment(appointmentData); // Use bookAppointment from api.js
      alert(response.message);  // Show success message or handle response
      console.log('Appointment booked successfully', response.appointment);
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment');
    }
  };

  const fetchDoctors = async () => {
    try {
      setIsDoctorLoading(true);
      console.log('Fetching doctors...');
      
      // First try to get registered doctors from the new API endpoint
      try {
        console.log('Attempting to fetch from /registered-doctors endpoint');
        const response = await getRegisteredDoctors();
        console.log('getRegisteredDoctors response:', response);
        
        if (response && Array.isArray(response) && response.length > 0) {
          console.log(`Successfully found ${response.length} registered doctors`);
          const formattedDoctors = response.map((doctor, index) => ({
            _id: doctor._id || `reg-${index + 1}`,
            name: doctor.name,
            specialist: doctor.specialist
          }));
          setDoctors(formattedDoctors);
          setIsDoctorLoading(false);
          return;
        } else {
          console.log('getRegisteredDoctors returned empty or invalid data:', response);
        }
      } catch (registeredDoctorsError) {
        console.error('Error fetching registered doctors:', registeredDoctorsError);
      }
      
      // Then try to get specialists from the /allspecialists endpoint
      try {
        console.log('Attempting to fetch from /allspecialists endpoint');
        const response = await getAllSpecialists();
        console.log('getAllSpecialists response:', response);
        
        if (response && Array.isArray(response) && response.length > 0) {
          console.log(`Successfully found ${response.length} specialists`);
          setDoctors(response);
          setIsDoctorLoading(false);
          return;
        } else {
          console.log('getAllSpecialists returned empty or invalid data:', response);
        }
      } catch (specialistsError) {
        console.error('Error fetching specialists:', specialistsError);
      }
      
      // Then try to get all doctors from the /alldoctors endpoint
      try {
        console.log('Attempting to fetch from /alldoctors endpoint');
        const response = await getAllDoctors();
        console.log('getAllDoctors response:', response);
        
        if (response && Array.isArray(response) && response.length > 0) {
          console.log(`Successfully found ${response.length} doctors`);
          setDoctors(response);
          setIsDoctorLoading(false);
          return;
        } else {
          console.log('getAllDoctors returned empty or invalid data:', response);
        }
      } catch (allDoctorsError) {
        console.error('Error fetching all doctors:', allDoctorsError);
      }
      
      // Fallback to the /alldoctorsspeciality endpoint
      try {
        console.log('Attempting to fetch from /alldoctorsspeciality endpoint');
        const response = await getdoctorspeciality();
        console.log('getdoctorspeciality response:', response);
        
        if (response && Array.isArray(response) && response.length > 0) {
          console.log(`Successfully found ${response.length} doctors from speciality endpoint`);
          setDoctors(response);
          setIsDoctorLoading(false);
          return;
        } else {
          console.error('getdoctorspeciality returned empty or invalid data:', response);
        }
      } catch (specialityError) {
        console.error('Error fetching doctor specialities:', specialityError);
      }
      
      // If we reach here, all API calls failed or returned no data
      console.error('All API calls failed or returned no data');
      
      // As a last resort, set some hardcoded sample doctors so user can proceed
    
      
      console.log('Using sample doctors as fallback');
      setDoctors(sampleDoctors);
      
    } catch (error) {
      console.error('Unexpected error in fetchDoctors:', error);
    } finally {
      setIsDoctorLoading(false);
    }
  };

  const handleDoctorInputClick = () => {
    if (doctors.length === 0) {
      fetchDoctors(); // Fetch doctors if the list is empty
    }
    setShowDoctorList(true); // Show the dropdown when clicked
  };

  const handleDoctorSelect = (doctorId, doctorName, doctorSpecialist) => {
    console.log('Selected doctor:', { doctorId, doctorName, doctorSpecialist });
    setFormData({
      ...formData,
      doctor: `${doctorName} - ${doctorSpecialist || 'Specialist'}`, // Handle missing specialist field
      doctorId: doctorId, // Store doctorId for the selected doctor
    });
    setShowDoctorList(false); // Hide the list after selecting
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} style={{ height: '500px' }}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-medblue hover:bg-medblue-dark">
          Book Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl w-full rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-medblue mb-4">
            Book Your Appointment
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <Textarea
            name="symptoms"
            placeholder="Briefly describe your symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            rows={4}
            required
          />

          {/* Date Input */}
          <div className="flex flex-col mb-4">
            <label className="block text-sm font-medium text-gray-700">Appointment Date</label>
            <Input
              type="date"
              name="appointmentDate"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={handleDateChange}
              required
            />
          </div>

          {/* Time Input */}
          <div className="flex flex-col mb-4">
            <label className="block text-sm font-medium text-gray-700">Appointment Time</label>
            <Input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          {/* Doctor Selection */}
          <div className="flex flex-col mb-4">
            <label className="block text-sm font-medium text-gray-700">Select Doctor</label>
            <Input
              type="text"
              name="doctor"
              value={formData.doctor || ''}
              onClick={handleDoctorInputClick}
              placeholder="Click to choose a doctor"
              readOnly
              required
            />
            {showDoctorList && (
              <div className="border rounded-md mt-2 max-h-40 overflow-y-auto">
                {isDoctorLoading ? (
                  <p className="p-2 text-gray-500">Loading doctors...</p>
                ) : doctors && doctors.length > 0 ? (
                  doctors.map((doctor) => (
                    <div
                      key={doctor._id || doctor.id || Math.random().toString()} 
                      onClick={() => handleDoctorSelect(
                        doctor._id || doctor.id || '',
                        doctor.name || 'Unnamed Doctor', 
                        doctor.specialist || doctor.specialty || 'Specialist'
                      )}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {doctor.name || 'Unnamed Doctor'} - {doctor.specialist || doctor.specialty || 'Specialist'}
                    </div>
                  ))
                ) : (
                  <p className="p-2 text-gray-500">No doctors available. Please try again later.</p>
                )}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full bg-medblue hover:bg-medblue-dark">
            Confirm Appointment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Appointment;
