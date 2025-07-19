// src/components/HomePage.jsx
import React, { useEffect, useState, useContext } from 'react';
import { Search, MessageSquare, Home } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import HeroSection from './HeroSection';
import PropertyListingCard from './PropertyListingCard';
import RoommateListingCard from './RoommateListingCard';

const HomePage = () => {
  const { trackInteraction } = useContext(AppContext);
  const [properties, setProperties] = useState([]);
  const [roommates, setRoommates] = useState([]);
  const [propertyLoading, setPropertyLoading] = useState(false);
  const [roommateLoading, setRoommateLoading] = useState(false);
  const [propertyError, setPropertyError] = useState(null);
  const [roommateError, setRoommateError] = useState(null);
  const [activeTab, setActiveTab] = useState('find_room');

  // Fetch initial data
  useEffect(() => {
    trackInteraction('page_view', 'home_page');
    fetchProperties();
    fetchRoommates();
  }, [trackInteraction]);

  // Fetch properties
  const fetchProperties = async (query = '') => {
    try {
      setPropertyLoading(true);
      setPropertyError(null);
      const url = query
        ? `https://nestifyy-my3u.onrender.com/api/property/search?search=${encodeURIComponent(query)}`
        : 'https://nestifyy-my3u.onrender.com/api/property/all';
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setProperties(data.properties.slice(0, 4)); // Limit to 4 properties
      } else {
        setPropertyError(data.message || 'Failed to fetch properties');
      }
    } catch (err) {
      setPropertyError('Error fetching properties');
      console.error(err);
    } finally {
      setPropertyLoading(false);
    }
  };

  // Fetch roommates
  const fetchRoommates = async (query = '') => {
    try {
      setRoommateLoading(true);
      setRoommateError(null);
      const url = query
        ? `https://nestifyy-my3u.onrender.com/api/room-request?search=${encodeURIComponent(query)}`
        : 'https://nestifyy-my3u.onrender.com/api/room-request';
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRoommates(data.slice(0, 4)); // Limit to 4 roommates
      } else {
        setRoommateError(data.message || 'Failed to fetch roommates');
      }
    } catch (err) {
      setRoommateError('Error fetching roommates');
      console.error(err);
    } finally {
      setRoommateLoading(false);
    }
  };

  // Handle search from HeroSection
  const handleSearch = (query, tab) => {
    setActiveTab(tab);
    if (tab === 'find_room') {
      fetchProperties(query);
    } else if (tab === 'find_roommate') {
      fetchRoommates(query);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter antialiased flex flex-col">
      <HeroSection onSearch={handleSearch} />

      <section className="py-12 px-6 bg-white md:px-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
          {activeTab === 'find_room' ? 'Featured Rooms & Properties' : 'Featured Roommates'}
        </h2>
        {activeTab === 'find_room' && propertyLoading && <p className="text-center">Loading properties...</p>}
        {activeTab === 'find_roommate' && roommateLoading && <p className="text-center">Loading roommates...</p>}
        {activeTab === 'find_room' && propertyError && <p className="text-center text-red-500">{propertyError}</p>}
        {activeTab === 'find_roommate' && roommateError && <p className="text-center text-red-500">{roommateError}</p>}
        {!propertyLoading && !roommateLoading && !propertyError && !roommateError && (
          <div className="grid grid-cols-1 gap-8 max-w-[1200px] mx-auto sm:grid-cols-2 lg:grid-cols-4">
            {activeTab === 'find_room' ? (
              properties.length > 0 ? (
                properties.map((property) => (
                  <PropertyListingCard key={property._id} property={property} />
                ))
              ) : (
                <p className="text-center col-span-full text-gray-600">No properties found</p>
              )
            ) : (
              roommates.length > 0 ? (
                roommates.map((roommate) => (
                  <RoommateListingCard key={roommate._id} roommate={roommate} />
                ))
              ) : (
                <p className="text-center col-span-full text-gray-600">No roommates found</p>
              )
            )}
          </div>
        )}
      </section>

      {activeTab === 'find_roommate' && (
        <section className="py-12 px-6 bg-gray-100 md:px-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">All Roommates</h2>
          {roommateLoading && <p className="text-center">Loading roommates...</p>}
          {roommateError && <p className="text-center text-red-500">{roommateError}</p>}
          {!roommateLoading && !roommateError && (
            <div className="grid grid-cols-1 gap-8 max-w-[1200px] mx-auto sm:grid-cols-2 lg:grid-cols-4">
              {roommates.length > 0 ? (
                roommates.map((roommate) => (
                  <RoommateListingCard key={roommate._id} roommate={roommate} />
                ))
              ) : (
                <p className="text-center col-span-full text-gray-600">No roommates found</p>
              )}
            </div>
          )}
        </section>
      )}

      <section className="py-12 px-6 bg-white md:px-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">How Nestify Works</h2>
        <p className="text-gray-700 max-w-2xl mx-auto mb-8 text-base leading-relaxed text-center">
          Seamlessly find your next home or ideal roommate with our easy-to-use platform.
        </p>
        <div className="grid grid-cols-1 gap-8 max-w-[1000px] mx-auto md:grid-cols-3">
          <div className="p-6 rounded-lg shadow-md text-center flex flex-col items-center justify-center bg-blue-50">
            <Search size={48} className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Search & Discover</h3>
            <p className="text-gray-700 text-base leading-relaxed">Browse thousands of listings for rooms, houses, and compatible roommates.</p>
          </div>
          <div className="p-6 rounded-lg shadow-md text-center flex flex-col items-center justify-center bg-green-50">
            <MessageSquare size={48} className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect & Meet</h3>
            <p className="text-gray-700 text-base leading-relaxed">Connect directly with owners, brokers, or potential roommates. Share OTP for secure meetings.</p>
          </div>
          <div className="p-6 rounded-lg shadow-md text-center flex flex-col items-center justify-center bg-purple-50">
            <Home size={48} className="w-12 h-12 mx-auto mb-4 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Settle In</h3>
            <p className="text-gray-700 text-base leading-relaxed">Find your perfect match and settle into your new living situation with ease.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;