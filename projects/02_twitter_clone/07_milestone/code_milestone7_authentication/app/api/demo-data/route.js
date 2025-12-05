import { makeSureDbIsReady } from "@/lib/db.js";
import { Tweet } from "@/models/Tweet.js";
import { Reaction } from "@/models/Reaction.js";
import { Comment } from "@/models/Comment.js";
import { User } from "@/models/User.js";
import bcrypt from "bcryptjs";

const dummyUsers = [
  {
    username: "john",
    email: "john@example.com",
    password: "password123",
    name: "John Doe",
  },
  {
    username: "jane",
    email: "jane@example.com",
    password: "password123",
    name: "Jane Smith",
  },
  {
    username: "demo",
    email: "demo@example.com",
    password: "demo",
    name: "Demo User",
  },
];

const dummyTweets = [
  {
    title: "Getting Started with Next.js 16",
    body: "Just deployed my first Next.js 16 app with the new App Router! The developer experience is amazing. Server Components are a game changer for performance. #nextjs #react #webdev",
    tags: ["nextjs", "react", "webdev"],
    views: 328,
    userId: 1,
  },
  {
    title: "MongoDB Tips for Beginners",
    body: "Been working with MongoDB for a few months now. Here are my top 3 tips: 1) Always index your queries, 2) Use aggregation pipelines, 3) Keep your schemas flexible but consistent. What are your favorite MongoDB tips?",
    tags: ["mongodb", "database", "tips"],
    views: 654,
    userId: 2,
  },
  {
    title: "Hello REDI SCHOOL STUDENTS!",
    body: "The tweet is fetched from localMongoDB! 🎨",
    tags: ["tailwind", "css", "webdesign"],
    views: 1203,
    userId: 3,
  },
  {
    title: "Docker Compose for Local Development",
    body: "Setting up Docker Compose has transformed my local dev workflow. No more 'works on my machine' issues! Spinning up databases, caching layers, and services is now a single command. Highly recommend! 🐳",
    tags: ["docker", "devops", "productivity"],
    views: 1876,
    userId: 1,
  },
  {
    title: "React 19 Features I'm Excited About",
    body: "React 19 brings some amazing features: Server Components, improved Suspense, and better error handling. The future of React development looks bright! Can't wait to use these in production.",
    tags: ["react", "javascript", "frontend"],
    views: 892,
    userId: 4,
  },
  {
    title: "Building RESTful APIs in 2025",
    body: "Just finished a course on modern API design. Key takeaways: versioning is crucial, always document with OpenAPI, use proper HTTP status codes, and implement rate limiting from day one. 🚀",
    tags: ["api", "backend", "rest"],
    views: 743,
    userId: 2,
  },
  {
    title: "JavaScript Array Methods Cheat Sheet",
    body: "Here's a quick reference for JS array methods: map() for transformation, filter() for selection, reduce() for aggregation, find() for searching. Master these and you'll write cleaner code! 📝",
    tags: ["javascript", "tutorial", "coding"],
    views: 1456,
    userId: 5,
  },
  {
    title: "Git Workflows That Actually Work",
    body: "After years of trial and error, I've settled on trunk-based development with feature flags. It's simpler than Git Flow and works great for continuous deployment. What's your preferred Git workflow?",
    tags: ["git", "workflow", "devops"],
    views: 567,
    userId: 3,
  },
  {
    title: "Why I Love TypeScript",
    body: "TypeScript has saved me countless hours of debugging. The type safety, IDE support, and refactoring capabilities are unmatched. If you're still writing plain JavaScript, give TypeScript a try!",
    tags: ["typescript", "javascript", "programming"],
    views: 1089,
    userId: 4,
  },
  {
    title: "Testing Strategies for Modern Web Apps",
    body: "My testing pyramid: lots of unit tests, some integration tests, few E2E tests. Using Jest for units, React Testing Library for components, and Playwright for E2E. This balance works perfectly! ✅",
    tags: ["testing", "javascript", "quality"],
    views: 834,
    userId: 5,
  },
];

const reactionAuthors = ["john", "jane", "demo"];

