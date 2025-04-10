const Appointment = require('../Models/Appointment');

exports.bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, time, symptoms } = req.body;

    const appointment = new Appointment({
      patientId,
      doctorId,
      date,
      time,
      symptoms
    });

    await appointment.save();
    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Booking failed', error: error.message });
  }
};

// Get appointments for a specific doctor (for Doctor Dashboard)
exports.getAppointmentsForDoctor = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    const appointments = await Appointment.find({ doctorId }).populate('patientId', 'name email');
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Fetching failed', error: error.message });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Fetching failed', error: error.message });
  }
};

// (Optional) Get appointments for a specific patient
exports.getAppointmentsForPatient = async (req, res) => {
  try {
    const patientId = req.params.patientId;

    const appointments = await Appointment.find({ patientId }).populate('doctorId', 'name email');
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Fetching failed', error: error.message });
  }
};

// Approve or Reject appointment by Doctor
exports.updateAppointmentStatus = async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const { status } = req.body; // expected "approved" or "rejected"
  
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
  
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { status },
        { new: true }
      );
  
      if (!updatedAppointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
  
      res.status(200).json({ message: `Appointment ${status}`, updatedAppointment });
    } catch (error) {
      res.status(500).json({ message: 'Update failed', error: error.message });
    }
  };
  