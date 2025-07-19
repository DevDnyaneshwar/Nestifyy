import { RoomRequest } from "../models/roomRequest.model.js";
import { User } from "../models/user.model.js";

const createRoomRequest = async (req, res) => {
  try {
    const { budget, location } = req.body;
    const userId = req.user._id;

    if (!budget || !location) {
      return res.status(400).json({ message: "Budget and location are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const roomRequest = new RoomRequest({
      user: userId,
      location,
      budget,
    });

    await roomRequest.save();

    res.status(201).json({
      message: "Room request created successfully",
      roomRequest,
    });
  } catch (error) {
    console.error("Error in createRoomRequest:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllRoomRequests = async (req, res) => {
  try {
    const roomRequests = await RoomRequest.find()
      .populate("user", "name number gender photo")
      .lean();
    res.status(200).json(roomRequests);
  } catch (error) {
    console.error("Error in getAllRoomRequests:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const searchRoomRequests = async (req, res) => {
  try {
    const { search, gender, priceRange, sortBy } = req.query;
    let query = {};

    if (!search && !gender && !priceRange) {
      return res.status(200).json([]);
    }

    // Search query
    if (search && search.trim()) {
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { location: { $regex: escapedSearch, $options: 'i' } },
        { 'user.name': { $regex: escapedSearch, $options: 'i' } },
      ];
    }

    // Gender filter
    if (gender && ['Male', 'Female', 'Other'].includes(gender)) {
      query['user.gender'] = gender;
    }

    // Budget range filter
    if (priceRange && priceRange.trim()) {
      if (priceRange.includes('-')) {
        const [minBudget, maxBudget] = priceRange.split('-').map((val) => parseFloat(val));
        if (!isNaN(minBudget) && !isNaN(maxBudget)) {
          query.budget = { $gte: minBudget.toString(), $lte: maxBudget.toString() };
        }
      } else if (priceRange.endsWith('+')) {
        const minBudget = parseFloat(priceRange.replace('+', ''));
        if (!isNaN(minBudget)) {
          query.budget = { $gte: minBudget.toString() };
        }
      }
    }

    // Execute query
    let roomRequests = await RoomRequest.find(query)
      .populate('user', 'name number gender photo')
      .limit(4)
      .lean();

    // Apply sorting
    switch (sortBy) {
      case 'rent-low':
        roomRequests = roomRequests.sort((a, b) => a.budget - b.budget);
        break;
      case 'rent-high':
        roomRequests = roomRequests.sort((a, b) => b.budget - a.budget);
        break;
      case 'popularity':
        roomRequests = roomRequests.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    res.status(200).json(roomRequests);
  } catch (error) {
    console.error('Error searching room requests:', {
      message: error.message,
      stack: error.stack,
      query: req.query,
      timestamp: new Date().toISOString(),
    });
    res.status(500).json({ message: 'Failed to search room requests', error: error.message });
  }
};

export { createRoomRequest, getAllRoomRequests, searchRoomRequests };