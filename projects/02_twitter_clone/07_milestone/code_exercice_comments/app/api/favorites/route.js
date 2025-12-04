import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

// This API route is protected by middleware
// Only authenticated users can access it
export async function GET(request) {
  // Since middleware already checked authentication,
  // we can safely access user data here
  const session = await getServerSession();

  // Return user's favorite tweets from localStorage
  // In a real app, this would fetch from a database
  return NextResponse.json({
    message: "Successfully accessed protected API route",
    user: session?.user,
    info: "This route is protected by middleware. Only authenticated users can access it.",
  });
}

export async function POST(request) {
  const session = await getServerSession();

  try {
    const body = await request.json();

    // In a real app, save to database here
    // For now, just acknowledge the request
    return NextResponse.json({
      message: "Favorite added successfully",
      user: session?.user,
      data: body,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function DELETE(request) {
  const session = await getServerSession();

  try {
    const { searchParams } = new URL(request.url);
    const tweetId = searchParams.get("tweetId");

    if (!tweetId) {
      return NextResponse.json(
        { error: "tweetId is required" },
        { status: 400 }
      );
    }

    // In a real app, delete from database here
    return NextResponse.json({
      message: "Favorite removed successfully",
      user: session?.user,
      tweetId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to remove favorite" },
      { status: 500 }
    );
  }
}
