// Frontend: SymptomCheckerSection.jsx
import React, { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { X } from 'lucide-react';

const commonSymptoms = [
  'Headache', 'Fever', 'Cough', 'Fatigue', 
  'Sore Throat', 'Shortness of Breath', 'Nausea'
];

const API_URL = "https://telemed-connect-backend.onrender.com"
const SymptomCheckerSection = () => {
  const [searchValue, setSearchValue] = useState('');
  const [chatPopupVisible, setChatPopupVisible] = useState(false);
  const [botReply, setBotReply] = useState('');
  const [doctor, setDoctor] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setChatPopupVisible(true);

    try {
      const userId = localStorage.getItem('telemed-patient') || 'guest';
      const res = await axios.post(`${API_URL}/askingQuestion`, { message: searchValue, userId });
      setBotReply(res.data.reply);
      setDoctor(res.data.suggestedDoctor);
    } catch (error) {
      setBotReply('Sorry, something went wrong.');
    }
  };

  const saveAsPDF = async () => {
    try {
      const res = await axios.post(`${API_URL}/save-suggestion`, {
        suggestion: botReply,
        doctor
      }, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'suggestion.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert('Failed to save PDF');
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-medblue-light/20 to-medteal-light/20 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Symptom Checker</h2>
              <p className="text-lg text-gray-600 mb-8">
                Describe your symptoms and get an instant assessment before connecting with a doctor.
              </p>
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter your main symptom..."
                    className="pl-10 py-6 rounded-lg border-gray-200 w-full"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  <Button 
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-medblue hover:bg-medblue-dark">
                    Check
                  </Button>
                </div>
              </form>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Common symptoms:</h3>
                <div className="flex flex-wrap gap-2">
                  {commonSymptoms.map((symptom, index) => (
                    <button
                      key={index}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700"
                      onClick={() => setSearchValue(symptom)}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-8">
                <a href="/symptom-checker" className="inline-flex items-center text-medblue hover:text-medblue-dark font-medium">
                  Start Full Assessment <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>
              {chatPopupVisible && (
  <div className="mt-10 p-4 border rounded-md shadow-md bg-gray-50 relative">
    <button
      onClick={() => setChatPopupVisible(false)}
      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
    >
      <X className="w-5 h-5" />
    </button>
    <p className="mb-2">{botReply}</p>
    <p className="mb-4 text-sm text-gray-600">Suggested by Doctor: {doctor}</p>
    <Button onClick={saveAsPDF} className="bg-green-600 hover:bg-green-700">
      Save the Suggestion
    </Button>
  </div>
)}

            </div>
            <div className="hidden lg:block relative">
              <img 
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="AI Medical Technology" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SymptomCheckerSection;
