import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAppointmentsForDoctor, getAppointmentsForPatient } from "../api";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [isDoctor, setIsDoctor] = useState(false);
  const [isPatient, setIsPatient] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const patientData = localStorage.getItem("telemed-patient");
    const doctorData = localStorage.getItem("telemed-doctor");

    const patientId = patientData ? JSON.parse(patientData)._id : null;
    const doctorId = doctorData ? JSON.parse(doctorData)._id : null;

    setIsPatient(!!patientData);
    setIsDoctor(!!doctorData);
    setLoggedIn(!!patientData || !!doctorData);

    if (doctorId) {
      getAppointmentsForDoctor(doctorId)
        .then((data) => setAppointmentsCount(data.count))
        .catch((error) =>
          console.error("Error fetching doctor appointments:", error.message)
        );
    } else if (patientId) {
      getAppointmentsForPatient(patientId)
        .then((data) => setAppointmentsCount(data.count))
        .catch((error) =>
          console.error("Error fetching patient appointments:", error.message)
        );
    }
  }, []);

  const renderAppointmentsLink = () => {
    if (isDoctor) {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
          asChild
        >
          <Link to="/appointmentspage">
            <div className="flex items-center space-x-2 text-gray-700">
              <span>Appointments</span>
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {appointmentsCount}
              </span>
            </div>
          </Link>
        </Button>
      );
    }
    return null;
  };

  const renderSettingsLink = () => {
    if (isDoctor) {
      return <Link to="/doctorsetting" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>;
    } else if (isPatient) {
      return <Link to="/patientsetting" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>;
    }
    return null;
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

          <div className="hidden md:flex md:items-center md:space-x-4">
          <Link
                
                to="/"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-medblue"
              >
                Home
              </Link>
            {["Services", "Doctors", "About", "Contact"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-medblue"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center">
            {loggedIn ? (
              <div className="hidden md:flex items-center space-x-3">
                <div className="relative group">
                  <button className="flex items-center space-x-2 hover:text-medblue">
                    <User className="h-6 w-6 text-medteal" />
                  </button>
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
                    {renderSettingsLink()}
                    {renderAppointmentsLink()}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      asChild
                    >
                      <Link to="/notification">Notification</Link>
                    </Button>
                    <button
                      onClick={() => {
                        localStorage.removeItem("telemed-patient");
                        localStorage.removeItem("telemed-doctor");
                        setLoggedIn(false);
                        alert("Logout Successfully")
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
                
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medblue"
              >
               Home
              </Link>
            {[ "Services", "Doctors", "About", "Contact"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medblue"
              >
                {item}
              </Link>
            ))}

            {loggedIn && (
              <>
                {renderSettingsLink()}
                {isDoctor && appointmentsCount > 0 && (
                  <Link
                    to="/appointmentspage"
                    className="px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <span>Appointments</span>
                    <span className="ml-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {appointmentsCount}
                    </span>
                  </Link>
                )}
                <Link
                  to="/notification"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Notification
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("telemed-patient");
                    localStorage.removeItem("telemed-doctor");
                    setLoggedIn(false);
                    window.location.reload();
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            )}

            {!loggedIn && (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-medblue hover:bg-medblue-dark"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};


export default Navbar;
