const mongoose = require('mongoose');

const MedicalSchema = new mongoose.Schema({
    patientname: {
        type: String,
        required: true
    },
    doctorsname: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    phnnumber: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    symptoms: {
        type: String,
        required: true
    },
    prescription: {
        data: Buffer,
        contentType: String,
        required: true
    }    

});
const MedicalData = mongoose.model('MedicalData', MedicalSchema);
module.exports = MedicalData;