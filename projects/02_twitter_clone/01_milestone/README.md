# **Milestone 1: Next.js Basics – Milestone Guide**

## **Overview**
In Milestone 1, we transition from React to **Next.js**, a powerful React framework for **server-side rendering (SSR)**, **static site generation (SSG)**, and **API routes**. This Milestone, we begin building a **Twitter Clone** using Next.js, setting up its fundamental structure and handling dynamic data fetching.

---

## **Learning Objectives**
1. **Understand Next.js Basics**:
   - The difference between a **React SPA** and a **Next.js application**.
   - The **App Router** in Next.js and how it differs from React Router.
   - Server-side rendering (SSR) vs. static site generation (SSG).

2. **Set Up a Next.js Project**:
   - Installing Next.js and creating a structured project.
   - Understanding the **file-based routing system**.

3. **Fetching Data in Next.js**:
   - Learn how **SSR and SSG** impact fetching external data.
   - Use `fetch()` and API routes to retrieve **tweets from an external API**.

4. **Build a Simple Twitter Clone (Part 1)**:
   - Design a basic **Tweet feed** component.
   - Fetch **dummy tweets** from an API and display them dynamically.

---

## **Why Learn Next.js?**
Next.js enhances **React applications** by allowing both **client-side rendering (CSR)** and **server-side rendering (SSR)**, making applications faster and **SEO-friendly**. In contrast to traditional React SPAs, Next.js enables:
- **Faster page loads** using pre-rendering techniques.
- **Better SEO** since pages are rendered on the server before reaching the browser.
- **API Routes** to manage backend-like functionality within the same project.

---

## **Project Requirements**
1. **Set Up a Next.js Project**:
   - Create a new **Next.js app** using the Next.js CLI.
   - Configure project settings and dependencies.

2. **File-based Routing**:
   - Define the **Home page (`/`)** and a **Tweet page (`/tweet/[id]`)**.
   - Create navigation between these pages.

3. **Fetch Tweets from an API**:
   - Retrieve and display tweets dynamically using an API route.

4. **Basic UI for Tweets**:
   - Structure tweet components with **author name, content, and time**.

---

## **Steps to Complete**

### **1. Create a Next.js Project**
To create a new **Next.js** app, run:
```sh
npx create-next-app@latest twitter-clone
cd twitter-clone
npm install
```

Inside the project, the key directories will be:
```
/app
 ├── layout.js      (Defines global layout)
 ├── page.js        (Home page)
 ├── /tweet
 │   ├── [id].js    (Individual tweet page)
```

---

### **2. Fetch Tweets Dynamically**
To simulate real Twitter functionality, we use an external API for tweets. We can use **dummy data** or fetch tweets from a JSON placeholder API.

**Example API Route (`/app/api/tweets/route.js`):**
```javascript
export async function GET() {
  const tweets = [
    { id: 1, user: "JohnDoe", content: "Hello Next.js!", timestamp: "2m ago" },
    { id: 2, user: "JaneDoe", content: "Loving React & Next.js!", timestamp: "10m ago" }
  ];
  return new Response(JSON.stringify(tweets), { status: 200 });
}
```

---

### **3. Display Tweets on the Home Page**
Modify `/app/page.js` to fetch and display tweets:
```javascript
"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [tweets, setTweets] = useState([]);

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
      <h1>Latest Tweets</h1>
      {tweets.map((tweet) => (
        <div key={tweet.id}>
          <p><strong>{tweet.user}</strong>: {tweet.content}</p>
          <small>{tweet.timestamp}</small>
        </div>
      ))}
    </div>
  );
}
```

---

### **4. Navigating to Individual Tweet Pages**
Next.js supports **file-based dynamic routing**. We create a page `/tweet/[id].js` to display single tweets.

**Example for `/app/tweet/[id].js`:**
```javascript
export default function TweetPage({ params }) {
  return <h1>Tweet ID: {params.id}</h1>;
}
```

---

## **Expected Outcome**
1. Users see a **list of tweets** on the home page.
2. Clicking on a tweet redirects users to its **detailed page**.
3. Tweets are **fetched dynamically** from an API.

---

## **Bonus Challenge**
1. Implement a **"like" button** for each tweet.
2. Allow users to **add new tweets** using a simple form.

---

