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

🚀 **Congratulations! You've completed Milestone 1!**
In **Milestone 2**, we will **enhance the Twitter Clone** with **Tailwind CSS** to create a more refined, responsive, and visually appealing UI.
