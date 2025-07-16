import React, { useEffect, useContext, useState } from 'react';
import { User, Home, MessageSquare, Briefcase, DollarSign, CheckCircle, AlertCircle, Eye, Trash2, Edit, Loader2, PlusCircle, Heart, Users, MapPin, Bell, Calendar, TrendingUp, Activity } from 'lucide-react';

const DashboardPage = () => {
  // Mock context and navigation
  const trackInteraction = (action, category, details) => console.log('Track:', action, category, details);
  const navigate = (path) => console.log('Navigate to:', path);
  const isAuthenticated = true;
  
  const [userRole, setUserRole] = useState('user'); // Default to 'user' for demo
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [properties, setProperties] = useState([]);
  const [roommateProfile, setRoommateProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [savedListings, setSavedListings] = useState([]);

  useEffect(() => {
    trackInteraction('page_view', 'dashboard_page');
    const storedRole = 'user'; // Mock role
    if (!isAuthenticated || !storedRole) {
      setError("You need to be logged in to access the dashboard.");
      setLoading(false);
      trackInteraction('auth_error', 'dashboard_unauthenticated');
      navigate('/login');
      return;
    }
    setUserRole(storedRole);
    fetchDashboardData(storedRole);
  }, [trackInteraction, isAuthenticated]);

  const fetchDashboardData = async (role) => {
    setLoading(true);
    setError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (role === 'owner' || role === 'broker') {
        setProperties([
          { id: 201, name: 'Spacious 2BHK for Rent', location: 'Kothrud, Pune', status: 'Active', imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop' },
          { id: 202, name: '1RK near IT Park', location: 'Hinjewadi, Pune', status: 'Pending', imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=200&fit=crop' },
          { id: 203, name: 'Luxury Villa', location: 'Lonavala, Pune', status: 'Active', imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=300&h=200&fit=crop' },
        ]);
        trackInteraction('data_fetch', 'dashboard_properties_success');
      } else if (role === 'user') {
        setRoommateProfile({
          id: 301,
          name: 'Your Roommate Profile',
          location: 'Pune',
          lookingFor: 'Shared room in Baner',
          budget: '₹ 10,000',
          status: 'Active',
          imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
        });
        trackInteraction('data_fetch', 'dashboard_roommate_profile_success');
      }

      setMessages([
        { id: 1, sender: 'Property Owner', subject: 'Inquiry about 2BHK', date: '2023-10-26' },
        { id: 2, sender: 'Nestify Support', subject: 'Your recent feedback', date: '2023-10-25' },
        { id: 3, sender: 'Roommate Sarah', subject: 'Room sharing discussion', date: '2023-10-24' },
      ]);
      trackInteraction('data_fetch', 'dashboard_messages_success');

      setSavedListings([
        { id: 401, name: 'Cozy 1BHK', location: 'Koregaon Park', price: '₹ 20,000/month', imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop' },
        { id: 402, name: 'Roommate: Sarah J.', location: 'Bengaluru', lookingFor: 'Indiranagar', budget: '₹ 12,000', imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616c31c75bd?w=300&h=200&fit=crop' },
      ]);
      trackInteraction('data_fetch', 'dashboard_saved_listings_success');

      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard data.');
      setLoading(false);
      trackInteraction('data_fetch', 'dashboard_failure', { error: err.message });
    }
  };

  const handleEditProperty = (propertyId) => {
    trackInteraction('click', `dashboard_edit_property_${propertyId}`);
    console.log('Edit property:', propertyId);
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      setLoading(true);
      trackInteraction('click', `dashboard_delete_property_confirm_${propertyId}`);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProperties(prev => prev.filter(p => p.id !== propertyId));
        setLoading(false);
        trackInteraction('property_management', 'dashboard_property_delete_success', { propertyId });
      } catch (err) {
        setError('Failed to delete property.');
        setLoading(false);
        trackInteraction('property_management', 'dashboard_property_delete_failure', { propertyId, error: err.message });
      }
    } else {
      trackInteraction('click', `dashboard_delete_property_cancel_${propertyId}`);
    }
  };

  const handleEditRoommateProfile = () => {
    trackInteraction('click', 'dashboard_edit_roommate_profile');
    console.log('Edit roommate profile');
  };

  const handleViewMessage = (messageId) => {
    trackInteraction('click', `dashboard_view_message_${messageId}`);
    console.log('Viewing message:', messageId);
  };

  const handleRemoveSavedListing = (listingId) => {
    trackInteraction('click', `dashboard_remove_saved_listing_${listingId}`);
    setSavedListings(prev => prev.filter(l => l.id !== listingId));
    console.log('Removed saved listing:', listingId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Loading Dashboard</h3>
            <p className="text-gray-600">Setting up your personalized experience...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 max-w-md mx-4 text-center border border-red-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
          <button
            onClick={() => { fetchDashboardData(userRole); trackInteraction('click', 'dashboard_retry_load'); }}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back!
              </h1>
              <p className="text-gray-600 mt-1">Here's what's happening with your account</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Listings</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">12</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">+2.5% from last month</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Messages</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{messages.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-600 font-medium">2 unread</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Saved Items</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{savedListings.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-purple-600 font-medium">Updated today</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Profile Views</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">89</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">+12% this week</span>
            </div>
          </div>
        </div>

        {/* Owner/Broker Properties Section */}
        {(userRole === 'owner' || userRole === 'broker') && (
          <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 mb-8 border border-gray-200/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                My Properties
              </h2>
              <button
                onClick={() => { navigate('/list-property'); trackInteraction('click', 'dashboard_add_property_button'); }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 transform hover:scale-105 active:scale-95"
              >
                <PlusCircle className="w-5 h-5" />
                Add Property
              </button>
            </div>

            {properties.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-600 text-lg">No properties listed yet</p>
                <p className="text-gray-500 mt-2">Start by adding your first property!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property, index) => (
                  <div key={property.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200/50 group hover:scale-105" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="relative overflow-hidden">
                      <img src={property.imageUrl} alt={property.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          property.status === 'Active' 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}>
                          {property.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{property.name}</h3>
                      <p className="text-gray-600 flex items-center gap-2 mb-4">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {property.location}
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEditProperty(property.id)}
                          className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-xl hover:bg-blue-100 transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property.id)}
                          className="flex-1 bg-red-50 text-red-600 py-2 px-4 rounded-xl hover:bg-red-100 transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* User Roommate Profile Section */}
        {userRole === 'user' && (
          <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 mb-8 border border-gray-200/50">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              My Roommate Profile
            </h2>
            
            {roommateProfile ? (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                  <div className="relative">
                    <img
                      src={roommateProfile.imageUrl}
                      alt={roommateProfile.name}
                      className="w-32 h-32 object-cover rounded-2xl shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="text-center lg:text-left flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{roommateProfile.name}</h3>
                    <div className="space-y-2 mb-4">
                      <p className="text-gray-600 flex items-center justify-center lg:justify-start gap-2">
                        <MapPin className="w-4 h-4 text-purple-500" />
                        {roommateProfile.location}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Looking for:</span> {roommateProfile.lookingFor}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Budget:</span> {roommateProfile.budget}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Status:</span> 
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {roommateProfile.status}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={handleEditRoommateProfile}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 transform hover:scale-105 active:scale-95"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-12 h-12 text-purple-400" />
                </div>
                <p className="text-gray-600 text-lg">No roommate profile yet</p>
                <p className="text-gray-500 mt-2">Create one to find perfect matches!</p>
              </div>
            )}
          </section>
        )}

        {/* Messages and Saved Listings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Messages Section */}
          <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200/50">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              Recent Messages
            </h2>
            
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600">No messages yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={message.id} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200/50 hover:shadow-md transition-all duration-200 group" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{message.sender}</h4>
                        <p className="text-gray-600 text-sm mb-2">{message.subject}</p>
                        <p className="text-gray-500 text-xs flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {message.date}
                        </p>
                      </div>
                      <button
                        onClick={() => handleViewMessage(message.id)}
                        className="opacity-0 group-hover:opacity-100 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-105"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Saved Listings Section */}
          <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200/50">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              Saved Listings
            </h2>
            
            {savedListings.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600">No saved listings</p>
                <p className="text-gray-500 text-sm mt-1">Start exploring to save your favorites!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedListings.map((listing, index) => (
                  <div key={listing.id} className="bg-gradient-to-r from-gray-50 to-pink-50 rounded-xl p-4 border border-gray-200/50 hover:shadow-md transition-all duration-200 group" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-start gap-4">
                      <img src={listing.imageUrl} alt={listing.name} className="w-16 h-16 object-cover rounded-lg shadow-md" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{listing.name}</h4>
                        <p className="text-gray-600 text-sm flex items-center gap-1 mb-1">
                          <MapPin className="w-3 h-3" />
                          {listing.location}
                        </p>
                        {listing.price && (
                          <p className="text-green-600 font-medium text-sm">{listing.price}</p>
                        )}
                        {listing.budget && (
                          <p className="text-blue-600 font-medium text-sm">Budget: {listing.budget}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveSavedListing(listing.id)}
                        className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-105"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;