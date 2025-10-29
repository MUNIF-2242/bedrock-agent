import User from "@/lib/model/schema/User";
import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json(null, { status: 200, headers: CORS_HEADERS });
}

export async function POST(request) {
  try {
    const reqBody = await request.json();
    console.log("reqBody:", reqBody);

    if (!reqBody || !reqBody.name || !reqBody.email || !reqBody.phone) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, phone" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const createdUser = await User.create(reqBody);

    return NextResponse.json(
      {
        message: "Admin user created successfully",
        user: createdUser,
      },
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error("Create Admin User API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
