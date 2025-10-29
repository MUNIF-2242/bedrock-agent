import mongoose from "mongoose";
import laundryItemSchema from "../innerSchema/laundryItemSchema";

const hotelSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
  },
  phone: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    default: null,
  },
  numberOfRooms: {
    type: Number,
    default: 0,
  },
  wifiInfo: {
    ssid: { type: String, default: null },
    password: { type: String, default: null },
  },

  laundryServices: {
    type: [laundryItemSchema],
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
hotelSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Use singleton pattern to prevent model recompilation
let Hotel;

if (mongoose.models.Hotel) {
  Hotel = mongoose.model("Hotel");
} else {
  Hotel = mongoose.model("Hotel", hotelSchema);
}

export default Hotel;