export async function GET(request) {
  // Check if database should be used (skip if MONGODB_URI is not set)
  const shouldUseDatabase = process.env.MONGODB_URI && process.env.MONGODB_URI.length > 0;
  
  if (!shouldUseDatabase) {
    return Response.json(
      {
        success: false,
        error: "Database is not configured. Please set MONGODB_URI environment variable.",
      },
      { status: 503 }
    );
  }

  try {
    console.log("🌱 Starting database seed...");

    // Connect to database
    await makeSureDbIsReady();

    // Clear existing data
    const deleteResult = await Tweet.deleteMany({});
    await Reaction.deleteMany({});
    await Comment.deleteMany({});
    await User.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing tweets, all reactions, comments, and users`);

    // Create users with hashed passwords
    const hashedUsers = await Promise.all(
      dummyUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    const insertedUsers = await User.insertMany(hashedUsers);
    console.log(`👥 Inserted ${insertedUsers.length} users with hashed passwords`);

    // Insert dummy tweets
    const insertedTweets = await Tweet.insertMany(dummyTweets);
    console.log(`✅ Inserted ${insertedTweets.length} dummy tweets`);

    // Create reactions for tweets
    const reactions = [];
    const reactionData = [
      { likes: 42, dislikes: 2 },   // Tweet 1
      { likes: 87, dislikes: 5 },   // Tweet 2
      { likes: 156, dislikes: 8 },  // Tweet 3
      { likes: 203, dislikes: 12 }, // Tweet 4
      { likes: 124, dislikes: 7 },  // Tweet 5
      { likes: 98, dislikes: 4 },   // Tweet 6
      { likes: 189, dislikes: 3 },  // Tweet 7
      { likes: 76, dislikes: 15 },  // Tweet 8
      { likes: 145, dislikes: 23 }, // Tweet 9
      { likes: 112, dislikes: 6 },  // Tweet 10
    ];

    insertedTweets.forEach((tweet, index) => {
      const { likes, dislikes } = reactionData[index] || { likes: 0, dislikes: 0 };
      
      // Add likes
      for (let i = 0; i < likes && i < 50; i++) {
        reactions.push({
          sourceType: "tweet",
          sourceId: tweet._id.toString(),
          author: reactionAuthors[i % reactionAuthors.length] + (i > 2 ? i : ""),
          type: "like",
        });
      }
      
      // Add dislikes
      for (let i = 0; i < dislikes && i < 50; i++) {
        reactions.push({
          sourceType: "tweet",
          sourceId: tweet._id.toString(),
          author: reactionAuthors[(i + likes) % reactionAuthors.length] + (i + likes > 2 ? (i + likes) : ""),
          type: "dislike",
        });
      }
    });

    if (reactions.length > 0) {
      await Reaction.insertMany(reactions);
      console.log(`👍 Inserted ${reactions.length} reactions`);
    }

    // Create some sample comments
    const comments = [
      {
        tweetId: insertedTweets[0]._id.toString(),
        author: "jane",
        text: "Great explanation! Very helpful for beginners.",
      },
      {
        tweetId: insertedTweets[0]._id.toString(),
        author: "demo",
        text: "Thanks for sharing this! Just what I needed.",
      },
      {
        tweetId: insertedTweets[1]._id.toString(),
        author: "john",
        text: "Aggregation pipelines are so powerful once you get the hang of them!",
      },
      {
        tweetId: insertedTweets[2]._id.toString(),
        author: "jane",
        text: "Welcome to REDI School! 🎉",
      },
    ];

    await Comment.insertMany(comments);
    console.log(`💬 Inserted ${comments.length} comments`);

    // Get stats
    const totalUsers = await User.countDocuments();
    const totalTweets = await Tweet.countDocuments();
    const totalReactions = await Reaction.countDocuments();
    const totalComments = await Comment.countDocuments();
    const likesCount = await Reaction.countDocuments({ type: "like" });
    const dislikesCount = await Reaction.countDocuments({ type: "dislike" });
    const viewsStats = await Tweet.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);

    const result = {
      success: true,
      message: "Database seeded successfully! 🎉",
      stats: {
        totalUsers,
        totalTweets,
        totalReactions,
        totalComments,
        totalLikes: likesCount,
        totalDislikes: dislikesCount,
        totalViews: viewsStats[0]?.totalViews || 0,
      },
    };

    console.log("\n📊 Seed Summary:");
    console.log(`   Total users: ${result.stats.totalUsers}`);
    console.log(`   Total tweets: ${result.stats.totalTweets}`);
    console.log(`   Total reactions: ${result.stats.totalReactions} (${result.stats.totalLikes} likes, ${result.stats.totalDislikes} dislikes)`);
    console.log(`   Total comments: ${result.stats.totalComments}`);
    console.log(`   Total views: ${result.stats.totalViews}`);

    return Response.json(result);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
