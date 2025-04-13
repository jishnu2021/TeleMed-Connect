import React, { useState, useEffect } from 'react';

const PatientSetting = () => {
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    // Fetch patient data from API or localStorage
    const patientInfo = JSON.parse(localStorage.getItem('telemed-patient'));
    setPatientData(patientInfo);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Patient Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700">Name</label>
                <input
                  id="name"
                  type="text"
                  defaultValue={patientData ? patientData.name : 'Loading...'}
                  className="w-full mt-2 p-2 border rounded-md"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700">Email</label>
                <input
                  id="email"
                  type="email"
                  defaultValue={patientData ? patientData.email : 'Loading...'}
                  className="w-full mt-2 p-2 border rounded-md"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="emailNotifications" className="block text-gray-700">Email Notifications</label>
                <input
                  id="emailNotifications"
                  type="checkbox"
                  className="mt-2 p-2"
                  defaultChecked={patientData ? patientData.emailNotifications : false}
                />
              </div>
              <div>
                <label htmlFor="smsNotifications" className="block text-gray-700">SMS Notifications</label>
                <input
                  id="smsNotifications"
                  type="checkbox"
                  className="mt-2 p-2"
                  defaultChecked={patientData ? patientData.smsNotifications : false}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientSetting;
