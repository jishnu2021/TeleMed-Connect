// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const doctor = localStorage.getItem("telemed-doctor");
  const patient = localStorage.getItem("telemed-patient");

  // If either doctor or patient is logged in, allow access
  const isAuthenticated = doctor || patient;

  return isAuthenticated ? <Outlet /> : <Navigate to="/signup" replace />;
};

export default ProtectedRoute;
