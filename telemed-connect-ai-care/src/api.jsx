import axios from 'axios';

const API_URL = "http://localhost:5000";

export const patcreateaccount = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/patientregister`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message || 'Unknown error' };
    }
  }

  
export const patlogin = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/patientlogin`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message || 'Unknown error' };
    }
}


export const doccreateaccount = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/doctorregister`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Unknown error' };
  }
}

export const doclogin = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/doctorlogin`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Unknown error' };
  }
}

export const getAllDoctors = async () => {
  try {
    const response = await axios.get(`${API_URL}/alldoctors`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Unknown error' };
  }
}

export const getAllSpecialists = async () => {
  try {
    const response = await axios.get(`${API_URL}/allspecialists`);
    if (Array.isArray(response.data)) {
      return response.data.map(specialist => ({
        id: specialist._id || specialist.id,  // Ensure we get a unique identifier
        name: specialist.name || specialist,  // Ensure the name is available
      }));
    } else {
      throw new Error("Unexpected response format from specialists API");
    }
  } catch (error) {
    console.error('Error fetching specialists:', error);
    throw error.response?.data || { message: error.message || 'Unknown error' };
  }
};


export const bookAppointment = async (appointmentData) => {
  try {
    const response = await axios.post(`${API_URL}/book`, appointmentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Unknown error' };
  }
}

export const getdoctorspeciality = async () => {
  try {
    const response = await axios.get(`${API_URL}/alldoctorsspeciality`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Unknown error' };
  }
}

export const getAppointmentsForDoctor = async (doctorId) => {
  try {
    const response = await axios.get(`${API_URL}/doctor/${doctorId}`);  // Updated the URL
    const appointments = response.data; // Assuming the API directly returns an array of appointments
    return { count: appointments.length, appointments };
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Unknown error' };
  }
}
