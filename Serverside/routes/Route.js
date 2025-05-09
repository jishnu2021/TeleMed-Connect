const route = require('express').Router()

const {saveSuggestionAsPDF} = require('../Controllers/SaveSuggestion')
const { registerUser , loginUser,updateUserDetails,getUserDetails} = require('../Controllers/UserContoller')
const { registerDoctor, loginDoctor,getAllDoctors,getAllSpecialists , getAllDoctorsSpeciality,updateDoctorProfile,getDoctorDetails} = require('../Controllers/DoctorController');
const {
    bookAppointment,
    getAppointmentsForDoctor,
    getAppointmentsForPatient,
    updateAppointmentStatus,
    getAllAppointments,
    CheckUpdation
  } = require('../Controllers/AppointmentController');
const { chatWithBot } = require('../Controllers/chatbotController');
const {createContact,getAllContacts} = require('../Controllers/ContactController')
const { upload } = require('../Controllers/MessageController'); 
const messageController = require('../Controllers/MessageController');

// Base path: /api/messages

// Get message history for a specific appointment
route.get('/:appointmentId', messageController.getMessages);

// Send a new message
route.post('/', messageController.sendMessage);

// Mark messages as read
route.put('/read/:appointmentId', messageController.markMessagesAsRead);

// Get unread message count for a user
route.get('/unread/:userId', messageController.getUnreadCount);

// Search messages by content
route.get('/search', messageController.searchMessages);

// Get latest message for each appointment
route.get('/latest', messageController.getLatestMessages);

// Delete messages for an appointment (Admin or system use only)
route.delete('/:appointmentId', messageController.deleteMessages);


// const AppointmentModel = require('../Models/AppointmentModel');


route.put('/updatepatientprofile/:userId',updateUserDetails); // Update user details for both roles
route.get('/updatepatientprofile/:userId', getUserDetails); // Get user details for both roles

route.put('/updatedoctorprofile/:docId', updateDoctorProfile);

route.get('/updatedoctorprofile/:docId', getDoctorDetails)

route.post("/contact", createContact);
route.get("/getcontacts", getAllContacts);

route.post('/askingQuestion', chatWithBot);
route.post('/save-suggestion', saveSuggestionAsPDF);

route.put('/update-status/:appointmentId', updateAppointmentStatus);
route.post('/book', bookAppointment);
route.get('/doctor/:doctorId', getAppointmentsForDoctor);
route.get('/patient/:patientId', getAppointmentsForPatient);
route.get('/allappointments', getAllAppointments);
route.get('/checkupdation/:appointmentId',CheckUpdation)

route.post('/doctorregister', registerDoctor);
route.post('/doctorlogin', loginDoctor);
route.get('/alldoctors', getAllDoctors);
route.get('/allspecialists', getAllSpecialists);
route.get('/alldoctorsspeciality', getAllDoctorsSpeciality);

route.post('/patientregister' , registerUser);
route.post('/patientlogin',loginUser)





module.exports = route;


// Optional endpoint to return a roomId per appointment
// route.get('/video-room/:appointmentId', async (req, res) => {
//   const { appointmentId } = req.params;
//   const appointment = await AppointmentModel.findById(appointmentId).populate('doctorId');

//   if (!appointment || appointment.status !== 'approved') {
//     return res.status(403).json({ error: 'Appointment not approved or not found' });
//   }

//   const roomId = `${appointment.patientId}_${appointment.doctorId._id}`;
//   res.json({ roomId });
// });