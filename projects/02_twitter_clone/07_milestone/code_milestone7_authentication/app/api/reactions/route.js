import { Reaction } from "@/models/Reaction";
import { makeSureDbIsReady } from "@/lib/db";

// GET - Get reactions for a source (tweet or comment)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sourceId = searchParams.get("sourceId");
  const sourceType = searchParams.get("sourceType") || "tweet";

  if (!sourceId) {
    return Response.json({ error: "sourceId required" }, { status: 400 });
  }

  const shouldUseDatabase = process.env.MONGODB_URI && process.env.MONGODB_URI.length > 0;

  if (shouldUseDatabase) {
    try {
      await makeSureDbIsReady();
      
      const reactions = await Reaction.find({ sourceType, sourceId }).lean();
      
      // Count likes and dislikes
      const likes = reactions.filter(r => r.type === "like").length;
      const dislikes = reactions.filter(r => r.type === "dislike").length;
      
      return Response.json({ 
        likes, 
        dislikes, 
        reactions,
        source: "database" 
      });
    } catch (error) {
      console.error("Database error:", error);
      return Response.json({ error: "Database error" }, { status: 500 });
    }
  }

  // Without database, return empty (client will use fallback data)
  return Response.json({ likes: 0, dislikes: 0, reactions: [], source: "fallback" });
}

// POST - Add or update a reaction (toggle between like/dislike)
export async function POST(request) {
  const { sourceId, sourceType = "tweet", author, type } = await request.json();

  if (!sourceId || !author || !type) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!["like", "dislike"].includes(type)) {
    return Response.json({ error: "Invalid reaction type" }, { status: 400 });
  }

  const shouldUseDatabase = process.env.MONGODB_URI && process.env.MONGODB_URI.length > 0;

  if (shouldUseDatabase) {
    try {
      await makeSureDbIsReady();
      
      // Find existing reaction from this author
      const existingReaction = await Reaction.findOne({ sourceType, sourceId, author });
      
      if (existingReaction) {
        if (existingReaction.type === type) {
          // Same reaction - remove it (unlike/un-dislike)
          await Reaction.deleteOne({ _id: existingReaction._id });
          return Response.json({ 
            action: "removed", 
            reaction: existingReaction,
            source: "database" 
          });
        } else {
          // Different reaction - update it (switch from like to dislike or vice versa)
          existingReaction.type = type;
          await existingReaction.save();
          return Response.json({ 
            action: "updated", 
            reaction: existingReaction,
            source: "database" 
          });
        }
      } else {
        // No existing reaction - create new
        const reaction = await Reaction.create({ sourceType, sourceId, author, type });
        return Response.json({ 
          action: "created", 
          reaction,
          source: "database" 
        }, { status: 201 });
      }
    } catch (error) {
      console.error("Database error:", error);
      return Response.json({ error: "Database error" }, { status: 500 });
    }
  }

  // Without database, return success (client will use fallback)
  return Response.json({ 
    action: "created", 
    reaction: { sourceId, sourceType, author, type },
    source: "fallback" 
  }, { status: 201 });
}

// DELETE - Remove a reaction
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const sourceId = searchParams.get("sourceId");
  const sourceType = searchParams.get("sourceType") || "tweet";
  const author = searchParams.get("author");

  if (!sourceId || !author) {
    return Response.json({ error: "sourceId and author required" }, { status: 400 });
  }

  const shouldUseDatabase = process.env.MONGODB_URI && process.env.MONGODB_URI.length > 0;

  if (shouldUseDatabase) {
    try {
      await makeSureDbIsReady();
      await Reaction.deleteOne({ sourceType, sourceId, author });
      return Response.json({ success: true, source: "database" });
    } catch (error) {
      console.error("Database error:", error);
      return Response.json({ error: "Database error" }, { status: 500 });
    }
  }

  return Response.json({ success: true, source: "fallback" });
}
