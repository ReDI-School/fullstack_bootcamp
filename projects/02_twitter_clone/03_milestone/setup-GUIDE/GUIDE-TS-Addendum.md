# **TypeScript Addendum: MongoDB Setup Guide**

> 🧭 **Who this is for**: you are building your Twitter clone in **TypeScript** and are following the *MongoDB Setup Guide*. The guide shows JavaScript (`.js`) files. This page gives you the **TypeScript version of every code block**. Everything else in the guide (Atlas, `.env.local`, testing, troubleshooting, Part B) stays exactly the same.

## **What changes?**

| Guide step | Guide file (JS) | Your file (TS) |
| --- | --- | --- |
| Step 4 | `lib/db.js` | `lib/db.ts` |
| Step 5 | `models/Tweet.js` | `models/Tweet.ts` |
| Step 6 | `app/api/tweets/route.js` | `app/api/tweets/route.ts` |
| Step 7 | `app/page.js` | `app/page.tsx` |
| Step 8 | `app/api/tweets/[id]/route.js` | `app/api/tweets/[id]/route.ts` |
| Part B, Step 13 | `scripts/seed.mjs` | **no change**, it is a plain Node script |

The **imports stay the same** (`@/lib/db`, `@/models/Tweet`, no file extension). You do **not** need to install extra type packages: Mongoose ships with its own types.

---

## **Step 4: `lib/db.ts`**

In JS we can put anything on `global`. TypeScript wants to know about it first, which is what the `declare global` block does.

```ts
// lib/db.ts
import mongoose from "mongoose";
import assert from "node:assert";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Tell TypeScript that we store a cache on the global object
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// A little "memory" that survives hot reloads (see the guide for why)
const cached: MongooseCache = global.mongoose ?? {
  conn: null,
  promise: null,
};
global.mongoose = cached;

export async function makeSureDbIsReady() {
  if (cached.conn) {
    return cached.conn;
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  assert(
    MONGODB_URI,
    "Please define the MONGODB_URI environment variable inside .env.local"
  );

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // If connecting failed, forget the failed promise so the next call can try again
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
```

---

## **Step 5: `models/Tweet.ts`**

Here you write **both** things from the guide's "TypeScript interfaces" section: the **interface** (checked while you type) and the **Schema** (checked while the app runs).

```ts
// models/Tweet.ts
import { Schema, model, models, Model } from "mongoose";

// 1. The INTERFACE: what a tweet looks like, for TypeScript
export interface ITweet {
  content: string;
  author: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  updatedAt: Date;
}

// 2. The SCHEMA: the blueprint that Mongoose enforces at runtime
const TweetSchema = new Schema<ITweet>(
  {
    content: {
      type: String,
      required: true,
      maxlength: [280, "A tweet cannot be longer than 280 characters"],
    },
    author: {
      type: String,
      default: "anonymous",
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// 3. The MODEL (the "models.Tweet ??" part is for hot reloading, see the guide)
export const Tweet: Model<ITweet> =
  (models.Tweet as Model<ITweet>) ?? model<ITweet>("Tweet", TweetSchema);
```

---

## **Step 6: `app/api/tweets/route.ts`**

Two TypeScript details: the `request` needs a type, and in a `catch` block `error` is of type `unknown`, so we cannot simply write `error.message`.

```ts
// app/api/tweets/route.ts
import { makeSureDbIsReady } from "@/lib/db";
import { Tweet } from "@/models/Tweet";

// GET /api/tweets  →  return all tweets, newest first
export async function GET() {
  await makeSureDbIsReady();

  const tweets = await Tweet.find({}).sort({ createdAt: -1 });
  return Response.json(tweets);
}

// POST /api/tweets  →  create a new tweet
export async function POST(request: Request) {
  await makeSureDbIsReady();

  const body: { content?: string; author?: string } = await request.json();

  try {
    // We pick the fields ourselves, so nobody can sneak in e.g. upvotes: 9999
    const tweet = await Tweet.create({
      content: body.content,
      author: body.author,
    });
    return Response.json(tweet, { status: 201 });
  } catch (error) {
    // e.g. content missing or too long → Mongoose validation error
    const message =
      error instanceof Error ? error.message : "Error creating tweet";
    return Response.json({ error: message }, { status: 400 });
  }
}
```

---

## **Step 7: `app/page.tsx`**

