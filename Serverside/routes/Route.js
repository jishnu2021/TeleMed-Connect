const route = require('express').Router()

const { registerUser , loginUser} = require('../Controllers/UserContoller')
const { registerDoctor, loginDoctor,getAllDoctors,getAllSpecialists , getAllDoctorsSpeciality} = require('../Controllers/DoctorController');
const {
    bookAppointment,
    getAppointmentsForDoctor,
    getAppointmentsForPatient,
    updateAppointmentStatus,
    getAllAppointments
  } = require('../Controllers/AppointmentController');
  const { chatWithBot } = require('../Controllers/chatbotController');

route.post('/askingQuestion', chatWithBot);

route.put('/update-status/:appointmentId', updateAppointmentStatus);
route.post('/book', bookAppointment);
route.get('/doctor/:doctorId', getAppointmentsForDoctor);
route.get('/patient/:patientId', getAppointmentsForPatient);
route.get('/allappointments', getAllAppointments);

route.post('/doctorregister', registerDoctor);
route.post('/doctorlogin', loginDoctor);
route.get('/alldoctors', getAllDoctors);
route.get('/allspecialists', getAllSpecialists);
route.get('/alldoctorsspeciality', getAllDoctorsSpeciality);

route.post('/patientregister' , registerUser);
route.post('/patientlogin',loginUser)

module.exports = route;