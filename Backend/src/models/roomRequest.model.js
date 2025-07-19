import mongoose, { Schema } from "mongoose";

const roomRequestSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    city: { 
        type: String 
    },
    area: { 
        type: String 
    },
    location: {
      type: String,
      required: true,
    },
    budget: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other",
    },
    photo: {
      type: String,
    },
  },
  { timestamps: true }
);

export const RoomRequest = mongoose.model("RoomRequest", roomRequestSchema);