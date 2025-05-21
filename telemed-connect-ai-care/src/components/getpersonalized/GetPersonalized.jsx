import { useState, useEffect } from 'react';
import { Search, Heart, Pill, Activity, BookOpen, Clock, Shield, Users, FileText, Printer, Download, User, Calendar, Phone } from 'lucide-react';
import Navbar from '../Navbar';
import axios from 'axios';

export default function GetPersonalized() {
  const [disease, setDisease] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState({});
  const [showPrescription, setShowPrescription] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [step, setStep] = useState(1);

  // Load patient name from local storage on component mount
  useEffect(() => {
    const storedName = localStorage.getItem('patientName');
    if (storedName) {
      setPatientName(storedName);
    }
  }, []);

  // Save patient name to local storage when it changes
  useEffect(() => {
    if (patientName) {
      localStorage.setItem('patientName', patientName);
    }
  }, [patientName]);

  // Common health conditions and their recommendations
  const diseasesData = {
    "hypertension": {
      title: "Hypertension (High Blood Pressure)",
      medications: [
        { name: "Lisinopril", dosage: "10mg", frequency: "once daily", duration: "30 days", instructions: "Take in the morning with or without food" },
        { name: "Hydrochlorothiazide", dosage: "12.5mg", frequency: "once daily", duration: "30 days", instructions: "Take in the morning with food" },
        { name: "Amlodipine", dosage: "5mg", frequency: "once daily", duration: "30 days", instructions: "Take at the same time each day" }
      ],
      lifestyle: ["Reduce sodium intake", "Regular aerobic exercise", "Maintain healthy weight", "Limit alcohol consumption", "Quit smoking"],
      monitoring: ["Daily blood pressure readings", "Regular doctor check-ups", "Monitor salt intake"],
      resources: ["American Heart Association", "DASH diet guidelines"]
    },
    "diabetes": {
      title: "Diabetes",
      medications: [
        { name: "Metformin", dosage: "500mg", frequency: "twice daily", duration: "30 days", instructions: "Take with meals" },
        { name: "Glipizide", dosage: "5mg", frequency: "once daily", duration: "30 days", instructions: "Take 30 minutes before breakfast" },
        { name: "Vitamin B Complex", dosage: "1 tablet", frequency: "once daily", duration: "30 days", instructions: "Take with food" }
      ],
      lifestyle: ["Regular blood sugar monitoring", "Balanced diet", "Regular physical activity", "Foot care", "Weight management"],
      monitoring: ["Regular A1C tests", "Daily glucose monitoring", "Kidney function tests"],
      resources: ["American Diabetes Association", "Diabetes Self-Management Education"]
    },
    "asthma": {
      title: "Asthma",
      medications: [
        { name: "Albuterol Inhaler", dosage: "2 puffs", frequency: "every 4-6 hours as needed", duration: "1 inhaler", instructions: "Use as rescue medication for acute symptoms" },
        { name: "Fluticasone Inhaler", dosage: "2 puffs", frequency: "twice daily", duration: "1 inhaler", instructions: "Rinse mouth after use" },
        { name: "Montelukast", dosage: "10mg", frequency: "once daily", duration: "30 days", instructions: "Take in the evening" }
      ],
      lifestyle: ["Identify and avoid triggers", "Use air purifiers", "Regular exercise with proper management", "Maintain healthy weight"],
      monitoring: ["Peak flow monitoring", "Symptom tracking", "Regular pulmonary function tests"],
      resources: ["American Lung Association", "Asthma Action Plan templates"]
    },
    "arthritis": {
      title: "Arthritis",
      medications: [
        { name: "Naproxen", dosage: "500mg", frequency: "twice daily", duration: "14 days", instructions: "Take with food" },
        { name: "Acetaminophen", dosage: "650mg", frequency: "every 6 hours as needed", duration: "14 days", instructions: "Do not exceed 3000mg per day" },
        { name: "Topical Diclofenac Gel", dosage: "Apply to affected area", frequency: "four times daily", duration: "1 tube", instructions: "Apply to clean, dry skin" }
      ],
      lifestyle: ["Low-impact exercise", "Hot and cold therapy", "Weight management", "Joint protection techniques"],
      monitoring: ["Pain levels", "Joint mobility and function", "Side effects of medications"],
      resources: ["Arthritis Foundation", "Physical therapy resources"]
    },
    "depression": {
      title: "Depression",
      medications: [
        { name: "Sertraline", dosage: "50mg", frequency: "once daily", duration: "30 days", instructions: "Take in the morning" },
        { name: "Vitamin D3", dosage: "2000 IU", frequency: "once daily", duration: "30 days", instructions: "Take with food" },
        { name: "Melatonin", dosage: "3mg", frequency: "once daily at bedtime", duration: "30 days", instructions: "Take 30 minutes before bedtime" }
      ],
      lifestyle: ["Regular physical activity", "Healthy sleep habits", "Stress reduction techniques", "Social connection"],
      monitoring: ["Mood tracking", "Sleep quality", "Side effects of medications"],
      resources: ["National Alliance on Mental Health", "Depression support groups"]
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const generatePrescriptionId = () => {
    return 'RX-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleNextStep = () => {
    if (step === 1 && patientName && patientAge) {
      setStep(2);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('https://telemed-connect-flaskbackend.onrender.com/predict', {
        symptoms: symptoms.split(',').map(s => s.trim())
      });

      const { disease: predictedDisease, description, precautions, medications, diet, workout } = response.data;
      
      if (predictedDisease) {
        setRecommendations({
          title: predictedDisease,
          description: description,
          precautions: precautions,
          medications: medications,
          diet: diet,
          workout: workout
        });

        // Generate prescription data with detailed medication information
        setPrescriptionData({
          id: generatePrescriptionId(),
          date: getCurrentDate(),
          patientName: patientName,
          patientAge: patientAge,
          diagnosis: predictedDisease,
          symptoms: symptoms,
          medications: medications.map(med => ({
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            duration: med.duration,
            instructions: med.instructions
          })),
          followUp: "2 weeks",
          additionalNotes: generateAdditionalNotes(predictedDisease, symptoms)
        });
      } else {
        setRecommendations({
          title: "Condition Not Found",
          message: "We couldn't find specific recommendations for this condition. Please try a different term or consult your healthcare provider."
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setRecommendations({
        title: "Error",
        message: "There was an error while fetching the data. Please try again later."
      });
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  const generateAdditionalNotes = (disease, symptoms) => {
    const symptomsLower = symptoms.toLowerCase();
    let notes = [];
    
    // Disease-specific notes
    switch(disease.toLowerCase()) {
      case 'hypertension':
        notes.push("Monitor blood pressure daily");
        notes.push("Maintain a low sodium diet");
        if (symptomsLower.includes("headache") || symptomsLower.includes("dizzy")) {
          notes.push("If dizziness persists, contact healthcare provider immediately");
        }
        break;
      case 'diabetes':
        notes.push("Monitor blood glucose levels regularly");
        notes.push("Follow prescribed diet plan");
        if (symptomsLower.includes("thirst") || symptomsLower.includes("urination")) {
          notes.push("Ensure adequate hydration");
        }
        break;
      case 'fungal infection':
        notes.push("Keep affected areas clean and dry");
        notes.push("Complete the full course of medication");
        notes.push("Avoid sharing personal items");
        break;
      default:
        notes.push("Follow lifestyle recommendations");
        notes.push("Schedule follow-up appointment as directed");
    }
    
    // General notes
    notes.push("Report any adverse reactions to medications");
    notes.push("Keep all follow-up appointments");
    notes.push("Maintain a healthy lifestyle");
    
    return notes.join(". ");
  };

  const handleReset = () => {
    setDisease('');
    setSymptoms('');
    setSubmitted(false);
    setRecommendations({});
    setShowPrescription(false);
    setPrescriptionData(null);
    setStep(1);
  };

  const handleTogglePrescription = () => {
    setShowPrescription(!showPrescription);
  };

  const handlePrint = () => {
    window.print();
  };

  // Add this new component for displaying medication details
  const MedicationDetails = ({ medication }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
      <h4 className="font-semibold text-lg text-indigo-700 mb-2">{medication.name}</h4>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="font-medium">Dosage:</span> {medication.dosage}
        </div>
        <div>
          <span className="font-medium">Frequency:</span> {medication.frequency}
        </div>
        <div>
          <span className="font-medium">Duration:</span> {medication.duration}
        </div>
        <div className="col-span-2">
          <span className="font-medium">Instructions:</span> {medication.instructions}
        </div>
      </div>
    </div>
  );

  // Update the prescription display section
  const PrescriptionDisplay = () => (
    <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-800">Medical Prescription</h2>
        <div className="flex space-x-4">
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Printer className="mr-2" size={18} />
            Print
          </button>
          <button
            onClick={handleReset}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-gray-600">Prescription ID: {prescriptionData.id}</p>
          <p className="text-gray-600">Date: {prescriptionData.date}</p>
        </div>
        <div>
          <p className="text-gray-600">Patient: {prescriptionData.patientName}</p>
          <p className="text-gray-600">Age: {prescriptionData.patientAge}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-indigo-700 mb-2">Diagnosis</h3>
        <p className="text-gray-700">{prescriptionData.diagnosis}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-indigo-700 mb-2">Medications</h3>
        {prescriptionData.medications.map((medication, index) => (
          <MedicationDetails key={index} medication={medication} />
        ))}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-indigo-700 mb-2">Additional Notes</h3>
        <p className="text-gray-700">{prescriptionData.additionalNotes}</p>
      </div>

      <div className="border-t pt-4">
        <p className="text-gray-600">Follow-up: {prescriptionData.followUp}</p>
      </div>
    </div>
  );

  return (
    <>
    <Navbar/>
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-16">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-indigo-800 mb-2">TeleMed-Connect</h1>
          <p className="text-gray-600">AI-Powered Health Recommendations & Prescription System</p>
        </header>

        {!submitted ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            {step === 1 ? (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-indigo-700">Patient Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="patientName" className="block text-gray-700 font-medium">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        id="patientName"
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full py-3 px-4 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                      <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="patientAge" className="block text-gray-700 font-medium">
                      Age
                    </label>
                    <div className="relative">
                      <input
                        id="patientAge"
                        type="number"
                        min="1"
                        max="120"
                        value={patientAge}
                        onChange={(e) => setPatientAge(e.target.value)}
                        placeholder="Enter your age"
                        className="w-full py-3 px-4 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                      <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleNextStep}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center"
                    disabled={!patientName || !patientAge}
                  >
                    Continue
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="disease" className="block text-gray-700 font-medium">
                    What condition are you managing?
                  </label>
                  <div className="relative">
                    <input
                      id="disease"
                      type="text"
                      value={disease}
                      onChange={(e) => setDisease(e.target.value)}
                      placeholder="Example: Hypertension, Diabetes, Asthma..."
                      className="w-full py-3 px-4 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                    <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="symptoms" className="block text-gray-700 font-medium">
                    Describe your symptoms and concerns
                  </label>
                  <textarea
                    id="symptoms"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Describe your symptoms, concerns, and how long you've been experiencing them..."
                    className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-32"
                    required
                  />
                </div>
                
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition duration-200"
                  >
                    Back
                  </button>
                  
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        Get AI Recommendations
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Common Health Conditions:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.keys(diseasesData).map((key) => (
                    <div 
                      key={key}
                      className="bg-indigo-50 rounded-lg px-3 py-2 text-sm text-indigo-700 font-medium cursor-pointer hover:bg-indigo-100"
                      onClick={() => setDisease(key)}
                    >
                      {diseasesData[key].title}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {showPrescription && prescriptionData ? (
              <PrescriptionDisplay />
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-indigo-600 p-6">
                  <h2 className="text-2xl font-bold text-white">{recommendations.title}</h2>
                  <p className="text-indigo-100 mt-1">Personalized recommendations for {patientName}, {patientAge} years</p>
                </div>
                
                {recommendations.message ? (
                  <div className="p-6">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                      <p className="text-yellow-700">{recommendations.message}</p>
                    </div>
                    <button
                      onClick={handleReset}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                      <div className="flex items-center mb-3">
                        <Pill className="text-blue-600 mr-2" size={20} />
                        <h3 className="font-semibold text-lg text-blue-800">Medications</h3>
                      </div>
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-sm text-blue-700">
                            <th className="pb-2">Medication</th>
                            <th className="pb-2">Dosage</th>
                            <th className="pb-2">Frequency</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recommendations.medications?.map((med, index) => (
                            <tr key={index} className="border-t border-blue-100">
                              <td className="py-2 pr-2 font-medium">{med.name}</td>
                              <td className="py-2 pr-2">{med.dosage}</td>
                              <td className="py-2">{med.frequency}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <Activity className="text-green-600 mr-2" size={20} />
                          <h3 className="font-semibold text-lg text-green-800">Lifestyle Changes</h3>
                        </div>
                        <ul className="space-y-2">
                          {recommendations.lifestyle?.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className=" bg-green-200 rounded-full w-5 h-5 flex items-center justify-center text-xs text-green-800 mr-2 mt-0.5">{index + 1}</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <Clock className="text-purple-600 mr-2" size={20} />
                          <h3 className="font-semibold text-lg text-purple-800">Monitoring</h3>
                        </div>
                        <ul className="space-y-2">
                          {recommendations.monitoring?.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="bg-purple-200 rounded-full w-5 h-5 flex items-center justify-center text-xs text-purple-800 mr-2 mt-0.5">{index + 1}</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-orange-50 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <BookOpen className="text-orange-600 mr-2" size={20} />
                          <h3 className="font-semibold text-lg text-orange-800">Resources</h3>
                        </div>
                        <ul className="space-y-2">
                          {recommendations.resources?.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className=" bg-orange-200 rounded-full w-5 h-5 flex items-center justify-center text-xs text-orange-800 mr-2 mt-0.5">{index + 1}</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-indigo-50 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <Phone className="text-indigo-600 mr-2" size={20} />
                          <h3 className="font-semibold text-lg text-indigo-800">Follow-up</h3>
                        </div>
                        <p>Schedule a follow-up appointment in 2 weeks to review your progress and adjust treatments if necessary.</p>
                      </div>
                    </div>
                    
                    <div className="mt-8 bg-indigo-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Shield className="text-indigo-600 mr-2" size={20} />
                        <h3 className="font-semibold text-lg text-indigo-800">Important Notice</h3>
                      </div>
                      <p className="text-gray-700">These recommendations are for informational purposes only and should not replace professional medical advice. Always consult with your healthcare provider before making changes to your treatment plan.</p>
                    </div>
                    
                    <div className="mt-6 flex justify-between">
                      <button
                        onClick={handleReset}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-200"
                      >
                        Start Over
                      </button>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={handleTogglePrescription}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center"
                        >
                          <FileText size={18} className="mr-2" />
                          View Prescription
                        </button>
                        
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center">
                          <Users size={18} className="mr-2" />
                          Connect with Doctor
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>TeleMed-Connect © 2025. This application is for educational purposes only. All recommendations should be reviewed by a healthcare professional.</p>
        </footer>
      </div>
    </div>
    </>
  );
}