## **Resources**
1. **Next.js Introduction**: [Next.js Docs - Getting Started](https://nextjs.org/docs/getting-started)
2. **Routing in Next.js**: [Next.js Docs - Routing](https://nextjs.org/docs/routing/introduction)
3. **Fetching Data**: [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

# **Milestone 1.1: Setting Up Next.js for a Twitter Clone**

## **1️⃣ Introduction to the Twitter Clone Project**

In this module, we will **build a simplified Twitter Clone** using **Next.js with App Router**.  
We will focus on:
✔️ **Fetching and displaying tweets dynamically**  
✔️ **Creating a layout with global components (Header, Sidebar, Feed)**  
✔️ **Understanding Next.js folder structure and routing**

At the end of this Milestone, our app will have:  
✅ A **homepage displaying tweets** from an API  
✅ A **dynamic page for individual tweets**  
✅ A **responsive UI** with Tailwind CSS (introduced in the next lesson)

---

## **2️⃣ Project Structure**

Before we start coding, let’s understand the structure of a Next.js **App Router project**.  
Our Twitter Clone will follow this layout:

```
my-twitter-clone/
├── app/
│   ├── layout.js    # Global layout (Header, Sidebar)
│   ├── page.js      # Homepage with feed
│   ├── tweet/       # Route for tweets
│   │   ├── [id]/    # Dynamic route for single tweet
│   │   │   ├── page.js  # Individual tweet page
├── components/      # Shared UI components
│   ├── Header.js    # Top navigation bar
│   ├── Sidebar.js   # Left menu (Home, Explore, Profile)
│   ├── TweetCard.js # Reusable tweet component
├── styles/          # Global CSS
│   ├── globals.css  # General styling
├── public/          # Static assets (e.g., Twitter logo)
├── package.json     # Dependencies and scripts
└── next.config.js   # Next.js configuration
```

This structure ensures that:  
✔️ **The app is scalable** with clear separation of concerns.  
✔️ **Components are reusable**, reducing code duplication.  
✔️ **Routing is dynamic**, generating tweet pages automatically.

---

## **3️⃣ Setting Up Next.js**

To create our Twitter Clone project, run the following command:

```bash
npx create-next-app@latest my-twitter-clone
cd my-twitter-clone
npm install
npm run dev
```

This will:
✔️ Create a new Next.js project  
✔️ Install all dependencies  
✔️ Start a local development server at `http://localhost:3000`

---

## **4️⃣ Understanding Routing in Next.js**

### **Static vs. Dynamic Routing**

| Feature         | Static Routes       | Dynamic Routes           |
| --------------- | ------------------- | ------------------------ |
| Example Path    | `/home`, `/profile` | `/tweet/[id]`            |
| Number of Pages | Fixed               | Created dynamically      |
| File Location   | `app/home/page.js`  | `app/tweet/[id]/page.js` |


### 📘 API Routes in Next.js – When to Use
>We’ll also be working with API routes in Next.js — a feature that lets you build backend logic directly into your application. You’ll see this used throughout the course.

**What is API**

API stands for Application Programming Interface.
In simple terms, it’s a way for different software systems to talk to each other.

In web development, an API typically refers to a backend endpoint (usually HTTP-based) that allows a frontend (or another system) to send or retrieve data.

**Why Do We Use APIs?**

Communication: APIs let frontend and backend parts of an app communicate efficiently.

Data Access: APIs allow access to databases or external services (e.g., weather, auth).

Code Separation: They enforce a clean separation of concerns between frontend and backend.

3rd-party Integration: APIs enable integration with services like Stripe, Google Maps, or GitHub.

| Use Case                           | Description               | Recommended? | Usage                                         |
|------------------------------------|---------------------------|--------------|-----------------------------------------------|
| `/app/api/tweets/route.js`         | Fetch list of tweets      | ✅ Yes       | /api/tweets                                   |
| `/api/api/tweets/[id]/route.js`    | Get or Update tweet by Id | ✅ Yes       | /api/tweets/111                               |

---

## **5️⃣ Next Steps**

In the next lesson, we will:  
✔️ **Create dynamic routes** for tweets  
✔️ **Fetch tweet data from an API**  
✔️ **Implement basic UI components**

🚀 Let’s start coding!

---

## **🔹 Additional Resources**

📘 **Next.js Official Docs:** [https://nextjs.org/docs/app](https://nextjs.org/docs/app)  
📘 **Routing in Next.js:** [https://nextjs.org/docs/app/building-your-application/routing](https://nextjs.org/docs/app/building-your-application/routing)

---

## **1️⃣ Fetching Tweets from an API**

In this lesson, we will:
✔️ **Fetch tweets from an API** using Next.js Server Components  
✔️ **Display tweets dynamically** in our Twitter Clone feed  
✔️ **Create a reusable `TweetCard` component**

We will use the **DummyJSON API** to get tweet-like posts:

```json
{
  "posts": [
    {
      "id": 1,
      "title": "First Tweet",
      "body": "This is my first tweet!",
      "tags": ["nextjs", "javascript"],
      "reactions": { "likes": 120, "dislikes": 5 },
      "views": 305,
      "userId": 121
    }
  ]
}
```

---

## **2️⃣ Fetching Data in Next.js**

### **Why Fetch Inside Server Components?**

✅ Improves performance (no unnecessary client-side requests)  
✅ Supports **SEO optimization** by pre-rendering content  
✅ Reduces bundle size

### **Fetching Tweets in `app/page.js`**

```javascript
// app/page.js
// 📌 Fetches tweets and displays them in the feed

async function getTweets() {
  const res = await fetch("https://dummyjson.com/posts");
  return res.json();
}

export default async function HomePage() {
  const tweets = await getTweets();

  return (
    <main>
      <h1>📝 Latest Tweets</h1>
      <ul>
        {tweets.posts.map((tweet) => (
          <li key={tweet.id}>{tweet.body}</li>
        ))}
      </ul>
    </main>
  );
}
```

✅ Fetches tweets **on the server** before rendering the page.  
✅ Displays tweets **dynamically** in an unordered list `<ul>`.

---

## **3️⃣ Creating a Reusable `TweetCard` Component**

Instead of displaying raw text, we will build a **TweetCard component**:

```javascript
// components/TweetCard.js
// 📌 Displays a single tweet with likes, hashtags, and user info

export default function TweetCard({ tweet }) {
  return (
    <div style={{ border: "1px solid #ddd", padding: "10px", margin: "10px" }}>
      <h3>{tweet.title}</h3>
      <p>{tweet.body}</p>
      <p>
        👍 {tweet.reactions.likes} | 👎 {tweet.reactions.dislikes}
      </p>
      <p>Tags: {tweet.tags.join(", ")}</p>
    </div>
  );
}
```

✅ Displays **title, content, likes, and hashtags**.  
✅ Makes our code **modular and reusable**.

---

## **4️⃣ Integrating `TweetCard` in `app/page.js`**

Now, let’s update our homepage to use `TweetCard`:

```javascript
// app/page.js
import TweetCard from "@/components/TweetCard";

async function getTweets() {
  const res = await fetch("https://dummyjson.com/posts");
  return res.json();
}

export default async function HomePage() {
  const tweets = await getTweets();

  return (
    <main>
      <h1>📝 Latest Tweets</h1>
      {tweets.posts.map((tweet) => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
    </main>
  );
}
```

✅ **Replaces raw text** with structured TweetCards.  
✅ **Enhances readability** and modularity.

---

## **5️⃣ Next Steps**

Next, we will:
✔️ **Implement a dynamic route for each tweet** (`app/tweet/[id]/page.js`)  
✔️ **Enable navigation from the feed to the tweet’s detail page**  
✔️ **Style our components for a clean Twitter-like UI**

🚀 Let’s keep building!

---

## **🔹 Additional Resources**

📘 **Next.js Data Fetching:** [https://nextjs.org/docs/app/building-your-application/data-fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)  
📘 **Using API Data in Next.js:** [https://nextjs.org/docs/pages/building-your-application/data-fetching/fetching](https://nextjs.org/docs/pages/building-your-application/data-fetching/fetching)

## **1️⃣ Creating Dynamic Routes for Tweets**

In this lesson, we will:
✔️ **Implement dynamic routing for tweet details** (`app/tweet/[id]/page.js`)  
✔️ **Fetch and display data for a single tweet**  
✔️ **Enable navigation from the tweet feed to its detail page**

---

## **2️⃣ How Dynamic Routes Work in Next.js**

### **Static vs. Dynamic Pages**

| Feature         | Static Pages        | Dynamic Pages            |
| --------------- | ------------------- | ------------------------ |
| Example Path    | `/home`, `/profile` | `/tweet/[id]`            |
| File Location   | `app/home/page.js`  | `app/tweet/[id]/page.js` |
| Number of Pages | Fixed               | Generated dynamically    |

✅ **Dynamic routes allow Next.js to generate pages dynamically based on the URL.**  
✅ **Each tweet will have its own unique URL (`/tweet/1`, `/tweet/2`, etc.).**

---

## **3️⃣ Creating a Dynamic Page for Tweets**

```javascript
// app/tweet/[id]/page.js
// 📌 Fetches and displays details for a single tweet

async function getTweet(id) {
  const res = await fetch(`https://dummyjson.com/posts/${id}`);
  return res.json();
}

export default async function TweetDetail({ params }) {
  const tweet = await getTweet(params.id);

  return (
    <main>
      <h1>{tweet.title}</h1>
      <p>{tweet.body}</p>
      <p>
        👍 {tweet.reactions.likes} | 👎 {tweet.reactions.dislikes}
      </p>
      <p>Tags: {tweet.tags.join(", ")}</p>
      <a href="/" style={{ color: "blue", textDecoration: "underline" }}>
        ← Back to Feed
      </a>
    </main>
  );
}
```

✅ Fetches tweet **on the server** before rendering the page.  
✅ Uses **dynamic route parameter (`params.id`)** to retrieve the correct tweet.  
✅ Provides a **back navigation link** to return to the homepage.

---

## **4️⃣ Adding Navigation from the Feed**

To allow users to click a tweet and view its details, update **`app/page.js`**:

```javascript
// app/page.js
import Link from "next/link";
import TweetCard from "@/components/TweetCard";

async function getTweets() {
  const res = await fetch("https://dummyjson.com/posts");
  return res.json();
}

export default async function HomePage() {
  const tweets = await getTweets();

  return (
    <main>
      <h1>📝 Latest Tweets</h1>
      {tweets.posts.map((tweet) => (
        <Link key={tweet.id} href={`/tweet/${tweet.id}`}>
          <TweetCard tweet={tweet} />
        </Link>
      ))}
    </main>
  );
}
```

✅ **Wraps each `TweetCard` in a `<Link>` component for fast navigation.**  
✅ **Clicking a tweet now loads `/tweet/[id]` dynamically.**

---

## **5️⃣ Next Steps**

In the next lesson (Milestone 2), we will:
✔️ **Introduce Tailwind CSS** for styling our Twitter Clone  
✔️ **Improve UI design** with a better layout and spacing  
✔️ **Make the app mobile-friendly**

🚀 Let’s build a beautiful UI next!

---

## **🔹 Additional Resources**

📘 **Next.js Routing Docs:** [https://nextjs.org/docs/app/building-your-application/routing](https://nextjs.org/docs/app/building-your-application/routing)  
📘 **Dynamic Routes in Next.js:** [https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)

---

## **📌 What We Achieved This Milestone**

🚀 This Milestone, we successfully built the **foundations** of our Twitter Clone using **Next.js with App Router**.  
We focused on:
✔️ **Setting up Next.js & project structure**  
✔️ **Fetching and displaying tweets dynamically**  
✔️ **Creating dynamic routing for individual tweet pages**

---

## **1️⃣ Key Takeaways**

### ✅ **Understanding Next.js App Router**

- Replaces the old `pages/` system with **folder-based routing**.
- Supports **server-side data fetching** for improved performance.
- Allows **layouts** for consistent UI across all pages.

### ✅ **Fetching Data the Right Way**

- Using **Server Components** to fetch tweets before rendering.
- Reducing client-side load by avoiding unnecessary `useEffect` calls.
- Fetching **data dynamically in `[id]/page.js`** for each tweet.

### ✅ **Dynamic Routing in Next.js**

- Created a **tweet details page** that loads dynamically.
- Used **`params.id`** to fetch specific tweet data.
- Implemented **client-side navigation with `<Link>`** for smooth transitions.

---

## **2️⃣ Common Challenges & How to Solve Them**

⚠️ **Forgot to use `async` in Server Components?**  
✔️ Always wrap API calls in `async function getTweets()`.

⚠️ **Got a "Cannot read properties of undefined" error?**  
✔️ Ensure the **API response matches the expected structure** (`posts`, `id`, `body`, etc.).

⚠️ **Navigation reloads the page instead of being smooth?**  
✔️ Use `<Link href="/tweet/[id]">` instead of `<a href="/tweet/[id]">`.

---

## **3️⃣ What’s Next?**

Next Milestone, we will:
✔️ **Introduce Tailwind CSS** to improve UI design.  
✔️ **Create an interactive tweet feed with better spacing and mobile responsiveness.**  
✔️ **Enhance the look and feel of our Twitter Clone.**

🚀 **Great job! Let’s make it visually stunning next!**

---

## **🔹 Additional Learning Resources**

📘 **Next.js App Router Docs:** [https://nextjs.org/docs/app](https://nextjs.org/docs/app)  
📘 **Fetching Data in Next.js:** [https://nextjs.org/docs/app/building-your-application/data-fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)  
📘 **Dynamic Routes in Next.js:** [https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)

🚀 **Congratulations! You've completed Milestone 1!**
In **Milestone 2**, we will **enhance the Twitter Clone** with **Tailwind CSS** to create a more refined, responsive, and visually appealing UI.
