import React, { useEffect, useState } from "react";
import { getAppointmentsForPatient } from "../api"; // Adjust path
import Navbar from '../components/Navbar';

const Notification = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const patient = JSON.parse(localStorage.getItem("telemed-patient"));
        const data = await getAppointmentsForPatient(patient._id);
        setAppointments(data);
      } catch (err) {
        console.error("Error loading notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-500">Loading notifications...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Notifications</h2>

        {appointments.length === 0 ? (
          <p className="text-center text-gray-600">You have no appointments yet.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
  <div
    key={appointment._id}
    className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition duration-300 ease-in-out"
  >
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-semibold text-gray-700">
        Doctor:{" "}
        <span className="text-blue-600">
          {appointment.doctorId?.name || "Not assigned yet"}
        </span>
      </h3>
      <span
        className={`text-sm font-medium px-3 py-1 rounded-full 
          ${appointment.status === "approved"
            ? "bg-green-100 text-green-700"
            : appointment.status === "rejected"
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
      </span>
    </div>

    <p className="text-gray-600 mb-1">
      {appointment.status === "approved" && "✅ Your appointment has been approved by the doctor."}
      {appointment.status === "rejected" && "❌ Sorry, your appointment was rejected."}
      {appointment.status === "pending" && "⏳ Your appointment is still awaiting approval."}
    </p>

    <p className="text-gray-500 text-sm mb-4">
      Date:{" "}
      <span className="font-medium text-gray-700">
        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
      </span>
    </p>

    {/* Action Buttons */}
    <div className="flex gap-4">
      <button
        disabled={appointment.status !== 'approved'}
        onClick={() => window.open(`/video/appointment_${appointment._id}`, '_blank')}
        className={`px-4 py-2 rounded text-sm font-medium w-full ${
          appointment.status === 'approved'
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Join Call
      </button>

      <button
        disabled={appointment.status !== 'approved'}
        onClick={() => window.open(`/chat/${appointment._id}`, '_blank')}
        className={`px-4 py-2 rounded text-sm font-medium w-full ${
          appointment.status === 'approved'
            ? 'bg-purple-600 text-white hover:bg-purple-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Chat
      </button>
    </div>
  </div>
))}

          </div>
        )}
      </div>
    </>
  );
};

export default Notification;
