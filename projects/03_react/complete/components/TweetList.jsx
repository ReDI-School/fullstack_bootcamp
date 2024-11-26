import React from "react";
import TweetItem from "./TweetItem";

// Component that renders a list of tweets
// If no tweets are available, displays a message
const TweetList = ({ tweets }) => {
  if (!tweets || tweets.length === 0) {
    return <p className="text-center text-gray-500">No tweets to display.</p>;
  }

  return (
    <div>
      {/* Map through tweets array and render each tweet */}
      {tweets.map((tweet) => (
        <TweetItem key={tweet.id} tweet={tweet} />
      ))}
    </div>
  );
};

export default TweetList;
