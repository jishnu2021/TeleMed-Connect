import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';  // Or use your preferred UI components

const AppointmentsPage = ({doctorId}) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!doctorId) {
      console.error("Doctor ID is missing");
      setLoading(false);
      return;
    }
  
    const fetchAppointments = async () => {
      try {
        console.log("Fetching appointments for doctor:", doctorId);
        const response = await axios.get(`/doctor/${doctorId}`);
        console.log("API Response Data:", response.data);  // Log the entire response data
  
        // Check if appointments are in the response data
        if (Array.isArray(response.data)) {
          setAppointments(response.data);
        } else if (response.data.appointments && Array.isArray(response.data.appointments)) {
          setAppointments(response.data.appointments);  // Appointments might be in the "appointments" field
        } else {
          console.error("Appointments data is not in the expected format:", response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      }
    };
  
    fetchAppointments();
  }, [doctorId]);
  

  const handleStatusChange = async (appointmentId, status) => {
    try {
      await axios.patch(`/appointments/${appointmentId}`, { status });
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  if (appointments.length === 0) {
    return <div>No appointments available.</div>;
  }

  return (
    <div className="appointments-page">
      <h2>Appointments</h2>
      {appointments.map((appointment) => (
        <div key={appointment._id} className="appointment-card">
          <div className="appointment-details">
            <h3>Patient: {appointment.patientId.name}</h3>
            <p>Email: {appointment.patientId.email}</p>
            <p>Symptoms: {appointment.symptoms}</p>
            <p>Date: {new Date(appointment.date).toLocaleString()}</p>
            <p>Time: {appointment.time}</p>
            <p>Status: {appointment.status}</p>
          </div>
          {appointment.status === 'pending' && (
            <div className="appointment-actions">
              <Button
                colorScheme="green"
                onClick={() => handleStatusChange(appointment._id, 'approved')}
              >
                Approve
              </Button>
              <Button
                colorScheme="red"
                onClick={() => handleStatusChange(appointment._id, 'rejected')}
              >
                Reject
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AppointmentsPage;
