# **Milestone 4: Advanced Next.js - API, Routing & Security**

## **Overview**
In Milestone 4, we take our **Twitter Clone project** to the next level by implementing **dynamic API routes, advanced data-fetching strategies, global state management, and authentication security** in Next.js.

By the end of this Milestone, you’ll be able to:
✅ Build **dynamic API routes** to interact with a database
✅ Apply **Server-Side Rendering (SSR)**, **Static Site Generation (SSG)**, and **Incremental Static Regeneration (ISR)** for optimal performance
✅ Manage global state using **Context API**
✅ Secure your application with **protected routes and authentication middleware**
✅ Implement **client-side and server-side security measures**

---

## **1️⃣ Dynamic API Routes in Next.js**
Next.js allows us to create **API routes** directly in our project without needing a separate backend.

### **Why Use Dynamic API Routes?**
✅ **Simplifies backend logic** – No need for a separate Node.js/Express server
✅ **Handles CRUD operations** – Fetch, update, and delete data from the database
✅ **Easily integrates with MongoDB**

### **Creating an API Route**
📁 **Project Structure**
```
/app
 ├── /api
 │   ├── /tweets
 │   │   ├── route.js  (Handles all tweet operations)
 │   │   ├── [id].js   (Handles individual tweet requests)
```

📌 **Example: Fetching All Tweets** (`app/api/tweets/route.js`)
```js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Tweet from "@/models/Tweet";

// GET: Fetch all tweets
export async function GET() {
  await connectDB();
  const tweets = await Tweet.find().sort({ createdAt: -1 });
  return NextResponse.json(tweets, { status: 200 });
}
```

📌 **Example: Fetching a Single Tweet** (`app/api/tweets/[id]/route.js`)
```js
export async function GET(req, { params }) {
  await connectDB();
  const tweet = await Tweet.findById(params.id);
  if (!tweet) {
    return NextResponse.json({ error: "Tweet not found" }, { status: 404 });
  }
  return NextResponse.json(tweet, { status: 200 });
}
```

---

## **2️⃣ Data Fetching Strategies**
Next.js provides multiple ways to fetch data, each optimized for different use cases.

| Fetching Method | When to Use | Pros | Example |
|----------------|------------|------|---------|
| **SSR (Server-Side Rendering)** | When you need **real-time data** on each request | Data is always fresh | `getServerSideProps()` |
| **SSG (Static Site Generation)** | When data doesn’t change often | Faster page loads | `getStaticProps()` |
| **ISR (Incremental Static Regeneration)** | When data needs **regular updates** but without full re-render | Best of both worlds | `revalidate` option in `getStaticProps()` |

📌 **Example: Fetching Data with SSR**
```js
export async function getServerSideProps() {
  const res = await fetch("https://api.example.com/tweets");
  const tweets = await res.json();
  return { props: { tweets } };
}
```

📌 **Example: Fetching Data with SSG**
```js
export async function getStaticProps() {
  const res = await fetch("https://api.example.com/tweets");
  const tweets = await res.json();
  return { props: { tweets }, revalidate: 60 }; // ISR updates every 60 seconds
}
```

---

## **3️⃣ Global State Management with Context API**
When working on a project like a **Twitter Clone**, we need to share data between components (e.g., authentication status, user data, tweets).

### **Why Use Context API?**
✅ Avoids **prop drilling**
✅ Centralized **authentication state management**
✅ Allows **global access to user data**

📌 **Example: Creating a Global Auth Context**
```js
import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

📌 **Using Global State in a Component**
```js
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return <h1>Welcome, {user ? user.username : "Guest"}!</h1>;
}
```

---

## **Bonus Challenge: Implement Authentication**
For a **real-world Twitter clone**, authentication is essential. Here’s how you can implement it:

1️⃣ **User Registration & Login**
- Create a sign-up form
- Store user credentials securely in **MongoDB**
- Hash passwords using **bcrypt**

2️⃣ **JWT Authentication**
- Issue **JWT tokens** upon login
- Store tokens in **cookies** for persistence
- Use tokens to authenticate API requests

📌 **Example: Generating a JWT Token**
```js
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { username, password } = await req.json();

  // Validate user (check in database)
  const user = await User.findOne({ username });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Generate JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  return NextResponse.json({ token }, { status: 200 });
}
```

---
