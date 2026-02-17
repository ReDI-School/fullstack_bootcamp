import { makeSureDbIsReady } from "@/lib/db.js";
import { Tweet } from "@/models/Tweet.js";

const dummyTweets = [
  {
    title: "Getting Started with Next.js 16",
    body: "Just deployed my first Next.js 16 app with the new App Router! The developer experience is amazing. Server Components are a game changer for performance. #nextjs #react #webdev",
    tags: ["nextjs", "react", "webdev"],
    reactions: { likes: 42, dislikes: 2 },
    views: 328,
    userId: 1,
  },
  {
    title: "MongoDB Tips for Beginners",
    body: "Been working with MongoDB for a few months now. Here are my top 3 tips: 1) Always index your queries, 2) Use aggregation pipelines, 3) Keep your schemas flexible but consistent. What are your favorite MongoDB tips?",
    tags: ["mongodb", "database", "tips"],
    reactions: { likes: 87, dislikes: 5 },
    views: 654,
    userId: 2,
  },
  {
    title: "Hello REDI SCHOOL STUDENTS!",
    body: "The tweet is fetched from localMongoDB! 🎨",
    tags: ["tailwind", "css", "webdesign"],
    reactions: { likes: 156, dislikes: 8 },
    views: 1203,
    userId: 3,
  },
  {
    title: "Docker Compose for Local Development",
    body: "Setting up Docker Compose has transformed my local dev workflow. No more 'works on my machine' issues! Spinning up databases, caching layers, and services is now a single command. Highly recommend! 🐳",
    tags: ["docker", "devops", "productivity"],
    reactions: { likes: 203, dislikes: 12 },
    views: 1876,
    userId: 1,
  },
  {
    title: "React 19 Features I'm Excited About",
    body: "React 19 brings some amazing features: Server Components, improved Suspense, and better error handling. The future of React development looks bright! Can't wait to use these in production.",
    tags: ["react", "javascript", "frontend"],
    reactions: { likes: 124, dislikes: 7 },
    views: 892,
    userId: 4,
  },
  {
    title: "Building RESTful APIs in 2025",
    body: "Just finished a course on modern API design. Key takeaways: versioning is crucial, always document with OpenAPI, use proper HTTP status codes, and implement rate limiting from day one. 🚀",
    tags: ["api", "backend", "rest"],
    reactions: { likes: 98, dislikes: 4 },
    views: 743,
    userId: 2,
  },
  {
    title: "JavaScript Array Methods Cheat Sheet",
    body: "Here's a quick reference for JS array methods: map() for transformation, filter() for selection, reduce() for aggregation, find() for searching. Master these and you'll write cleaner code! 📝",
    tags: ["javascript", "tutorial", "coding"],
    reactions: { likes: 189, dislikes: 3 },
    views: 1456,
    userId: 5,
  },
  {
    title: "Git Workflows That Actually Work",
    body: "After years of trial and error, I've settled on trunk-based development with feature flags. It's simpler than Git Flow and works great for continuous deployment. What's your preferred Git workflow?",
    tags: ["git", "workflow", "devops"],
    reactions: { likes: 76, dislikes: 15 },
    views: 567,
    userId: 3,
  },
  {
    title: "Why I Love TypeScript",
    body: "TypeScript has saved me countless hours of debugging. The type safety, IDE support, and refactoring capabilities are unmatched. If you're still writing plain JavaScript, give TypeScript a try!",
    tags: ["typescript", "javascript", "programming"],
    reactions: { likes: 145, dislikes: 23 },
    views: 1089,
    userId: 4,
  },
  {
    title: "Testing Strategies for Modern Web Apps",
    body: "My testing pyramid: lots of unit tests, some integration tests, few E2E tests. Using Jest for units, React Testing Library for components, and Playwright for E2E. This balance works perfectly! ✅",
    tags: ["testing", "javascript", "quality"],
    reactions: { likes: 112, dislikes: 6 },
    views: 834,
    userId: 5,
  },
];

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

    // Clear existing tweets
    const deleteResult = await Tweet.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing tweets`);

    // Insert dummy tweets
    const insertedTweets = await Tweet.insertMany(dummyTweets);
    console.log(`✅ Inserted ${insertedTweets.length} dummy tweets`);

    // Get stats
    const totalTweets = await Tweet.countDocuments();
    const stats = await Tweet.aggregate([
      {
        $group: {
          _id: null,
          totalLikes: { $sum: "$reactions.likes" },
          totalViews: { $sum: "$views" },
        },
      },
    ]);

    const result = {
      success: true,
      message: "Database seeded successfully! 🎉",
      stats: {
        totalTweets,
        totalLikes: stats[0]?.totalLikes || 0,
        totalViews: stats[0]?.totalViews || 0,
      },
    };

    console.log("\n📊 Seed Summary:");
    console.log(`   Total tweets: ${result.stats.totalTweets}`);
    console.log(`   Total likes: ${result.stats.totalLikes}`);
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
