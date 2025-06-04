# **Recap - Introduction to Next.js**

## **Overview**

In this Milestone, we transitioned from React to **Next.js**, a powerful React framework for building fast, SEO-friendly web applications. We explored:

- The differences between React and Next.js
- File-based routing system in Next.js
- Fetching and displaying dynamic content

By the end of this Milestone, we built the foundation for our **Twitter Clone** using Next.js.

---

## **Key Concepts Covered**

### 1️⃣ React vs. Next.js: Understanding the Shift

While React provides a strong client-side rendering (CSR) approach, Next.js enhances it by offering:
✅ **File-based Routing** – No need for `react-router-dom`  
✅ **Pre-rendering (SSR & SSG)** – Improves performance & SEO  
✅ **API Routes** – Allows building backend-like functionality within the app

Example of a basic Next.js **page component** (`app/page.js`):

```jsx
export default function Home() {
  return (
    <div>
      <h1>Welcome to the Twitter Clone!</h1>
    </div>
  );
}
```

### 2️⃣ File-based Routing in Next.js

Next.js replaces traditional React routing with **file-based routing** inside the `app/` directory.

- **Dynamic Routes** (`app/user/[id]/page.js`)
- **Nested Routes** (`app/profile/page.js`)

Example: Dynamic user profile route:

```jsx
export default function UserProfile({ params }) {
  return <h1>Profile of User {params.id}</h1>;
}
```

### 3️⃣ Fetching Data in Next.js

We explored three main ways of **fetching data** in Next.js:
| Fetching Method | When to Use? |
|------------------|--------------|
| **Client-side Fetching** | For user-specific or real-time updates |
| **Static Site Generation (SSG)** | For pre-rendering static content |
| **Server-side Rendering (SSR)** | For real-time API data fetching |

Example of **Client-side Fetching** (Used for tweets):

```jsx
import { useState, useEffect } from "react";

export default function Tweets() {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    fetch("https://dummyjson.com/posts")
      .then((res) => res.json())
      .then((data) => setTweets(data.posts));
  }, []);

  return (
    <ul>
      {tweets.map((tweet) => (
        <li key={tweet.id}>{tweet.title}</li>
      ))}
    </ul>
  );
}
```

---

## **What We Built**

This Milestone, we laid the foundation for our **Twitter Clone** by setting up:
✅ A Next.js project with **file-based routing**  
✅ Dynamic pages (`user/[id]`) for fetching user profiles  
✅ API routes (`api/tweets/route.js`) to handle data fetching

---

# **Recap - Tailwind CSS & UI Design**

## **Overview**

In Milestone 2, we focused on **UI design** using **Tailwind CSS** and improved our Twitter Clone's layout and responsiveness.  
Key topics covered:

- Tailwind CSS and its utility-first approach
- Styling components efficiently
- Implementing a mobile-friendly UI

By the end of this Milestone, we significantly improved the **visual design** of our Twitter Clone.

---

## **Key Concepts Covered**

### 1️⃣ What is Tailwind CSS?

Unlike traditional CSS or libraries like Bootstrap, **Tailwind CSS** is a **utility-first CSS framework** that allows developers to design directly in the markup.

Example: Styling a button with Tailwind

```jsx
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Click Me
</button>
```

✅ **Why Use Tailwind?**
| Feature | Benefit |
|-----------------|---------|
| Utility Classes | Faster styling |
| Mobile-first | Built-in responsive support |
| Customizable | Easy to extend styles |

### 2️⃣ Implementing Tailwind in Next.js

To use Tailwind CSS in our Next.js project, we installed it via:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

We then configured `tailwind.config.js`:

```js
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
```

### 3️⃣ Structuring the UI for Our Twitter Clone

We applied **Tailwind CSS** to structure and style our Twitter Clone:

- **Tweet Cards** for displaying posts
- **User Profile UI** for better styling
- **Mobile-first design** with responsive layouts

Example: **TweetCard Component** (With Tailwind)