We describe the tweet *as the browser receives it* (JSON, so `_id` is a plain string and dates are strings). That is why this `Tweet` type is separate from the `ITweet` interface of the model.

```tsx
// app/page.tsx
"use client";
import { FormEvent, useEffect, useState } from "react";

type Tweet = {
  _id: string;
  content: string;
  author: string;
  upvotes: number;
  downvotes: number;
};

export default function Home() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [content, setContent] = useState("");

  // Load all tweets once, when the page opens
  useEffect(() => {
    async function loadTweets() {
      const res = await fetch("/api/tweets");
      const data: Tweet[] = await res.json();
      setTweets(data);
    }
    loadTweets();
  }, []);

  // Create a new tweet
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const res = await fetch("/api/tweets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) {
      const err: { error: string } = await res.json();
      alert(err.error);
      return;
    }

    const newTweet: Tweet = await res.json();
    setTweets([newTweet, ...tweets]);
    setContent("");
  }

  return (
    <main>
      <h1>My Twitter Clone</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
        />
        <button type="submit">Tweet</button>
      </form>

      <ul>
        {tweets.map((tweet) => (
          <li key={tweet._id}>{tweet.content}</li>
        ))}
      </ul>
    </main>
  );
}
```

---

## **Step 8: voting**

### **8.1 `app/api/tweets/[id]/route.ts`**

In current Next.js versions `params` is a Promise, so we type it that way and `await` it.

```ts
// app/api/tweets/[id]/route.ts
import { makeSureDbIsReady } from "@/lib/db";
import { Tweet } from "@/models/Tweet";

type RouteContext = { params: Promise<{ id: string }> };

// PATCH /api/tweets/<id>  with body { "type": "up" } or { "type": "down" }
export async function PATCH(request: Request, { params }: RouteContext) {
  await makeSureDbIsReady();

  const { id } = await params;
  const { type }: { type?: string } = await request.json();

  const field =
    type === "up" ? "upvotes" : type === "down" ? "downvotes" : null;

  if (!field) {
    return Response.json(
      { error: 'type must be "up" or "down"' },
      { status: 400 }
    );
  }

  try {
    const tweet = await Tweet.findByIdAndUpdate(
      id,
      { $inc: { [field]: 1 } },
      { new: true }
    );

    if (!tweet) {
      return Response.json({ error: "Tweet not found" }, { status: 404 });
    }

    return Response.json(tweet);
  } catch (error) {
    return Response.json({ error: "Invalid tweet id" }, { status: 400 });
  }
}
```

### **8.2 The vote function in `app/page.tsx`**

The `type` parameter can only be `"up"` or `"down"`. TypeScript will now stop you if you write `"upp"` by accident.

```tsx
async function handleVote(id: string, type: "up" | "down") {
  const res = await fetch(`/api/tweets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type }),
  });

  if (!res.ok) return;

  const updatedTweet: Tweet = await res.json();
  setTweets(tweets.map((t) => (t._id === updatedTweet._id ? updatedTweet : t)));
}
```

The buttons in the list item are identical to the guide:

```tsx
<li key={tweet._id}>
  {tweet.content}
  <button onClick={() => handleVote(tweet._id, "up")}>👍 {tweet.upvotes}</button>
  <button onClick={() => handleVote(tweet._id, "down")}>👎 {tweet.downvotes}</button>
</li>
```

---

## **Extra troubleshooting for TypeScript**

| Symptom / error message | Likely cause | Fix |
| --- | --- | --- |
| `Property 'mongoose' does not exist on type 'typeof globalThis'` | The `declare global { var mongoose ... }` block is missing | Copy the whole top of `lib/db.ts` from Step 4 above. |
| `'error' is of type 'unknown'` | In TS, caught errors are `unknown` | Check with `error instanceof Error` before using `error.message`. |
| `Type '{ params: { id: string } }' is not assignable...` (in `[id]/route.ts`) | `params` is a Promise in current Next.js | Type it as `{ params: Promise<{ id: string }> }` and `await params`. |
| `Unexpected var, use let or const` (ESLint) | `declare global` requires `var` | Keep the `// eslint-disable-next-line no-var` comment above it. |
| Red squiggle on `tweet.upvotes` after `findOne` | `findOne` can return `null` | Check `if (tweet) { ... }` first. |
