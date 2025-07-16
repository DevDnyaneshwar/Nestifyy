// src/components/HeroSection.jsx
import React, { useState, useContext } from 'react';
import { Search } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState('find_room'); // 'find_room', 'find_roommate'
  const { trackInteraction } = useContext(AppContext);

  return (
    <main className="hero-section-main"
      style={{ backgroundImage: "url('https://placehold.co/1920x650/3B82F6/E0F2FE?text=Find+Your+Perfect+Nest')" }}>
      <div className="hero-overlay"></div>
      <div className="hero-content-wrapper">
        <h1 className="hero-title animate-fade-in-up">
          Your Dream Home, Just a Click Away
        </h1>
        <p className="hero-subtitle animate-fade-in-up delay-100">
          Find rooms, houses, or perfect roommates tailored to your needs.
        </p>
        <div className="search-card animate-fade-in-up delay-200">
          {/* Search Tabs */}
          <div className="search-tabs-container">
            <button
              className={`tab-button ${activeTab === 'find_room' ? 'tab-button-active' : ''}`}
              onClick={() => { setActiveTab('find_room'); trackInteraction('click', 'search_tab_find_room'); }}
            >
              Find Room
            </button>
            <button
              className={`tab-button ${activeTab === 'find_roommate' ? 'tab-button-active' : ''}`}
              onClick={() => { setActiveTab('find_roommate'); trackInteraction('click', 'search_tab_find_roommate'); }}
            >
              Find Roommate
            </button>
          </div>

          {/* Search Bar */}
          <div className="search-input-area">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={22} />
              <input
                type="text"
                placeholder={activeTab === 'find_room' ? "Search by locality, area, or property type" : "Search roommate by city, gender, or interests"}
                className="search-input"
                onFocus={() => trackInteraction('focus', `search_input_${activeTab}`)}
                onKeyDown={(e) => { if (e.key === 'Enter') trackInteraction('keypress', `search_input_enter_${activeTab}`, { query: e.target.value }); }}
              />
            </div>
            <button className="search-button"
                    onClick={() => trackInteraction('click', `search_button_${activeTab}`)}>
              Search
            </button>
          </div>
        </div>
      </div>
      <style>{`
        /* Root Variables for consistency */
        :root {
          --primary-blue: #2563eb; /* blue-600 */
          --primary-blue-dark: #1d4ed8; /* blue-700 */
          --primary-blue-light: #eff6ff; /* blue-50 */
          --primary-blue-darker: #1e3a8a; /* blue-900 */
          --text-gray-dark: #1f2937; /* gray-900 */
          --text-gray-medium: #4b5563; /* gray-700 */
          --text-gray-light: #6b7280; /* gray-600 */
          --border-gray: #e5e7eb; /* gray-200 */
          --bg-gray-light: #f9fafb; /* gray-50 */
          --blue-300: #93c5fd;
        }

        /* Hero Section Main Container */
        .hero-section-main {
          position: relative;
          background-size: cover;
          background-position: center;
          height: 550px; /* h-[550px] */
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem; /* p-4 */
          overflow: hidden;
        }
        @media (min-width: 768px) { /* md:p-8 */
          .hero-section-main {
            padding: 2rem;
          }
        }

        /* Overlay for background image */
        .hero-overlay {
          position: absolute;
          inset: 0; /* inset-0 */
          background-image: linear-gradient(to bottom right, #1d4ed8, #1e3a8a); /* from-blue-700 to-blue-900 */
          opacity: 0.8; /* opacity-80 */
          border-radius: 0.75rem; /* rounded-xl */
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); /* shadow-2xl */
        }

        /* Content Wrapper */
        .hero-content-wrapper {
          position: relative; /* z-10 */
          z-index: 10;
          text-align: center;
          color: #fff; /* text-white */
          max-width: 64rem; /* max-w-5xl */
          width: 100%;
          padding-left: 1rem; /* px-4 */
          padding-right: 1rem; /* px-4 */
        }

        /* Title */
        .hero-title {
          font-size: 2.25rem; /* text-4xl */
          font-weight: 800; /* font-extrabold */
          margin-bottom: 1.5rem; /* mb-6 */
          line-height: 1.2; /* leading-tight */
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); /* drop-shadow-lg */
        }
        @media (min-width: 768px) { /* md:text-6xl */
          .hero-title {
            font-size: 3.75rem;
          }
        }

        /* Subtitle */
        .hero-subtitle {
          font-size: 1.125rem; /* text-lg */
          margin-bottom: 2.5rem; /* mb-10 */
          opacity: 0.9; /* opacity-90 */
        }
        @media (min-width: 768px) { /* md:text-xl */
          .hero-subtitle {
            font-size: 1.25rem;
          }
        }

        /* Search Card Container */
        .search-card {
          background-color: #fff;
          border-radius: 1rem; /* rounded-2xl */
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); /* shadow-2xl */
          padding: 1rem; /* p-4 */
          width: 100%;
        }
        @media (min-width: 768px) { /* md:p-6 */
          .search-card {
            padding: 1.5rem;
          }
        }

        /* Search Tabs Container */
        .search-tabs-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1.25rem; /* mb-5 */
          border-bottom: 2px solid var(--border-gray); /* border-b-2 border-gray-100 */
        }
        .tab-button {
          padding: 1rem 2rem; /* px-8 py-4 */
          font-weight: 600; /* font-semibold */
          font-size: 1.125rem; /* text-lg */
          border-top-left-radius: 0.75rem; /* rounded-t-xl */
          border-top-right-radius: 0.75rem;
          transition-property: all;
          transition-duration: 300ms;
          transition-timing-function: ease-in-out;
          background-color: transparent;
          border: none;
          cursor: pointer;
          border-bottom: 4px solid transparent; /* default border for inactive */
          color: var(--text-gray-light); /* text-gray-600 */
        }
        .tab-button:hover {
          color: var(--primary-blue); /* hover:text-blue-600 */
          background-color: var(--bg-gray-light); /* hover:bg-gray-50 */
        }
        .tab-button-active {
          color: var(--primary-blue-dark); /* text-blue-700 */
          border-bottom-color: var(--primary-blue-dark); /* border-b-4 border-blue-700 */
          background-color: var(--primary-blue-light); /* bg-blue-50 */
        }

        /* Search Input Area */
        .search-input-area {
          display: flex;
          flex-direction: column; /* flex-col */
          align-items: center;
          gap: 1rem; /* space-y-4 */
          /* Removed padding here to prevent overflow */
        }
        @media (min-width: 768px) { /* md:flex-row md:space-y-0 md:space-x-4 */
          .search-input-area {
            flex-direction: row;
            gap: 1rem;
            margin-top: 0;
            margin-left: 0;
          }
        }

        .search-input-wrapper {
          position: relative;
          flex-grow: 1; /* flex-grow */
          width: 100%;
        }
        @media (min-width: 768px) { /* md:w-auto */
          .search-input-wrapper {
            width: auto;
          }
        }

        .search-icon {
          position: absolute;
          left: 1rem; /* left-4 */
          top: 50%;
          transform: translateY(-50%); /* -translate-y-1/2 */
          color: var(--text-gray-light); /* text-gray-400 */
        }
        .search-input {
          width: 100%;
          padding: 1rem 1.5rem 1rem 3rem; /* pl-12 pr-6 py-4 */
          border: 1px solid var(--border-gray); /* border border-gray-300 */
          border-radius: 0.75rem; /* rounded-xl */
          outline: none; /* focus:outline-none */
          transition-property: all;
          transition-duration: 200ms;
          color: var(--text-gray-dark); /* text-gray-800 */
          font-size: 1.125rem; /* text-lg */
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
          box-sizing: border-box; /* Ensure padding is included in the width */
        }
        .search-input:focus {
          border-color: var(--primary-blue); /* focus:ring-3 focus:ring-blue-300 */
          box-shadow: 0 0 0 3px var(--blue-300); /* focus ring effect */
        }

        .search-button {
          background-color: var(--primary-blue); /* bg-blue-600 */
          color: #fff; /* text-white */
          padding: 1rem 2rem; /* px-8 py-4 */
          border-radius: 0.75rem; /* rounded-xl */
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-lg */
          transition-property: background-color, transform;
          transition-duration: 300ms;
          width: 100%;
          font-size: 1.125rem; /* text-lg */
          font-weight: 600; /* font-semibold */
          border: none;
          cursor: pointer;
          box-sizing: border-box; /* Ensure padding is included in the width */
        }
        @media (min-width: 768px) { /* md:w-auto */
          .search-button {
            width: auto;
          }
        }
        .search-button:hover {
          background-color: var(--primary-blue-dark); /* hover:bg-blue-700 */
          transform: scale(1.05); /* hover:scale-105 */
        }
        .search-button:active {
          transform: scale(0.95); /* active:scale-95 */
        }

        /* Animations */
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-fade-in-up.delay-100 { animation-delay: 0.1s; }
        .animate-fade-in-up.delay-200 { animation-delay: 0.2s; }
      `}</style>
    </main>
  );
};

export default HeroSection;
