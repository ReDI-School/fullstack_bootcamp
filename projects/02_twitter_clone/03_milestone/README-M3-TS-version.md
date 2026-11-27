# **Milestone 3: Introduction to Databases**

In the last lesson, we talked about how we can take data from the user and store it on disk; now we want to store it on a real database!

### Expected Outcomes

By the end of Milestone 3, you should:

- Allow the user to create tweets and store them in the database
- Allow the user to see the tweets they created from the database
- Allow upvotes / downvotes to be stored in the database


# Introduction to Databases

## What is a Database?

A database is a place where data is stored, organized, and accessed. In backend development, databases are used to save things like user information, product details, messages, or anything your app needs to remember. You can put data in (store), look at it (read), change it (update), or remove it (delete). These operations are often referred to as CRUD (Create, Read, Update, Delete).

## Types of Databases

There are several types of databases, but the two main categories are:

### Relational Databases (SQL)

Relational databases use tables with rows and columns (like spreadsheets).

Here is an example with `SQL` of how to define the schema for a table:

```sql
CREATE TABLE companies (
  company_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  industry VARCHAR(50),
  founded_year INT
);
```

Every row is an entry in that table, so if you think about tweets, every row is a tweet.

Data is connected using relations / foreign keys. A foreign key is an identifier that connects two rows from different tables.

```sql
CREATE TABLE employees (
  employee_id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  company_id INT NOT NULL,
  FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE
);
```

Generally, data in SQL is flat; you can add columns, but you cannot nest items inside other items. For that, you create a new table and reference the items by the `key`.

Examples: MySQL, PostgreSQL, SQLite, SQL Server.

We won't dig deep into SQL in this course, but I just want to give you the basics.

### Non-relational Databases (NoSQL)

Non-relational databases don't use traditional tables; they use a variety of other data formats, like documents, key-value pairs, or graphs. Generally, the data is less structured than SQL, and you have more flexibility in how you organize it.

Examples: Document-based: MongoDB, Key-Value: Redis, Graph: Neo4j

### **Key Features of NoSQL Databases**

- **Schema-less data storage** 🏗️ → No rigid structure like SQL tables.
- **Horizontal scalability** 📈 → Data can be distributed across multiple servers.
- **High availability & performance** ⚡ → Optimized for fast data retrieval.
- **Variety of models** 🎭 → Document, Key-Value, Graph, and Column-based storage.


## **Why NoSQL & MongoDB?**

Traditional SQL databases use **tables and relationships**, while NoSQL databases like **MongoDB** use **documents and collections**. This makes NoSQL **flexible** and **scalable**, especially for dynamic applications like our tweet app.

### **MongoDB vs SQL: Key Differences**

| Feature | SQL (Relational DB) | MongoDB (NoSQL) |
| :-- | :-- | :-- |
| **Schema** | Fixed schema | Dynamic schema |
| **Data Model** | Tables & Rows | JSON-like Documents |
| **Scalability** | Vertical Scaling | Horizontal Scaling |
| **Joins** | Uses relationships | Embedded documents |
| **Best for** | Structured data (e.g., Banking) | Unstructured data (e.g., Social Media, Content Management) |

MongoDB stores data in **documents** (JSON format), which allows us to store tweet data in an easy-to-query structure.

Here is an example of how a document looks in MongoDB:

```json
{
  "_id": ObjectId("64fb..."),
  "full_name": "Alice Smith",
  "email": "alice@technova.com",
  "company_id": ObjectId("64fa...")  // Reference to the company
}
```

Note that we are just looking at the data, because there is *no rigid schema inside the database*. In our app, we use Mongoose schemas to define and validate the shape of our data. You can even put nested documents:

```json
{
  "_id": ObjectId("64fa..."),
  "name": "TechNova",
  "industry": "Technology",
  "founded_year": 2010,
  "employees": [
    {
      "full_name": "Alice Smith",
      "email": "alice@technova.com"
    },
    {
      "full_name": "Bob Lee",
      "email": "bob@technova.com"
    }
  ]
}
```

