// src/components/Footer.jsx
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Home, FacebookIcon, MapPin, PhoneCall, Mail, Twitter, Linkedin } from 'lucide-react'; // Import icons for social media

const Footer = () => {
  const { trackInteraction } = useContext(AppContext);
  return (
    <footer className="footer-container">
      <div className="footer-content-grid">
        {/* Nestify Brand Info */}
        <div className="footer-brand-info">
          <div className="footer-logo-wrapper">
            <Home className="footer-home-icon" size={32} strokeWidth={2.5} />
            <h3 className="footer-brand-text">Nestify</h3>
          </div>
          <p className="footer-description">
            Your ultimate platform for finding perfect rooms and roommates, simplifying your housing journey.
          </p>
          <div className="footer-social-links">
            <a href="#" className="social-icon-link" onClick={() => trackInteraction('click', 'footer_social_facebook')} aria-label="Facebook">
              <FacebookIcon size={24} />
            </a>
            <a href="#" className="social-icon-link" onClick={() => trackInteraction('click', 'footer_social_twitter')} aria-label="Twitter">
              <Twitter size={24} />
            </a>
            <a href="#" className="social-icon-link" onClick={() => trackInteraction('click', 'footer_social_linkedin')} aria-label="LinkedIn">
              <Linkedin size={24} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4 className="footer-section-title">Quick Links</h4>
          <ul className="footer-list">
            <li><a href="#" className="footer-link" onClick={() => trackInteraction('click', 'footer_about_us')}>About Us</a></li>
            <li><a href="#" className="footer-link" onClick={() => trackInteraction('click', 'footer_how_it_works')}>How It Works</a></li>
            <li><a href="#" className="footer-link" onClick={() => trackInteraction('click', 'footer_faq')}>FAQ</a></li>
            <li><a href="#" className="footer-link" onClick={() => trackInteraction('click', 'footer_terms_conditions')}>Terms & Conditions</a></li>
            <li><a href="#" className="footer-link" onClick={() => trackInteraction('click', 'footer_privacy_policy')}>Privacy Policy</a></li>
          </ul>
        </div>

        {/* Explore */}
        <div className="footer-section">
          <h4 className="footer-section-title">Explore</h4>
          <ul className="footer-list">
            <li><a href="#" className="footer-link" onClick={() => trackInteraction('click', 'footer_find_room_link')}>Find Room</a></li>
            <li><a href="#" className="footer-link" onClick={() => trackInteraction('click', 'footer_find_roommate_link')}>Find Roommate</a></li>
            <li><a href="#" className="footer-link" onClick={() => trackInteraction('click', 'footer_list_property_link')}>List Property</a></li>
            <li><a href="#" className="footer-link" onClick={() => trackInteraction('click', 'footer_broker_zone_link')}>Broker Zone</a></li>
            <li><a href="#" className="footer-link" onClick={() => trackInteraction('click', 'footer_cities_link')}>Cities</a></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="footer-section">
          <h4 className="footer-section-title">Contact Us</h4>
          <address className="footer-contact-address">
            <p className="contact-item">
              <MapPin size={18} className="contact-icon" />
              123 Nestify Towers, Tech City,<br/> Pune, Maharashtra, India
            </p>
            <p className="contact-item">
              <PhoneCall size={18} className="contact-icon" />
              +91 98765 43210
            </p>
            <p className="contact-item">
              <Mail size={18} className="contact-icon" />
              support@nestify.com
            </p>
          </address>
        </div>
      </div>
      <div className="footer-copyright">
        &copy; {new Date().getFullYear()} Nestify. All rights reserved.
      </div>
      <style>{`
        /* Variables for consistency */
        :root {
          --footer-bg: #1f2937; /* gray-900 */
          --footer-text-light: #d1d5db; /* gray-300 */
          --footer-text-medium: #9ca3af; /* gray-400 */
          --footer-text-dark: #6b7280; /* gray-500 */
          --footer-border: #374151; /* gray-700 */
          --blue-400: #60a5fa;
          --link-hover-color: #fff;
        }

        .footer-container {
          background-color: var(--footer-bg);
          color: var(--footer-text-light);
          padding: 2.5rem 1.5rem; /* py-10 px-6 */
          border-top-left-radius: 0.75rem; /* rounded-t-xl */
          border-top-right-radius: 0.75rem;
          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); /* shadow-inner */
          margin-top: 3rem; /* mt-12 */
        }
        @media (min-width: 768px) { /* md:px-12 */
          .footer-container {
            padding-left: 3rem;
            padding-right: 3rem;
          }
        }

        .footer-content-grid {
          display: grid;
          grid-template-columns: 1fr; /* grid-cols-1 */
          gap: 2.5rem; /* gap-10 */
          max-width: 1200px; /* container mx-auto */
          margin-left: auto;
          margin-right: auto;
        }
        @media (min-width: 768px) { /* md:grid-cols-4 */
          .footer-content-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        /* Brand Info Section */
        .footer-brand-info {
          /* md:col-span-1 is handled by grid-template-columns */
        }

        .footer-logo-wrapper {
          display: flex;
          align-items: center;
          margin-bottom: 1rem; /* mb-4 */
        }
        .footer-home-icon {
          color: var(--blue-400);
          margin-right: 0.5rem; /* mr-2 */
        }
        .footer-brand-text {
          color: #fff;
          font-weight: 800; /* font-extrabold */
          font-size: 1.5rem; /* text-2xl */
        }

        .footer-description {
          color: var(--footer-text-medium);
          font-size: 0.875rem; /* text-sm */
          line-height: 1.6; /* leading-relaxed */
        }

        .footer-social-links {
          display: flex;
          gap: 1rem; /* space-x-4 */
          margin-top: 1.5rem; /* mt-6 */
        }
        .social-icon-link {
          color: var(--footer-text-medium);
          transition: color 200ms ease-in-out; /* transition-colors duration-200 */
        }
        .social-icon-link:hover {
          color: var(--blue-400);
        }

        /* General Section Styling (Quick Links, Explore, Contact Us) */
        .footer-section {
          /* No specific styles needed here, handled by grid */
        }

        .footer-section-title {
          color: #fff;
          font-weight: 700; /* font-bold */
          font-size: 1.125rem; /* text-lg */
          margin-bottom: 1.25rem; /* mb-5 */
          border-bottom: 1px solid var(--footer-border); /* border-b border-gray-700 */
          padding-bottom: 0.5rem; /* pb-2 */
        }

        .footer-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem; /* space-y-3 */
          font-size: 0.875rem; /* text-sm */
        }
        .footer-link {
          color: var(--footer-text-medium);
          text-decoration: none;
          transition: color 200ms ease-in-out; /* transition-colors duration-200 */
        }
        .footer-link:hover {
          color: var(--link-hover-color); /* hover:text-white */
        }

        /* Contact Address Section */
        .footer-contact-address {
          font-style: normal; /* not-italic */
          color: var(--footer-text-medium);
          font-size: 0.875rem; /* text-sm */
          display: flex;
          flex-direction: column;
          gap: 0.75rem; /* space-y-3 */
        }
        .contact-item {
          display: flex;
          align-items: flex-start; /* Align icon and text at the top */
          line-height: 1.4;
        }
        .contact-icon {
          margin-right: 0.5rem; /* mr-2 */
          color: var(--blue-400);
          flex-shrink: 0; /* Prevent icon from shrinking */
          margin-top: 2px; /* Small adjustment for visual alignment */
        }

        /* Copyright Section */
        .footer-copyright {
          margin-top: 3rem; /* mt-12 */
          padding-top: 2rem; /* pt-8 */
          border-top: 1px solid var(--footer-border); /* border-t border-gray-700 */
          text-align: center;
          color: var(--footer-text-dark);
          font-size: 0.875rem; /* text-sm */
        }
      `}</style>
    </footer>
  );
};

export default Footer;
