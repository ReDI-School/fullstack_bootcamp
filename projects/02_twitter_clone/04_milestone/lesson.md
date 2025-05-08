# **Milestone 3 - Advanced Next.js Features**

## **Introduction**

In this module, we dive into **advanced Next.js features**, building upon our foundational knowledge to enhance our Twitter Clone project. This Milestone, we will focus on:

- **Dynamic API Routes**: Creating server-side API endpoints within Next.js.
- **Data Fetching Strategies**: Understanding SSR, SSG, and ISR.
- **Middleware and Route Handling**: Managing authentication and protected routes.

By the end of this lesson, students will be able to build **scalable, server-side applications** with advanced data management techniques.

---

## **1️⃣ Dynamic API Routes in Next.js**

### **What Are API Routes?**

Next.js allows us to create API routes inside our project, eliminating the need for an external backend. These routes act as RESTful endpoints, responding to client requests dynamically.

### **Static vs. Dynamic API Routes**

- **Static API Route** → `/app/api/posts.js`: Returns the same data for all requests.
- **Dynamic API Route** → `/app/api/posts/[id].js`: Returns different data based on the `id` parameter.

### **Creating a Dynamic API Route**

To create a dynamic API route, we define a file inside the `app/api/` directory using **square brackets `[id]`**, indicating that the parameter is dynamic.

📌 **Project Structure Example:**

```plaintext
app/
├── api/
│   ├── tweet/
│   │   ├── [id]/
│   │   │   ├── route.js
```

📌 **Example Code (Fetching a Single Tweet by ID):**

```javascript
// app/api/tweet/[id]/route.js
export async function GET(request, { params }) {
  const { id } = params;
  const res = await fetch(`https://dummyjson.com/posts/${id}`);
  const data = await res.json();
  return Response.json(data);
}
```

### **How It Works:**

- A GET request to `/api/tweet/1` returns **tweet 1**.
- A GET request to `/api/tweet/45` returns **tweet 45**.
- Next.js dynamically injects the `id` parameter into the request.

### **Benefits of API Routes in Next.js**

✅ Eliminates the need for an external backend service.  
✅ Provides a seamless way to interact with databases or external APIs.  
✅ Supports all HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).  
✅ Scales efficiently as the app grows.

---

## **2️⃣ Data Fetching Strategies in Next.js**

### **Why Choose the Right Data Fetching Method?**

In Next.js, we have multiple strategies for fetching data, each optimized for different use cases:

| **Method**                                | **Description**                     | **Best For**                                      |
| ----------------------------------------- | ----------------------------------- | ------------------------------------------------- |
| **SSR (Server-Side Rendering)**           | Fetches data on each request.       | Real-time, user-specific content.                 |
| **SSG (Static Site Generation)**          | Pre-builds pages at compile time.   | Fast-loading, rarely updated content.             |
| **ISR (Incremental Static Regeneration)** | Rebuilds static pages at intervals. | Blogs, dashboards, periodically updating content. |

📌 **Example Code (Fetching Data Using SSR)**

```javascript
// app/tweet/[id]/page.js
async function getTweet(id) {
  const res = await fetch(`https://dummyjson.com/posts/${id}`);
  return res.json();
}

export default async function TweetPage({ params }) {
  const tweet = await getTweet(params.id);
  return (
    <main>
      <h1>{tweet.title}</h1>
      <p>{tweet.body}</p>
      <p>
        👍 {tweet.reactions.likes} | 👎 {tweet.reactions.dislikes}
      </p>
    </main>
  );
}
```

✅ **SSR ensures each request gets the most up-to-date data**. However, it **slows down performance** for high-traffic pages.  
✅ **SSG pre-renders content** for faster performance but isn't ideal for real-time content.  
✅ **ISR combines both**, updating pages at regular intervals without rebuilding the entire app.

---

## **3️⃣ Middleware and Protected Routes**

### **What is Middleware in Next.js?**

Middleware in Next.js runs **before** a request is completed. It is useful for authentication, logging, and request modifications.

📌 **Example Use Cases:**

- Redirecting unauthenticated users to the login page.
- Blocking access to specific routes based on user roles.
- Logging request metadata for analytics.

📌 **Example Code (Middleware for Route Protection):**

```javascript
// middleware.js (root of the project)
import { NextResponse } from "next/server";

