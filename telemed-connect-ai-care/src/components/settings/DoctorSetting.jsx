import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar'

const API_URL = "http://localhost:5000"
const DoctorSetting = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch docId from localStorage (assuming telemed-doctor is stored there)
  const doctorInfo = JSON.parse(localStorage.getItem('telemed-doctor'));
  console.log("The info is ", doctorInfo);
  
  const docId = doctorInfo && doctorInfo.doctor ? doctorInfo.doctor._id : null;
  console.log("The id is ", docId);
  
  useEffect(() => {
    if (!docId) {
      setError('Doctor not found in localStorage');
      return;
    }

    // Fetch doctor data from API (GET request)
    axios.get(`${API_URL}/updatedoctorprofile/${docId}`)
      .then((response) => {
        const doctorInfo = response.data;
        setDoctorData(doctorInfo);
        setEmail(doctorInfo.email);
        setName(doctorInfo.name);
        setSpecialist(doctorInfo.specialist);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching doctor details');
      });
  }, [docId]);

  const handlePasswordChange = () => {
    if (oldPassword === '' || newPassword === '' || confirmPassword === '') {
      setError('Please fill out all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    // Logic to update password (PUT request)
    const passwordData = {
      oldPassword,
      newPassword
    };

    axios.put(`${API_URL}/updatedoctorprofile/${docId}`, passwordData)
      .then((response) => {
        setSuccess('Password updated successfully.');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      })
      .catch((err) => {
        setError('Error updating password.');
        console.error(err);
      });
  };

  const handleProfileUpdate = () => {
  
    if (oldPassword && newPassword && confirmPassword) {
      // Include password fields if they are provided
      updatedData.oldPassword = oldPassword;
      updatedData.newPassword = newPassword;
      updatedData.confirmPassword = confirmPassword;
    }
    const updatedData = {
        name,
        email,
        specialist,
        confirmPassword
      };
  
    // PUT request to update profile
    axios.put(`${API_URL}/updatedoctorprofile/${docId}`, updatedData)
      .then((response) => {
        setSuccess('Profile updated successfully.');
        alert("Profile updated successfully.")
      })
      .catch((err) => {
        setError('Error updating profile.');
        console.error(err);
      });
  };
  

  return (
    <>
    <Navbar/>
    <div className="bg-gray-100 min-h-screen flex items-center justify-center py-10">
      <div className="bg-white w-full max-w-4xl p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">Doctor Settings</h2>

        {/* Error and Success Messages */}
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        {success && <div className="text-green-600 text-center mb-4">{success}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Profile Information</h3>
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-600 font-medium">Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
              </div>
              <div>
                <label htmlFor="specialty" className="block text-gray-600 font-medium">Specialty</label>
                <input
                  id="specialty"
                  type="text"
                  value={specialist}
                  onChange={(e) => setSpecialist(e.target.value)}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-600 font-medium">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email }
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleProfileUpdate}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                Save Profile Changes
              </button>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Change Password</h3>
            <div className="space-y-6">
              <div>
                <label htmlFor="oldPassword" className="block text-gray-600 font-medium">Old Password</label>
                <input
                  id="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-gray-600 font-medium">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-gray-600 font-medium">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handlePasswordChange}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default DoctorSetting;
