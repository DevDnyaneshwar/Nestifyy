import React, { useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Search, Home, Users } from 'lucide-react';

const HeroSection = ({ initialSearch = '', activeTab, onTabChange, onSearch }) => {
  const { trackInteraction } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [, setSearchParams] = useSearchParams();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    trackInteraction('input', `search_input_${activeTab}`, { value: e.target.value });
  };

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      trackInteraction('click', `search_button_${activeTab}`, { query: trimmedQuery });
      setSearchParams({ search: trimmedQuery });
      onSearch(trimmedQuery);
    } else {
      setSearchParams({});
      onSearch('');
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100 py-16 md:py-24 flex items-center justify-center min-h-[60vh]">
      <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
      <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-text-gray-800 mb-6 leading-tight">
          Find Your Perfect <span className="text-primary-blue">Home</span> or{' '}
          <span className="text-primary-green">Roommate</span>
        </h1>
        <p className="text-lg md:text-xl text-text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Discover verified listings and connect with compatible roommates to make your move seamless.
        </p>

        <div className="bg-card-bg rounded-2xl shadow-card-shadow p-6 md:p-8 max-w-3xl mx-auto border border-border-gray-300">
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-lg border border-border-gray-300 p-1 bg-bg-gray-50 shadow-sm">
              <button
                className={`px-6 py-3 text-base font-semibold rounded-md transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'find_room'
                    ? 'bg-primary-blue text-white shadow-md'
                    : 'text-text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => onTabChange('find_room')}
              >
                <Home size={20} /> Find Room
              </button>
              <button
                className={`px-6 py-3 text-base font-semibold rounded-md transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'find_roommate'
                    ? 'bg-primary-green text-white shadow-md'
                    : 'text-text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => onTabChange('find_roommate')}
              >
                <Users size={20} /> Find Roommate
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 max-w-2xl mx-auto">
            <div className="relative flex-grow">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-gray-400"
              />
              <input
                type="text"
                placeholder={activeTab === 'find_room' ? 'Search for rooms by city...' : 'Search for roommates by city...'}
                className="w-full px-4 py-3 pl-12 border border-border-gray-300 rounded-lg outline-none transition-all duration-200 text-base text-text-gray-800 bg-card-bg shadow-sm focus:border-primary-blue focus:ring-2 focus:ring-blue-300"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => trackInteraction('focus', `search_input_${activeTab}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-primary-blue text-white py-3 px-8 rounded-lg border-none cursor-pointer transition-all duration-300 font-semibold shadow-card-shadow inline-flex items-center gap-2 hover:bg-primary-blue-dark hover:scale-105 active:scale-95"
            >
              <Search size={20} /> Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;