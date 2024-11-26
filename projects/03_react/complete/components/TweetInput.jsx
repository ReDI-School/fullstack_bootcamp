import React, { useState } from "react";

const TweetInput = ({ onTweet, username }) => {
  const [tweet, setTweet] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tweet.trim() || !username) return;

    const tweetData = {
      content: tweet,
      user: username,
    };

    await onTweet(tweetData);
    setTweet("");
  };

  return (
    <div className="border-b border-gray-800 p-4">
      <form onSubmit={handleSubmit}>
        {/* Profile picture placeholder */}
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-700 flex-shrink-0" />
          <div className="flex-grow">
            <textarea
              value={tweet}
              onChange={(e) => setTweet(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="What's happening?"
              className={`w-full bg-transparent text-xl text-white placeholder-gray-600 outline-none resize-none ${
                !username && "cursor-not-allowed"
              }`}
              disabled={!username}
              rows={isFocused ? 4 : 2}
            />
            {/* Tweet button */}
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={!username || !tweet.trim()}
                className={`tweet-button px-4 py-2 ${
                  !username || !tweet.trim()
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-twitter-blue-hover"
                }`}
              >
                Tweet
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TweetInput;
