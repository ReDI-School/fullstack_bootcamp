# **Milestone 4 - Reference Guide**

## **Overview**
This document serves as a **quick reference** for the key concepts, functions, and patterns used in **Milestone 4** of the Next.js module. It includes **dynamic routing, authentication, API protection, and client-side guards**.

---

## **1️⃣ Dynamic Routing in Next.js**
### **Creating Dynamic Routes**
- Use **bracket syntax** `[id]` for dynamic paths.
- Access `params.id` to retrieve dynamic values.

📌 **Example: Fetching a Tweet by ID**
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

🔹 **Key Takeaways:**
✅ Use `params.id` to fetch and display **dynamic data**.
✅ Next.js automatically **creates routes based on folder structure**.

---

## **2️⃣ Middleware for Authentication**
### **What is Middleware?**
Middleware **intercepts requests before they reach the page** and can be used for **authentication, logging, or redirects**.

📌 **Example: Protecting Routes with Middleware**
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

// Apply middleware to specific routes
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
```

🔹 **Key Takeaways:**
✅ Middleware **runs before the request reaches the page**.
✅ **If not authenticated**, users are **redirected to /login**.
✅ Use `matcher` to **restrict specific routes**.

---

## **3️⃣ Securing API Routes with Authentication**
### **Protecting API Endpoints**
By default, **Next.js API routes are public**. We need to **verify authentication** inside API handlers.

📌 **Example: Secure API Endpoint**
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

🔹 **Key Takeaways:**
✅ Always **validate authentication** inside API routes.
✅ If `authToken` is missing, return a **401 Unauthorized** response.
✅ API routes **should never expose sensitive user data** without authentication.

---

## **4️⃣ Client-Side Route Guards**
### **Why Do We Need Route Guards?**
Even with **middleware and API protection**, we still need to **protect client-side navigation**.

📌 **Example: Redirecting Unauthenticated Users**
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

🔹 **Key Takeaways:**
✅ **Prevent unauthorized users** from accessing protected pages.
✅ **Redirect users** to `/login` if they are **not authenticated**.
✅ **Check authentication state** using `useContext` inside protected pages.

---

## **🔹 Summary & Best Practices**
| **Feature** | **Best Practice** |
|------------|-------------------|
| **Dynamic Routing** | Use `[id]` for parameterized routes. |
| **Middleware** | Apply it only to protected routes (`/dashboard`, `/profile`). |
| **API Security** | Always **validate authentication tokens** in API requests. |
| **Client Route Guards** | Redirect users from protected pages **if they are not logged in**. |

---

## **🔗 Additional Resources**

🔹 [Next.js Routing Guide](https://nextjs.org/docs/routing/introduction)
🔹 [Next.js Middleware Docs](https://nextjs.org/docs/advanced-features/middleware)
🔹 [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

## **Next Steps: Connecting with a Database**
Next Milestone, we will **integrate a real database** to store and fetch real user-generated tweets, making our Twitter Clone fully functional.

🚀 **Get ready to take your project to the next level!**

---
