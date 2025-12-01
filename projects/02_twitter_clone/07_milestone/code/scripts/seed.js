import { makeSureDbIsReady } from "../lib/db.js";
import { Tweet } from "../models/Tweet.js";

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
    title: "MongoDB + Mongoose = ❤️",
    body: "Finally got MongoDB working with Mongoose ODM. The schema validation and type safety make working with NoSQL databases so much easier. Highly recommend for Node.js projects!",
    tags: ["mongodb", "nodejs", "database"],
    reactions: { likes: 35, dislikes: 1 },
    views: 256,
    userId: 2,
  },
  {
    title: "Tailwind CSS Dark Mode Tips",
    body: "Pro tip: Use the 'dark:' prefix in Tailwind to create beautiful dark mode designs without writing custom CSS. Your users will thank you! 🌙",
    tags: ["tailwindcss", "css", "darkmode"],
    reactions: { likes: 67, dislikes: 3 },
    views: 489,
    userId: 3,
  },
  {
    title: "Docker Compose for Local Development",
    body: "Setting up MongoDB with Docker Compose is the best way to keep your dev environment consistent. No more 'works on my machine' issues! 🐳",
    tags: ["docker", "devops", "mongodb"],
    reactions: { likes: 89, dislikes: 4 },
    views: 612,
    userId: 1,
  },
  {
    title: "Why I Love Server Components",
    body: "React Server Components let me fetch data directly in my components without client-side JavaScript. Faster page loads, better SEO, and simpler code. What's not to love?",
    tags: ["react", "nextjs", "performance"],
    reactions: { likes: 124, dislikes: 8 },
    views: 1043,
    userId: 4,
  },
  {
    title: "RESTful API Best Practices",
    body: "When building APIs: use proper HTTP methods, return meaningful status codes, version your endpoints, and always validate input. Your future self will thank you! 🚀",
    tags: ["api", "rest", "backend"],
    reactions: { likes: 156, dislikes: 5 },
    views: 1289,
    userId: 2,
  },
  {
    title: "JavaScript Array Methods Cheatsheet",
    body: "map(), filter(), reduce(), find(), some(), every()... Master these and you'll write cleaner, more functional JavaScript. No more messy for loops! 📚",
    tags: ["javascript", "programming", "tutorial"],
    reactions: { likes: 203, dislikes: 12 },
    views: 1876,
    userId: 5,
  },
  {
    title: "Building a Twitter Clone",
    body: "Just finished building a Twitter clone with Next.js, MongoDB, and Tailwind. Learned so much about full-stack development! Check out the repo on GitHub 👨‍💻",
    tags: ["project", "fullstack", "learning"],
    reactions: { likes: 78, dislikes: 3 },
    views: 542,
    userId: 3,
  },
  {
    title: "Environment Variables in Next.js",
    body: "Remember: NEXT_PUBLIC_ prefix for client-side env vars, no prefix for server-only. Keep your secrets safe and your builds secure! 🔐",
    tags: ["nextjs", "security", "tips"],
    reactions: { likes: 91, dislikes: 2 },
    views: 734,
    userId: 1,
  },
  {
    title: "Git Commit Message Tips",
    body: "Write commit messages like you're explaining to your future self. Use conventional commits: feat:, fix:, docs:, refactor:. Your team will love you! 💚",
    tags: ["git", "bestpractices", "development"],
    reactions: { likes: 145, dislikes: 7 },
    views: 1156,
    userId: 4,
  },
];

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seed...");

    // Connect to database
    await makeSureDbIsReady();

    // Clear existing tweets
    const deleteResult = await Tweet.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing tweets`);

    // Insert dummy tweets
    const insertedTweets = await Tweet.insertMany(dummyTweets);
    console.log(`✅ Successfully added ${insertedTweets.length} dummy tweets!`);

    // Show summary
    console.log("\n📊 Database Summary:");
    console.log(`   Total tweets: ${insertedTweets.length}`);
    console.log(
      `   Total likes: ${dummyTweets.reduce((sum, t) => sum + t.reactions.likes, 0)}`
    );
    console.log(
      `   Total views: ${dummyTweets.reduce((sum, t) => sum + t.views, 0)}`
    );
    console.log("\n🎉 Database seeded successfully!\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
