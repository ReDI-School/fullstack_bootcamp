/**
 * api/tweets/route.js - API Route for Fetching Tweets
 * This API route fetches a list of tweets from the DummyJSON API.
 */

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://dummyjson.com/posts");
    const data = await response.json();
    return NextResponse.json(data.posts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tweets" }, { status: 500 });
  }
}
