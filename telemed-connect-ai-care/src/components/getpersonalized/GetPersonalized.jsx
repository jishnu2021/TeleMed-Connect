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

    // Simulate AI processing delay (remove this in production)
    setTimeout(async () => {
      try {
        // Making a POST request to the backend API
        console.log("The symptoms " , symptoms)
        
        const response = await axios.post('https://telemed-connect-flaskbackend.onrender.com/predict', {
          symptoms:["itching"]
        });
        console.log("The data is " , response)
        // Get the predicted disease and recommendations
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

          // Generate prescription data
          setPrescriptionData({
            id: generatePrescriptionId(),
            date: getCurrentDate(),
            patientName: patientName,
            patientAge: patientAge,
            diagnosis: predictedDisease,
            symptoms: symptoms,
            medications: medications,
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
      }

      setSubmitted(true);
    }, 1500);
  };

  
  const generateAdditionalNotes = (disease, symptoms) => {
    // Here you would implement more advanced AI logic to generate specific notes
    // This is a simple implementation for demonstration
    const symptomsLower = symptoms.toLowerCase();
    
    if (disease === "hypertension") {
      if (symptomsLower.includes("headache") || symptomsLower.includes("dizzy")) {
        return "Monitor blood pressure more frequently. If dizziness persists, contact your healthcare provider immediately.";
      }
      return "Maintain a low sodium diet. Record daily blood pressure readings.";
    }
    
    if (disease === "diabetes") {
      if (symptomsLower.includes("thirst") || symptomsLower.includes("urination")) {
        return "Monitor blood glucose levels more frequently. Ensure adequate hydration.";
      }
      return "Monitor blood glucose levels regularly. Follow a balanced diet plan.";
    }
    
    if (disease === "asthma") {
      if (symptomsLower.includes("cough") || symptomsLower.includes("wheez")) {
        return "Use rescue inhaler as needed. Avoid known triggers. If symptoms worsen, seek immediate medical attention.";
      }
      return "Maintain your asthma action plan. Avoid known triggers.";
    }
    
    return "Follow lifestyle recommendations. Schedule follow-up appointment as directed.";
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
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-indigo-600 p-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Digital Prescription</h2>
                    <p className="text-indigo-100 mt-1">TeleMed-Connect</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handlePrint}
                      className="bg-white text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center"
                    >
                      <Printer size={18} className="mr-2" />
                      Print
                    </button>
                    <button
                      onClick={handleTogglePrescription}
                      className="bg-indigo-500 hover:bg-indigo-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                    >
                      Back to Recommendations
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="border-b pb-4 mb-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-gray-800">TeleMed-Connect</h3>
                      <div className="text-right">
                        <p className="text-gray-600">Prescription #: {prescriptionData.id}</p>
                        <p className="text-gray-600">Date: {prescriptionData.date}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Patient Information</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p><span className="font-medium">Name:</span> {prescriptionData.patientName}</p>
                        <p><span className="font-medium">Age:</span> {prescriptionData.patientAge} years</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Diagnosis</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p><span className="font-medium">Primary:</span> {prescriptionData.diagnosis}</p>
                        <p><span className="font-medium">Symptoms:</span> {prescriptionData.symptoms}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-2">Medication</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left">
                            <th className="pb-2">Medication</th>
                            <th className="pb-2">Dosage</th>
                            <th className="pb-2">Frequency</th>
                            <th className="pb-2">Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {prescriptionData.medications.map((med, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-white" : ""}>
                              <td className="py-2 pr-2">{med.name}</td>
                              <td className="py-2 pr-2">{med.dosage}</td>
                              <td className="py-2 pr-2">{med.frequency}</td>
                              <td className="py-2">{med.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-2">Instructions</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <ul className="list-disc pl-5 space-y-1">
                        {prescriptionData.medications.map((med, index) => (
                          <li key={index}><span className="font-medium">{med.name}:</span> {med.instructions}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-2">Additional Notes</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p>{prescriptionData.additionalNotes}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Follow-up</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p>Schedule follow-up visit in {prescriptionData.followUp}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Healthcare Provider</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p><span className="font-medium">TeleMed-Connect</span></p>
                        <p>AI-Assisted Healthcare</p>
                        <p>ID: TMCAI-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-yellow-800">This is an AI-generated prescription for informational purposes only. All medication recommendations must be reviewed and approved by a licensed healthcare provider before use.</p>
                  </div>
                </div>
              </div>
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