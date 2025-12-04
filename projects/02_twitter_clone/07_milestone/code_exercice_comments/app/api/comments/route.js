import { Comment } from "@/models/Comment";
import { makeSureDbIsReady } from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tweetId = searchParams.get("tweetId");

  if (!tweetId) {
    return Response.json({ error: "tweetId required" }, { status: 400 });
  }

  // Check if database should be used
  const shouldUseDatabase = process.env.MONGODB_URI && process.env.MONGODB_URI.length > 0;

  if (shouldUseDatabase) {
    try {
      await makeSureDbIsReady();
      const comments = await Comment.find({ tweetId }).sort({ createdAt: -1 }).lean();
      return Response.json({ comments, source: "database" });
    } catch (error) {
      console.error("Database error:", error);
      return Response.json({ error: "Database error" }, { status: 500 });
    }
  }

  // Without database, client will use Context API
  return Response.json({ comments: [], source: "context" });
}

export async function POST(request) {
  const { tweetId, author, text } = await request.json();

  if (!tweetId || !author || !text) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Check if database should be used
  const shouldUseDatabase = process.env.MONGODB_URI && process.env.MONGODB_URI.length > 0;

  if (shouldUseDatabase) {
    try {
      await makeSureDbIsReady();
      const comment = await Comment.create({ tweetId, author, text });
      return Response.json({ comment, source: "database" }, { status: 201 });
    } catch (error) {
      console.error("Database error:", error);
      return Response.json({ error: "Database error" }, { status: 500 });
    }
  }

  // Without database, return success (client will use Context API)
  const comment = {
    _id: Date.now().toString(),
    tweetId,
    author,
    text,
    createdAt: new Date().toISOString(),
  };
  return Response.json({ comment, source: "context" }, { status: 201 });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const commentId = searchParams.get("commentId");

  if (!commentId) {
    return Response.json({ error: "commentId required" }, { status: 400 });
  }

  // Check if database should be used
  const shouldUseDatabase = process.env.MONGODB_URI && process.env.MONGODB_URI.length > 0;

  if (shouldUseDatabase) {
    try {
      await makeSureDbIsReady();
      await Comment.findByIdAndDelete(commentId);
      return Response.json({ success: true, source: "database" });
    } catch (error) {
      console.error("Database error:", error);
      return Response.json({ error: "Database error" }, { status: 500 });
    }
  }

  // Without database, return success (client will use Context API)
  return Response.json({ success: true, source: "context" });
}
