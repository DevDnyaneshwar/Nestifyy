// src/components/HeroSection.jsx
import React, { useState, useContext } from 'react';
import { Search, Filter, Home, Users, AlertCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const HeroSection = ({ initialSearch = '', activeTab: initialTab = 'find_room', onTabChange, onSearch }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [propertyType, setPropertyType] = useState('');
  const [gender, setGender] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('rent-low');
  const [searchError, setSearchError] = useState(null);
  const { trackInteraction } = useContext(AppContext);

  // Property types and gender options
  const propertyTypes = ['Apartment', 'House', 'Villa', 'Studio', 'PG'];
  const genderOptions = ['Male', 'Female', 'Other'];

  // Calculate active filters count
  const activeFiltersCount = [propertyType, gender, priceRange].filter(Boolean).length;

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery && activeTab === 'find_room' && !propertyType && !priceRange) {
      setSearchError('Please enter a search query or apply filters');
      return;
    }
    if (!trimmedQuery && activeTab === 'find_roommate' && !gender && !priceRange) {
      setSearchError('Please enter a search query or apply filters');
      return;
    }
    setSearchError(null);
    const params = new URLSearchParams();
    if (trimmedQuery) params.set('search', trimmedQuery);
    if (propertyType) params.set('propertyType', propertyType);
    if (gender) params.set('gender', gender);
    if (priceRange) params.set('priceRange', priceRange);
    params.set('sortBy', sortBy);
    trackInteraction('click', `search_button_${activeTab}`, {
      query: trimmedQuery,
      propertyType,
      gender,
      priceRange,
      sortBy,
    });
    onSearch(params.toString());
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setPropertyType('');
    setGender('');
    setPriceRange('');
    setSortBy('rent-low');
    setSearchError(null);
    onSearch('');
    trackInteraction('click', `clear_filters_${activeTab}`);
  };

  return (
    <main
      className="relative bg-cover bg-center h-[550px] flex items-center justify-center p-4 md:p-8 overflow-hidden rounded-xl shadow-2xl"
      style={{ backgroundImage: "url('https://placehold.co/1920x650/3B82F6/E0F2FE?text=Find+Your+Perfect+Nest')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-blue-900 opacity-80 rounded-xl shadow-2xl"></div>
      <div className="relative z-10 text-center text-white max-w-5xl w-full px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg animate-fade-in-up">
          Your Dream Home, Just a Click Away
        </h1>
        <p className="text-lg md:text-xl mb-10 opacity-90 animate-fade-in-up delay-100">
          Find rooms, houses, or perfect roommates tailored to your needs.
        </p>
        <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 w-full animate-fade-in-up delay-200">
          {/* Tabs */}
          <div className="flex justify-center mb-5 border-b-2 border-gray-100">
            <button
              className={`px-8 py-4 font-semibold text-lg rounded-t-xl transition-all duration-300 ease-in-out bg-transparent border-b-4 border-transparent cursor-pointer
                ${activeTab === 'find_room' ? 'text-blue-700 border-blue-700 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
              onClick={() => {
                setActiveTab('find_room');
                onTabChange('find_room');
                trackInteraction('click', 'search_tab_find_room');
                clearAllFilters();
              }}
            >
              <Home className="inline-block w-5 h-5 mr-2" />
              Find Room
            </button>
            <button
              className={`px-8 py-4 font-semibold text-lg rounded-t-xl transition-all duration-300 ease-in-out bg-transparent border-b-4 border-transparent cursor-pointer
                ${activeTab === 'find_roommate' ? 'text-blue-700 border-blue-700 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
              onClick={() => {
                setActiveTab('find_roommate');
                onTabChange('find_roommate');
                trackInteraction('click', 'search_tab_find_roommate');
                clearAllFilters();
              }}
            >
              <Users className="inline-block w-5 h-5 mr-2" />
              Find Roommate
            </button>
          </div>

          {/* Filters */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={
                      activeTab === 'find_room'
                        ? 'Search by location, city, or property type'
                        : 'Search by location or name'
                    }
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchError(null);
                    }}
                    onFocus={() => trackInteraction('focus', `search_input_${activeTab}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                  />
                </div>
              </div>

              {/* Filter Dropdowns */}
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Property Type / Gender Filter */}
                  <select
                    value={activeTab === 'find_room' ? propertyType : gender}
                    onChange={(e) =>
                      activeTab === 'find_room'
                        ? setPropertyType(e.target.value)
                        : setGender(e.target.value)
                    }
                    className="px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                  >
                    <option value="">
                      {activeTab === 'find_room' ? 'All Property Types' : 'Any Gender'}
                    </option>
                    {(activeTab === 'find_room' ? propertyTypes : genderOptions).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  {/* Price/Budget Range Filter */}
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                  >
                    <option value="">Any Price</option>
                    <option value="0-10000">₹0 - ₹10,000</option>
                    <option value="10000-20000">₹10,000 - ₹20,000</option>
                    <option value="20000-30000">₹20,000 - ₹30,000</option>
                    <option value="30000-50000">₹30,000 - ₹50,000</option>
                    <option value="50000+">Over ₹50,000</option>
                  </select>

                  {/* Sort Order */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                  >
                    <option value="rent-low">Rent: Low to High</option>
                    <option value="rent-high">Rent: High to Low</option>
                    <option value="popularity">Popularity</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters and Clear Button */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <span className="text-sm text-blue-700 font-medium">
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied
                </span>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="mt-4">
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl w-full md:w-auto"
            >
              <Search className="inline-block w-5 h-5 mr-2" />
              Search
            </button>
          </div>

          {/* Error Message */}
          {searchError && (
            <div className="bg-red-100 border border-red-300 text-red-600 px-4 py-2 rounded-lg mt-4 flex items-center gap-2">
              <AlertCircle size={20} className="w-5 h-5 flex-shrink-0" />
              <p>{searchError}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default HeroSection;