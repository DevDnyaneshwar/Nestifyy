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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State to store search query results
  const [searchResults, setSearchResults] = useState(null);

  // Fetch properties from backend
  useEffect(() => {
    trackInteraction('page_view', 'home_page');
    fetchProperties();
  }, [trackInteraction]);

  const fetchProperties = async (query = '') => {
    try {
      setLoading(true);
      const url = query
        ? `https://nestifyy-my3u.onrender.com/api/property/all?search=${encodeURIComponent(query)}`
        : 'https://nestifyy-my3u.onrender.com/api/property/all';
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setProperties(data.properties.slice(0, 4)); 
        setSearchResults(null); 
      } else {
        setError(data.message || 'Failed to fetch properties');
      }
    } catch (err) {
      setError('Error fetching properties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search results from HeroSection
  const handleSearch = (query) => {
    if (query) {
      fetchProperties(query);
    } else {
      fetchProperties(); // Reset to default properties
    }
  };

  // Hardcoded roommates (since no backend for roommates yet)
  const featuredRoommates = [
    { id: 1, name: 'Anjali S.', location: 'Mumbai', lookingFor: 'Bandra, Andheri', budget: '₹ 15,000', imageUrl: 'https://placehold.co/400x250/F0F9FF/0284C7?text=Anjali' },
    { id: 2, name: 'Rahul K.', location: 'Bengaluru', lookingFor: 'Koramangala, Indiranagar', budget: '₹ 12,000', imageUrl: 'https://placehold.co/400x250/ECFDF5/059669?text=Rahul' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-inter antialiased flex flex-col">
      <HeroSection onSearch={handleSearch} />

      <section className="py-12 px-6 bg-white md:px-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Featured Rooms & Properties</h2>
        {loading && <p className="text-center">Loading properties...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-8 max-w-[1200px] mx-auto sm:grid-cols-2 lg:grid-cols-4">
            {(searchResults || properties).map((property) => (
              <PropertyListingCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </section>

      <section className="py-12 px-6 bg-gray-100 md:px-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Featured Roommates</h2>
        <div className="grid grid-cols-1 gap-8 max-w-[1200px] mx-auto sm:grid-cols-2 lg:grid-cols-4">
          {featuredRoommates.map((roommate) => (
            <RoommateListingCard key={roommate.id} roommate={roommate} />
          ))}
        </div>
      </section>

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