```jsx
export default function TweetCard({ tweet }) {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg mb-4">
      <h3 className="text-lg font-bold">{tweet.title}</h3>
      <p className="text-gray-600">{tweet.body}</p>
    </div>
  );
}
```

### 4️⃣ Making the App Responsive

We used **Tailwind’s responsive classes** to ensure mobile compatibility:

- `sm:` → Small screens
- `md:` → Medium screens
- `lg:` → Large screens

Example: Responsive Layout for the Feed

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {tweets.map((tweet) => (
    <TweetCard key={tweet.id} tweet={tweet} />
  ))}
</div>
```

---

## **What We Built**

✅ **Styled the Twitter Clone using Tailwind CSS**  
✅ **Designed responsive tweet cards and profile pages**  
✅ **Created a visually appealing UI with minimal custom CSS**

---

# **Recap - Advanced Next.js & API Integration**

## **Overview**

In Milestone 3, we focused on **advanced Next.js features**, including:

- API routes for backend logic
- Authentication with user login/logout
- Fetching and managing dynamic data

By the end of this Milestone, our Twitter Clone supported **user authentication, real-time tweet fetching, and API communication.**

---

## **Key Concepts Covered**

### 1️⃣ API Routes in Next.js

Next.js allows us to create API endpoints directly inside our project. These are useful for handling database queries or fetching third-party API data.

Example: API Route for Fetching Users (`api/users/route.js`)

```js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://dummyjson.com/users");
    const data = await response.json();
    return NextResponse.json(data.users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
```

### 2️⃣ User Authentication & State Management

We implemented a **global authentication system** using the `AuthProvider.js` component.

✅ **Features Implemented:**
| Feature | Functionality |
|-----------------|--------------|
| Login Page | Allows users to authenticate |
| Logout Function | Clears session data |
| Auth Context | Stores user info globally |

Example: **AuthProvider.js**

```js
import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

### 3️⃣ Connecting Authentication to the UI

To make authentication functional, we connected it to the **login and logout pages**.

Example: **Login Page (`login/page.js`)**

```js
"use client";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      const data = await response.json();
      login(data);
      router.push("/profile");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

### 4️⃣ Fetching & Displaying User Data

With authentication set up, we fetched user-specific data from the API.

Example: **Fetching and Displaying User Data in the Profile Page (`profile/page.js`)**

```js
"use client";
import { useAuth } from "@/components/AuthProvider";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.username}!</h1>
      <p>Email: {user?.email}</p>
    </div>
  );
}
```

---

## **What We Built**

✅ **User authentication system with login/logout**  
✅ **API routes for fetching and managing user data**  
✅ **Dynamic profile pages connected to authentication**

---

# **Recap - Conclusion**

## **What We Accomplished**

Over the last three Milestones, we built a **Twitter Clone** while learning **Next.js, Tailwind CSS, and API integration**. Here’s a summary of our achievements:

✅ **Milestone 1 - Next.js Basics**

- Set up a Next.js project with `app router`
- Implemented **file-based routing** and **dynamic pages**
- Introduced **server-side data fetching**

✅ **Milestone 2 - Tailwind & UI Design**

- Designed and structured our Twitter Clone UI with **Tailwind CSS**
- Implemented **responsive layouts** and modern **styling techniques**

✅ **Milestone 3 - Advanced Next.js Features**

- Built **API routes** to fetch and manage tweets/users
- Implemented **authentication (login/logout)**
- Connected **profile pages** to user authentication

---

## **Key Takeaways**

### 🏗️ **Next.js as a React Framework**

We explored how Next.js improves upon React with **pre-rendering**, **API routes**, and **built-in routing**.

### 🎨 **Tailwind CSS for UI Design**

Instead of writing long custom styles, we used **utility classes** to build a clean, responsive layout.

### 🔗 **Connecting APIs to Our App**

Fetching data dynamically with `fetch()`, and handling authentication via API endpoints.

### 🔐 **User Authentication in Next.js**

We implemented **login/logout functionality** and managed user sessions in a global context.
