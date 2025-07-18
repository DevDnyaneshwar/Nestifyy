// src/components/PropertyListingCard.jsx

import React, { useContext } from 'react';
import { MapPin, Home, Bed, Bath } from 'lucide-react'; // Ensure Bed and Bath are imported from lucide-react, removed unused icons
import { AppContext } from '../context/AppContext';

const PropertyListingCard = ({ property }) => {
  const { trackInteraction } = useContext(AppContext);
  return (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden transform scale-100 transition-transform duration-300 cursor-pointer flex flex-col group hover:scale-105"
      onClick={() => trackInteraction('click', `property_card_${property.id}`)}
    >
     {property.imageUrls.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 hidden sm:flex space-x-1">
              {property.imageUrls.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleImageChange(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    currentImageIndex === index 
                      ? 'bg-white shadow-sm' 
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">{property.name}</h3>
        <p className="text-gray-600 flex items-center mb-3 text-sm">
          <MapPin size={16} className="mr-1 text-blue-500" /> {property.location}
        </p>
        <p className="text-2xl font-bold text-blue-600 mb-4">{property.price}</p>
        <div className="flex justify-between text-gray-700 text-sm border-t border-gray-200 pt-4 mt-auto">
          <div className="flex items-center">
            <Bed size={16} className="mr-1 text-gray-500" /> {property.beds} Beds
          </div>
          <div className="flex items-center">
            <Bath size={16} className="mr-1 text-gray-500" /> {property.baths} Baths
          </div>
          <div className="flex items-center">
            <Home size={16} className="mr-1 text-gray-500" /> {property.area}
          </div>
        </div>
        <button
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg border-none cursor-pointer transition-colors duration-200 text-base font-medium hover:bg-blue-700"
          onClick={(e) => { e.stopPropagation(); trackInteraction('click', `view_details_button_${property.id}`); }}
        >
          View Details
        </button>
      </div>
      {/* Removed the style tag as all styles are now Tailwind classes */}
    </div>
  );
};

export default PropertyListingCard;