import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TweetList from "../components/TweetList";
import Layout from "../components/Layout";

// Component that displays a user's profile page with their tweets
const ProfilePage = () => {
  const router = useRouter();
  // Get the username from the URL query parameters
  const { user } = router.query;

  // State management for tweets, loading state, and current user
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  // Initialize username from localStorage if we're in the browser
  const [username, setUsername] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("twitter_clone_username") || null;
    }
    return null;
  });

  // Fetch user's tweets when the profile page loads or when user changes
  useEffect(() => {
    const fetchUserTweets = async () => {
      if (user) {
        setLoading(true);
        try {
          const response = await fetch(
            `/api/tweets?user=${encodeURIComponent(user)}`
          );
          const data = await response.json();
          setTweets(data);
        } catch (error) {
          console.error("Error fetching tweets:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserTweets();
  }, [user]);

  // Handle user login - update state and localStorage
  const handleLogin = (newUsername) => {
    setUsername(newUsername);
    localStorage.setItem("twitter_clone_username", newUsername);
  };

  // Handle user logout - clear state and localStorage, redirect to home
  const handleLogout = () => {
    setUsername(null);
    localStorage.removeItem("twitter_clone_username");
    router.push("/");
  };

  // Show loading state if user parameter is not yet available
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Layout onLogin={handleLogin} onLogout={handleLogout} username={username}>
      <div className="max-w-2xl mx-auto p-4">
        {/* Display profile header with username */}
        <h1 className="text-3xl font-bold mb-4">Profile: {user}</h1>
        {loading ? (
          <p>Loading tweets...</p>
        ) : (
          <>
            {/* Show tweet count with proper pluralization */}
            <p className="mb-4 text-gray-600">
              {tweets.length} Tweet{tweets.length !== 1 ? "s" : ""}
            </p>
            {/* Display list of user's tweets */}
            <TweetList tweets={tweets} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
