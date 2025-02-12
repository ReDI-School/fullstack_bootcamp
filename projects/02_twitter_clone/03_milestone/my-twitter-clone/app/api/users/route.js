/**
 * api/users/route.js - API Route for Fetching Users
 * This API route fetches a list of users from the DummyJSON API.
 */

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://dummyjson.com/users");
    const data = await response.json();
    return NextResponse.json(data.users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
