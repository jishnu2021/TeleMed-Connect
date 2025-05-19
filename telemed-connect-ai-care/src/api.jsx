import axios from 'axios';

// Use a single API URL without health checks
const API_URL = process.env.NODE_ENV === 'development' 
  ? "http://localhost:5000" 
  : "https://telemed-connect-backend.onrender.com";

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
  console.log(`Calling getAllDoctors API: ${API_URL}/alldoctors`);
  try {
    const response = await axios.get(`${API_URL}/alldoctors`, { timeout: 5000 });
    console.log('getAllDoctors API response status:', response.status);
    
    if (response.data && Array.isArray(response.data)) {
      console.log(`getAllDoctors API returned ${response.data.length} doctors`);
      return response.data;
    } else {
      console.warn('getAllDoctors API did not return an array:', response.data);
      return [];
    }
  } catch (error) {
    console.error('getAllDoctors API error:', error.message);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received from server. Request:', error.request);
    }
    return []; // Return empty array instead of throwing
  }
}

export const getAllSpecialists = async () => {
  console.log(`Calling getAllSpecialists API: ${API_URL}/getallspeciality`);
  try {
    const response = await axios.get(`${API_URL}/allspecialists`, { timeout: 10000 });
    console.log('getAllSpecialists API response status:', response.status);
    console.log('Response data:', response.data);
    
    if (response.data && Array.isArray(response.data)) {
      console.log(`getAllSpecialists API returned ${response.data.length} specialists`);
      return response.data;
    } else {
      console.warn('getAllSpecialists API did not return an array:', response.data);
      return [];
    }
  } catch (error) {
    console.error('getAllSpecialists API error:', error.message);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received from server. Request:', error.request);
    }
    return []; // Return empty array instead of throwing
  }
};

export const getRegisteredDoctors = async () => {
  console.log(`Calling getRegisteredDoctors API: ${API_URL}/registered-doctors`);
  try {
    const response = await axios.get(`${API_URL}/registered-doctors`, { timeout: 8000 });
    console.log('getRegisteredDoctors API response status:', response.status);
    
    if (response.data && Array.isArray(response.data)) {
      console.log(`getRegisteredDoctors API returned ${response.data.length} doctors`);
      return response.data;
    } else {
      console.warn('getRegisteredDoctors API did not return an array:', response.data);
      return [];
    }
  } catch (error) {
    console.error('getRegisteredDoctors API error:', error.message);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received from server. Request:', error.request);
    }
    return []; // Return empty array instead of throwing
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
    const response = await axios.get(`${API_URL}/getallspeciality`, { timeout: 5000 });
    console.log('getdoctorspeciality API response status:', response.status);
    
    if (response.data && Array.isArray(response.data)) {
      console.log(`getdoctorspeciality API returned ${response.data.length} doctors`);
      return response.data;
    } else {
      console.warn('getdoctorspeciality API did not return an array:', response.data);
      return [];
    }
  } catch (error) {
    console.error('getdoctorspeciality API error:', error.message);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received from server. Request:', error.request);
    }
    return []; // Return empty array instead of throwing
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

export const updateStatusAppointment = async (appointmentId, status) => {
  try {
    const response = await axios.put(`${API_URL}/update-status/${appointmentId}`, { status });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update appointment status');
  }
};


export const getAppointmentsForPatient = async (patientId) => {
  console.log("Calling appointments API with ID:", patientId);
  try {
    const response = await axios.get(`${API_URL}/patient/${patientId}`);
    console.log("API success:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server responded with error:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request setup error:", error.message);
    }
    throw error;
  }
};



export const submitContactForm = async (formData) => {
  try {
    const res = await fetch(`${API_URL}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      throw new Error("Failed to submit contact form");
    }

    return await res.json();
  } catch (error) {
    console.error("Contact API Error:", error);
    throw error;
  }
};

export const fetchAllContacts = async () => {
  try {
    const res = await fetch(`${API_URL}/getcontacts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch contacts");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
};


export const sendMessage = async (appointmentId, sender, message) => {
  try {
    const response = await fetch(`${API_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appointmentId,
        sender,
        message,
      }),
    });

    if (response.ok) {
      return await response.json(); // Return the saved message object
    } else {
      throw new Error("Failed to send message");
    }
  } catch (err) {
    console.error("Error sending message:", err);
    throw err;
  }
};

// Fetch message history for a specific appointment
export const getMessages = async (appointmentId) => {
  try {
    const response = await fetch(`${API_URL}/messages/${appointmentId}`);
    if (response.ok) {
      return await response.json(); // Return the message history
    } else {
      throw new Error("Failed to fetch messages");
    }
  } catch (err) {
    console.error("Error fetching messages:", err);
    throw err;
  }
};

export const updatedoctorprofile = async(id,data)=>axios.put(`${API_URL}/updateproduct/${id}`,data);


export const getPrediction = async (req, res) => {
  const { symptoms } = req.body;

  try {
    const response = await axios.post('https://telemed-connect-backend.onrender.com/predict', { symptoms });
    res.json(response.data);
  } catch (error) {
    console.error("Prediction Error:", error);
    res.status(500).json({ error: "Prediction service failed" });
  }
};