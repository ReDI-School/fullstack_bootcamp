/**
 * profile/page.js - User Profile Page
 * This page fetches and displays a user's profile information from the DummyJSON API.
 */
"use client";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("https://dummyjson.com/users/1");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <div className="container mx-auto py-6 text-center">
      <h1 className="text-2xl font-bold text-blue-600">User Profile</h1>

      {loading ? (
        <p className="text-gray-500">Loading profile...</p>
      ) : user ? (
        <div className="bg-white p-6 rounded-lg shadow-md inline-block text-left mt-6">
          <img
            src={user.image}
            alt={user.firstName}
            className="w-24 h-24 rounded-full mx-auto"
          />
          <h2 className="text-xl font-semibold mt-4">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-700">{user.email}</p>
          <p className="text-gray-600">
            {user.company.title} at {user.company.name}
          </p>
        </div>
      ) : (
        <p className="text-red-500">Failed to load profile.</p>
      )}
    </div>
  );
}
