# **Milestone 3 – Practical Guide: From `db.json` to a Real Database**

> 🧭 **Who this is for**: you have a working Next.js Twitter clone that stores tweets in a `db.json` file (or `localStorage`), and you now want to store them in a **real database** – MongoDB, running in the cloud on **MongoDB Atlas**.
>
> **How to use this guide**: work through the steps **in order**. Every step ends with a ✅ **Checkpoint** – a small thing you can *see* working. **Don't continue until the checkpoint works.** If something breaks, you will know exactly which step caused it.
>
> ⏱️ Plan for about 2–3 hours in total. It is fine to take it slowly, and to split it over a few sessions.
>
> This guide is the *hands-on companion* to the Milestone 3 `README.md`. The README explains the theory (SQL vs NoSQL, CRUD, ...). This guide tells you **what to click, what to type, and why**.

---

## **Table of Contents**

0. [The big picture (read this first!)](#0-the-big-picture-read-this-first)
1. [Bridging the gap: from `db.json` to MongoDB](#1-bridging-the-gap-from-dbjson-to-mongodb)
2. [Create your free database on MongoDB Atlas](#2-create-your-free-database-on-mongodb-atlas)
3. [Store the connection string safely (`.env.local`)](#3-store-the-connection-string-safely-envlocal)
4. [Install Mongoose and write the connection helper (`lib/db.js`)](#4-install-mongoose-and-write-the-connection-helper-libdbjs)
5. [Describe a tweet: Schema and Model (`models/Tweet.js`)](#5-describe-a-tweet-schema-and-model-modelstweetjs)
6. [Create the API route and test it without any UI](#6-create-the-api-route-and-test-it-without-any-ui)
7. [Connect your React page to the API](#7-connect-your-react-page-to-the-api)
8. [Upvotes and downvotes](#8-upvotes-and-downvotes)
9. [Troubleshooting](#9-troubleshooting)
10. [Final checklist and glossary](#10-final-checklist-and-glossary)

**Part B – Toolbox (optional, after you finish Part A)**

11. [Three ways to look at your data: Atlas, Compass, mongosh](#11-three-ways-to-look-at-your-data)
12. [The sample dataset](#12-the-sample-dataset)
13. [Seed data](#13-seed-data)
14. [Three doors into one database](#14-three-doors-into-one-database)

---

## **0. The big picture (read this first!)**

Before touching any code, let's understand **who talks to whom**. This is the single most useful thing to understand in this milestone.

```
  YOUR BROWSER                    YOUR NEXT.JS SERVER                          THE CLOUD
 ┌───────────────┐   fetch()    ┌──────────────────────────────┐  Mongoose  ┌──────────────┐
 │ app/page.js   │ ───────────▶ │ app/api/tweets/route.js      │ ─────────▶ │   MongoDB    │
 │ (React, UI)   │ ◀─────────── │  uses lib/db.js + models/    │ ◀───────── │   (Atlas)    │
 └───────────────┘     JSON     └──────────────────────────────┘            └──────────────┘
```

**The golden rule: the browser never talks to the database directly.**
The browser asks *your API route* (using `fetch`), and the API route talks to the database. Why?

- The database password must stay **secret** – code in the browser can be read by anyone.
- The API route is the place where you can **check** the data before saving it.

You already know the left half of this picture from Milestone 2 (`fetch` + `useEffect`). The new part is the right half: **API route → Mongoose → MongoDB**.

### **The new files and what each one is for**

You will create 4 new things. Each has exactly one job:

| File | Its one job | Real-life analogy |
| --- | --- | --- |
| `.env.local` | Holds the **secret address + password** of your database | The key to the building |
| `lib/db.js` | **Opens the connection** to the database (once) | Opening the door |
| `models/Tweet.js` | Describes **what a tweet looks like** and gives us tools like `find` and `create` | The form template + the filing clerk |
| `app/api/tweets/route.js` | The **door the browser knocks on**: receives requests, uses the model, sends answers | The reception desk |

That's it. When it feels like "so many new things" – remember: **4 files, 4 jobs**.

### **Where does JSON appear in all of this?**

You might have seen the "JSON – The Missing Link" slides. Here is exactly where JSON shows up in this milestone:

| Where | What happens | Do I need `JSON.stringify` / `.json()`? |
| --- | --- | --- |
| Browser → API route | We send data as a **JSON string** inside `fetch` | ✅ Yes: `body: JSON.stringify({...})` |
| API route → Browser | We answer with JSON | ✅ `Response.json(data)` does the stringify for you; in the browser we use `await res.json()` |
| API route ↔ MongoDB | **Mongoose does the translation** | ❌ No! Never stringify/parse here. Just pass normal JavaScript objects. |

> 💡 MongoDB documents *look like* JSON (that's why they feel familiar), but behind the scenes MongoDB stores them in a binary format called BSON. **You don't need to care about that** – Mongoose takes care of it.

---

## **1. Bridging the gap: from `db.json` to MongoDB**

You already know how to store data. Here is what changes and what stays the same.

### **Your `db.json` world vs. the MongoDB world**

| What you did with `db.json` | The MongoDB equivalent |
| --- | --- |
| The file `db.json` | A **database** (e.g. `twitter-clone`) |
| The `"tweets": [...]` array | A **collection** called `tweets` |
| One tweet object in that array | One **document** |
| One property of the object (`content`) | One **field** |
| An `id` you generated yourself | An `_id` that **MongoDB generates for you** |
| `fs.readFile` + `JSON.parse` | `Tweet.find()` |
| `array.push(...)` + `fs.writeFile` | `Tweet.create({...})` |
| Editing an object in the array and saving the file | `Tweet.findByIdAndUpdate(...)` |
| `array.filter(...)` + `fs.writeFile` | `Tweet.findByIdAndDelete(...)` |

**The shape of your data barely changes. What changes is *where* it lives and *how* you reach it.**

### **If you already know SQL**

| SQL | MongoDB / Mongoose |
| --- | --- |
| database | database |
| table | collection |
| row | document |
| column | field |
| primary key | `_id` |
| `CREATE TABLE` | `new Schema({...})` – but see the note below |
| `SELECT` | `Model.find()` |
| `INSERT` | `Model.create()` |
| `UPDATE` | `Model.findByIdAndUpdate()` |
| `DELETE` | `Model.findByIdAndDelete()` |

> ⚠️ **Important difference**: In SQL, the *database itself* enforces the table structure. MongoDB does **not** – it will happily store anything. The structure is enforced by **Mongoose**, in your code. That's what the Schema is for.

### **If you already know MongoDB**

You know the concepts. In this guide you will use **Mongoose** instead of the plain driver, and Atlas instead of a local instance. The new parts for you are the Next.js-specific connection caching (Step 4) and API routes (Step 6).

### **Schema vs. Model vs. Document – three words, one picture**

These three words confuse almost everyone at first:

| Word | Meaning | Analogy |
| --- | --- | --- |
| **Schema** | The *blueprint*: which fields exist, what type, which are required | A blank paper form |
| **Model** | The *tool* built from the schema. It has methods like `find`, `create`, ... and is connected to one collection | The clerk who knows the form and the filing cabinet |
| **Document** | *One* saved tweet | One filled-in form |
| **Collection** | All saved tweets together | The filing cabinet |

### **If you know TypeScript interfaces**

A Mongoose **Schema** and a TypeScript **interface** describe the *same shape* (`content: string`, `upvotes: number`, ...) but do **different jobs**:

- A TypeScript `interface` is checked **while you write code** and disappears when the app is built.
- A Mongoose `Schema` is checked **while the app runs**, when real data is about to be saved.

In the TypeScript version of this milestone you will write **both**, side by side.

---

## **2. Create your free database on MongoDB Atlas**

⏱️ ~15 minutes

**MongoDB Atlas** is a service where MongoDB runs the database *for you* in the cloud. The free tier (called **M0**) is enough for this whole course and needs **no credit card**.

> 📝 Atlas changes its interface from time to time. If a button or menu has a slightly different name than in this guide, look for the same *concept* (account → free cluster → database user → network access → connection string).

### **2.1 Create an account**

1. Go to [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) and click the button to start for free.
2. Sign up with your email, Google, or GitHub. Confirm your email if asked.

### **2.2 Create a free cluster**

A **cluster** is simply "the computer(s) in the cloud where your database lives".

1. Choose to create a new deployment / database.
2. Select the **Free (M0)** option. ⚠️ Make sure it says free – don't pick a paid tier.
3. Choose any cloud provider, and a **region close to you** (for example Frankfurt if you are in Germany).
4. Keep the default cluster name (e.g. `Cluster0`) and click **Create**.

It takes a minute or two for the cluster to be ready.

### **2.3 Create a database user**

This is the **username and password your app will use** to log in to the database. It is *not* the same as your Atlas account login!

1. In the left sidebar, find **Database Access** (usually under *Security*).
2. Click **Add New Database User**.
3. Choose **Password** authentication.
4. Enter a username (e.g. `tweetapp`) and a password.

> ⚠️ **Use a password with only letters and numbers** (e.g. `Banana2025Tree`). Special characters like `@ : / ? #` have a special meaning inside the connection string and will break it unless you encode them. Keep it simple for now.

5. **Write down** the username and password. You'll need them in a minute.
6. Click **Add User**. (The default permissions – read and write – are fine.)

### **2.4 Allow your computer to connect (Network Access)**

By default, Atlas **blocks all connections**. We need to tell it who may connect.

1. In the left sidebar, open **Network Access**.
2. Click **Add IP Address**.
3. For learning purposes, choose **Allow access from anywhere** (this enters `0.0.0.0/0`).
4. Confirm.

> 🔐 "Allow from anywhere" is OK **for a learning project with a strong password and no sensitive data**. In a real production app you would restrict this. Alternatively, choose "Add current IP address" – but your IP changes when you switch networks (home → café → school), and then the connection suddenly stops working. That's the #1 reason for "it worked yesterday!"

### **2.5 Get your connection string**

The **connection string** is the single line of text that contains *everything* needed to reach your database: where it is, and who you are.

1. Go to your cluster overview and click **Connect**.
2. Choose **Drivers**.
3. Select **Node.js** and copy the connection string.

It looks like this:

```
mongodb+srv://tweetapp:<password>@cluster0.abc12.mongodb.net/?retryWrites=true&w=majority
```

Now **edit it in a text editor** (not yet in your project):

1. Replace `<password>` with your real password – and **remove the `<` and `>` brackets** too.
2. Add a **database name** after `.net/` and before the `?`. We'll call it `twitter-clone`.

Result:

```
mongodb+srv://tweetapp:Banana2025Tree@cluster0.abc12.mongodb.net/twitter-clone?retryWrites=true&w=majority
```

Let's read this string piece by piece:

| Part | Meaning |
| --- | --- |
| `mongodb+srv://` | "This is a MongoDB address" |
| `tweetapp:Banana2025Tree` | username : password |
| `@cluster0.abc12.mongodb.net` | where your cluster lives |
| `/twitter-clone` | the name of the database inside the cluster (it's created automatically when you save the first tweet) |
| `?retryWrites=true&w=majority` | extra options – leave as is |

✅ **Checkpoint 2**: You have a complete connection string saved in a text file, with your real password and a database name in it. **Treat it like a password – never post it on GitHub, Discord, or in screenshots.**

---

## **3. Store the connection string safely (`.env.local`)**

⏱️ ~5 minutes

We must **not** paste the connection string into our code. Code gets committed to GitHub – and then everyone can read your password. Instead, we use an **environment variable**.

### **3.1 Create the file**

In the **root folder** of your project (next to `package.json` – *not* inside `app/`), create a file named exactly:

```
.env.local
```

Put this inside (use *your* string, with no quotes and no spaces around the `=`):

```sh
MONGODB_URI=mongodb+srv://tweetapp:Banana2025Tree@cluster0.abc12.mongodb.net/twitter-clone?retryWrites=true&w=majority
```

### **3.2 Make sure it will not be committed**

Open your `.gitignore`. A project made with `create-next-app` already ignores `.env*` files. Check that you see a line like this:

```
.env*
```

If it isn't there, add `.env.local` to `.gitignore` **before** your next commit.

### **3.3 Restart the dev server**

Next.js reads `.env.local` **only when it starts**. Stop your dev server (`Ctrl + C`) and run `npm run dev` again. **Every time you change `.env.local`, restart the server.**

> 💡 **How it works**: in server code (API routes), you can now read the value with `process.env.MONGODB_URI`. Don't prefix it with `NEXT_PUBLIC_` – that prefix would send the value to the browser, which is exactly what we don't want.

✅ **Checkpoint 3**: `.env.local` exists in the project root, contains `MONGODB_URI=...`, and is listed in `.gitignore`. The dev server was restarted.

---

## **4. Install Mongoose and write the connection helper (`lib/db.js`)**

⏱️ ~20 minutes

### **4.1 Install Mongoose**

```sh
npm install mongoose
```

**Mongoose** is the library that lets you talk to MongoDB with normal JavaScript objects and functions instead of raw database commands (it's called an *ODM*, see the README).

### **4.2 Create the connection helper**

Create the file `lib/db.js`.

> 📁 **Where do I put it?** In the project root next to the `app` folder: `lib/db.js`. If your project uses a `src/` folder, put it in `src/lib/db.js`. The `@/` shortcut used in imports points to the root (or to `src/`) automatically.

```js
// lib/db.js
import mongoose from "mongoose";
import assert from "node:assert";

// --- Part 1: a little "memory" that survives hot reloads ---
// In development, Next.js reloads your code every time you save a file.
// Without this memory, every reload would open a NEW connection to the database,
// and you'd quickly run out of connections.
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// --- Part 2: the function we call before every database operation ---
export async function makeSureDbIsReady() {
  // Already connected? Reuse the connection.
  if (cached.conn) {
    return cached.conn;
  }

  // Read the connection string from .env.local
  const MONGODB_URI = process.env.MONGODB_URI;
  assert(
    MONGODB_URI,
    "Please define the MONGODB_URI environment variable inside .env.local"
  );

  // Not connecting yet? Start connecting (and remember the promise).
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  try {
    // Wait until the connection is really established
    cached.conn = await cached.promise;
  } catch (error) {
    // If connecting failed, forget the failed promise so the next call can try again
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
```

**What you need to understand** (you don't need to memorize the code):

1. Connecting to a database takes time, so we do it **once** and **reuse** the connection.
2. `global.mongoose` is a little storage box that survives Next.js hot reloads.
3. `assert(MONGODB_URI, "...")` stops with a clear error message if you forgot to set up `.env.local`.
4. **From now on, every API route that uses the database starts with `await makeSureDbIsReady();`**

> 💡 Next.js's official Mongoose example does the same thing under a different name (`dbConnect`). You can compare it with the code above – it's good practice in reading other people's code.

✅ **Checkpoint 4**: `lib/db.js` exists and `mongoose` appears in your `package.json` dependencies. (We'll test the connection for real in Step 6.)

---

## **5. Describe a tweet: Schema and Model (`models/Tweet.js`)**

⏱️ ~20 minutes

### **5.1 Look at your own data first**

Open your `db.json`. Each tweet object there will become **one document**. Maybe it looks like this:

```json
{
  "id": 1,
  "content": "Learning Next.js!",
  "upvotes": 3,
  "downvotes": 0
}
```

The Schema describes this shape. **Use the field names from *your* project** – the ones below are just an example.

### **5.2 Create the model**

Create the file `models/Tweet.js` (again: next to `app/`, or in `src/` if you use it).

```js
// models/Tweet.js
import mongoose from "mongoose";

// 1. The SCHEMA: the blueprint of a tweet
const TweetSchema = new mongoose.Schema(
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
  { timestamps: true } // Mongoose adds createdAt and updatedAt automatically
);

// 2. The MODEL: the tool built from the schema
// The "mongoose.models.Tweet ??" part is needed because of hot reloading:
// without it, Next.js would try to define the model twice and crash.
export const Tweet =
  mongoose.models.Tweet ?? mongoose.model("Tweet", TweetSchema);
```

**What's happening here?**

- `required: true` → saving a tweet without `content` will fail with a clear error.
- `maxlength` → too-long tweets are rejected.
- `default: 0` → if we don't say anything about votes, they start at 0.
- `timestamps: true` → we get `createdAt` for free (useful to sort tweets by date).
- `mongoose.model("Tweet", TweetSchema)` creates the model. Mongoose automatically uses the collection **`tweets`** (lowercase + plural).
- We don't define `_id` – MongoDB creates it for every document.

> ⚠️ **Remember: the Schema is enforced by Mongoose, not by MongoDB.** If you later change the schema, tweets that are *already* in the database are not automatically changed.

✅ **Checkpoint 5**: `models/Tweet.js` exists. Nothing visible happens yet – that's normal.

---

## **6. Create the API route and test it without any UI**

⏱️ ~30 minutes

Now we connect everything. **We deliberately test the API *before* touching the React page.** If something fails, it's much easier to find the problem when only one piece is involved.

### **6.1 Create the route file**

Create `app/api/tweets/route.js`:

```js
// app/api/tweets/route.js
import { makeSureDbIsReady } from "@/lib/db";
import { Tweet } from "@/models/Tweet";

// GET /api/tweets  →  return all tweets, newest first
export async function GET() {
  await makeSureDbIsReady();

  const tweets = await Tweet.find({}).sort({ createdAt: -1 });
  return Response.json(tweets);
}

// POST /api/tweets  →  create a new tweet
export async function POST(request) {
  await makeSureDbIsReady();

  const body = await request.json(); // read the JSON the browser sent

  try {
    // We pick the fields ourselves, so nobody can sneak in e.g. upvotes: 9999
    const tweet = await Tweet.create({
      content: body.content,
      author: body.author,
    });
    return Response.json(tweet, { status: 201 });
  } catch (error) {
    // e.g. content missing or too long → Mongoose validation error
    return Response.json({ error: error.message }, { status: 400 });
  }
}
```

> 💡 `Response.json(...)` converts your JavaScript object to a JSON string for you (that's the `stringify` step). `request.json()` does the reverse: it turns the JSON text the browser sent back into an object.

### **6.2 Test the GET route in the browser**

1. Make sure the dev server is running (`npm run dev`).
2. Open `http://localhost:3000/api/tweets` in your browser.

You should see:

```json
[]
```

An empty list! That means: **your app connected to Atlas, asked the (still empty) `tweets` collection for its documents, and got an empty list back.** 🎉

> If you see an error instead, jump to [Troubleshooting](#9-troubleshooting).

### **6.3 Test the POST route with Thunder Client or Postman**

You can't send a POST request by typing a URL in the browser, so use **Thunder Client** (VS Code extension) or **Postman**:

1. Method: `POST`
2. URL: `http://localhost:3000/api/tweets`
3. Body → **JSON**:

```json
{
  "content": "Hello from the database!",
  "author": "me"
}
```

4. Click **Send**. You should get status `201` and a response like:

```json
{
  "_id": "665f1c2a9b1e4a0012ab34cd",
  "content": "Hello from the database!",
  "author": "me",
  "upvotes": 0,
  "downvotes": 0,
  "createdAt": "2025-06-04T10:15:22.123Z",
  "updatedAt": "2025-06-04T10:15:22.123Z",
  "__v": 0
}
```

Notice what the database added for us: `_id`, `createdAt`, `updatedAt`, and `__v` (an internal version counter from Mongoose – ignore it).

5. Send a second request with **no** `content` → you should get status `400` and a validation error message. That's your Schema doing its job. ✅

6. Open `http://localhost:3000/api/tweets` in the browser again → your tweets are listed.

### **6.4 Look at your data in Atlas**

Let's see the data with our own eyes:

1. In Atlas, open your cluster and click **Browse Collections**.
2. You should see a database **`twitter-clone`** containing a collection **`tweets`**.
3. Click on it – there are your documents. This is the "filing cabinet" from the analogy. 🗄️

> 🧰 Prefer a desktop app, or want to use the terminal? See [Part B](#11-three-ways-to-look-at-your-data) for MongoDB Compass and `mongosh` – they show the same data.

> 🔑 **Stop and appreciate this moment**: you restarted nothing, edited no file – and the data lives *outside your project*, in the cloud. Stop the dev server and start it again: the tweets are still there.

✅ **Checkpoint 6**: `GET /api/tweets` returns your tweets, `POST /api/tweets` creates a new one, and you can see the documents in Atlas under *Browse Collections*.

---

## **7. Connect your React page to the API**

⏱️ ~30 minutes

Now the backend works. Time to replace the `db.json` / `localStorage` code in your UI. The following example shows the **pattern**; adapt it to your own components and field names.

```jsx
// app/page.js
"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [tweets, setTweets] = useState([]);
  const [content, setContent] = useState("");

  // Load all tweets once, when the page opens
  useEffect(() => {
    async function loadTweets() {
      const res = await fetch("/api/tweets");
      const data = await res.json(); // JSON text → JavaScript array
      setTweets(data);
    }
    loadTweets();
  }, []);

  // Create a new tweet
  async function handleSubmit(event) {
    event.preventDefault();

    const res = await fetch("/api/tweets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }), // JavaScript object → JSON text
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error);
      return;
    }

    const newTweet = await res.json();
    setTweets([newTweet, ...tweets]); // show it at the top
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

**Three things to notice:**

1. **The key is now `tweet._id`**, not `tweet.id`. MongoDB names its identifier `_id`. (This is a very common cause of "key" warnings and broken buttons!)
2. **`JSON.stringify` appears exactly once**: when *sending* data to the API. This is the "missing link" from the slides.
3. We update the screen ourselves with `setTweets(...)` after the server confirms. The database is the **source of truth**; React state is just what we currently show.

✅ **Checkpoint 7**: Write a tweet in the UI → it appears on screen → **refresh the page → it is still there** → you can see it in Atlas.

---

## **8. Upvotes and downvotes**

⏱️ ~30 minutes

### **8.1 A route for one specific tweet**

We need to say *which* tweet gets a vote. For that we use a **dynamic route** (like `/product/:id` from Milestone 2, but on the server). Create `app/api/tweets/[id]/route.js`:

```js
// app/api/tweets/[id]/route.js
import { makeSureDbIsReady } from "@/lib/db";
import { Tweet } from "@/models/Tweet";

// PATCH /api/tweets/<id>  with body { "type": "up" } or { "type": "down" }
export async function PATCH(request, { params }) {
  await makeSureDbIsReady();

  const { id } = await params; // the <id> from the URL
  const { type } = await request.json();

  // Which field should go up by one?
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
      { $inc: { [field]: 1 } }, // "increase this field by 1"
      { new: true } // give me the tweet AFTER the update
    );

    if (!tweet) {
      return Response.json({ error: "Tweet not found" }, { status: 404 });
    }

    return Response.json(tweet);
  } catch (error) {
    // e.g. the id has an invalid format
    return Response.json({ error: "Invalid tweet id" }, { status: 400 });
  }
}
```

**New things explained:**

- **`[id]` in the folder name** → whatever is in that part of the URL arrives as `params.id`.
- **`await params`** → in current Next.js versions, `params` is a Promise, so we `await` it. (Awaiting it is also harmless in older versions.)
- **`$inc`** → a MongoDB operator that increases a number **inside the database**. It's better than "read the tweet, add 1 in JavaScript, save it back": if two people vote at the same time, `$inc` never loses a vote.
- **`{ new: true }`** → without it, you'd get back the tweet *as it was before* the update.

Test it first in Thunder Client / Postman (`PATCH http://localhost:3000/api/tweets/<paste an _id here>` with body `{ "type": "up" }`), check that `upvotes` becomes `1`, then continue.

### **8.2 Use it in the UI**

Add this function next to `handleSubmit` in `app/page.js`:

```jsx
async function handleVote(id, type) {
  const res = await fetch(`/api/tweets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type }), // "up" or "down"
  });

  if (!res.ok) return;

  const updatedTweet = await res.json();
  // replace the old version of this tweet with the updated one
  setTweets(tweets.map((t) => (t._id === updatedTweet._id ? updatedTweet : t)));
}
```

And change the list item to show the buttons:

```jsx
<li key={tweet._id}>
  {tweet.content}
  <button onClick={() => handleVote(tweet._id, "up")}>👍 {tweet.upvotes}</button>
  <button onClick={() => handleVote(tweet._id, "down")}>👎 {tweet.downvotes}</button>
</li>
```

✅ **Checkpoint 8**: Click 👍 a few times → the number goes up → **refresh the page → the number is still there**. Votes are now stored in the database. 🎉 **You've completed the milestone's expected outcomes!**

---

## **9. Troubleshooting**

**Golden debugging rule: go from the bottom up.** If something doesn't work, check in this order, and stop at the first thing that fails:

1. Is the connection string correct and loaded? *(Step 2–3)*
2. Can the server connect to Atlas? *(open `/api/tweets` in the browser)*
3. Does the API work on its own? *(Thunder Client / Postman)*
4. Only then: is the React page doing the right `fetch`?

| Symptom / error message | Likely cause | Fix |
| --- | --- | --- |
| `Please define the MONGODB_URI environment variable` | Env variable not loaded | Is the file named exactly `.env.local`? Is it in the **project root** (next to `package.json`)? Did you **restart** the dev server? |
| `bad auth` / `Authentication failed` | Wrong username or password in the connection string | Re-check it. Did you remove the `<` `>` brackets? Is the password the one of the **database user** (Step 2.3), not your Atlas login? If the password has special characters, set a simpler one in *Database Access*. |
| Timeout / `Server selection timed out` / `could not connect to any servers` | Atlas blocks your IP | *Network Access* → add `0.0.0.0/0` (or your current IP). Wait a minute for it to apply. Also check your internet / VPN / school network. |
| `Operation buffering timed out` | You used the model without being connected | Make sure the route calls `await makeSureDbIsReady();` **before** using `Tweet`, and that it's `await`ed. |
| `OverwriteModelError: Cannot overwrite 'Tweet' model once compiled` | The model got defined twice by hot reloading | Use the `mongoose.models.Tweet ?? mongoose.model(...)` pattern in `models/Tweet.js`. |
| `Cast to ObjectId failed` | The id you sent isn't a valid MongoDB id | Copy the `_id` exactly from a real tweet. |
| Tweets saved but not visible in Atlas | Looking at the wrong database | Check the database name in your connection string (`.net/twitter-clone?`). In Atlas look under *Browse Collections* → the right database. |
| `Module not found: Can't resolve '@/lib/db'` | File is in the wrong folder | Put `lib/` and `models/` next to `app/` – or inside `src/` if your project uses `src/`. |
| React warning `Each child in a list should have a unique "key"` / vote buttons do nothing | Using `tweet.id` instead of `tweet._id` | Use `_id`. |
| `Cannot read properties of undefined` right after `fetch` | The API returned an error object, not an array | Look at the response in the browser's Network tab, or `console.log(data)`. |
| Changed `.env.local` but nothing changes | Server still uses old values | Restart `npm run dev`. |
| `Unexpected token '<'` when calling `res.json()` | The URL returned an HTML error page, not JSON | Check the URL for typos and the route file location: `app/api/tweets/route.js`. |

> 🚨 **If you accidentally pushed your connection string to GitHub**: don't just delete the file – the password is still in the history. Go to Atlas → *Database Access* → edit the user → set a **new password**, and update `.env.local`.

---

## **10. Final checklist and glossary**

### **✅ Final checklist**

- [ ] Atlas account + free M0 cluster created
- [ ] Database user created (username + simple password)
- [ ] Network Access allows my connection
- [ ] Connection string saved in `.env.local` (with password and database name), and `.env*` is in `.gitignore`
- [ ] `mongoose` installed
- [ ] `lib/db.js` with `makeSureDbIsReady`
- [ ] `models/Tweet.js` with Schema and Model
- [ ] `app/api/tweets/route.js` (GET + POST) tested without the UI
- [ ] `app/api/tweets/[id]/route.js` (PATCH for votes)
- [ ] UI loads, creates, and votes via `fetch` – and everything survives a page refresh
- [ ] I can see my data in Atlas under *Browse Collections*

### **📁 Final project structure**

```
my-twitter-clone/
├── .env.local                      ← secret connection string (NOT committed)
├── lib/
│   └── db.js                       ← opens the DB connection
├── models/
│   └── Tweet.js                    ← Schema + Model
└── app/
    ├── page.js                     ← UI (fetches from the API)
    └── api/
        └── tweets/
            ├── route.js            ← GET (list), POST (create)
            └── [id]/
                └── route.js        ← PATCH (vote)
```

### **📖 Glossary**

| Term | Meaning in one sentence |
| --- | --- |
| **Database** | A program that stores data permanently and lets you search and change it. |
| **MongoDB** | A *document* database: it stores JSON-like documents instead of table rows. |
| **Atlas** | The cloud service where MongoDB runs your database for you. |
| **Cluster** | The server(s) in the cloud where your database lives. |
| **Collection** | A group of similar documents (like a table, or like the `tweets` array in `db.json`). |
| **Document** | One record, e.g. one tweet. |
| **Field** | One property of a document, e.g. `content`. |
| **`_id`** | The unique id MongoDB gives every document. |
| **Connection string** | One line containing the address and login of your database. |
| **Environment variable** | A value (like a password) kept *outside* your code, in `.env.local`. |
| **ODM** | A library that lets you use objects/classes instead of raw database commands. |
| **Mongoose** | The ODM we use for MongoDB. |
| **Schema** | The blueprint: fields, types, rules. Enforced by Mongoose. |
| **Model** | The tool built from a schema: `find`, `create`, `findByIdAndUpdate`, ... |
| **API route** | A server function in `app/api/...` that the browser calls with `fetch`. |
| **CRUD** | Create, Read, Update, Delete – the four basic operations on data. |

---

---

# **Part B – Toolbox (optional)**

Everything in Part A works with nothing but the Atlas website. **Part B is optional**: it shows you other tools to *look into* your database and to *fill it with data*. Come back to it when Part A works and you are curious – or when you need 50 test tweets instead of 3.

---

## **11. Three ways to look at your data**

First, a very important clarification, because it is easy to mix these up:

> **Atlas is *where the database lives* (the server in the cloud). Compass and mongosh are *windows into* a database.** They are not alternatives to Atlas – you use them *together with* it. (The Atlas website also has its own window: *Browse Collections*.)

So there are three "windows" into the same data. Which one you use is partly **taste**:

| | **Atlas website** (*Browse Collections*) | **MongoDB Compass** | **mongosh** |
| --- | --- | --- | --- |
| **What is it?** | A page in your browser | A desktop app with a graphical interface | A terminal program (command line) |
| **Install?** | No | Yes | Yes |
| **Best for** | A quick look, editing one document | Exploring data visually, filtering, importing/exporting files | Typing exact commands, scripting, speed |
| **Feels like** | Google Sheets in the browser | A file explorer for your data | Talking to the database directly |
| **Downside** | You must be logged in and online; clumsy for bulk work | One more app to install; no scripting | You must learn the command syntax |

All three show **exactly the same data** – change something in one, refresh in another, and it's there.

### **11.1 MongoDB Compass**

1. Download and install [MongoDB Compass](https://www.mongodb.com/try/download/compass).
2. Open it and click **Add new connection**.
3. Paste your **connection string** (the same one as in `.env.local`, with the real password and without quotes) and click **Connect**.
4. In the left sidebar open **`twitter-clone` → `tweets`**. There are your documents.

Things worth trying:

- **Filter** with the query bar. It takes the same shape as a document, for example:
  ```json
  { "upvotes": { "$gt": 2 } }
  ```
  → shows only tweets with more than 2 upvotes (`$gt` means "greater than").
- **Edit** a document: hover over it, click the pencil icon, change a value, click *Update*.
- **Insert** a document: *Add Data* → *Insert Document*.
- **Import / export**: *Add Data* → *Import JSON or CSV file* (we'll use this in Section 13).

### **11.2 mongosh (the MongoDB shell)**

1. Install [mongosh](https://www.mongodb.com/try/download/shell). Check with `mongosh --version`.
2. Connect. Note that we give the password **separately**, so that it doesn't end up in your terminal history:

   ```sh
   mongosh "mongodb+srv://cluster0.abc12.mongodb.net/twitter-clone" --username tweetapp
   ```

   mongosh asks for the password. (Use *your* cluster address, which you can copy from Atlas → *Connect*.)

3. Try some commands:

   ```js
   show collections                         // lists: tweets
   db.tweets.countDocuments()               // how many tweets?
   db.tweets.find()                         // show tweets
   db.tweets.find().sort({ createdAt: -1 }).limit(3)   // the 3 newest

   db.tweets.insertOne({
     content: "Inserted with mongosh",
     upvotes: 0,
     downvotes: 0,
     createdAt: new Date(),
     updatedAt: new Date(),
   })

   db.tweets.updateOne({ content: "Inserted with mongosh" }, { $inc: { upvotes: 1 } })
   db.tweets.deleteOne({ content: "Inserted with mongosh" })
   ```

   Look at `$inc` – it's **the same operator** our `PATCH` route uses in Step 8. Mongoose is just a friendly JavaScript wrapper around commands like these.

4. Leave with `exit`.

> ⚠️ `db.tweets.deleteMany({})` deletes **all** tweets without asking. Be careful with it.

### **⚠️ The big gotcha: documents created by hand have no defaults**

When you insert a document in **Compass, mongosh or the Atlas website**, **Mongoose is not involved**. That means:

- No **defaults** (`upvotes: 0`) are added – so your UI might show `undefined` or `NaN`.
- No **timestamps** (`createdAt`) are added – so sorting by date may look odd.
- No **validation** – you could save a tweet without `content`.

**So when you insert by hand, include all the fields** (as in the `insertOne` example above).

---

## **12. The sample dataset**

Atlas offers ready-made example databases (such as `sample_mflix` with movies, or `sample_airbnb` with listings) that you can load with one click. They are great for **practicing queries** in Compass or mongosh – and a nice way to see what *nested* documents (from the README) look like in real life.

**You do not need them for the Twitter clone.**

### **How to load them**

1. In Atlas, go to your cluster.
2. Open the **⋯ (three-dot) menu** of the cluster and choose **Load Sample Dataset**.
3. Pick the datasets you want (you can usually select them individually) and confirm.

They are created as **separate databases** next to `twitter-clone`. Your tweets are not touched.

> ⚠️ **Mind the storage limit!** The free tier has **512 MB** of storage, and the complete sample data is large (several hundred MB – check the size shown in Atlas). Loading everything can use up most of your free space. **Load only one or two datasets**, and delete them when you are done (in Compass or Atlas: hover over the sample database → delete). If writes to your own database ever start failing, a full cluster is a possible reason.

### **Something to try in Compass**

Open `sample_mflix` → `movies` and filter with:

```json
{ "year": 1999 }
```

and then with a **nested field** (a field inside an embedded document):

```json
{ "imdb.rating": { "$gt": 8.5 } }
```

That `imdb.rating` with a dot is how you reach *into* a nested document – exactly the structure you saw in the "TechNova with employees" example in the README.

---

## **13. Seed data**

**Seed data** = a set of starter documents that you can load into an empty database, over and over again. Why bother?

- Your UI looks more alive with 10 tweets than with 1.
- If you break something, you can reset to a clean state in seconds.
- Classmates can start from the same data.

There are three ways, from simple to repeatable:

### **13.1 By hand**

Insert 2–3 documents with the Atlas website, Compass (*Insert Document*) or mongosh. Fine for a start. (Remember the gotcha above: include all fields.)

### **13.2 Import a JSON file with Compass**

1. Create a file `data/seed-tweets.json` in your project:

   ```json
   [
     { "content": "Just set up my first database! 🎉", "author": "alice", "upvotes": 5, "downvotes": 0 },
     { "content": "Mongoose Schema vs TypeScript interface – still confusing", "author": "bob", "upvotes": 2, "downvotes": 1 },
     { "content": "db.json, we had a good run.", "author": "carol", "upvotes": 8, "downvotes": 0 }
   ]
   ```

2. In Compass open `twitter-clone` → `tweets` → **Add Data** → **Import JSON or CSV file** and choose the file.

> 💡 We left out `createdAt` and `updatedAt` on purpose. Documents imported this way have no date, so in the UI they may show up at the bottom of the list. Use the script below if you want proper dates.

### **13.3 A seed script (repeatable – recommended)**

Create `scripts/seed.mjs` (wondering why `.mjs` and not `.js`? See the [side note below](#why-mjs)):

```js
// scripts/seed.mjs
import mongoose from "mongoose";
import { readFile } from "node:fs/promises";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error(
    "MONGODB_URI is missing. Run with: node --env-file=.env.local scripts/seed.mjs"
  );
  process.exit(1);
}

// A file on disk is just TEXT, so we read it and JSON.parse it into an array
const raw = await readFile(
  new URL("../data/seed-tweets.json", import.meta.url),
  "utf8"
);
const seedTweets = JSON.parse(raw);

try {
  await mongoose.connect(uri);
  const tweets = mongoose.connection.collection("tweets");

  // Start from a clean state. Remove this line if you want to ADD to existing tweets.
  await tweets.deleteMany({});

  // Mongoose isn't involved here, so we add the defaults ourselves
  const now = new Date();
  const docs = seedTweets.map((tweet, index) => ({
    author: "anonymous",
    upvotes: 0,
    downvotes: 0,
    ...tweet,
    createdAt: new Date(now.getTime() - index * 60_000), // one minute apart
    updatedAt: now,
  }));

  const result = await tweets.insertMany(docs);
  console.log(`Seeded ${result.insertedCount} tweets`);
} finally {
  await mongoose.disconnect();
}
```

Run it from your project root:

```sh
node --env-file=.env.local scripts/seed.mjs
```

Optionally add a shortcut to the `"scripts"` section of your `package.json`, so you can type `npm run seed`:

```json
"seed": "node --env-file=.env.local scripts/seed.mjs"
```

**Good to know:**

- `--env-file` needs **Node 20.6 or newer** (check with `node -v`). It loads `.env.local` for the script – Next.js only does that for the app itself, not for plain scripts.
- The script writes to the `tweets` collection **directly**, skipping our `Tweet` model. (A plain Node script can't use the `@/` shortcut, and importing our model file from plain Node depends on your module setup – see the [side note below](#why-mjs).) Because of that, **keep your seed file consistent with your Schema** – nothing checks it for you.
- ⚠️ `deleteMany({})` wipes the collection first. That's what makes the script *repeatable* – and also why you shouldn't run it against data you care about.

<a id="why-mjs"></a>

### **📝 Side note: why `.mjs`?**

Node.js has two module systems: **CommonJS** (`require`) and **ES modules** (`import`). Our seed script uses `import` and top-level `await`, so Node has to run it as an ES module. The file extension tells Node which system a file uses:

| File | Treated as |
| --- | --- |
| `.mjs` | always an ES module |
| `.cjs` | always CommonJS |
| `.js` | depends on `"type"` in `package.json` (`"module"` or `"commonjs"`) |

A `create-next-app` project usually has no `"type"` field, so `.mjs` is the safest choice and works without any setup. If you set `"type": "module"` in your `package.json`, a plain `seed.js` works too. Just make sure older config files that use `module.exports` (like `postcss.config.js`) are converted or renamed to `.cjs`.

CommonJS is not deprecated, but ES modules are the standard, and you'll still see `require` in older tutorials.

✅ **Checkpoint 13**: After running the script, refresh your app → the seed tweets are shown. Run it again → you still have exactly the same tweets (not duplicates).

---

## **14. Three doors into one database**

Now you know several ways to get data into (and out of) the same database. Here is the full picture:

| Door | Path | Goes through Mongoose? | Schema validation and defaults? |
| --- | --- | --- | --- |
| Your **UI** | Browser → `fetch` → API route → Mongoose → DB | ✅ Yes | ✅ Yes |
| **Postman / Thunder Client** | Postman → API route → Mongoose → DB | ✅ Yes | ✅ Yes |
| **Compass / mongosh / Atlas website** | Straight into the DB | ❌ No | ❌ No |
| **Seed script** (as written above) | Script → DB | ❌ No (raw collection) | ❌ No |

Two takeaways:

1. **Postman never talks to MongoDB.** It talks to *your API*. That's why you can only use it once your routes (Step 6) exist. Use it to test **your code** (status codes, validation errors, responses).
2. **Compass, mongosh and Atlas talk to the database itself.** Use them to **see and fix what is actually stored** – for example when the UI shows something unexpected: look at the real document and compare.

When something looks wrong, ask yourself: *"Is the problem in my code (API/UI), or in the data (database)?"* – Postman helps you find out about the first, Compass about the second.

---

## **Stretch goals (optional)**

- ✅ Add a **delete** button (`DELETE /api/tweets/[id]` using `Tweet.findByIdAndDelete(id)`).
- ✅ Move your **old tweets from `db.json`** into the database: copy the array into `data/seed-tweets.json` (adapt the field names) and use the seed script from [Section 13](#13-seed-data).
- ✅ Add an `author` field to your form.
- ✅ Show `createdAt` in a readable format.

---

## **Useful links**

- [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database)
- [Mongoose documentation](https://mongoosejs.com/docs/)
- [Using Mongoose with Next.js (official Mongoose guide)](https://mongoosejs.com/docs/nextjs.html)
- [Official Next.js + Mongoose example](https://github.com/vercel/next.js/tree/canary/examples/with-mongodb-mongoose)
- [Next.js documentation](https://nextjs.org/docs)
