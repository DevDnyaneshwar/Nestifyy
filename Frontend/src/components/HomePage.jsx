import React, { useEffect, useContext } from 'react';
import { Search, MessageSquare, Home } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import HeroSection from './HeroSection'; // Assuming this is now pure CSS (or Tailwind)
import PropertyListingCard from './PropertyListingCard'; // Assuming this is now pure CSS (or Tailwind)
import RoommateListingCard from './RoommateListingCard'; // Assuming this is now pure CSS (or Tailwind)

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
    <div className="min-h-screen bg-gray-50 font-inter antialiased flex flex-col">
      <HeroSection />

      <section className="py-12 px-6 bg-white md:px-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Featured Rooms & Properties</h2>
        <div className="grid grid-cols-1 gap-8 max-w-[1200px] mx-auto sm:grid-cols-2 lg:grid-cols-4">
          {featuredProperties.map((property) => (
            <PropertyListingCard key={property.id} property={property} />
          ))}
        </div>




      </section>

      <section className="py-12 px-6 bg-gray-100 md:px-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Featured Roommates</h2>
        <div className="grid grid-cols-1 gap-8 max-w-[1200px] mx-auto sm:grid-cols-2 lg:grid-cols-4">
          {featuredRoommates.map((roommate) => (
            <RoommateListingCard key={roommate.id} roommate={roommate} />
          ))}
        </div>
      </section>

      {/* How it works section */}
      <section className="py-12 px-6 bg-white md:px-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">How Nestify Works</h2>
        <p className="text-gray-700 max-w-2xl mx-auto mb-8 text-base leading-relaxed text-center">
          Seamlessly find your next home or ideal roommate with our easy-to-use platform.
        </p>
        <div className="grid grid-cols-1 gap-8 max-w-[1000px] mx-auto md:grid-cols-3">
          <div className="p-6 rounded-lg shadow-md text-center flex flex-col items-center justify-center bg-blue-50">
            <Search size={48} className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Search & Discover</h3>
            <p className="text-gray-700 text-base leading-relaxed">Browse thousands of listings for rooms, houses, and compatible roommates.</p>
          </div>
          <div className="p-6 rounded-lg shadow-md text-center flex flex-col items-center justify-center bg-green-50">
            <MessageSquare size={48} className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect & Meet</h3>
            <p className="text-gray-700 text-base leading-relaxed">Connect directly with owners, brokers, or potential roommates. Share OTP for secure meetings.</p>
          </div>
          <div className="p-6 rounded-lg shadow-md text-center flex flex-col items-center justify-center bg-purple-50">
            <Home size={48} className="w-12 h-12 mx-auto mb-4 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Settle In</h3>
            <p className="text-gray-700 text-base leading-relaxed">Find your perfect match and settle into your new living situation with ease.</p>
          </div>
        </div>
      </section>
      {/* Remove the style tag */}
    </div>
  );
};