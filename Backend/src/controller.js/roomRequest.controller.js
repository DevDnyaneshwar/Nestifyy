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
    const { search, gender, budget } = req.query;
    let query = {};

    // If no filters are provided, return empty results
    if (!search && !gender && !budget) {
      return res.status(200).json([]);
    }

    // Location and name-based search
    if (search && search.trim()) {
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { location: { $regex: escapedSearch, $options: 'i' } },
        { 'user.name': { $regex: escapedSearch, $options: 'i' } }, // Search user.name
      ];
    }

    // Gender filter
    if (gender && ['Male', 'Female', 'Other'].includes(gender)) {
      query['user.gender'] = gender;
    } else if (gender) {
      return res.status(200).json([]);
    }

    // Budget filter
    if (budget && budget.trim()) {
      if (budget.includes('-')) {
        const [minBudget, maxBudget] = budget.split('-').map((val) => parseFloat(val));
        if (!isNaN(minBudget) && !isNaN(maxBudget)) {
          query.budget = {
            $gte: minBudget.toString(),
            $lte: maxBudget.toString(),
          };
        } else {
          return res.status(200).json([]);
        }
      } else if (budget.endsWith('+')) {
        const minBudget = parseFloat(budget.replace('+', ''));
        if (!isNaN(minBudget)) {
          query.budget = { $gte: minBudget.toString() };
        } else {
          return res.status(200).json([]);
        }
      } else {
        return res.status(200).json([]);
      }
    }

    const roomRequests = await RoomRequest.find(query)
      .populate('user', 'name number gender photo')
      .limit(4)
      .lean();

    res.status(200).json(roomRequests);
  } catch (error) {
    console.error('Error searching room requests:', error);
    res.status(500).json({ message: 'Failed to search room requests', error: error.message });
  }
};

export { createRoomRequest, getAllRoomRequests, searchRoomRequests };