export function middleware(request) {
  const isAuthenticated = request.cookies.get("authToken");

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Apply middleware only to protected routes
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
```

✅ **Middleware intercepts requests**, allowing us to check authentication before rendering pages.  
✅ **Prevents unauthorized access** to sensitive routes like `/profile` and `/dashboard`.

---

## **Introduction**

Managing application-wide state is essential when building scalable React and Next.js applications. In this lesson, we will cover **global state management** using the **React Context API** to efficiently manage authentication, user data, and global notifications.

By the end of this lesson, students will understand:

- How to create a **global state** using Context API.
- How to manage **authentication state** in the Twitter Clone.
- How to access and update global state from any component.

---

## **1️⃣ Why Use Global State?**

### **The Problem with Prop Drilling**

In traditional React applications, **props** are used to pass data between components. However, in large applications, **prop drilling** (passing data through multiple nested components) can make the code messy and difficult to maintain.

📌 **Example of Prop Drilling Problem:**

```javascript
function App() {
  const [user, setUser] = useState(null);

  return <Header user={user} setUser={setUser} />;
}

function Header({ user, setUser }) {
  return <Navbar user={user} setUser={setUser} />;
}

function Navbar({ user, setUser }) {
  return <Profile user={user} setUser={setUser} />;
}
```

🔴 **Issue:** The `user` state has to be manually passed down through every level of the component tree.

### **The Solution: Context API**

The **Context API** allows us to store **global state** and access it from any component **without** passing props manually.

✅ **Improves maintainability** by centralizing shared state.  
✅ **Reduces unnecessary re-renders** by providing direct access to data.  
✅ **Ideal for authentication, theme settings, and global messages.**

---

## **2️⃣ Implementing Global Authentication State**

### **Step 1: Creating an Auth Context**

First, we create a `context/AuthContext.js` file to store authentication-related data.

📌 **`context/AuthContext.js`**

```javascript
import { createContext, useState, useEffect } from "react";

// Create authentication context
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate fetching a stored authentication token
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### **Step 2: Wrapping the App with the Provider**

Now, we wrap our entire application in the `AuthProvider` so that all components can access authentication data.

📌 **`app/layout.js`**

```javascript
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </AuthProvider>
  );
}
```

### **Step 3: Using Context in a Component**

Now, any component can **access authentication data** using the `useContext` hook.

📌 **Example Usage in `Header.js`**

```javascript
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function Header() {
  const { user, login, logout } = useContext(AuthContext);

  return (
    <header className="bg-blue-500 p-4 flex justify-between items-center">
      <h1 className="text-white text-xl">Twitter Clone</h1>
      <nav>
        {user ? (
          <>
            <span className="text-white mr-4">Welcome, {user.name}</span>
            <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => login({ name: "John Doe" })}
            className="bg-green-500 px-4 py-2 rounded"
          >
            Login
          </button>
        )}
      </nav>
    </header>
  );
}
```

✅ **Now, authentication state is available throughout the entire app.**  
✅ **Any component can access the `user` object without prop drilling.**  
✅ **The `login` and `logout` functions handle user authentication easily.**

---

## **3️⃣ Expanding Global State: Managing Liked Tweets**

Besides authentication, we can use **Context API** to store user preferences, such as **liked tweets**.

### **Step 1: Create a New Context for Likes**

📌 **`context/LikesContext.js`**

```javascript
import { createContext, useState } from "react";

export const LikesContext = createContext();

export function LikesProvider({ children }) {
  const [likedTweets, setLikedTweets] = useState([]);

  const toggleLike = (tweetId) => {
    setLikedTweets((prevLikes) =>
      prevLikes.includes(tweetId)
        ? prevLikes.filter((id) => id !== tweetId)
        : [...prevLikes, tweetId]
    );
  };

  return (
    <LikesContext.Provider value={{ likedTweets, toggleLike }}>
      {children}
    </LikesContext.Provider>
  );
}
```

### **Step 2: Wrap the App in LikesProvider**

📌 **Modify `app/layout.js`**

```javascript
import { LikesProvider } from "@/context/LikesContext";

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <LikesProvider>{children}</LikesProvider>
    </AuthProvider>
  );
}
```

### **Step 3: Implementing the Like Feature in a Component**

📌 **Example Usage in `TweetCard.js`**

```javascript
import { useContext } from "react";
import { LikesContext } from "@/context/LikesContext";

export default function TweetCard({ tweet }) {
  const { likedTweets, toggleLike } = useContext(LikesContext);

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">{tweet.title}</h2>
      <p className="text-gray-700">{tweet.body}</p>
      <button
        onClick={() => toggleLike(tweet.id)}
        className={`mt-2 px-4 py-2 rounded ${
          likedTweets.includes(tweet.id)
            ? "bg-red-500 text-white"
            : "bg-gray-200"
        }`}
      >
        {likedTweets.includes(tweet.id) ? "Unlike ❤️" : "Like ♡"}
      </button>
    </div>
  );
}
```

✅ **The Like button dynamically updates for each tweet.**  
✅ **Liked tweets persist across components without prop drilling.**  
✅ **Global state management keeps UI interactions smooth and responsive.**

---

## **Introduction**

In the final part of this module, we will explore **advanced routing in Next.js**, including **protected routes**, **middleware**, and **dynamic API routes with authentication**.

By the end of this lesson, students will be able to:

- Implement **protected routes** using **middleware**.
- Secure API routes to prevent unauthorized access.
- Utilize **dynamic parameters** in Next.js routing.

---

## **1️⃣ Understanding Next.js Routing**

### **Static vs. Dynamic Routing**

Next.js uses a **file-based routing system**, meaning that the file structure inside the `app/` directory determines the URL paths.

📌 **Basic Routing Example:**

```plaintext
app/
├── page.js          →  "/"
├── about/
│   ├── page.js      →  "/about"
├── user/
│   ├── [id]/
│   │   ├── page.js  →  "/user/{id}"
```

### **Dynamic Routes in Next.js**

Dynamic routes allow us to create **custom paths based on parameters**. These are especially useful for profile pages, tweets, or other **dynamic content**.

📌 **Example: Fetching User Profile Based on ID**

```javascript
// app/user/[id]/page.js
async function getUser(id) {
  const res = await fetch(`https://dummyjson.com/users/${id}`);
  return res.json();
}

