// src/components/Navbar.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Home, Map, ChevronDown, Menu, X, User, LogOut, ShieldCheck } from 'lucide-react';
import { AppContext } from '../context/Appcontext'; // Import AppContext

const Navbar = () => {
  const { isAuthenticated, isAdmin, trackInteraction, handleLogout } = useContext(AppContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Pune');
  const cityDropdownRef = useRef(null);

  // Cities for the dropdown
  const cities = ['Pune', 'Mumbai', 'Bengaluru', 'Delhi', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close city dropdown if click outside
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
        setIsCityDropdownOpen(false);
      }
      // Close mobile menu if click outside (and it's open)
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container') && !event.target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="navbar-container">
      {/* Logo */}
      <Link to="/" className="navbar-logo"
            onClick={() => trackInteraction('click', 'logo')}>
        <Home className="navbar-home-icon" size={28} strokeWidth={2.5} />
        <span className="navbar-brand-text">Nestify</span>
      </Link>

      {/* Mobile menu button */}
      <div className="mobile-menu-toggle">
        <button
          onClick={() => {
            setIsMobileMenuOpen(!isMobileMenuOpen);
            trackInteraction('click', `mobile_menu_toggle_${isMobileMenuOpen ? 'close' : 'open'}`);
          }}
          className="mobile-menu-button"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="icon-x" /> : <Menu className="icon-menu" />}
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="desktop-nav-links">
        {/* City Selector Dropdown */}
        <div className="city-dropdown-wrapper" ref={cityDropdownRef}>
          <button
            className="city-dropdown-button"
            onClick={() => {
              setIsCityDropdownOpen(!isCityDropdownOpen);
              trackInteraction('click', 'city_dropdown_toggle');
            }}
          >
            <Map size={18} className="city-map-icon" />
            <span className="city-selected-text">{selectedCity}</span>
            <ChevronDown size={16} className={`city-chevron-icon ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isCityDropdownOpen && (
            <div className="city-dropdown-menu animate-fade-in-down">
              <div className="city-dropdown-list">
                {cities.map((city) => (
                  <button
                    key={city}
                    className="city-dropdown-item"
                    onClick={() => {
                      setSelectedCity(city);
                      setIsCityDropdownOpen(false);
                      trackInteraction('click', `city_select_${city}`);
                    }}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <NavLink to="/find-room" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`} onClick={() => trackInteraction('click', 'nav_find_room')}>Find Room</NavLink>
        <NavLink to="/find-roommate" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`} onClick={() => trackInteraction('click', 'nav_find_roommate')}>Find Roommate</NavLink>
        <NavLink to="/list-property" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`} onClick={() => trackInteraction('click', 'nav_list_property')}>List Property</NavLink>
        <NavLink to="/broker-zone" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`} onClick={() => trackInteraction('click', 'nav_broker_zone')}>Broker Zone</NavLink>
        <NavLink to="/support" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`} onClick={() => trackInteraction('click', 'nav_support')}>Support</NavLink>

        {isAuthenticated ? (
          <>
            <div className="separator"></div>
            <NavLink to="/dashboard" className={({ isActive }) => `auth-link ${isActive ? 'auth-link-active' : ''}`} onClick={() => trackInteraction('click', 'nav_dashboard')}>
              <User className="auth-icon" />
              <span>Dashboard</span>
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin-panel" className={({ isActive }) => `auth-link ${isActive ? 'auth-link-active' : ''}`} onClick={() => trackInteraction('click', 'nav_admin_panel')}>
                <ShieldCheck className="auth-icon" />
                <span>Admin</span>
              </NavLink>
            )}
            <button
              onClick={() => {
                handleLogout();
                trackInteraction('click', 'logout_button');
              }}
              className="logout-button"
            >
              <LogOut className="auth-icon" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <div className="separator"></div>
            <Link to="/login" className="login-signup-button" onClick={() => trackInteraction('click', 'login_signup_button')}>
              Login/Signup
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu (Drawer) */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-container animate-slide-in-down">
          {/* City Selector in Mobile Menu */}
          <div className="mobile-city-dropdown-wrapper" ref={cityDropdownRef}>
            <button
              className="mobile-city-dropdown-button"
              onClick={() => {
                setIsCityDropdownOpen(!isCityDropdownOpen);
                trackInteraction('click', 'mobile_city_dropdown_toggle');
              }}
            >
              <span className="mobile-city-button-content">
                <Map size={20} className="mobile-city-map-icon" />
                <span className="mobile-city-selected-text">{selectedCity}</span>
              </span>
              <ChevronDown size={18} className={`mobile-city-chevron-icon ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isCityDropdownOpen && (
              <div className="mobile-city-dropdown-menu animate-fade-in-down">
                {cities.map((city) => (
                  <button
                    key={city}
                    className="mobile-city-dropdown-item"
                    onClick={() => {
                      setSelectedCity(city);
                      setIsCityDropdownOpen(false);
                      setIsMobileMenuOpen(false); // Close mobile menu on city selection
                      trackInteraction('click', `mobile_city_select_${city}`);
                    }}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mobile-nav-links">
            <NavLink to="/find-room" onClick={() => { setIsMobileMenuOpen(false); trackInteraction('click', 'mobile_nav_find_room'); }} className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}>Find Room</NavLink>
            <NavLink to="/find-roommate" onClick={() => { setIsMobileMenuOpen(false); trackInteraction('click', 'mobile_nav_find_roommate'); }} className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}>Find Roommate</NavLink>
            <NavLink to="/list-property" onClick={() => { setIsMobileMenuOpen(false); trackInteraction('click', 'mobile_nav_list_property'); }} className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}>List Property</NavLink>
            <NavLink to="/broker-zone" onClick={() => { setIsMobileMenuOpen(false); trackInteraction('click', 'mobile_nav_broker_zone'); }} className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}>Broker Zone</NavLink>
            <NavLink to="/support" onClick={() => { setIsMobileMenuOpen(false); trackInteraction('click', 'mobile_nav_support'); }} className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}>Support</NavLink>

            {isAuthenticated ? (
              <div className="mobile-auth-section">
                <NavLink to="/dashboard" onClick={() => { setIsMobileMenuOpen(false); trackInteraction('click', 'mobile_nav_dashboard'); }} className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}>Dashboard</NavLink>
                {isAdmin && (
                  <NavLink to="/admin-panel" onClick={() => { setIsMobileMenuOpen(false); trackInteraction('click', 'mobile_nav_admin_panel'); }} className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}>Admin</NavLink>
                )}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                    trackInteraction('click', 'mobile_logout_button');
                  }}
                  className="mobile-logout-button"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="mobile-login-section">
                <Link to="/login" onClick={() => { setIsMobileMenuOpen(false); trackInteraction('click', 'mobile_login_signup_button'); }} className="mobile-login-signup-button">
                  Login/Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      <style>{`
        /* Root Variables for consistency */
        :root {
          --primary-blue: #2563eb; /* blue-600 */
          --primary-blue-dark: #1d4ed8; /* blue-700 */
          --primary-blue-light: #eff6ff; /* blue-50 */
          --primary-blue-lighter: #dbeafe; /* blue-100 */
          --text-gray-dark: #1f2937; /* gray-900 */
          --text-gray-medium: #4b5563; /* gray-700 */
          --text-gray-light: #6b7280; /* gray-600 */
          --border-gray: #e5e7eb; /* gray-200 */
          --bg-gray-light: #f9fafb; /* gray-50 */
          --red-error: #dc2626; /* red-600 */
          --red-error-hover: #b91c1c; /* red-700 */
          --red-error-light: #fee2e2; /* red-100 */
        }

        /* General Navbar Container */
        .navbar-container {
          background-color: #fff;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-lg */
          padding: 1rem 1.5rem; /* py-4 px-6 */
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative; /* For z-index */
          z-index: 50;
        }
        @media (min-width: 768px) { /* md:px-12 */
          .navbar-container {
            padding-left: 3rem;
            padding-right: 3rem;
          }
        }

        /* Logo */
        .navbar-logo {
          font-size: 1.5rem; /* text-2xl */
          font-weight: 800; /* font-extrabold */
          display: flex;
          align-items: center;
          gap: 0.5rem; /* space-x-2 */
          color: var(--primary-blue-dark); /* text-blue-700 */
          transition-property: color;
          transition-duration: 300ms;
        }
        .navbar-logo:hover {
          color: var(--primary-blue-dark); /* hover:text-blue-800 */
        }
        .navbar-home-icon {
          color: var(--primary-blue); /* text-blue-600 */
        }
        .navbar-brand-text {
          color: var(--text-gray-dark); /* text-gray-800 */
        }

        /* Mobile Menu Toggle Button */
        .mobile-menu-toggle {
          display: none; /* hidden by default */
        }
        @media (max-width: 767px) { /* md:hidden */
          .mobile-menu-toggle {
            display: block;
          }
        }
        .mobile-menu-button {
          color: var(--text-gray-light); /* text-gray-600 */
          padding: 0.5rem; /* p-2 */
          border-radius: 0.375rem; /* rounded-md */
          transition-property: background-color, color;
          transition-duration: 150ms;
          background-color: transparent;
          border: none;
          cursor: pointer;
        }
        .mobile-menu-button:hover {
          color: var(--text-gray-dark); /* hover:text-gray-800 */
          background-color: var(--bg-gray-light); /* hover:bg-gray-100 */
        }
        .mobile-menu-button:focus {
          outline: none;
        }
        .icon-x, .icon-menu {
          width: 1.75rem; /* w-7 */
          height: 1.75rem; /* h-7 */
        }

        /* Desktop Navigation Links */
        .desktop-nav-links {
          display: none; /* hidden by default */
          align-items: center;
          gap: 2rem; /* space-x-8 */
        }
        @media (min-width: 768px) { /* md:flex */
          .desktop-nav-links {
            display: flex;
          }
        }

        /* City Selector Dropdown (Desktop) */
        .city-dropdown-wrapper {
          position: relative;
        }
        .city-dropdown-button {
          display: flex;
          align-items: center;
          padding: 0.5rem 1rem; /* px-4 py-2 */
          border-radius: 9999px; /* rounded-full */
          border: 1px solid var(--border-gray); /* border border-gray-200 */
          background-color: var(--bg-gray-light); /* bg-gray-50 */
          color: var(--text-gray-dark); /* text-gray-800 */
          font-size: 0.875rem; /* text-sm */
          font-weight: 500; /* font-medium */
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
          transition-property: background-color, box-shadow;
          transition-duration: 200ms;
          cursor: pointer;
        }
        .city-dropdown-button:hover {
          background-color: var(--primary-blue-lighter); /* hover:bg-gray-100 */
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* hover:shadow-md */
        }
        .city-map-icon {
          margin-right: 0.5rem; /* mr-2 */
          color: var(--primary-blue); /* text-blue-500 */
        }
        .city-selected-text {
          font-weight: 600; /* font-semibold */
        }
        .city-chevron-icon {
          margin-left: 0.5rem; /* ml-2 */
          transition-property: transform;
          transition-duration: 200ms;
        }
        .city-chevron-icon.rotate-180 {
          transform: rotate(180deg);
        }

        .city-dropdown-menu {
          position: absolute;
          top: 100%; /* top-full */
          left: 0;
          margin-top: 0.75rem; /* mt-3 */
          width: 14rem; /* w-56 */
          background-color: #fff;
          border: 1px solid var(--border-gray); /* border border-gray-200 */
          border-radius: 0.5rem; /* rounded-lg */
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-xl */
          z-index: 20;
          max-height: 15rem; /* max-h-60 */
          overflow-y: auto;
        }
        .city-dropdown-list {
          padding-top: 0.5rem; /* py-2 */
          padding-bottom: 0.5rem;
        }
        .city-dropdown-item {
          display: block;
          width: 100%;
          text-align: left;
          padding: 0.5rem 1rem; /* px-4 py-2 */
          color: var(--text-gray-medium); /* text-gray-700 */
          transition-property: background-color, color;
          transition-duration: 200ms;
          background-color: transparent;
          border: none;
          cursor: pointer;
          font-size: 0.875rem; /* text-sm */
        }
        .city-dropdown-item:hover {
          background-color: var(--primary-blue-light); /* hover:bg-blue-50 */
          color: var(--primary-blue); /* hover:text-blue-600 */
        }

        /* Main Navigation Links */
        .nav-link {
          font-weight: 500; /* font-medium */
          font-size: 1rem; /* text-base */
          padding: 0.5rem 0.75rem; /* py-2 px-3 */
          border-radius: 0.5rem; /* rounded-lg */
          transition-property: color, background-color, box-shadow;
          transition-duration: 200ms;
          color: var(--text-gray-medium); /* text-gray-700 */
        }
        .nav-link:hover {
          color: var(--primary-blue-dark); /* hover:text-blue-700 */
          background-color: var(--bg-gray-light); /* hover:bg-gray-50 */
        }
        .nav-link-active {
          color: var(--primary-blue-dark); /* text-blue-700 */
          background-color: var(--primary-blue-light); /* bg-blue-50 */
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
        }

        /* Separator */
        .separator {
          width: 1px; /* w-px */
          height: 1.5rem; /* h-6 */
          background-color: var(--border-gray); /* bg-gray-200 */
          margin-left: 0.5rem; /* mx-2 */
          margin-right: 0.5rem;
        }

        /* Authenticated Links (Dashboard, Admin, Logout) */
        .auth-link {
          display: flex;
          align-items: center;
          gap: 0.25rem; /* space-x-1 */
          padding: 0.5rem 1rem; /* px-4 py-2 */
          border-radius: 9999px; /* rounded-full */
          transition-property: all;
          transition-duration: 300ms;
          font-size: 0.875rem; /* text-sm */
          font-weight: 500; /* font-medium */
          color: var(--text-gray-medium); /* text-gray-700 */
        }
        .auth-link:hover {
          background-color: var(--primary-blue-light); /* hover:bg-blue-50 */
          color: var(--primary-blue-dark); /* hover:text-blue-700 */
        }
        .auth-link-active {
          background-color: var(--primary-blue); /* bg-blue-600 */
          color: #fff; /* text-white */
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
        }
        .auth-icon {
          width: 1rem; /* w-4 */
          height: 1rem; /* h-4 */
        }

        /* Logout Button */
        .logout-button {
          display: flex;
          align-items: center;
          gap: 0.25rem; /* space-x-1 */
          padding: 0.5rem 1rem; /* px-4 py-2 */
          border-radius: 9999px; /* rounded-full */
          background-color: var(--red-error); /* bg-red-600 */
          color: #fff; /* text-white */
          transition-property: background-color, box-shadow;
          transition-duration: 300ms;
          font-size: 0.875rem; /* text-sm */
          font-weight: 500; /* font-medium */
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
          border: none;
          cursor: pointer;
        }
        .logout-button:hover {
          background-color: var(--red-error-hover); /* hover:bg-red-700 */
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* hover:shadow-lg */
        }

        /* Login/Signup Button */
        .login-signup-button {
          padding: 0.5rem 1.25rem; /* px-5 py-2 */
          border-radius: 9999px; /* rounded-full */
          background-color: var(--primary-blue-light); /* bg-blue-50 */
          color: var(--primary-blue); /* text-blue-600 */
          transition-property: background-color, box-shadow;
          transition-duration: 300ms;
          font-size: 0.875rem; /* text-sm */
          font-weight: 600; /* font-semibold */
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
          text-align: center;
          display: inline-block; /* To apply padding/margin correctly */
        }
        .login-signup-button:hover {
          background-color: var(--primary-blue-lighter); /* hover:bg-blue-100 */
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* hover:shadow-md */
        }

        /* Mobile Menu (Drawer) - Container */
        .mobile-menu-container {
          display: none; /* hidden by default */
          position: absolute;
          top: 72px; /* Adjust based on navbar height */
          left: 0;
          width: 100%;
          background-color: #fff;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-xl */
          padding: 1.5rem 1rem; /* py-6 px-4 */
          border-top: 1px solid var(--border-gray); /* border-t border-gray-100 */
          z-index: 40;
          overflow-y: auto;
          max-height: calc(100vh - 72px); /* Max height to fit screen */
        }
        @media (max-width: 767px) { /* md:hidden */
          .mobile-menu-container {
            display: block; /* Show on mobile */
          }
        }

        /* Mobile City Selector Dropdown */
        .mobile-city-dropdown-wrapper {
          position: relative;
          margin-bottom: 1.5rem; /* mb-6 */
        }
        .mobile-city-dropdown-button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.75rem 1rem; /* px-4 py-3 */
          border-radius: 0.5rem; /* rounded-lg */
          background-color: var(--bg-gray-light); /* bg-gray-50 */
          color: var(--text-gray-dark); /* text-gray-800 */
          font-size: 1rem; /* text-base */
          font-weight: 500; /* font-medium */
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
          transition-property: background-color;
          transition-duration: 200ms;
          border: none;
          cursor: pointer;
        }
        .mobile-city-dropdown-button:hover {
          background-color: var(--primary-blue-lighter); /* hover:bg-gray-100 */
        }
        .mobile-city-button-content {
          display: flex;
          align-items: center;
        }
        .mobile-city-map-icon {
          margin-right: 0.75rem; /* mr-3 */
          color: var(--primary-blue); /* text-blue-500 */
        }
        .mobile-city-selected-text {
          font-weight: 600; /* font-semibold */
        }
        .mobile-city-chevron-icon {
          margin-left: 0.25rem; /* ml-1 */
          transition-property: transform;
          transition-duration: 200ms;
        }
        .mobile-city-chevron-icon.rotate-180 {
          transform: rotate(180deg);
        }

        .mobile-city-dropdown-menu {
          margin-top: 0.5rem; /* mt-2 */
          width: 100%;
          background-color: #fff;
          border: 1px solid var(--border-gray); /* border border-gray-200 */
          border-radius: 0.5rem; /* rounded-lg */
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-lg */
          z-index: 20;
          max-height: 15rem; /* max-h-60 */
          overflow-y: auto;
        }
        .mobile-city-dropdown-item {
          display: block;
          width: 100%;
          text-align: left;
          padding: 0.5rem 1rem; /* px-4 py-2 */
          color: var(--text-gray-medium); /* text-gray-700 */
          transition-property: background-color, color;
          transition-duration: 200ms;
          background-color: transparent;
          border: none;
          cursor: pointer;
          font-size: 1rem; /* text-base */
        }
        .mobile-city-dropdown-item:hover {
          background-color: var(--primary-blue-light); /* hover:bg-blue-50 */
          color: var(--primary-blue-dark); /* hover:text-blue-600 */
        }

        /* Mobile Navigation Links */
        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem; /* space-y-2 */
        }
        .mobile-nav-link {
          display: block;
          padding: 0.75rem 1rem; /* px-4 py-3 */
          border-radius: 0.5rem; /* rounded-lg */
          transition-property: color, background-color;
          transition-duration: 200ms;
          font-size: 1rem; /* text-base */
          color: var(--text-gray-medium); /* text-gray-700 */
        }
        .mobile-nav-link:hover {
          background-color: var(--bg-gray-light); /* hover:bg-gray-50 */
          color: var(--primary-blue-dark); /* hover:text-blue-700 */
        }
        .mobile-nav-link-active {
          color: var(--primary-blue-dark); /* text-blue-700 */
          background-color: var(--primary-blue-light); /* bg-blue-50 */
          font-weight: 600; /* font-semibold */
        }

        /* Mobile Authenticated Section */
        .mobile-auth-section {
          margin-top: 1rem; /* mt-4 */
          padding-top: 1rem; /* pt-4 */
          border-top: 1px solid var(--border-gray); /* border-t border-gray-100 */
          display: flex;
          flex-direction: column;
          gap: 0.5rem; /* space-y-2 */
        }

        /* Mobile Logout Button */
        .mobile-logout-button {
          display: block;
          width: 100%;
          text-align: left;
          padding: 0.75rem 1rem; /* px-4 py-3 */
          border-radius: 0.5rem; /* rounded-lg */
          color: var(--red-error); /* text-red-600 */
          transition-property: background-color, color;
          transition-duration: 200ms;
          font-size: 1rem; /* text-base */
          font-weight: 500; /* font-medium */
          background-color: transparent;
          border: none;
          cursor: pointer;
        }
        .mobile-logout-button:hover {
          background-color: var(--red-error-light); /* hover:bg-red-50 */
          color: var(--red-error-hover); /* hover:text-red-700 */
        }

        /* Mobile Login/Signup Section */
        .mobile-login-section {
          margin-top: 1rem; /* mt-4 */
          padding-top: 1rem; /* pt-4 */
          border-top: 1px solid var(--border-gray); /* border-t border-gray-100 */
          display: flex;
          flex-direction: column;
          gap: 0.75rem; /* space-y-3 */
          padding-left: 1rem; /* px-4 */
          padding-right: 1rem; /* px-4 */
        }
        .mobile-login-signup-button {
          padding: 0.75rem 1.25rem; /* px-5 py-3 */
          text-align: center;
          color: var(--primary-blue); /* text-blue-600 */
          background-color: var(--primary-blue-light); /* bg-blue-50 */
          border-radius: 9999px; /* rounded-full */
          transition-property: background-color;
          transition-duration: 200ms;
          font-weight: 600; /* font-semibold */
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
          display: block; /* For full width */
        }
        .mobile-login-signup-button:hover {
          background-color: var(--primary-blue-lighter); /* hover:bg-blue-100 */
        }

        /* Animations */
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-down {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in-down { animation: fade-in-down 0.3s ease-out forwards; }
        .animate-slide-in-down { animation: slide-in-down 0.3s ease-out forwards; }
      `}</style>
    </nav>
  );
};

export default Navbar;
