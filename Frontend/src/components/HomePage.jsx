// src/components/HomePage.jsx
import React, { useEffect, useContext } from 'react';
import { Search, MessageSquare, Home } from 'lucide-react';
import { AppContext } from '../context/AppContext'; // Import AppContext
import HeroSection from './Herosection'; // Assuming this is now pure CSS
import PropertyListingCard from './PropertyListingCard'; // Assuming this is now pure CSS
import RoommateListingCard from './RoommateListingCard'; // Assuming this is now pure CSS

const HomePage = () => {
  const { trackInteraction } = useContext(AppContext);
  useEffect(() => {
    trackInteraction('page_view', 'home_page');
  }, [trackInteraction]);

  const featuredProperties = [
    { id: 1, name: 'Cozy 2BHK Apartment', location: 'Koregaon Park, Pune', price: '₹ 35,000/month', imageUrl: 'https://placehold.co/400x250/E0E7FF/4338CA?text=Apartment', beds: 2, baths: 2, area: '1000 sqft' },
    { id: 2, name: 'Spacious 3BHK Villa', location: 'Whitefield, Bengaluru', price: '₹ 60,000/month', imageUrl: 'https://placehold.co/400x250/D1FAE5/065F46?text=Villa', beds: 3, baths: 3, area: '2000 sqft' },
    { id: 3, name: 'Shared Room near Uni', location: 'North Campus, Delhi', price: '₹ 8,000/month', imageUrl: 'https://placehold.co/400x250/FFFBEB/92400E?text=Shared+Room', beds: 1, baths: 1, area: '250 sqft' },
    { id: 4, name: 'Studio Flat', location: 'Bandra, Mumbai', price: '₹ 28,000/month', imageUrl: 'https://placehold.co/400x250/FEE2E2/991B1B?text=Studio+Flat', beds: 1, baths: 1, area: '450 sqft' },
  ];

  const featuredRoommates = [
    { id: 1, name: 'Anjali S.', location: 'Mumbai', lookingFor: 'Bandra, Andheri', budget: '₹ 15,000', imageUrl: 'https://placehold.co/400x250/F0F9FF/0284C7?text=Anjali' },
    { id: 2, name: 'Rahul K.', location: 'Bengaluru', lookingFor: 'Koramangala, Indiranagar', budget: '₹ 12,000', imageUrl: 'https://placehold.co/400x250/ECFDF5/059669?text=Rahul' },
  ];

  return (
    <div className="homepage-container">
      <HeroSection />

      <section className="section-properties">
        <h2 className="section-title">Featured Rooms & Properties</h2>
        <div className="properties-grid">
          {featuredProperties.map((property) => (
            <PropertyListingCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      <section className="section-roommates">
        <h2 className="section-title">Featured Roommates</h2>
        <div className="roommates-grid">
          {featuredRoommates.map((roommate) => (
            <RoommateListingCard key={roommate.id} roommate={roommate} />
          ))}
        </div>
      </section>

      {/* How it works section */}
      <section className="section-how-it-works">
        <h2 className="section-title">How Nestify Works</h2>
        <p className="how-it-works-subtitle">
          Seamlessly find your next home or ideal roommate with our easy-to-use platform.
        </p>
        <div className="steps-grid">
          <div className="step-card step-card-blue">
            <Search size={48} className="step-icon" />
            <h3 className="step-title">Search & Discover</h3>
            <p className="step-description">Browse thousands of listings for rooms, houses, and compatible roommates.</p>
          </div>
          <div className="step-card step-card-green">
            <MessageSquare size={48} className="step-icon" />
            <h3 className="step-title">Connect & Meet</h3>
            <p className="step-description">Connect directly with owners, brokers, or potential roommates. Share OTP for secure meetings.</p>
          </div>
          <div className="step-card step-card-purple">
            <Home size={48} className="step-icon" />
            <h3 className="step-title">Settle In</h3>
            <p className="step-description">Find your perfect match and settle into your new living situation with ease.</p>
          </div>
        </div>
      </section>
      <style>{`
        /* Variables for consistency */
        :root {
          --primary-blue: #2563eb; /* blue-600 */
          --primary-blue-light: #eff6ff; /* blue-50 */
          --text-gray-800: #1f2937;
          --text-gray-600: #4a5568;
          --bg-gray-50: #f9fafb;
          --bg-gray-100: #f3f4f6;
          --green-50: #ecfdf5; /* green-50 */
          --green-600: #059669; /* green-600 */
          --purple-50: #f5f3ff; /* purple-50 */
          --purple-600: #9333ea; /* purple-600 */
          --card-bg: #fff;
          --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
        }

        .homepage-container {
          min-height: 100vh;
          background-color: var(--bg-gray-50);
          font-family: 'Inter', sans-serif; /* Assuming Inter font is loaded globally */
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          display: flex;
          flex-direction: column;
        }

        /* Section Styling */
        .section-properties,
        .section-how-it-works {
          padding: 3rem 1.5rem; /* py-12 px-6 */
          background-color: var(--card-bg);
        }
        @media (min-width: 768px) { /* md:px-12 */
          .section-properties,
          .section-how-it-works {
            padding-left: 3rem;
            padding-right: 3rem;
          }
        }

        .section-roommates {
          padding: 3rem 1.5rem; /* py-12 px-6 */
          background-color: var(--bg-gray-100);
        }
        @media (min-width: 768px) { /* md:px-12 */
          .section-roommates {
            padding-left: 3rem;
            padding-right: 3rem;
          }
        }

        .section-title {
          font-size: 1.875rem; /* text-3xl */
          font-weight: 700; /* font-bold */
          color: var(--text-gray-800);
          text-align: center;
          margin-bottom: 2.5rem; /* mb-10 */
        }

        /* Grids for listings */
        .properties-grid,
        .roommates-grid {
          display: grid;
          grid-template-columns: 1fr; /* grid-cols-1 */
          gap: 2rem; /* gap-8 */
          max-width: 1200px; /* Max width for content */
          margin-left: auto;
          margin-right: auto;
        }
        @media (min-width: 640px) { /* sm:grid-cols-2 */
          .properties-grid,
          .roommates-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) { /* lg:grid-cols-4 */
          .properties-grid,
          .roommates-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        /* How it works section specific styles */
        .how-it-works-subtitle {
          color: var(--text-gray-600);
          max-width: 42rem; /* max-w-2xl */
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 2rem; /* mb-8 */
          font-size: 1rem;
          line-height: 1.5;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: 1fr; /* grid-cols-1 */
          gap: 2rem; /* gap-8 */
          max-width: 1000px; /* Adjusted max-width for this section */
          margin-left: auto;
          margin-right: auto;
        }
        @media (min-width: 768px) { /* md:grid-cols-3 */
          .steps-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .step-card {
          padding: 1.5rem; /* p-6 */
          border-radius: 0.5rem; /* rounded-lg */
          box-shadow: var(--card-shadow);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .step-card-blue {
          background-color: var(--primary-blue-light); /* bg-blue-50 */
        }
        .step-card-green {
          background-color: var(--green-50); /* bg-green-50 */
        }
        .step-card-purple {
          background-color: var(--purple-50); /* bg-purple-50 */
        }


        .step-icon {
          width: 3rem; /* size={48} */
          height: 3rem;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 1rem; /* mb-4 */
        }
        .step-card-blue .step-icon {
          color: var(--primary-blue); /* text-blue-600 */
        }
        .step-card-green .step-icon {
          color: var(--green-600); /* text-green-600 */
        }
        .step-card-purple .step-icon {
          color: var(--purple-600); /* text-purple-600 */
        }


        .step-title {
          font-size: 1.25rem; /* text-xl */
          font-weight: 600; /* font-semibold */
          color: var(--text-gray-800);
          margin-bottom: 0.5rem; /* mb-2 */
        }

        .step-description {
          color: var(--text-gray-600);
          font-size: 1rem;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