export default async function UserProfile({ params }) {
  const user = await getUser(params.id);
  return (
    <main>
      <h1>
        {user.firstName} {user.lastName}
      </h1>
      <p>Email: {user.email}</p>
      <p>Username: {user.username}</p>
    </main>
  );
}
```

🔹 **What happens here?**

- A request to `/user/5` fetches **user 5** dynamically.
- The `params.id` value is used to fetch the correct profile.
- Next.js automatically injects the parameter into the function.

---

## **2️⃣ Protecting Routes with Middleware**

### **What is Middleware?**

Middleware in Next.js **runs before the request is processed**, allowing us to:

- Restrict access to protected pages.
- Redirect unauthorized users.
- Log request details for security.

### **Adding Authentication Middleware**

To protect pages like `/dashboard`, we can **restrict access to logged-in users only**.

📌 **Example Middleware for Authentication**

```javascript
// middleware.js (root of the project)
import { NextResponse } from "next/server";

export function middleware(request) {
  const isAuthenticated = request.cookies.get("authToken");

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Apply middleware only to protected routes
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
```

### **How It Works**

✅ If a user **is not logged in**, they are **redirected to the login page**.  
✅ If a user **has an auth token**, they can access the dashboard and profile pages.  
✅ The **matcher property** applies middleware **only to specific routes** (`/dashboard/*` and `/profile/*`).

---

## **3️⃣ Securing API Routes with Authentication**

Just like we protect pages, we can **secure API routes** by verifying authentication before serving data.

📌 **Example: Protected API Route**

```javascript
// app/api/user/profile/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  const authToken = request.cookies.get("authToken");

  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch("https://dummyjson.com/users/1");
  const data = await res.json();
  return NextResponse.json(data);
}
```

🔹 **How It Works:**

- If the user **has a valid auth token**, the API returns profile data.
- If the user **is not authenticated**, a `401 Unauthorized` response is sent.

---

## **4️⃣ Implementing Route Guards in Components**

Even with API security and middleware, **client-side protection is still important**. We can create a **higher-order component (HOC)** that wraps around protected pages.

📌 **Example: Protecting a Dashboard Page**

```javascript
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  if (!user) return <p>Redirecting...</p>;

  return (
    <div>
      <h1>Welcome to your Dashboard, {user.name}!</h1>
    </div>
  );
}
```

🔹 **What Happens Here?**

- If the user **is not logged in**, they are redirected to `/login`.
- If the user **is logged in**, they can see their **dashboard**.

---

# **Conclusion**

## **Recap of Advanced Next.js Features**

This Milestone, we explored **advanced Next.js features** to enhance our Twitter Clone project. The key takeaways include:

### **1️⃣ Dynamic Routing & API Routes**

- **File-based routing** allows us to create dynamic paths effortlessly.
- **Dynamic API routes** provide flexible, scalable backend endpoints.
- **Example:** `/user/[id]` fetches a specific user's data dynamically.

### **2️⃣ Middleware for Authentication**

- **Middleware runs before page rendering**, allowing authentication checks.
- Protecting sensitive routes like `/dashboard` ensures **only logged-in users** can access them.
- **Example:** Redirecting unauthorized users to `/login`.

### **3️⃣ Securing API Endpoints**

- API routes must be **secured with authentication**.
- **Auth token verification** prevents unauthorized access to user data.
- **Example:** If no auth token is found, return a `401 Unauthorized` error.

### **4️⃣ Route Guards for Client-Side Protection**

- Even with middleware, protecting **frontend routes** is essential.
- **React Context & Hooks** ensure only authenticated users can view protected pages.
- **Example:** Redirecting users from the dashboard if they are not logged in.

---

## **How These Concepts Improve Our Twitter Clone**

✅ **Security** → API endpoints and frontend pages are now protected.  
✅ **Scalability** → Dynamic routes and API handling improve flexibility.  
✅ **Performance** → Middleware optimizes authentication without extra server requests.

---

## **Next Steps: Preparing for Milestone 4**

In the next module, we will **connect our frontend to a real backend service**, implementing **real-time API interactions** to fetch, post, and update tweets dynamically.

Get ready to take our Twitter Clone to the next level! 🚀

---
