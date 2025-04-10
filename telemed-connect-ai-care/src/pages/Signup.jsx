import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowLeft } from 'lucide-react';
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
import { patcreateaccount } from '../api';
import {doccreateaccount} from '../api'; // ✅ import the correct API function for doctors

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    specialist: '', // new field
  });
  

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required';
    }
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
  
      if (formData.role === 'doctor') {
        response = await doccreateaccount(formData);
      } else {
        response = await patcreateaccount(formData);
      }
  
      console.log("API raw response:", response);
  
      let user;
      if (response?.data?.user) {
        user = response.data.user;
      } else if (response?.user) {
        user = response.user;
      } else if (response?.data) {
        user = response.data;
      } else {
        user = response;
      }
  
      if (user) {
        if (formData.role === 'doctor') {
          localStorage.setItem('telemed-doctor', JSON.stringify(user));
          localStorage.removeItem('telemed-patient');
        } else {
          localStorage.setItem('telemed-patient', JSON.stringify(user));
          localStorage.removeItem('telemed-doctor');
        }
  
        alert('Account created successfully!');
        navigate('/');
      } else {
        throw new Error('User data not returned from server.');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      alert(error?.message || 'Signup failed. Please try again.');
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
                <CardTitle className="text-2xl text-center">Create Your Account</CardTitle>
                <CardDescription className="text-center">
                  Join TeleMed Connect to access quality healthcare services from anywhere.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label>I want to register as a</Label>
                    <div className="mt-2 flex gap-6">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="role"
                          value="patient"
                          checked={formData.role === 'patient'}
                          onChange={handleChange}
                          className="form-radio h-4 w-4 text-medblue"
                        />
                        <span className="ml-2 text-sm">Patient</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="role"
                          value="doctor"
                          checked={formData.role === 'doctor'}
                          onChange={handleChange}
                          className="form-radio h-4 w-4 text-medblue"
                        />
                        <span className="ml-2 text-sm">Doctor</span>
                      </label>
                    </div>
                    {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                  </div>
                  {formData.role === 'doctor' && (
  <div>
    <Label>Specialist</Label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <input
        type="text"
        name="specialist"
        value={formData.specialist}
        onChange={handleChange}
        className="block w-full pl-3 rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        placeholder="e.g., Cardiologist, Dermatologist"
      />
      {errors.specialist && (
        <p className="text-red-500 text-xs mt-1">{errors.specialist}</p>
      )}
    </div>
  </div>
)}

                  <div>
                    <Label>Full Name</Label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                  </div>

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
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-medblue hover:bg-medblue-dark"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>

                <p className="mt-4 text-xs text-gray-500 text-center">
                  Already have an account?{' '}
                  <Link to="/login" className="text-medblue hover:text-medblue-dark font-semibold">
                    Log In
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

export default Signup;
