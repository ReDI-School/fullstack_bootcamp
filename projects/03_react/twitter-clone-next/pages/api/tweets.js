// This is our API route for handling tweets. In Next.js, files in pages/api
// become API endpoints automatically.

// We're using an in-memory array to store tweets (in a real app, you'd use a database)
let tweets = [
  {
    id: 1,
    content: "Just setting up my Twitter clone! 🚀",
    user: "JohnDoe",
    timestamp: "2024-03-20T10:00:00.000Z",
  },
  {
    id: 2,
    content: "This is a great day for coding! 💻",
    user: "TechGirl",
    timestamp: "2024-03-20T09:30:00.000Z",
  },
  {
    id: 3,
    content: "Hello everyone! Excited to be here! 👋",
    user: "WebDev123",
    timestamp: "2024-03-20T09:00:00.000Z",
  },
];

let nextId = 4;

export default function handler(req, res) {
  if (req.method === "GET") {
    // Check if there's a user query parameter
    const { user } = req.query;

    if (user) {
      // Filter tweets for specific user
      const userTweets = tweets.filter((tweet) => tweet.user === user);
      return res.status(200).json(userTweets);
    }

    // Return all tweets if no user specified
    res.status(200).json(tweets);
  } else if (req.method === "POST") {
    const { content, user } = req.body;

    // Validate required fields
    if (!content || !user) {
      return res.status(400).json({ error: "Content and user are required" });
    }

    // Create new tweet
    const newTweet = {
      id: nextId++,
      content,
      user,
      timestamp: new Date().toISOString(),
    };

    // Add to tweets array
    tweets.unshift(newTweet);

    // Return the created tweet
    res.status(201).json(newTweet);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
