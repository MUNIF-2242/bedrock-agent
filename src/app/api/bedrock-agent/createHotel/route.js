import Hotel from "@/src/lib/model/schema/Hotel";
import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json(null, { status: 200, headers: CORS_HEADERS });
}

// POST handler to create a hotel
export async function POST(request) {
  try {
    const reqBody = await request.json();
    console.log("reqBody:", reqBody);

    if (!reqBody || !reqBody.hotelName || !reqBody.location) {
      return NextResponse.json(
        { error: "Missing required fields: hotelName, location" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const createdHotel = await Hotel.create(reqBody);

    return NextResponse.json(
      {
        message: "Hotel created successfully",
        hotel: createdHotel,
      },
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error("Create Hotel API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
