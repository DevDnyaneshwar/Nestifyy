import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String,
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String,
        enum:['broker','user'],
        default: 'user' 

    },
    Profession:{
        type:String
    },
    number: { 
        type: Number,
        required:true 
    },
    location: { 
        type: String 
    },
    photo: { 
        type: String 
    },
  },

  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
