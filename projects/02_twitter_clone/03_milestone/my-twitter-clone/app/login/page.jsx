/**
 * login/page.js - User Login Page
 * This page allows users to log in by providing their username and password.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Mock implementation of useAuth for demonstration purposes
const useAuth = () => ({
  login: (user) => console.log("Logged in user:", user),
});

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      // Mocking a successful login response
      const mockResponse = {
        id: 1,
        username: username,
        token: "mock-token",
      };

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      login(mockResponse);
      router.push("/profile");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-blue-600">Login</h1>
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-96 mt-6"
      >
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
