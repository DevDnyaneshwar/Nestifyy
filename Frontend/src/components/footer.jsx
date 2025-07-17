// src/components/Footer.jsx
import React, { useContext } from 'react';
import { AppContext} from '../context/AppContext';
import { Home, FacebookIcon, MapPin, PhoneCall, Mail, Twitter, Linkedin } from 'lucide-react'; // Import icons for social media

const Footer = () => {
  const { trackInteraction } = useContext(AppContext);
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-6 rounded-t-xl shadow-inner mt-12 md:px-12">
      <div className="grid grid-cols-1 gap-10 max-w-screen-xl mx-auto md:grid-cols-4">
        {/* Nestify Brand Info */}
        <div className="md:col-span-1">
          <div className="flex items-center mb-4">
            <Home className="text-blue-400 mr-2" size={32} strokeWidth={2.5} />
            <h3 className="text-white font-extrabold text-2xl">Nestify</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your ultimate platform for finding perfect rooms and roommates, simplifying your housing journey.
          </p>
          <div className="flex space-x-4 mt-6">
            <a href="#" className="text-gray-400 transition-colors duration-200 hover:text-blue-400" onClick={() => trackInteraction('click', 'footer_social_facebook')} aria-label="Facebook">
              <FacebookIcon size={24} />
            </a>
            <a href="#" className="text-gray-400 transition-colors duration-200 hover:text-blue-400" onClick={() => trackInteraction('click', 'footer_social_twitter')} aria-label="Twitter">
              <Twitter size={24} />
            </a>
            <a href="#" className="text-gray-400 transition-colors duration-200 hover:text-blue-400" onClick={() => trackInteraction('click', 'footer_social_linkedin')} aria-label="LinkedIn">
              <Linkedin size={24} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-lg mb-5 border-b border-gray-700 pb-2">Quick Links</h4>
          <ul className="list-none p-0 m-0 flex flex-col space-y-3 text-sm">
            <li><a href="#" className="text-gray-400 no-underline transition-colors duration-200 hover:text-white" onClick={() => trackInteraction('click', 'footer_about_us')}>About Us</a></li>
            <li><a href="#" className="text-gray-400 no-underline transition-colors duration-200 hover:text-white" onClick={() => trackInteraction('click', 'footer_how_it_works')}>How It Works</a></li>
            <li><a href="#" className="text-gray-400 no-underline transition-colors duration-200 hover:text-white" onClick={() => trackInteraction('click', 'footer_faq')}>FAQ</a></li>
            <li><a href="#" className="text-gray-400 no-underline transition-colors duration-200 hover:text-white" onClick={() => trackInteraction('click', 'footer_terms_conditions')}>Terms & Conditions</a></li>
            <li><a href="#" className="text-gray-400 no-underline transition-colors duration-200 hover:text-white" onClick={() => trackInteraction('click', 'footer_privacy_policy')}>Privacy Policy</a></li>
          </ul>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-white font-bold text-lg mb-5 border-b border-gray-700 pb-2">Explore</h4>
          <ul className="list-none p-0 m-0 flex flex-col space-y-3 text-sm">
            <li><a href="#" className="text-gray-400 no-underline transition-colors duration-200 hover:text-white" onClick={() => trackInteraction('click', 'footer_find_room_link')}>Find Room</a></li>
            <li><a href="#" className="text-gray-400 no-underline transition-colors duration-200 hover:text-white" onClick={() => trackInteraction('click', 'footer_find_roommate_link')}>Find Roommate</a></li>
            <li><a href="#" className="text-gray-400 no-underline transition-colors duration-200 hover:text-white" onClick={() => trackInteraction('click', 'footer_list_property_link')}>List Property</a></li>
            <li><a href="#" className="text-gray-400 no-underline transition-colors duration-200 hover:text-white" onClick={() => trackInteraction('click', 'footer_broker_zone_link')}>Broker Zone</a></li>
            <li><a href="#" className="text-gray-400 no-underline transition-colors duration-200 hover:text-white" onClick={() => trackInteraction('click', 'footer_cities_link')}>Cities</a></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h4 className="text-white font-bold text-lg mb-5 border-b border-gray-700 pb-2">Contact Us</h4>
          <address className="not-italic text-gray-400 text-sm flex flex-col space-y-3">
            <p className="flex items-start leading-tight">
              <MapPin size={18} className="text-blue-400 mr-2 flex-shrink-0 mt-px" />
              123 Nestify Towers, Tech City,<br/> Pune, Maharashtra, India
            </p>
            <p className="flex items-start leading-tight">
              <PhoneCall size={18} className="text-blue-400 mr-2 flex-shrink-0 mt-px" />
              +91 98765 43210
            </p>
            <p className="flex items-start leading-tight">
              <Mail size={18} className="text-blue-400 mr-2 flex-shrink-0 mt-px" />
              support@nestify.com
            </p>
          </address>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Nestify. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;