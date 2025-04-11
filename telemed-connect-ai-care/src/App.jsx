import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route,Navigate  } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Services from "./pages/Services";
import Doctors from "./pages/Doctors";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Signup from "./pages/Signup";
import Chatbutton from "./pages/Chatbutton";
import AppointmentsPage from "./pages/AppointmentsPage";
import Notification from "./pages/Notification";
import VideoConsultationForm from "./pages/VideoConsultationForm";
import Appointment from "./pages/Appointment";

const App = () => {
  
  const [doctorId, setDoctorId] = useState(null); // State to hold doctorId

  // Get doctorId from localStorage on component mount
  React.useEffect(() => {
    const doctorvalId = localStorage.getItem("telemed-doctor"); // Get doctorId from localStorage
    if (doctorvalId) {
      const parsedDoctorId = JSON.parse(doctorvalId)._id; // Parse and extract the ID
      setDoctorId(parsedDoctorId);
    }
  }, []); // Empty dependency array to run only once on mount

  return (
    <>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/services" element={<Services />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/appointment" element={<Appointment />} />

            <Route
              path="/appointmentspage"
              element={<AppointmentsPage doctorId={doctorId} />}
            />
            <Route path="/notification" element={<Notification/>}/>
            <Route path="/video/:roomId" element={<VideoConsultationForm />} />



            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      <Chatbutton />
    </>
  );
};


export default App;