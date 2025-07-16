// src/pages/ProfileDetailPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Globe, Briefcase, Calendar, User, Users, Bed, Building, AlertCircle, Loader2, GraduationCap, Crown, Award, Heart, Anchor, Bookmark } from 'lucide-react';
import { AppContext } from '../context/Appcontext';

const ProfileDetailPage = () => {
  const { trackInteraction } = useContext(AppContext);
  const { id } = useParams(); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    trackInteraction('page_view', 'profile_detail_page', { userId: id });
  }, [trackInteraction, id]);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token'); // Assuming token is needed for any profile view
        if (!token) {
          throw new Error('Authentication required to view profiles.');
        }

        // Placeholder API URL. Replace with your actual backend API.
        // This endpoint should return public profile data for a given ID.
        const response = await fetch(`https://nestifyy-s3yv.onrender.com/api/user/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('User not found or you do not have permission to view this profile');
        }

        const data = await response.json();
        setUser(data.user);
        trackInteraction('data_fetch', 'profile_detail_success', { userId: id });
      } catch (err) {
        console.error('Error fetching user:', err);
        const errorMessage = err.message || 'Failed to load user profile. It may not exist or you might not have permission to view it.';
        setError(errorMessage);
        trackInteraction('data_fetch', 'profile_detail_failure', { userId: id, error: errorMessage });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, trackInteraction]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
          <p className="text-gray-700 font-medium text-lg">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 border border-red-200 text-center animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 text-red-600 mb-6">
            <AlertCircle className="w-10 h-10" />
            <h2 className="text-2xl font-bold">Error</h2>
          </div>
          <p className="text-gray-700 mb-8 text-lg">{error}</p>
          <Link
            to="/"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg transition-all duration-300 font-bold text-lg shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 border-none cursor-pointer"
            onClick={() => trackInteraction('click', 'profile_detail_error_go_home')}
          >
            <ArrowLeft className="w-5 h-5" />
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 border border-yellow-200 text-center animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 text-yellow-600 mb-6">
            <AlertCircle className="w-10 h-10" />
            <h2 className="text-2xl font-bold">Profile Not Found</h2>
          </div>
          <p className="text-gray-700 mb-8 text-lg">The user profile you are looking for does not exist.</p>
          <Link
            to="/"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg transition-all duration-300 font-bold text-lg shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 border-none cursor-pointer"
            onClick={() => trackInteraction('click', 'profile_detail_not_found_go_home')}
          >
            <ArrowLeft className="w-5 h-5" />
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center md:p-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-4xl border border-gray-200 animate-fade-in-up">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold cursor-pointer transition-all duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800"
            onClick={() => trackInteraction('click', 'profile_detail_back_button')}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          {/* Optionally show edit button if current user is viewing their own profile */}
          {/* <button className="action-button contact-button">Edit Profile</button> */}
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b pb-8 mb-8 border-gray-200">
          <img
            src={user.profilePhoto || `https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff&size=128`}
            alt={user.name}
            className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-white"
          />
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-2">{user.name}</h1>
            <p className="text-xl text-gray-600 mb-4 flex items-center justify-center md:justify-start gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${user.role === 'broker' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                {user.role === 'broker' ? <><Briefcase size={16} className="inline-block mr-1"/>Broker</> : <><User size={16} className="inline-block mr-1"/>User</>}
              </span>
              {user.profession && <span className="text-gray-500 text-lg">({user.profession})</span>}
            </p>
            <div className="flex flex-col items-center md:items-start gap-2 text-gray-700">
              {user.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span>{user.email}</span>
                </div>
              )}
              {user.number && (
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span>{user.number}</span>
                </div>
              )}
              {user.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span>{user.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm animate-fade-in-up delay-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <User className="w-6 h-6 text-blue-600" />
              About
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Age: <span className="font-semibold">{user.age || 'N/A'}</span>
            </p>
            <p className="text-gray-700 leading-relaxed">
              Gender: <span className="font-semibold">{user.gender || 'N/A'}</span>
            </p>
          </div>

          {user.role === 'broker' && user.brokerInfo && (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm animate-fade-in-up delay-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-green-600" />
                Broker Information
              </h3>
              <p className="text-gray-700 leading-relaxed">
                <Users className="inline-block w-4 h-4 mr-2 text-gray-500" />
                Clients Handled: <span className="font-semibold">{user.brokerInfo.clientsHandled || 'N/A'}</span>
              </p>
              <p className="text-gray-700 leading-relaxed">
                <Building className="inline-block w-4 h-4 mr-2 text-gray-500" />
                Properties Sold: <span className="font-semibold">{user.brokerInfo.propertiesSold || 'N/A'}</span>
              </p>
              <p className="text-gray-700 leading-relaxed">
                <Award className="inline-block w-4 h-4 mr-2 text-gray-500" />
                Experience: <span className="font-semibold">{user.brokerInfo.experience || 'N/A'} years</span>
              </p>
            </div>
          )}

          {user.role === 'user' && user.preferences && (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm animate-fade-in-up delay-300">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <Heart className="w-6 h-6 text-red-600" />
                Preferences
              </h3>
              <p className="text-gray-700 leading-relaxed">
                <Bed className="inline-block w-4 h-4 mr-2 text-gray-500" />
                Preferred Property Type: <span className="font-semibold">{user.preferences.propertyType || 'N/A'}</span>
              </p>
              <p className="text-gray-700 leading-relaxed">
                <MapPin className="inline-block w-4 h-4 mr-2 text-gray-500" />
                Preferred Location: <span className="font-semibold">{user.preferences.location || 'N/A'}</span>
              </p>
              <p className="text-gray-700 leading-relaxed">
                <DollarSign className="inline-block w-4 h-4 mr-2 text-gray-500" />
                Budget: <span className="font-semibold">{user.preferences.budget || 'N/A'}</span>
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-center gap-4">
          {user.email && (
            <a
              href={`mailto:${user.email}`}
              className="py-3 px-6 rounded-lg font-semibold cursor-pointer transition-all duration-200 bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
              onClick={() => trackInteraction('click', 'contact_user_email', { userId: user.id })}
            >
              <Mail className="w-5 h-5" />
              Contact by Email
            </a>
          )}
          {user.number && (
            <a
              href={`tel:${user.number}`}
              className="py-3 px-6 rounded-lg font-semibold cursor-pointer transition-all duration-200 bg-green-600 text-white shadow-md hover:bg-green-700 hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
              onClick={() => trackInteraction('click', 'contact_user_phone', { userId: user.id })}
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
          )}
        </div>
      </div>

      <style jsx>{`
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

export default ProfileDetailPage;