## Using Databases in Your App

There are many ways to use databases in our app; one common way is by using an *ODM*.

## [ODM](https://www.mongodb.com/docs/drivers/odm/)

An ODM (Object Data Modeling library) is a library that lets you interact with your database using your programming language's objects and classes, instead of writing raw queries. Much easier and safer for beginners, and often cleaner in large applications.

These libraries help you manage your database from your app a lot easier than talking to the DB directly.

For this project, we are going to use *MongoDB* with *Mongoose* ODM.

## **What is Mongoose?**

Mongoose is an **Object Data Modeling (ODM) library** for MongoDB in **Node.js**. It provides a structured way to interact with MongoDB by defining **schemas** and **models**.

### **Why Use Mongoose?**

✅ **Provides schema validation** to ensure data consistency  
✅ **Simplifies database interactions** with an easy-to-use API  
✅ **Handles relationships** between different data models

## Setup DB

There are 2 main ways to set up a database for this project:

### Atlas

[MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) is a service by the company behind the MongoDB database; basically, they will run the database for you, and then you can access it from your app.

Using a cloud service has many advantages:

- You can access the database from anywhere.
- Mongo will handle the updates / backups for you.
- MongoDB Atlas also offers a [free tier](https://www.mongodb.com/pricing) for development and learning.

If you are shipping an application to production, you should use a *managed* database, since it makes your life easier.

> 🎥 **Extra help:** Prefer watching to reading? This [video walkthrough](https://www.youtube.com/watch?v=pILdgCr4w3s) shows how to create a MongoDB Atlas database. It covers the same steps as Step 2 of the Milestone 3 Practical Guide.

### Local Database

For local development, the simplest setup is MongoDB + MongoDB Compass.

- Install MongoDB locally or use a local MongoDB service.
- Install [MongoDB Compass](https://www.mongodb.com/products/tools/compass) to inspect the database.
- Connect Compass to `mongodb://localhost:27017`.
- Create a database name for this project in Compass.

If you already know Docker, you can also run MongoDB in a container:

```yml
services:
  mongo:
    image: mongo:8.0
    container_name: mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

You need to have [Docker](https://docs.docker.com/desktop/) installed on your machine. We won't go into details about what containers are; feel free to look it up.

Then to start the database, you run `docker compose up`.

### Using with Next.js

There is [an official example](https://github.com/vercel/next.js/tree/canary/examples/with-mongodb-mongoose) from the Next.js team on how to use Mongoose.

Go through the code in the example and try to understand what is happening, and how we can apply this to our use case. Also, read the documentation of [Mongoose](https://mongoosejs.com/docs/).

### Managing your database with MongoDB Compass

MongoDB Compass is a desktop app that lets you see and manage your data without the terminal. Use it to check that your app really saves tweets, or to fix a document by hand.

**1. Install Compass**

Download [MongoDB Compass](https://www.mongodb.com/products/tools/compass) and open it.

**2. Connect to your Atlas database**

1. Click **Add new connection**.
2. Paste your connection string, the same one as in your `.env.local` (with your real password, without quotes). You can also copy it in Atlas via **Connect → Drivers**.
3. Click **Connect**.

⚠️ The connection string contains your password. Never share it or post it in screenshots.

**3. Find your data**

In the left sidebar open your database (e.g. `twitter-clone`) and then the `tweets` collection. Every document is one tweet.

**4. Manage your data**

- **Read / filter:** type a query in the filter bar, for example `{ "upvotes": { "$gt": 2 } }` shows tweets with more than 2 upvotes.
- **Edit:** hover over a document, click the pencil icon, change a value, click **Update**.
- **Insert:** click **Add Data → Insert Document**.
- **Delete:** hover over a document and click the trash icon, then confirm.
- **Refresh:** click the refresh button to see changes made by your app.

💡 Documents you add by hand in Compass skip Mongoose, so they get no defaults (like `upvotes: 0`) and no validation. Include all fields yourself.

> 🎥 **More info:** This [video walkthrough](https://youtu.be/EpheHn2EK0o) shows how to connect MongoDB Compass to your Atlas database and manage your data. It matches Section 11.1 of the Practical Guide. If anything in the video differs from this README, follow the README.

## Connecting to the DB

Now that the database is set up, you can connect your app to it with `MONGODB_URI`.

🕵️ Create a `.env.local` file in the root of your project and add your **MongoDB connection string** there. Never commit this file to Git, because it contains your database password (Next.js projects ignore `.env*` files by default, but double-check your `.gitignore`).

```bash
# Atlas (copy the string from "Connect" → "Drivers" in your Atlas dashboard)
# Replace <username> and <password>, and add your database name after the "/"
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database-name>?retryWrites=true&w=majority

# Local
MONGODB_URI=mongodb://localhost:27017/<database-name>
```

You can use the following code to connect to the DB. You can put this in any file you want outside of the `app` folder, usually something like `lib/db.ts`.

💡 Before you can use the code in this README, install Mongoose in your project with `npm install mongoose`. Mongoose ships with its own TypeScript types, so you do not need to install `@types/mongoose`.

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

// Caching for local development
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

Anytime you want to talk to the database, make sure to `await makeSureDbIsReady()` first!

> If the connection does not work on the first try, double-check the IP access list (Network Access in Atlas), the database user credentials, and the connection string. These are the most common Atlas setup issues.
>
> If you see `querySrv ENOTFOUND`, your computer cannot find the cluster's address: check that the cluster exists in Atlas (and is not paused), copy a fresh connection string into `.env.local`, and try another network if it still fails.

## Defining Schemas

Before we define the schema, create a separate file for your model outside of the `app` folder. A good place is a `models` folder in the project root, for example `models/Tweet.ts`.

We keep database models in their own folder so they are easy to find and do not get mixed up with route handlers or helper functions. The `lib/` folder is a good place for connection helpers like `makeSureDbIsReady()`, while `models/` is for Mongoose schemas and models.

If you are using TypeScript, you can use `.ts` files for both the model and your type definitions. The Mongoose model is the runtime database model, while an interface (like `ITweet` below) only describes the shape of the data for TypeScript. It disappears when your code is compiled.

Also, because Next.js reloads code during development, we should only register the model once. That is why we use:

`models.Tweet ?? model("Tweet", TweetSchema)`

This prevents Mongoose from trying to create the same model again on every reload.

Now define your schema:

```ts
// models/Tweet.ts

import { Schema, model, models, Model } from "mongoose";

// describes what a tweet looks like in TypeScript
export interface ITweet {
  content: string;
  author: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  updatedAt: Date;
}

const TweetSchema = new Schema<ITweet>(
  {
    content: {
      type: String,
      required: true,
      maxlength: [280, "Tweet cannot be more than 280 characters"],
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
  // adds createdAt and updatedAt fields automatically
  { timestamps: true }
);

// We have to define it this way because of hot reloading
export const Tweet: Model<ITweet> =
  (models.Tweet as Model<ITweet>) ?? model<ITweet>("Tweet", TweetSchema);
```

Now our Mongoose model knows the `Tweet` collection, and each tweet has content, an author, upvotes, downvotes, and the time it was created and last updated.

Remember, you need to `await makeSureDbIsReady()` before calling any of the operations below.

***

## **CRUD Operations with MongoDB & Mongoose**

Now that our database is connected, let's implement **CRUD (Create, Read, Update, Delete)** operations to manage tweets in our app.

***

## **1️⃣ Understanding CRUD Operations**

| Operation | HTTP Method | Description |
| :-- | :-- | :-- |
| **Create** | `POST` | Add a new tweet to the database |
| **Read** | `GET` | Retrieve tweets from the database |
| **Update** | `PUT` or `PATCH` | Modify an existing tweet's details |
| **Delete** | `DELETE` | Remove a tweet from the database |


***

## **2️⃣ Creating API Routes for CRUD Operations**

In **Next.js App Router**, we structure our API routes inside `/app/api/tweets/`. We need **two** route files, because some operations are about *all* tweets and some are about *one specific* tweet:

📁 **Project Structure**

```text
/app
 ├── /api
 │   ├── /tweets
 │   │   ├── route.ts         (all tweets: GET = list, POST = create)
 │   │   ├── /[id]
 │   │   │   ├── route.ts     (one tweet: PATCH = vote, DELETE = remove)
```

The `[id]` in the folder name is a **dynamic route**: whatever is in that part of the URL (e.g. `/api/tweets/665f1c2a...`) arrives in your code as `params.id`. In current Next.js versions `params` is a Promise, which is why we type it as `Promise<{ id: string }>` and `await` it.

The examples below show the individual Mongoose operations we use for creating, reading, updating, and deleting tweets. In the route handler files, these operations are wrapped in the HTTP methods `POST`, `GET`, `PATCH`, and `DELETE`.

### Create

```ts
const tweet = await Tweet.create({
  content: "Hello, world!",
  author: "me",
});
// tweet is a Mongoose document; we can convert it to a normal object by calling
tweet.toObject();
```

### Read

```ts
const tweets = await Tweet.find({});
```

### Update

```ts
const tweet = await Tweet.findOne({ content: "Hello, world!" });
// findOne returns null when nothing matches, so TypeScript wants us to check
if (tweet) {
  tweet.upvotes = 5;
  await tweet.save();
}
```

### Delete

```ts
await Tweet.findOneAndDelete({ content: "Hello, world!" });
```

## **3️⃣ Implementing CRUD Routes**

### **📌 Create a New Tweet (`POST`) and Read All Tweets (`GET`)**

```ts
// app/api/tweets/route.ts

import { makeSureDbIsReady } from "@/lib/db";
import { Tweet } from "@/models/Tweet";

// GET /api/tweets  →  return all tweets, newest first
export async function GET() {
  await makeSureDbIsReady();
  try {
    const tweets = await Tweet.find({}).sort({ createdAt: -1 });
    return Response.json(tweets);
  } catch (error) {
    return Response.json({ error: "Error fetching tweets" }, { status: 500 });
  }
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

⚠️ Notice that we do **not** write `Tweet.create(body)`. That would save *whatever the client sends*, including a fake `upvotes: 9999`. Always pick the fields you accept.

### **📌 Upvote / Downvote a Tweet (`PATCH`) and Delete a Tweet (`DELETE`)**

```ts
// app/api/tweets/[id]/route.ts

import { makeSureDbIsReady } from "@/lib/db";
import { Tweet } from "@/models/Tweet";

// PATCH /api/tweets/<id>  with body { "type": "up" } or { "type": "down" }
type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  await makeSureDbIsReady();

  const { id } = await params; // the <id> from the URL
  const { type }: { type?: string } = await request.json();

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

// DELETE /api/tweets/<id>
export async function DELETE(_request: Request, { params }: RouteContext) {
  await makeSureDbIsReady();

  const { id } = await params;
  try {
    const tweet = await Tweet.findByIdAndDelete(id);
    if (!tweet) {
      return Response.json({ error: "Tweet not found" }, { status: 404 });
    }
    return Response.json({ message: "Tweet deleted successfully" });
  } catch (error) {
    return Response.json({ error: "Invalid tweet id" }, { status: 400 });
  }
}
```

### **👍 Why `$inc` for votes?**

Setting `tweet.upvotes = 5` *overwrites* whatever was stored. For votes you want "add one to the current value". The MongoDB operator `$inc` does that **inside the database**, so it never loses a vote even if two people vote at the same moment. The alternative (read the tweet, add 1 in JavaScript, save it back) can lose votes.

Also notice the API design: the client does not send the new vote count, it only says *"upvote this tweet"* and the server does the counting.

***

## **4️⃣ Testing API Routes with Postman or Thunder Client**

### **Testing a `POST` Request**

1. Open **Postman** or **Thunder Client** (VSCode extension).
2. Set the method to `POST`.
3. Use the URL: `http://localhost:3000/api/tweets`
4. Set the request body to JSON:

```tson
{
  "content": "This is my first tweet!",
  "author": "me"
}
```

5. Click **Send** → Expect a `201 Created` response.
6. Send it again **without** `content` → Expect a `400` and a validation error. That is your schema doing its job.

### **Testing a `GET` Request**

1. Set the method to `GET`.
2. Use the URL: `http://localhost:3000/api/tweets`
3. Click **Send** → Expect a JSON array of tweets.

### **Testing a `PATCH` Request (vote)**

1. Set the method to `PATCH`.
2. Use the URL: `http://localhost:3000/api/tweets/<paste an _id here>`
3. Set the request body:

```tson
{ "type": "up" }
```

4. Click **Send** → Expect a `200 OK` response with the updated tweet, where `upvotes` went up by one.

### **Testing a `DELETE` Request**

1. Set the method to `DELETE`.
2. Use the URL: `http://localhost:3000/api/tweets/<paste an _id here>`
3. No body is needed.
4. Click **Send** → Expect a `200 OK` confirmation.

💡 You can also open MongoDB Compass (or the Atlas web interface) and check that the tweets really show up in your database.

***

## **5️⃣ Frontend Integration (Fetching Tweets in Next.js)**

### **Fetching Tweets from the API in Next.js**

Inside `/app/page.tsx`, add:

```tsx
"use client";
import { useEffect, useState } from "react";

type Tweet = {
  _id: string;
  content: string;
  author: string;
  upvotes: number;
  downvotes: number;
};

export default function Home() {
  const [tweets, setTweets] = useState<Tweet[]>([]);

  useEffect(() => {
    async function fetchTweets() {
      const res = await fetch("/api/tweets");
      const data = await res.json();
      setTweets(data);
    }
    fetchTweets();
  }, []);

  return (
    <div>
      <h1>Tweets</h1>
      <ul>
        {tweets.map((tweet) => (
          <li key={tweet._id}>
            {tweet.content} ({tweet.upvotes} upvotes, {tweet.downvotes} downvotes)
          </li>
        ))}
      </ul>
    </div>
  );
}
```

This example only *reads* tweets. The form for creating tweets and the vote buttons are built step by step in **Steps 7 and 8 of the MongoDB Setup Guide**.

***

# **Conclusion - NoSQL & Database**

## **Key Takeaways from This Milestone**

1. **Understanding NoSQL** → We explored how NoSQL databases like MongoDB differ from relational databases, offering flexibility and scalability.
2. **MongoDB Basics** → We set up a MongoDB database and learned how to interact with it using Mongoose.
3. **Database Connection** → We established a connection between our Next.js app and MongoDB using Mongoose.
4. **CRUD Operations** → We implemented Create, Read, Update, and Delete functionalities for tweets.
5. **Frontend Integration** → We fetched tweet data from our API and displayed it on the frontend.

---

### Task

Take the time, go through the examples from Next.js; this is a good example on how to learn from other people's code. Update your code to save the user's tweets and read them from the DB.

[Getting Started with Next.js - official instructions](https://nextjs.org/docs/app/getting-started)

---

## READ THE DOCS, TEST YOURSELF & LEARN 🤓

- [Is Mongoose an ORM or ODM?](https://medium.com/@abhikshirsagar1999/is-mongoose-an-orm-or-odm-651c9d14e513)
- [ORMs, ODMs, and Libraries](https://www.mongodb.com/docs/drivers/odm/)
- [Quizlet - 54 Qs on Milestone 3](https://quizlet.com/de/1180898068/mongodb-flash-cards/?funnelUUID=ed8eba12-6b0f-466d-80c4-a11c63ab5350)
- [Next.js documentation](https://nextjs.org/docs)
- [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database)
- [How to create a MongoDB Atlas database (free cloud DB)](https://www.youtube.com/watch?v=pILdgCr4w3s)
- [MongoDB Compass](https://www.mongodb.com/products/tools/compass)
- [How to connect MongoDB Atlas using MongoDB Compass](https://www.youtube.com/watch?v=EpheHn2EK0o)

