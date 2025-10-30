// src/lib/model/schema/User.js
import mongoose from "mongoose";
import ROLES from "../../constants/enum/UserType.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
    required: true,
    default: ROLES.GUEST,
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel", // Use string "Hotel" instead of the Hotel object
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

// Auto-update updatedAt before save
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Use singleton pattern to prevent model recompilation
let User;

if (mongoose.models.User) {
  User = mongoose.model("User");
} else {
  User = mongoose.model("User", userSchema);
}

export default User;
