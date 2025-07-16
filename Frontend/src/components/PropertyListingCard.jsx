// src/components/PropertyListingCard.jsx

import React, { useContext } from 'react';
import { Building, Users, MapPin, Home, Bed, Bath, DollarSign } from 'lucide-react'; // Ensure Bed and Bath are imported from lucide-react
import { AppContext } from '../context/AppContext';
const PropertyListingCard = ({ property }) => {
  const { trackInteraction } = useContext(AppContext);
  return (
    <div className="property-card"
         onClick={() => trackInteraction('click', `property_card_${property.id}`)}>
      <img
        src={property.imageUrl}
        alt={property.name}
        className="property-image"
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x250/E0E7FF/4338CA?text=No+Image'; }}
      />
      <div className="property-details">
        <h3 className="property-title">{property.name}</h3>
        <p className="property-location">
          <MapPin size={16} className="location-icon" /> {property.location}
        </p>
        <p className="property-price">{property.price}</p>
        <div className="property-features">
          <div className="feature-item">
            <Bed size={16} className="feature-icon" /> {property.beds} Beds
          </div>
          <div className="feature-item">
            <Bath size={16} className="feature-icon" /> {property.baths} Baths
          </div>
          <div className="feature-item">
            <Home size={16} className="feature-icon" /> {property.area}
          </div>
        </div>
        <button className="view-details-button"
                onClick={(e) => { e.stopPropagation(); trackInteraction('click', `view_details_button_${property.id}`); }}>
          View Details
        </button>
      </div>
      <style>{`
        /* Variables for consistency */
        :root {
          --card-bg: #fff;
          --card-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
          --card-hover-scale: 1.05;
          --text-gray-900: #1a202c;
          --text-gray-600: #4a5568;
          --text-gray-700: #2d3748;
          --text-gray-500: #a0aec0;
          --blue-600: #2563eb;
          --blue-700: #1d4ed8;
          --blue-500: #3b82f6;
          --border-gray-200: #edf2f7;
        }

        .property-card {
          background-color: var(--card-bg);
          border-radius: 0.75rem; /* rounded-xl */
          box-shadow: var(--card-shadow);
          overflow: hidden;
          transform: scale(1); /* Initial scale */
          transition: transform 300ms ease-in-out; /* transition-transform duration-300 */
          cursor: pointer;
          display: flex;
          flex-direction: column;
        }
        .property-card:hover {
          transform: scale(var(--card-hover-scale)); /* hover:scale-105 */
        }

        .property-image {
          width: 100%;
          height: 12rem; /* h-48 */
          object-fit: cover;
          transition: brightness 300ms ease-in-out; /* transition-all duration-300 */
        }
        .property-card:hover .property-image {
          filter: brightness(0.9); /* group-hover:brightness-90 */
        }

        .property-details {
          padding: 1.25rem; /* p-5 */
          flex-grow: 1; /* Ensures details section takes available space */
          display: flex;
          flex-direction: column;
        }

        .property-title {
          font-size: 1.25rem; /* text-xl */
          font-weight: 600; /* font-semibold */
          color: var(--text-gray-900);
          margin-bottom: 0.5rem; /* mb-2 */
          line-height: 1.3;
        }

        .property-location {
          color: var(--text-gray-600);
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem; /* mb-3 */
          font-size: 0.875rem; /* text-sm */
        }
        .location-icon {
          margin-right: 0.25rem; /* mr-1 */
          color: var(--blue-500);
        }

        .property-price {
          font-size: 1.5rem; /* text-2xl */
          font-weight: 700; /* font-bold */
          color: var(--blue-600);
          margin-bottom: 1rem; /* mb-4 */
        }

        .property-features {
          display: flex;
          justify-content: space-between;
          color: var(--text-gray-700);
          font-size: 0.875rem; /* text-sm */
          border-top: 1px solid var(--border-gray-200); /* border-t border-gray-200 */
          padding-top: 1rem; /* pt-4 */
          margin-top: auto; /* Pushes features to the bottom if content above varies */
        }
        .feature-item {
          display: flex;
          align-items: center;
        }
        .feature-icon {
          margin-right: 0.25rem; /* mr-1 */
          color: var(--text-gray-500);
        }

        .view-details-button {
          margin-top: 1rem; /* mt-4 */
          width: 100%;
          background-color: var(--blue-600);
          color: #fff;
          padding: 0.5rem 1rem; /* py-2 px-4 */
          border-radius: 0.5rem; /* rounded-lg */
          border: none;
          cursor: pointer;
          transition: background-color 200ms ease-in-out; /* transition-colors */
          font-size: 1rem; /* text-base */
          font-weight: 500;
        }
        .view-details-button:hover {
          background-color: var(--blue-700); /* hover:bg-blue-700 */
        }
      `}</style>
    </div>
  );
};

export default PropertyListingCard;
