import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, Calendar, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAppointmentsForDoctor } from "../api";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  // const [doctorId, setDoctorId] = useState(null);
  const doctorvalId = localStorage.getItem("telemed-doctor"); // Get doctorId from localStorage
  const doctorId = doctorvalId ? JSON.parse(doctorvalId)._id : null; // Parse and extract the ID
  const [appointmentsCount, setAppointmentsCount] = useState(0);

  useEffect(() => {
    // Check for presence of patient or doctor in localStorage
    const patient = localStorage.getItem('telemed-patient');
    const doctor = localStorage.getItem('telemed-doctor');
    setLoggedIn(!!patient || !!doctor);  // Set loggedIn to true if either is found
    console.log('Doctor ID:', doctorId); // Log doctorId
    if (doctorId) {
      getAppointmentsForDoctor(doctorId)
        .then((data) => {
          console.log('Appointments Data:', data); // Log the response data
          setAppointmentsCount(data.count); // Set the number of appointments
        })
        .catch((error) => {
          console.error('Error fetching appointments:', error.message);
        });
    }
  }, [doctorId]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-medblue to-medteal flex items-center justify-center">
                <span className="text-white font-bold">TC</span>
              </div>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-medblue to-medteal bg-clip-text text-transparent">
                TeleMed Connect
              </span>
            </Link>
          </div>

          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <Link
              to="/"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-medblue"
            >
              Home
            </Link>
            <Link
              to="/services"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-medblue"
            >
              Services
            </Link>
            <Link
              to="/doctors"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-medblue"
            >
              Doctors
            </Link>
            <Link
              to="/about"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-medblue"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-medblue"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center">
            {loggedIn ? (
              <div className="hidden md:flex items-center space-x-3">
                <div className="relative group">
                  <button className="flex items-center space-x-2 hover:text-medblue">
                    <User className="h-6 w-6 text-medteal" />
                  </button>
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      asChild
                    >
                      <Link to="/appointmentspage">
                        <span>Appointments ({appointmentsCount})</span>
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      asChild
                    >
                      <Link to="/messages">
                        <span>Messages</span>
                      </Link>
                    </Button>
                    <button
                      onClick={() => {
                        localStorage.removeItem("telemed-patient");
                        localStorage.removeItem("telemed-doctor");
                        setLoggedIn(false); // Update the state when logging out
                        window.location.reload();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-medblue hover:bg-medblue-dark text-white"
                  asChild
                >
                  <Link to="/signup">Sign up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center ml-4">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-medblue focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medblue"
            >
              Home
            </Link>
            <Link
              to="/services"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medblue"
            >
              Services
            </Link>
            <Link
              to="/doctors"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medblue"
            >
              Doctors
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medblue"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medblue"
            >
              Contact
            </Link>

            {loggedIn ? (
              <>
                <div className="relative group">
                  <Link className="flex items-center space-x-2 hover:text-medblue px-3 py-2 rounded-md text-base font-medium text-gray-700">
                    <span>Account</span>
                  </Link>
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        localStorage.removeItem("telemed-patient");
                        localStorage.removeItem("telemed-doctor");
                        setLoggedIn(false);  // Update state after logout
                        window.location.reload();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-2 px-3 py-2">
                <Button variant="outline" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button
                  className="bg-medblue hover:bg-medblue-dark text-white"
                  asChild
                >
                  <Link to="/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
