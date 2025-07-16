// src/pages/FindRoommatePage.jsx
import React, { useEffect, useContext, useState } from "react";
import {
  Search,
  MapPin,
  Users,
  DollarSign,
  Loader2,
  Frown,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { AppContext } from "../context/AppContext";
import RoommateListingCard from "../components/RoommateListingCard";

const FindRoommatePage = () => {
  const { trackInteraction } = useContext(AppContext);
  const [filters, setFilters] = useState({
    location: "",
    gender: "",
    budget: "",
  });
  const [sortOrder, setSortOrder] = useState("relevance"); // This state is not currently used in UI, but kept for function integrity
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    trackInteraction("page_view", "find_roommate_page");
    // Simulate fetching roommates on initial load
    fetchRoommates();
  }, [trackInteraction]);

  const fetchRoommates = async (
    currentFilters = filters,
    currentSortOrder = sortOrder
  ) => {
    setLoading(true);
    setError("");
    trackInteraction("search", "find_roommate_search_initiated", {
      filters: currentFilters,
      sort: currentSortOrder,
    });
    try {
      // Simulate API call to fetch roommates
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      const dummyRoommates = [
        {
          id: 3,
          name: "Priya D.",
          location: "Mumbai",
          lookingFor: "Andheri, Bandra",
          budget: "₹ 18,000",
          imageUrl: "https://placehold.co/400x260/F0F9FF/0284C7?text=Priya",
          gender: "Female",
          interests: "Reading, Yoga",
        },
        {
          id: 4,
          name: "Amit V.",
          location: "Delhi",
          lookingFor: "Saket, Hauz Khas",
          budget: "₹ 10,000",
          imageUrl: "https://placehold.co/400x260/ECFDF5/059669?text=Amit",
          gender: "Male",
          interests: "Gaming, Movies",
        },
        {
          id: 5,
          name: "Sneha R.",
          location: "Pune",
          lookingFor: "Kothrud, Viman Nagar",
          budget: "₹ 12,000",
          imageUrl: "https://placehold.co/400x260/FFFBEB/92400E?text=Sneha",
          gender: "Female",
          interests: "Cooking, Travel",
        },
        {
          id: 6,
          name: "Vikram S.",
          location: "Bengaluru",
          lookingFor: "Electronic City",
          budget: "₹ 9,000",
          imageUrl: "https://placehold.co/400x260/FEE2E2/991B1B?text=Vikram",
          gender: "Male",
          interests: "Sports, Music",
        },
        {
          id: 7,
          name: "Deepa K.",
          location: "Chennai",
          lookingFor: "Velachery",
          budget: "₹ 11,000",
          imageUrl: "https://placehold.co/400x260/E0F7FA/00838F?text=Deepa",
          gender: "Female",
          interests: "Art, Photography",
        },
        {
          id: 8,
          name: "Rohan M.",
          location: "Hyderabad",
          lookingFor: "Gachibowli",
          budget: "₹ 14,000",
          imageUrl: "https://placehold.co/400x260/E8F5E9/2E7D32?text=Rohan",
          gender: "Male",
          interests: "Fitness, Tech",
        },
      ];
      setRoommates(dummyRoommates);
      trackInteraction("search", "find_roommate_search_success", {
        resultsCount: dummyRoommates.length,
      });
    } catch (err) {
      setError("Failed to load roommates. Please try again.");
      trackInteraction("search", "find_roommate_search_failure", {
        error: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    trackInteraction("input", `find_roommate_filter_${name}`, { value });
  };

  const handleSearch = () => {
    fetchRoommates(filters, sortOrder);
  };

  return (
    <div className="min-h-screen bg-bg-gray-50 p-6 md:p-12 flex flex-col items-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-text-gray-800 text-center mb-10 relative">
        <span className="relative inline-block pb-2">
          Find Your Perfect Roommate
          {/* Tailwind equivalent for ::after pseudo-element for the underline */}
          <span className="content-[''] absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-primary-green rounded-full"></span>
        </span>
      </h1>

      {/* Search and Filter Bar */}
      <div className="bg-card-bg rounded-2xl shadow-card-shadow-xl p-6 md:p-8 w-full max-w-4xl mb-10 border border-border-gray-200 animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="relative">
            <MapPin
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-gray-400"
              size={20}
            />
            <input
              type="text"
              name="location"
              placeholder="Preferred City/Locality"
              className="w-full pl-12 pr-4 py-3.5 border border-border-gray-300 rounded-lg outline-none transition-all duration-200 bg-card-bg text-base shadow-sm text-text-gray-800 focus:border-primary-green focus:ring-2 focus:ring-green-500/50"
              value={filters.location}
              onChange={handleFilterChange}
              onFocus={() =>
                trackInteraction("focus", "find_roommate_location_input")
              }
            />
          </div>
          <div className="relative">
            <Users
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-gray-400"
              size={20}
            />
            <select
              name="gender"
              className="w-full pl-12 pr-4 py-3.5 border border-border-gray-300 rounded-lg outline-none transition-all duration-200 bg-card-bg text-base shadow-sm text-text-gray-800 appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27currentColor%27%3E%3Cpath fill-rule=%27evenodd%27 d=%27M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%27 clip-rule=%27evenodd%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.5em] focus:border-primary-green focus:ring-2 focus:ring-green-500/50"
              value={filters.gender}
              onChange={handleFilterChange}
              onFocus={() =>
                trackInteraction("focus", "find_roommate_gender_filter")
              }
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="any">Any</option>
            </select>
          </div>
          <div className="relative">
            <DollarSign
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-gray-400"
              size={20}
            />
            <select
              name="budget"
              className="w-full pl-12 pr-4 py-3.5 border border-border-gray-300 rounded-lg outline-none transition-all duration-200 bg-card-bg text-base shadow-sm text-text-gray-800 appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27currentColor%27%3E%3Cpath fill-rule=%27evenodd%27 d=%27M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%27 clip-rule=%27evenodd%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.5em] focus:border-primary-green focus:ring-2 focus:ring-green-500/50"
              value={filters.budget}
              onChange={handleFilterChange}
              onFocus={() =>
                trackInteraction("focus", "find_roommate_budget_filter")
              }
            >
              <option value="">Max Budget</option>
              <option value="0-5000">₹0 - ₹5,000</option>
              <option value="5001-10000">₹5,001 - ₹10,000</option>
              <option value="10001-15000">₹10,001 - ₹15,000</option>
              <option value="15001+">₹15,001+</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="w-full mb-3 py-4 rounded-full bg-gradient-to-r from-green-500 via-green-400 to-green-600 text-white text-2xl font-bold shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 active:scale-98 focus:outline-none focus:ring-4 focus:ring-green-300"
          style={{ letterSpacing: "0.03em" }}
        >
          <Users size={28} className="text-white drop-shadow" />
          Find Roommate
        </button>
      </div>

      {error && (
        <div
          className="bg-red-error-bg border border-red-error-border text-red-error-text px-4 py-3 rounded-lg mb-6 flex items-center gap-2 text-base animate-fade-in"
          role="alert"
        >
          <AlertCircle size={20} />
          <span className="block">{error}</span>
        </div>
      )}

      {loading && roommates.length === 0 && (
        <div className="text-center text-text-gray-600 text-lg py-10 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary-green mb-4 animate-spin" />
          <p>Loading compatible roommates for you...</p>
        </div>
      )}

      {!loading && roommates.length === 0 && !error && (
        <div className="text-center text-text-gray-600 text-lg py-10 flex flex-col items-center justify-center">
          <Frown
            size={60}
            className="w-[3.75rem] h-[3.75rem] text-text-gray-400 mx-auto mb-4"
          />
          <p>
            No roommates found matching your criteria. Try adjusting your
            filters!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-6xl mx-auto animate-fade-in-up">
        {roommates.map((roommate) => (
          <RoommateListingCard key={roommate.id} roommate={roommate} />
        ))}
      </div>
    </div>
  );
};

export default FindRoommatePage;
