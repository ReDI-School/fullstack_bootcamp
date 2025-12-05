import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { makeSureDbIsReady } from "@/lib/db";
import { User } from "@/models/User";

export async function POST(request) {
  try {
    // Check if database should be used
    const shouldUseDatabase =
      process.env.MONGODB_URI && process.env.MONGODB_URI.length > 0;

    if (!shouldUseDatabase) {
      return NextResponse.json(
        {
          error: "Registration not available without database",
          message: "Please configure MONGODB_URI to enable user registration",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { username, email, password, name } = body;

    // Validate required fields
    if (!username || !email || !password || !name) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Connect to database
    await makeSureDbIsReady();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      const field = existingUser.username === username ? "Username" : "Email";
      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      name,
    });

    console.log("✅ New user registered:", newUser.username);

    // Return user without password
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          name: newUser.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Registration error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: Object.values(error.errors).map((e) => e.message),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to register user", message: error.message },
      { status: 500 }
    );
  }
}
