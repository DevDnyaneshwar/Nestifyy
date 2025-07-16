// src/components/RoommateListingCard.jsx
import React, { useContext } from 'react';
import { MapPin, DollarSign, User, MessageCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const RoommateListingCard = ({ roommate }) => {
  const { trackInteraction } = useContext(AppContext);
  return (
    <div className="roommate-card"
         onClick={() => trackInteraction('click', `roommate_card_${roommate.id}`)}>
      <img
        src={roommate.imageUrl}
        alt={roommate.name}
        className="roommate-image"
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x260/D1FAE5/065F46?text=Roommate+Image'; }}
      />
      <div className="roommate-details-content">
        <h3 className="roommate-name">{roommate.name}</h3>
        <p className="roommate-location">
          <MapPin size={16} className="location-icon" /> {roommate.location}
        </p>
        <p className="roommate-info-line">
          <User size={16} className="info-icon" /> Looking for a room in: <span className="highlight-text">{roommate.lookingFor}</span>
        </p>
        <p className="roommate-info-line">
          <DollarSign size={16} className="info-icon" /> Budget: <span className="highlight-text">{roommate.budget}</span>
        </p>
        <button className="connect-button"
                onClick={(e) => { e.stopPropagation(); trackInteraction('click', `connect_button_${roommate.id}`); }}>
          <MessageCircle size={20} />
          <span>Connect</span>
        </button>
      </div>
      <style>{`
        /* Variables for consistency */
        :root {
          --card-bg: #fff;
          --card-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); /* shadow-xl */
          --card-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
          --card-hover-scale: 1.05;
          --text-gray-900: #1a202c;
          --text-gray-600: #4a5568;
          --text-gray-700: #2d3748;
          --text-gray-500: #a0aec0;
          --border-gray-100: #f7fafc;
          --green-200: #bbf7d0;
          --green-500: #22c55e;
          --green-600: #059669;
          --green-700: #047857;
        }

        .roommate-card {
          background-color: var(--card-bg);
          border-radius: 1rem; /* rounded-2xl */
          box-shadow: var(--card-shadow-xl);
          overflow: hidden;
          transform: scale(1); /* Initial scale */
          transition: transform 300ms ease-in-out; /* transition-transform duration-300 */
          cursor: pointer;
          border: 1px solid var(--border-gray-100); /* border border-gray-100 */
          display: flex;
          flex-direction: column;
        }
        .roommate-card:hover {
          transform: scale(var(--card-hover-scale)); /* hover:scale-105 */
          border-color: var(--green-200); /* hover:border-green-200 */
        }

        .roommate-image {
          width: 100%;
          height: 13rem; /* h-52 */
          object-fit: cover;
          transition: brightness 300ms ease-in-out; /* transition-all duration-300 */
        }
        .roommate-card:hover .roommate-image {
          filter: brightness(0.9); /* group-hover:brightness-90 */
        }

        .roommate-details-content {
          padding: 1.5rem; /* p-6 */
          flex-grow: 1; /* Ensures details section takes available space */
          display: flex;
          flex-direction: column;
        }

        .roommate-name {
          font-size: 1.5rem; /* text-2xl */
          font-weight: 700; /* font-bold */
          color: var(--text-gray-900);
          margin-bottom: 0.5rem; /* mb-2 */
          line-height: 1.25; /* leading-tight */
        }

        .roommate-location {
          color: var(--text-gray-600);
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem; /* mb-3 */
          font-size: 0.875rem; /* text-sm */
        }
        .location-icon {
          margin-right: 0.25rem; /* mr-1 */
          color: var(--green-500); /* text-green-500 */
        }

        .roommate-info-line {
          font-size: 1rem; /* text-md */
          color: var(--text-gray-700);
          margin-bottom: 0.5rem; /* mb-2 */
          display: flex;
          align-items: center;
        }
        .info-icon {
          margin-right: 0.5rem; /* mr-2 */
          color: var(--text-gray-500);
        }
        .highlight-text {
          font-weight: 600; /* font-semibold */
          margin-left: 0.25rem; /* ml-1 */
        }

        .connect-button {
          margin-top: 1.5rem; /* mt-6 */
          width: 100%;
          background-color: var(--green-600);
          color: #fff;
          padding: 0.75rem 1rem; /* py-3 */
          border-radius: 0.75rem; /* rounded-xl */
          border: none;
          cursor: pointer;
          transition: background-color 300ms ease-in-out, transform 300ms ease-in-out, box-shadow 300ms ease-in-out; /* transition-colors duration-300 */
          font-size: 1.125rem; /* text-lg */
          font-weight: 600; /* font-semibold */
          box-shadow: var(--card-shadow-md); /* shadow-md */
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem; /* space-x-2 */
        }
        .connect-button:hover {
          background-color: var(--green-700); /* hover:bg-green-700 */
          box-shadow: var(--card-shadow-xl); /* hover:shadow-lg */
          transform: scale(1.01); /* Adjusted slightly to avoid breaking layout, was hover:scale-100 */
        }
        .connect-button:active {
          transform: scale(0.98); /* active:scale-98 */
        }
      `}</style>
    </div>
  );
};

export default RoommateListingCard;
