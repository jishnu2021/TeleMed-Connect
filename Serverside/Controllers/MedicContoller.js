const mongoose = require('mongoose');
const MedicalData = require('../Models/MedicalSchema')

const registerMedicalData = async (req, res) => {
    try {
        const medicalData = new MedicalData(req.body);
        await medicalData.save();
        res.status(201).json({ message: 'Medical data registered successfully', data: medicalData });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register medical data', details: error.message });
    }
}

const getMedicalData = async (req, res) => {
    try {
        const medicalData = await MedicalData.find();
        res.status(200).json(medicalData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve medical data', details: error.message });
    }
}

const getMedicalDataById = async (req, res) => {
    try {
        const medicalData = await MedicalData.findById(req.params.id);
        if (!medicalData) {
            return res.status(404).json({ message: 'Medical data not found' });
        }
        res.status(200).json(medicalData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve medical data', details: error.message });
    }
}



