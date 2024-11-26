import React, { useState } from "react";

// Component for handling user login
// Uses a simple username-only authentication
const LoginForm = ({ onLogin }) => {
  // State to manage username input
  const [username, setUsername] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username); // Call the parent function to set the user
      setUsername(""); // Clear the input
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Username input */}
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full px-4 py-3 bg-black border border-gray-800 rounded-md focus:ring-2 focus:ring-twitter-blue focus:border-transparent text-white placeholder-gray-500"
          required
        />
      </div>

      {/* Sign in button */}
      <button
        type="submit"
        className="w-full bg-white text-black font-bold py-3 px-4 rounded-full hover:bg-gray-200 transition-colors"
      >
        Sign in
      </button>

      {/* Sign up button */}
      <button
        type="button"
        className="w-full bg-transparent text-twitter-blue border border-twitter-blue font-bold py-3 px-4 rounded-full hover:bg-twitter-blue/10 transition-colors"
      >
        Create account
      </button>
    </form>
  );
};

export default LoginForm;
