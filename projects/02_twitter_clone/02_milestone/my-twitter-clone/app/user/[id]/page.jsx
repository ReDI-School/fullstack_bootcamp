/**
 * UserProfile.js - Week 6
 * This page displays the details of a user's profile.
 * It fetches a specific user based on their ID from the DummyJSON API.
 */
import { notFound } from "next/navigation";

// Fetch a single user by ID
async function getUser(id) {
  const res = await fetch(`https://dummyjson.com/users/${id}`);
  if (!res.ok) return notFound();
  return res.json();
}

export default async function UserProfile({ params }) {
  const user = await getUser(params.id);

  return (
    <main className="container mx-auto p-6">
      {/* User Info */}
      <div className="flex items-center space-x-4">
        <img
          src={user.image}
          alt={user.firstName}
          className="w-20 h-20 rounded-full shadow-md"
        />
        <div>
          <h1 className="text-2xl font-bold">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-gray-600">@{user.username}</p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 text-gray-700">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone}
        </p>
        <p>
          <strong>Company:</strong> {user.company.name}
        </p>
        <p>
          <strong>University:</strong> {user.university}
        </p>
      </div>

      {/* Back Button */}
      <a
        href="/"
        className="block text-center mt-6 text-blue-500 hover:underline"
      >
        ⬅️ Back to Home
      </a>
    </main>
  );
}
