// components/TweetCard.js
// 📌 Displays a single tweet in a structured card format.

export default function TweetCard({ tweet }) {
  return (
    <div className="border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-all cursor-pointer bg-white">
      <h3 className="text-lg font-bold">{tweet.title}</h3>
      <p className="text-gray-700 mt-2">{tweet.body}</p>

      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <p>
          👍 {tweet.reactions.likes} | 👎 {tweet.reactions.dislikes}
        </p>
        <p className="text-blue-500">{tweet.tags.join(", ")}</p>
      </div>
    </div>
  );
}
