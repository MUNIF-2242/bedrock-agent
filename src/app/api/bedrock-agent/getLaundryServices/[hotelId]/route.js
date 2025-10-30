import { NextResponse } from "next/server";
import mongoose from "mongoose";

import Hotel from "@/src/lib/model/schema/Hotel";
import connectDB from "@/src/lib/config/DB";

export async function GET(req, { params }) {
  console.log("➡️ [API] /getLaundryServices route hit");

  try {
    const { hotelId } = await params;
    console.log("🔹 Incoming hotelId:", hotelId);

    if (!hotelId) {
      console.warn("⚠️ Missing hotelId param");
      return NextResponse.json(
        { error: "Hotel ID is required" },
        { status: 400 }
      );
    }

    console.log("🧩 Attempting to connect to MongoDB...");

    await connectDB();
    console.log(
      "🌍 MONGO_URI:",
      process.env.MONGO_URI ? "Loaded ✅" : "❌ Not found"
    );

    console.log("✅ MongoDB Connected:", mongoose.connection.host);

    // Find hotel by ID
    console.log("🔍 Searching hotel by ID:", hotelId);
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      console.warn("⚠️ Hotel not found for ID:", hotelId);
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    // Extract WiFi info
    console.log("📶 Hotel found. Extracting WiFi info...");
    const laundryServicesInfo = hotel.laundryServices || null;

    return NextResponse.json({ laundryServicesInfo }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching wifi password:", error);

    try {
      console.log(
        "⚠️ Mongoose connection state:",
        mongoose.connection.readyState
      );
    } catch {
      console.warn(
        "⚠️ Could not get mongoose debug info: mongoose not defined"
      );
    }

    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
