import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import TweetInput from "../components/TweetInput";
import TweetList from "../components/TweetList";
import { useRouter } from "next/router";

const HomePage = () => {
  // Initialize Next.js router for programmatic navigation
  const router = useRouter();

  // State management for tweets and user authentication
  const [tweets, setTweets] = useState([]);
  const [username, setUsername] = useState(null);

  // Effect to handle user persistence using localStorage
  // This runs only on the client side after the component mounts
  useEffect(() => {
    const storedUsername = localStorage.getItem("twitter_clone_username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Effect to fetch tweets when the component mounts
  useEffect(() => {
    const fetchTweets = async () => {
      const response = await fetch("/api/tweets");
      const data = await response.json();
      setTweets(data);
    };
    fetchTweets();
  }, []);

  // Authentication handlers
  const handleLogin = (newUsername) => {
    setUsername(newUsername);
    localStorage.setItem("twitter_clone_username", newUsername);
  };

  const handleLogout = () => {
    setUsername(null);
    localStorage.removeItem("twitter_clone_username");
  };

  // Handler for creating new tweets
  const addTweet = async (newTweet) => {
    if (!username) return;

    const response = await fetch("/api/tweets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...newTweet,
        user: username,
      }),
    });

    if (response.ok) {
      const createdTweet = await response.json();
      // Update tweets state with the new tweet at the beginning
      setTweets((prevTweets) => [createdTweet, ...prevTweets]);
    }
  };

  // Handler for profile navigation
  const handleProfileClick = () => {
    if (username) {
      router.push(`/profile?user=${username}`);
    }
  };

  return (
    <Layout onLogin={handleLogin} onLogout={handleLogout} username={username}>
      <div className="min-h-screen bg-black">
        <div className="container mx-auto flex">
          {/* Left column - Navigation */}
          <div className="w-1/4 fixed left-0 p-4">
            <nav className="space-y-4">
              <a
                href="/"
                className="flex items-center text-white hover:bg-gray-800 px-4 py-2 rounded-full"
              >
                <svg
                  className="w-6 h-6 mr-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 7.57L12.357 2.115c-.223-.12-.49-.12-.713 0L1.543 7.57c-.364.197-.5.652-.303 1.017.135.25.394.393.66.393.12 0 .243-.03.356-.09l.815-.44L4.7 19.963c.214 1.215 1.308 2.062 2.658 2.062h9.282c1.352 0 2.445-.848 2.663-2.087l1.626-11.49.818.442c.364.193.82.06 1.017-.304.196-.363.06-.818-.304-1.016zm-4.638 12.133c-.107.606-.703.822-1.18.822H7.36c-.48 0-1.075-.216-1.178-.798L4.48 7.69 12 3.628l7.522 4.06-1.7 12.015z" />
                  <path d="M12 13.628l-3.196-3.196 1.414-1.414L12 10.799l1.782-1.781 1.414 1.414L12 13.628z" />
                </svg>
                Home
              </a>
              <button
                onClick={handleProfileClick}
                className="flex items-center text-white hover:bg-gray-800 px-4 py-2 rounded-full w-full text-left"
              >
                <svg
                  className="w-6 h-6 mr-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 11.816c1.355 0 2.872-.15 3.84-1.256.814-.93 1.078-2.368.806-4.392-.38-2.825-2.117-4.512-4.646-4.512S7.734 3.343 7.354 6.17c-.272 2.022-.008 3.46.806 4.39.968 1.107 2.485 1.256 3.84 1.256zM8.84 6.368c.162-1.2.787-3.212 3.16-3.212s2.998 2.013 3.16 3.212c.207 1.55.057 2.627-.45 3.205-.455.52-1.266.743-2.71.743s-2.255-.223-2.71-.743c-.507-.578-.657-1.656-.45-3.205zm11.44 12.868c-.877-3.526-4.282-5.99-8.28-5.99s-7.403 2.464-8.28 5.99c-.172.692-.028 1.4.395 1.94.408.52 1.04.82 1.733.82h12.304c.693 0 1.325-.3 1.733-.82.424-.54.567-1.247.394-1.94zm-1.576 1.016c-.126.16-.316.246-.552.246H5.848c-.235 0-.426-.085-.552-.246-.137-.174-.18-.412-.12-.654.71-2.855 3.517-4.85 6.824-4.85s6.114 1.994 6.824 4.85c.06.242.017.48-.12.654z" />
                </svg>
                Profile
              </button>
            </nav>
          </div>

          {/* Center column - Tweet Feed */}
          <div className="w-1/2 mx-auto border-x border-gray-800">
            <div className="px-4">
              <h1 className="text-xl font-bold py-4 sticky top-0 bg-black/80 backdrop-blur-md border-b border-gray-800 text-white">
                Home
              </h1>
              {username ? (
                <p className="mb-4 text-gray-400">Logged in as: {username}</p>
              ) : (
                <p className="mb-4 text-gray-400">Please login to tweet</p>
              )}
              <TweetInput onTweet={addTweet} username={username} />
              <TweetList tweets={tweets} />
            </div>
          </div>

          {/* Right column - Profile and Trends */}
          <div className="w-1/4 fixed right-0 p-4">
            <div className="bg-gray-900 rounded-2xl p-4 mb-4">
              <h2 className="text-xl font-bold text-white mb-4">Profile</h2>
              {username ? (
                <div className="text-white">
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 rounded-full bg-gray-600"></div>
                    <div>
                      <p className="font-bold">{username}</p>
                      <p className="text-gray-400">@{username}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">
                  Please login to see your profile
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
