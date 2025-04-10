import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { patlogin } from '../api';
import { doclogin } from '../api';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '', // Add role field
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
  
    setIsLoading(true);
  
    try {
      let response;
  
      // Add role in the request payload
      const userData = { ...formData, role: formData.role === 'doctor' ? 1 : 0 };
  
      if (formData.role === 'doctor') {
        response = await doclogin(userData);
      } else {
        response = await patlogin(formData);
      }
  
      console.log("API raw response:", response);
  
      const user = response?.data?.doctor || response?.doctor || response?.data || response;
  
      if (user) {
        // Store user data in local storage based on role
        if (formData.role === 'doctor') {
          localStorage.setItem('telemed-doctor', JSON.stringify(user));
          localStorage.removeItem('telemed-patient');
        } else {
          localStorage.setItem('telemed-patient', JSON.stringify(user));
          localStorage.removeItem('telemed-doctor');
        }
  
        alert('Login successful!');
        navigate('/');
      } else {
        throw new Error('User data not returned from server.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert(error?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex">
        <div className="flex-1 flex flex-col justify-center py-12 px-6 lg:px-20 xl:px-24">
          <div className="w-full max-w-4xl">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-medblue hover:text-medblue-dark mb-6"
            >
              <ArrowLeft size={16} className="mr-1" /> Back to Home
            </Link>
            <Card className="border-0 shadow-lg">
              <CardHeader className="space-y-1">
                <div className="flex justify-center mb-2">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-medblue to-medteal flex items-center justify-center">
                    <span className="text-white font-bold text-lg">TC</span>
                  </div>
                </div>
                <CardTitle className="text-2xl text-center">Login to Your Account</CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access TeleMed Connect.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Email address</Label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>
                    <div>
                      <Label>Password</Label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          placeholder="Enter your password"
                        />
                        {errors.password && (
                          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label>Role</Label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      >
                        <option value="">Select your role</option>
                        <option value="doctor">Doctor</option>
                        <option value="patient">Patient</option>
                      </select>
                      {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-medblue hover:bg-medblue-dark"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                  </div>
                </form>

                <p className="mt-4 text-xs text-gray-500 text-center">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-medblue hover:text-medblue-dark font-semibold">
                    Sign up
                  </Link>
                </p>
              </CardContent>
              <CardFooter className="flex flex-col">
                <div className="relative w-full my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-sm text-gray-500">or continue with</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <Button variant="outline" className="w-full">
                    Google
                  </Button>
                  <Button variant="outline" className="w-full">
                    Facebook
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
        <div className="hidden lg:block relative w-1/2">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
            alt="AI and machine learning"
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
