// src/components/HeroSection.jsx
import React, { useState, useContext } from 'react';
import { Search } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState('find_room'); // 'find_room', 'find_roommate'
  const { trackInteraction } = useContext(AppContext);

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
          {/* Search Tabs */}
          <div className="flex justify-center mb-5 border-b-2 border-gray-100">
            <button
              className={`px-8 py-4 font-semibold text-lg rounded-t-xl transition-all duration-300 ease-in-out bg-transparent border-b-4 border-transparent cursor-pointer
                ${activeTab === 'find_room' ? 'text-blue-700 border-blue-700 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
              onClick={() => { setActiveTab('find_room'); trackInteraction('click', 'search_tab_find_room'); }}
            >
              Find Room
            </button>
            <button
              className={`px-8 py-4 font-semibold text-lg rounded-t-xl transition-all duration-300 ease-in-out bg-transparent border-b-4 border-transparent cursor-pointer
                ${activeTab === 'find_roommate' ? 'text-blue-700 border-blue-700 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
              onClick={() => { setActiveTab('find_roommate'); trackInteraction('click', 'search_tab_find_roommate'); }}
            >
              Find Roommate
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col items-center gap-4 md:flex-row md:space-x-4 md:space-y-0">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
              <input
                type="text"
                placeholder={activeTab === 'find_room' ? "Search by locality, area, or property type" : "Search roommate by city, gender, or interests"}
                className="w-full pl-12 pr-6 py-4 border border-gray-300 rounded-xl outline-none transition-all duration-200 text-gray-800 text-lg shadow-sm focus:border-blue-600 focus:ring-3 focus:ring-blue-300"
                onFocus={() => trackInteraction('focus', `search_input_${activeTab}`)}
                onKeyDown={(e) => { if (e.key === 'Enter') trackInteraction('keypress', `search_input_enter_${activeTab}`, { query: e.target.value }); }}
              />
            </div>
            <button
              className="bg-blue-600 text-white px-8 py-4 rounded-xl shadow-lg transition-all duration-300 w-full text-lg font-semibold border-none cursor-pointer hover:bg-blue-700 hover:scale-105 active:scale-95 md:w-auto"
              onClick={() => trackInteraction('click', `search_button_${activeTab}`)}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      {/* Tailwind CSS custom animations will need to be defined in your tailwind.config.js */}
    </main>
  );
};

export default HeroSection;