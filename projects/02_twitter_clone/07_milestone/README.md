# **BONUS Milestone: Recap & Bonus Milestone - Next.js & Advanced Features (OPTIONAL)**

## **Overview**

This optional milestone is designed for students who want to take their project to the next level AFTER completing milestone 1-3. If you haven't completed milestone 1-3 we strongly encourage you to finish them before starting this bonus milestone. 

In this recap Milestone, you will refine your understanding of **Next.js, Tailwind CSS, authentication, API integration, and global state management**. You will revisit concepts from **Milestones 5, 6, and 7**, applying improvements and optimizations to your **Twitter Clone project**.

This is an opportunity to refactor your code, enhance the UI, and explore additional Next.js features. We will also introduce **middleware**, **incremental static regeneration (ISR)**, and **server components** as a **bonus milestone**.

---

## **Learning Objectives**

By the end of this Milestone, you should be able to:

1. **Strengthen Your Understanding of Next.js Core Features**

   - Improve routing logic (dynamic and API routes).
   - Optimize data fetching strategies (**SSR, SSG, ISR**).
   - Secure API endpoints and protect routes.

2. **Enhance the UI with Tailwind CSS**

   - Apply better UI/UX principles to the Twitter Clone.
   - Use **Tailwind utility classes** effectively for responsiveness.
   - Implement interactive animations.

3. **Refine Authentication & Global State Management**

   - Improve authentication logic using middleware.
   - Enhance global state management with the Context API.

4. **Bonus Challenge: Implement Middleware & ISR**
   - Use Next.js **middleware** to handle authentication.
   - Optimize your app with **incremental static regeneration (ISR)**.

---

## **1️⃣ Revisiting Next.js Routing & API**

One of the core principles of Next.js is **file-based routing**. Over the past three Milestones, you’ve worked with:

✅ **Dynamic routes** (e.g., `/profile/[id]`)  
✅ **API routes** for user authentication and posts  
✅ **Protected routes** that require authentication

Let’s **refactor our API routes** to improve readability and security.

### **Refactoring API Routes**

Instead of handling authentication logic directly in API handlers, move **authentication checks to middleware**.

#### **🔹 Before (Milestone 3 Implementation)**

```js
import { getSession } from "next-auth/react";

export async function GET(req) {
  const session = await getSession({ req });

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  return new Response(JSON.stringify({ message: "Welcome!" }), { status: 200 });
}
```

#### **✅ After (Using Middleware)**

```js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect("/login");
  }

  return NextResponse.next();
}
```

Now, **every protected route will use middleware** instead of checking authentication in every API handler.

---

## **2️⃣ UI Improvements with Tailwind CSS**

Tailwind CSS allows us to build modern, responsive UIs quickly. This Milestone, refine your **Twitter Clone UI** by implementing:

✅ **Better spacing and alignment**  
✅ **Consistent typography**  
✅ **Dark mode support**

### **Refactoring Components with Tailwind**

Instead of manually applying classes everywhere, use **reusable utility classes**.

#### **🔹 Before (Basic Button)**

```jsx
<button className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
```

#### **✅ After (Reusable Button Component)**

```jsx
export default function Button({ children }) {
  return (
    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded">
      {children}
    </button>
  );
}
```

Now, you can use `<Button>` anywhere in your project!

---

## **3️⃣ Optimizing API Calls with ISR**

**Incremental Static Regeneration (ISR)** allows pages to be **dynamically updated** after deployment.

Instead of fetching data on **every request (SSR)**, we can **pre-build pages and update them in the background**.

### **Example: Using ISR in Next.js**

Modify your `/pages/index.js` to **pre-render tweets** and update them every 30 seconds.

```js
export async function getStaticProps() {
  const res = await fetch("https://dummyjson.com/posts");
  const posts = await res.json();

  return {
    props: { posts },
    revalidate: 30, // Re-fetch data every 30 seconds
  };
}
```

With ISR:
✅ The page is **pre-rendered at build time**.  
✅ Every **30 seconds**, it refreshes with new data.  
✅ **Faster loading** for users!

---

## **Bonus Challenge: Implement Middleware & API Caching**

### **1. Use Middleware for Authentication**

✅ Move authentication logic to middleware  
✅ Redirect users to `/login` if they are not authenticated  
✅ Protect sensitive routes like `/api/posts`

### **2. Cache API Calls for Performance**

Instead of hitting the database on **every request**, use **Next.js API caching**.

#### **Example: API Caching with Redis**

```js
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export async function GET(req) {
  const cachedPosts = await redis.get("posts");

  if (cachedPosts) {
    return new Response(JSON.stringify(JSON.parse(cachedPosts)), {
      status: 200,
    });
  }

  const res = await fetch("https://dummyjson.com/posts");
  const posts = await res.json();

  await redis.set("posts", JSON.stringify(posts), "EX", 60); // Cache for 60 seconds

  return new Response(JSON.stringify(posts), { status: 200 });
}
```

Now:
✅ Posts are fetched **once per minute**, reducing database load  
✅ Faster API responses for users

---

# **Key Takeaways from Milestones 5-7**

| Topic              | Key Concepts                    |
| ------------------ | ------------------------------- |
| **Next.js Basics** | Routing, API, SSR, SSG          |
| **Tailwind CSS**   | Styling, Utility-First Approach |
| **Authentication** | NextAuth.js, Protected Routes   |
| **Global State**   | Context API, JWT Storage        |
| **Data Fetching**  | ISR, Middleware, API Caching    |

---

# **What’s Next?**

🚀 **In Milestone 1**, we will **integrate a database (MongoDB) and build a real-world Library App**!  
You’ll learn:
✅ How to **connect Next.js to a NoSQL database**  
✅ How to **store and retrieve user data securely**  
✅ How to **build a backend API for data management**

Get ready for **full-stack development** with **Next.js & MongoDB**! 🎯
