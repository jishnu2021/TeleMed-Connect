import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getAppointmentsForDoctor, updateStatusAppointment } from '../api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AppointmentsPage = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    console.log("The id is ",doctorId)
    if (!doctorId) return;
    
    const fetchAppointments = async () => {
      try {
        const { appointments } = await getAppointmentsForDoctor(doctorId);
        setAppointments(appointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  const handleStatusChange = async (appointmentId, status) => {
    try {
      await updateStatusAppointment(appointmentId, status);
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId ? { ...appointment, status } : appointment
        )
      );
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const filteredAppointments = appointments.filter(
    (appointment) => appointment.status === activeTab
  );

  if (loading) return <div>Loading appointments...</div>;

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <div className="bg-gradient-to-b from-green-300 to-green-100 p-4 w-full md:w-1/4">
          <ul className="space-y-2">
            {['pending', 'approved', 'rejected'].map((tab) => (
              <li
                key={tab}
                className={`cursor-pointer p-2 rounded-md text-center font-medium ${
                  activeTab === tab ? 'bg-green-500 text-white' : 'hover:bg-green-200'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Appointments
              </li>
            ))}
          </ul>
        </div>

        {/* Appointment Cards */}
        <div className="p-6 flex-1 bg-gray-50">
          <h2 className="text-2xl font-semibold mb-4 capitalize">{activeTab} Appointments</h2>
          {filteredAppointments.map((appointment) => (
  <div
    key={appointment._id}
    className="bg-white shadow-xl rounded-xl p-4 border-t-4 border-green-400 transition-transform hover:scale-105"
  >
    <h3 className="text-lg font-semibold text-green-700 mb-1">
      {appointment.patientId.name}
    </h3>
    <p className="text-sm">Email: {appointment.patientId.email}</p>
    <p className="text-sm">Symptoms: {appointment.symptoms}</p>
    <p className="text-sm">Date: {new Date(appointment.date).toLocaleString()}</p>
    <p className="text-sm">Time: {appointment.time}</p>
    <p className="text-sm font-medium">Status: {appointment.status}</p>

    {/* Approve/Reject Buttons */}
    {appointment.status === 'pending' && (
      <div className="mt-4 flex justify-between gap-2">
        <Button
          className="bg-green-500 text-white hover:bg-green-600 w-full"
          onClick={() => handleStatusChange(appointment._id, 'approved')}
        >
          Approve
        </Button>
        <Button
          className="bg-red-500 text-white hover:bg-red-600 w-full"
          onClick={() => handleStatusChange(appointment._id, 'rejected')}
        >
          Reject
        </Button>
      </div>
    )}

    {/* Join Call & Chat Buttons (only if approved) */}
    <div className="mt-4 flex justify-between gap-2">
      <Button
        className={`w-full ${
          appointment.status === 'approved'
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        disabled={appointment.status !== 'approved'}
        onClick={() =>
          window.open(`/video/appointment_${appointment._id}`, '_blank')
        }
      >
        Join Call
      </Button>

      <Button
        className={`w-full ${
          appointment.status === 'approved'
            ? 'bg-purple-600 text-white hover:bg-purple-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        disabled={appointment.status !== 'approved'}
        onClick={() =>
          window.open(`/chat/${appointment._id}`, '_blank')
        }
      >
        Chat
      </Button>
    </div>
  </div>
))}

        </div>
      </div>
      <Footer />
    </>
  );
};

export default AppointmentsPage;
