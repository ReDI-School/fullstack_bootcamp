# **Teacher Guide – Milestone 3: Advanced Next.js Features**

## **Introduction**
This Milestone, students are introduced to **advanced Next.js concepts**, including **dynamic routing, middleware authentication, and API security**. These topics are essential for **building scalable and secure web applications**.

By the end of this Milestone, students should be able to:
✅ Implement **dynamic routes** for handling user and tweet data.  
✅ Use **Next.js middleware** for authentication and route protection.  
✅ Secure API routes with **authentication checks**.  
✅ Implement **route guards** on the client-side using React Context.  

---

## **Lesson Overview**

| **Concept** | **Key Topics Covered** | **Practical Implementation** |
|------------|----------------------|------------------------------|
| **Dynamic Routing** | File-based routing, dynamic parameters | Fetch user/tweet data dynamically |
| **Middleware** | Authentication, request interception | Restrict access to protected pages |
| **API Security** | Auth checks, token validation | Prevent unauthorized API access |
| **Client-Side Route Guards** | Redirect unauthenticated users | Use `useContext` and `useEffect` |

---

## **Teaching Plan**

### **1️⃣ Dynamic Routing in Next.js**
Introduce students to **file-based routing** and how Next.js **automatically handles dynamic paths**.

📌 **Key Points to Explain:**
- Explain the **folder structure** for dynamic routes.
- Show how `[id]` is used to create **parameterized pages**.
- Discuss **static vs. dynamic routes**.

📌 **Code Example – Dynamic Tweet Page**
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
    </main>
  );
}
```

### **2️⃣ Middleware for Authentication**
Next.js middleware runs **before rendering a page**, making it useful for **protecting routes**.

📌 **Key Points to Explain:**
- What is middleware, and why do we use it?
- How to apply **authentication checks** before loading pages.
- The difference between **server-side middleware** and **client-side route guards**.

📌 **Code Example – Middleware Authentication**
```javascript
// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const isAuthenticated = request.cookies.get("authToken");

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Apply middleware only to protected pages
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
```

### **3️⃣ Securing API Routes with Authentication**
Even if we protect frontend pages, **API routes must also be secured**.

📌 **Key Points to Explain:**
- API routes are **public by default** unless secured.
- How to **check for authentication** inside API handlers.
- Why returning **proper HTTP status codes** (e.g., `401 Unauthorized`) is important.

📌 **Code Example – Protected API Route**
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

### **4️⃣ Client-Side Route Guards**
While middleware protects **backend routes**, we also need **client-side protection**.

📌 **Key Points to Explain:**
- How to use `useContext` and `useEffect` for **authentication-based redirects**.
- Why checking user **authentication status on the frontend** improves UX.

📌 **Code Example – Client-Side Route Guard**
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

---

## **Common Student Issues & Fixes**

| **Issue** | **Solution** |
|-----------|-------------|
| Middleware not working | Ensure `matcher` is set correctly in `config`. |
| API route is accessible without authentication | Add token verification inside API handler. |
| Route guard redirects incorrectly | Verify `user` state is loaded before redirecting. |

---

## **Key Learning Outcomes**

✅ **Students will understand how Next.js routing works.**  
✅ **They will be able to secure API routes using authentication.**  
✅ **They will implement protected routes with middleware and client-side guards.**  
✅ **They will integrate authentication seamlessly across the app.**  

---

## **Additional Resources**

🔹 [Next.js Routing Guide](https://nextjs.org/docs/routing/introduction)  
🔹 [Next.js Middleware Docs](https://nextjs.org/docs/advanced-features/middleware)  
🔹 [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)  

---

### **Next Steps: Moving to Full API Integration**
Next Milestone, students will learn how to **integrate a real-time API** with their Twitter Clone, allowing users to post, fetch, and delete tweets dynamically.  

---
