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
import { useSearchParams } from 'react-router-dom';
import { AppContext } from "../context/AppContext";
import RoommateListingCard from "../components/RoommateListingCard";
import axios from "axios";

const FindRoommatePage = () => {
  const { trackInteraction } = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    location: searchParams.get('search') || '',
    gender: '',
    budget: '',
  });
  const [sortOrder, setSortOrder] = useState("relevance");
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if no filters are applied
  const areFiltersEmpty = !filters.location && !filters.gender && !filters.budget;

  // Initialize filters from URL search params on page load
  useEffect(() => {
    trackInteraction("page_view", "find_roommate_page");
    setFilters({
      location: searchParams.get('search') || '',
      gender: searchParams.get('gender') || '',
      budget: searchParams.get('budget') || '',
    });
  }, [trackInteraction, searchParams]);

  const fetchRoommates = async (currentFilters = filters, currentSortOrder = sortOrder) => {
    setLoading(true);
    setError("");
    trackInteraction("search", "find_roommate_search_initiated", {
      filters: currentFilters,
      sort: currentSortOrder,
    });
    try {
      const params = {};
      if (currentFilters.location) params.search = currentFilters.location;
      if (currentFilters.gender) params.gender = currentFilters.gender;
      if (currentFilters.budget) params.budget = currentFilters.budget;

      const response = await axios.get("https://nestifyy-my3u.onrender.com/api/room-request", {
        params,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      const formattedRoommates = response.data.map((request) => ({
        id: request._id,
        name: request.name,
        location: request.location,
        lookingFor: request.location,
        budget: request.budget,
        imageUrl: request.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(request.name)}&size=400&background=F0F9FF&color=0284C7`,
        gender: request.gender,
        interests: "Not specified",
      }));

      setRoommates(formattedRoommates);
      trackInteraction("search", "find_roommate_search_success", {
        resultsCount: formattedRoommates.length,
        currentPath: "/find-roommate",
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to load roommates. Please try again.";
      setError(errorMessage);
      trackInteraction("search", "find_roommate_search_failure", {
        error: errorMessage,
        currentPath: "/find-roommate",
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
    if (areFiltersEmpty) {
      setError("Please apply at least one filter to find roommates.");
      setRoommates([]);
      return;
    }
    // Update URL with current filters
    const newParams = {};
    if (filters.location) newParams.search = filters.location;
    if (filters.gender) newParams.gender = filters.gender;
    if (filters.budget) newParams.budget = filters.budget;
    setSearchParams(newParams);
    fetchRoommates(filters, sortOrder);
  };

  return (
    <div className="min-h-screen bg-bg-gray-50 p-6 md:p-12 flex flex-col items-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-text-gray-800 text-center mb-10 relative">
        <span className="relative inline-block pb-2">
          Find Your Perfect Roommate
          <span className="content-[''] absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-primary-green rounded-full"></span>
        </span>
      </h1>

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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
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
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
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

      {!loading && roommates.length === 0 && !error && areFiltersEmpty && (
        <div className="text-center text-text-gray-600 text-lg py-10 flex flex-col items-center justify-center">
          <Frown
            size={60}
            className="w-[3.75rem] h-[3.75rem] text-text-gray-400 mx-auto mb-4"
          />
          <p>Please apply at least one filter to find roommates.</p>
        </div>
      )}

      {!loading && roommates.length === 0 && !error && !areFiltersEmpty && (
        <div className="text-center text-text-gray-600 text-lg py-10 flex flex-col items-center justify-center">
          <Frown
            size={60}
            className="w-[3.75rem] h-[3.75rem] text-text-gray-400 mx-auto mb-4"
          />
          <p>No roommates found matching your criteria. Try adjusting your filters!</p>
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