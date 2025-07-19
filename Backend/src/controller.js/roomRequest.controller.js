import { RoomRequest } from "../models/roomRequest.model.js";
import { User } from "../models/user.model.js";

const createRoomRequest = async (req, res) => {
  try {
    const { budget, location, city, area } = req.body;
    const userId = req.user._id;

    if (!budget || !location || !city || !area) {
      return res.status(400).json({ message: "Budget, location, city, and area are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const roomRequest = new RoomRequest({
      user: userId,
      name: user.name,
      number: user.number,
      location,
      budget,
      gender: user.gender,
      photo: user.photo,
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
    const { search } = req.query;
    let query = {};

    if (search && search.trim()) {
      query = {
        $or: [
          { location: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } },
          { area: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const roomRequests = await RoomRequest.find(query)
      .populate("user", "name number gender photo")
      .limit(4)
      .lean();
    res.status(200).json(roomRequests);
  } catch (error) {
    console.error("Error searching room requests:", error);
    res.status(500).json({ message: "Failed to search room requests", error: error.message });
  }
};
export { createRoomRequest, getAllRoomRequests, searchRoomRequests };