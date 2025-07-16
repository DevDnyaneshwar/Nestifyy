// src/pages/LoginPage.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const LoginPage = () => {
  const { handleLogin, trackInteraction, isAuthenticated } = useContext(AppContext);
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    trackInteraction('page_view', 'login_page');
  }, [trackInteraction]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile'); 
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`https://nestifyy-my3u.onrender.com/api/user/login`, {
        email,
        password,
      });
      const { token, user } = response.data;

      // Store token and update context
      localStorage.setItem("token", token);
      console.log('Token saved:', token);
      handleLogin(token, user);
      trackInteraction("login", "login_success");

      navigate("/profile");
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
      trackInteraction("login", "login_failure", { error: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md animate-fade-in-up">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Welcome Back!</h2>
        <p className="text-gray-600 text-center mb-8">Sign in to your account</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 flex items-center gap-2 text-sm animate-fade-in" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg pr-10 outline-none transition-all duration-200 pl-10
                  ${focusedField === 'email' ? 'border-blue-500 ring-1 ring-blue-500' : ''}`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg pr-10 outline-none transition-all duration-200 pl-10
                  ${focusedField === 'password' ? 'border-blue-500 ring-1 ring-blue-500' : ''}`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('')}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-none p-0"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
  type="submit"
  className={`w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white py-3 px-4 rounded-full font-bold text-lg shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl active:scale-98 flex items-center justify-center gap-3 ${
    isLoading ? 'opacity-80 cursor-not-allowed' : ''
  }`}
  disabled={isLoading}
>
  {isLoading ? (
    <>
      <Loader2 className="w-5 h-5 animate-spin" />
      <span>Logging In...</span>
    </>
  ) : (
    <>
      <span>Login</span>
      <ArrowRight className="w-5 h-5" />
    </>
  )}
</button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-gray-500">Or continue with</span>
          </div>
        </div>

        <button
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold transition-all duration-300 hover:bg-gray-50 active:scale-98"
          onClick={() => { /* Implement Google Login */ trackInteraction('click', 'google_login_button'); }}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google icon" className="w-5 h-5" />
          <span>Sign in with Google</span>
        </button>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium" onClick={() => trackInteraction('click', 'register_link_from_login')}>
            Register here
          </Link>
        </p>
      </div>

      <style>{`
        /* Animations */
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-fade-in-up.delay-100 { animation-delay: 0.1s; }
        .animate-fade-in-up.delay-200 { animation-delay: 0.2s; }
        .animate-fade-in-up.delay-300 { animation-delay: 0.3s; }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default LoginPage;