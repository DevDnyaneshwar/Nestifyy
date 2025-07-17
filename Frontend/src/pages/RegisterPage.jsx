import React, { useState, useContext, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, User, MapPin, GraduationCap, Briefcase, Calendar, Camera, ArrowRight, Phone } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const RegisterPage = () => {
  const { trackInteraction } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    Role: "",
    profession: "",
    location: "",
    gender: "",
    number: "",
  });

  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  useEffect(() => {
    trackInteraction('page_view', 'register_page');
  }, [trackInteraction]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    trackInteraction('input', `register_input_${e.target.name}`);
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      if (selectedFile && selectedFile.type.startsWith('image/')) {
        setPhoto(selectedFile);
        trackInteraction('file_select', 'register_photo_upload');
        setError(''); // Clear any previous file-related errors
      } else {
        setPhoto(null);
        setError('Please select a valid image file for your profile photo.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    trackInteraction('submit', 'register_form_submit_attempt');

    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.Role) {
      setError("Please fill in all required fields.");
      setIsSubmitting(false);
      trackInteraction('validation_error', 'register_missing_fields');
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsSubmitting(false);
      trackInteraction('validation_error', 'register_password_short');
      return;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      setIsSubmitting(false);
      trackInteraction('validation_error', 'register_invalid_email');
      return;
    }

    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }
      if (photo) {
        data.append('photo', photo);
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Registration data:', data);

      // Replace with actual API call
      const response = await axios.post('https://nestifyy-my3u.onrender.com/api/user/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Registration successful:', response.data);
      alert("Registration successful! Please log in."); 
      trackInteraction('registration', 'registration_success');
      // Redirect to login page
      window.location.assign('/login');

    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      trackInteraction('registration', 'registration_failure', { error: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl animate-fade-in-up border border-white/20">
          
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight">
              Create Your Account
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600">
              Join us and find your perfect property or client.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl mb-6 sm:mb-8 flex items-start gap-2 sm:gap-3 text-sm sm:text-base animate-fade-in shadow-sm" role="alert">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-red-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="flex-1">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-gray-800 text-sm font-semibold">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg sm:rounded-xl pl-10 sm:pl-12 outline-none transition-all duration-300 text-black placeholder-gray-500 bg-white/70 hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base ${focusedField === 'name' ? 'shadow-lg border-blue-400' : 'shadow-sm'}`}
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField('')}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-gray-800 text-sm font-semibold">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg sm:rounded-xl pl-10 sm:pl-12 outline-none transition-all duration-300 text-black placeholder-gray-500 bg-white/70 hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base ${focusedField === 'email' ? 'shadow-lg border-blue-400' : 'shadow-sm'}`}
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-gray-800 text-sm font-semibold">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg sm:rounded-xl pl-10 sm:pl-12 pr-10 sm:pr-12 outline-none transition-all duration-300 text-black placeholder-gray-500 bg-white/70 hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base ${focusedField === 'password' ? 'shadow-lg border-blue-400' : 'shadow-sm'}`}
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label htmlFor="number" className="block text-gray-800 text-sm font-semibold">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="tel"
                    id="number"
                    name="number"
                    className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg sm:rounded-xl pl-10 sm:pl-12 outline-none transition-all duration-300 text-black placeholder-gray-500 bg-white/70 hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base ${focusedField === 'number' ? 'shadow-lg border-blue-400' : 'shadow-sm'}`}
                    placeholder="e.g., +1234567890"
                    value={formData.number}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('number')}
                    onBlur={() => setFocusedField('')}
                  />
                </div>
              </div>

              {/* Age */}
              <div className="space-y-2">
                <label htmlFor="age" className="block text-gray-800 text-sm font-semibold">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg sm:rounded-xl outline-none transition-all duration-300 text-black placeholder-gray-500 bg-white/70 hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base ${focusedField === 'age' ? 'shadow-lg border-blue-400' : 'shadow-sm'}`}
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('age')}
                  onBlur={() => setFocusedField('')}
                  min="18"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label htmlFor="gender" className="block text-gray-800 text-sm font-semibold">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg sm:rounded-xl outline-none appearance-none bg-white/70 hover:bg-white focus:bg-white transition-all duration-300 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base ${focusedField === 'gender' ? 'shadow-lg border-blue-400' : 'shadow-sm'}`}
                  value={formData.gender}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('gender')}
                  onBlur={() => setFocusedField('')}
                >
                  <option value="" className="text-gray-500">Select Gender</option>
                  <option value="Male" className="text-black">Male</option>
                  <option value="Female" className="text-black">Female</option>
                  <option value="Other" className="text-black">Other</option>
                </select>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label htmlFor="Role" className="block text-gray-800 text-sm font-semibold">
                  Register As <span className="text-red-500">*</span>
                </label>
                <select
                  id="Role"
                  name="Role"
                  className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg sm:rounded-xl outline-none appearance-none bg-white/70 hover:bg-white focus:bg-white transition-all duration-300 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base ${focusedField === 'Role' ? 'shadow-lg border-blue-400' : 'shadow-sm'}`}
                  value={formData.Role}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('Role')}
                  onBlur={() => setFocusedField('')}
                  required
                >
                  <option value="" className="text-gray-500">Select Role</option>
                  <option value="user" className="text-black">User</option>
                  <option value="broker" className="text-black">Broker</option>
                </select>
              </div>

              {/* Profession */}
              <div className="space-y-2">
                <label htmlFor="profession" className="block text-gray-800 text-sm font-semibold">
                  Profession
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    id="profession"
                    name="profession"
                    className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg sm:rounded-xl pl-10 sm:pl-12 outline-none transition-all duration-300 text-black placeholder-gray-500 bg-white/70 hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base ${focusedField === 'profession' ? 'shadow-lg border-blue-400' : 'shadow-sm'}`}
                    placeholder="e.g., Engineer, Doctor"
                    value={formData.profession}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('profession')}
                    onBlur={() => setFocusedField('')}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label htmlFor="location" className="block text-gray-800 text-sm font-semibold">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg sm:rounded-xl pl-10 sm:pl-12 outline-none transition-all duration-300 text-black placeholder-gray-500 bg-white/70 hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base ${focusedField === 'location' ? 'shadow-lg border-blue-400' : 'shadow-sm'}`}
                    placeholder="Enter your city/state"
                    value={formData.location}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('location')}
                    onBlur={() => setFocusedField('')}
                  />
                </div>
              </div>
            </div>

            {/* Profile Photo */}
            <div className="space-y-2">
              <label htmlFor="photo" className="block text-gray-800 text-sm font-semibold">
                Profile Photo (Optional)
              </label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center gap-3 sm:gap-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 bg-white/50">
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-gray-600 text-center sm:text-left">
                  <Camera className="w-6 h-6 sm:w-7 sm:h-7 text-gray-500 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">
                    {photo ? photo.name : "Click to upload a profile image"}
                  </span>
                </div>
                <span className="text-blue-600 font-semibold text-xs sm:text-sm">
                  {photo ? "Change file" : "Browse"}
                </span>
              </div>
              {photo && (
                <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center">
                  Selected: <span className="font-medium text-gray-700">{photo.name}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 sm:pt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-bold text-sm sm:text-lg shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <span>Register Account</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Terms and Privacy */}
          <p className="text-center text-gray-600 text-xs sm:text-sm mt-4 sm:mt-6 px-2">
            By registering, you agree to our{' '}
            <Link 
              to="/terms" 
              className="text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-colors" 
              onClick={() => trackInteraction('click', 'terms_link_from_register')}
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link 
              to="/privacy" 
              className="text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-colors" 
              onClick={() => trackInteraction('click', 'privacy_link_from_register')}
            >
              Privacy Policy
            </Link>.
          </p>

          {/* Login Link */}
          <p className="text-center text-gray-700 text-sm sm:text-base mt-6 sm:mt-8">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-blue-600 hover:text-blue-700 hover:underline font-bold transition-colors" 
              onClick={() => trackInteraction('click', 'login_link_from_register')}
            >
              Login here
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        /* Custom Animations */
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in-up { 
          animation: fade-in-up 0.6s ease-out forwards; 
        }
        
        .animate-fade-in { 
          animation: fade-in 0.4s ease-out forwards; 
        }

        /* Custom scrollbar for better mobile experience */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        /* Ensure form elements are properly sized on mobile */
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type="number"] {
          -moz-appearance: textfield;
        }

        /* Custom select arrow */
        select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 12px center;
          background-repeat: no-repeat;
          background-size: 16px;
        }

        /* Mobile-specific optimizations */
        @media (max-width: 640px) {
          /* Prevent zoom on iOS */
          input[type="text"],
          input[type="email"],
          input[type="tel"],
          input[type="number"],
          input[type="password"],
          select {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;