# **Milestone 4 - Recap Part**

## **Introduction**

Welcome to the final recap Milestone! Over the past Milestones, we have explored **React, Next.js, NoSQL databases, authentication, and deployment**. This recap will consolidate key concepts and reinforce best practices.

This section will cover:

- **Core React Concepts**
- **Next.js Fundamentals**
- **Database & API Integration**

---

## **1️⃣ React Core Concepts Recap**

### **React Component Structure**

React applications are built with **components**, which can be **functional** or **class-based**. Since modern React relies on functional components, here’s a refresher:

#### **Functional Component Example**

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default Greeting;
```

#### **State Management (useState)**

State is used to store and manage component data dynamically.

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default Counter;
```

#### **Props & Reusability**

Props allow data to be passed between components.

```jsx
function UserCard({ name, role }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>{role}</p>
    </div>
  );
}

export default function App() {
  return <UserCard name="John Doe" role="Admin" />;
}
```

---

## **2️⃣ Next.js Recap**

### **Why Next.js?**

Next.js extends React with:
✅ Server-Side Rendering (SSR)  
✅ Static Site Generation (SSG)  
✅ API Routes  
✅ Built-in Routing

### **Page Routing**

With **App Router (Next.js 13+),** pages are inside `/app` instead of `/pages`.

#### **Defining a Page**

```jsx
export default function HomePage() {
  return <h1>Welcome to the Next.js App!</h1>;
}
```

#### **Dynamic Routes**

```jsx
export default function BookPage({ params }) {
  return <h1>Book ID: {params.id}</h1>;
}
```

**Example Folder Structure:**

```
/app
 ├── layout.js
 ├── page.js
 ├── books
 │   ├── [id]
 │   │   ├── page.js
```

### **Fetching Data in Next.js**

#### **Client-Side Fetching**

```jsx
"use client";
import { useEffect, useState } from "react";

export default function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function fetchBooks() {
      const res = await fetch("/api/books");
      const data = await res.json();
      setBooks(data);
    }
    fetchBooks();
  }, []);

  return (
    <div>
      {books.map((book) => (
        <p key={book.id}>{book.title}</p>
      ))}
    </div>
  );
}
```

#### **Server-Side Fetching (Recommended)**

```jsx
export default async function BooksPage() {
  const res = await fetch("https://api.example.com/books");
  const books = await res.json();

  return (
    <div>
      {books.map((book) => (
        <p key={book.id}>{book.title}</p>
      ))}
    </div>
  );
}
```

---

## **3️⃣ Connecting to a Database (MongoDB)**

We used **MongoDB & Mongoose** to store and retrieve book data.

### **Connecting to MongoDB**

```js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
```

### **Defining a Mongoose Model**

```js
import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  year: Number,
});

export default mongoose.models.Book || mongoose.model("Book", BookSchema);
```

### **API Route Example**

```js
import connectDB from "@/lib/mongodb";
import Book from "@/models/Book";

export async function GET() {
  await connectDB();
  const books = await Book.find({});
  return Response.json(books);
}
```

---

## **1️⃣ Enhancing Our Understanding of Next.js**

In the previous Milestones, we explored the basics and advanced features of Next.js. Let's solidify our understanding by revisiting some core concepts.

### **📌 Server-Side Rendering (SSR) vs Static Site Generation (SSG)**

| Feature          | SSR (Server-Side Rendering)        | SSG (Static Site Generation)                  |
| ---------------- | ---------------------------------- | --------------------------------------------- |
| When rendered?   | On each request                    | At build time                                 |
| Performance      | Slower (depends on request)        | Faster (prebuilt pages)                       |
| Best for         | Dynamic content that changes often | Static content that doesn't change frequently |
| Example Use Case | User-specific dashboards           | Blog posts, product pages                     |

### **🛠️ Dynamic Routing**

Next.js allows us to create **dynamic routes** using brackets (`[id]`), enabling us to handle pages dynamically.

Example:

- `/app/book/[id]/page.js` → Handles individual book pages.

```js
export default function BookPage({ params }) {
  return <h1>Book ID: {params.id}</h1>;
}
```

### **🔄 API Routes**

Next.js provides an easy way to create backend logic within our app. Our `/api/books/` route in Next.js acts as a mini backend that connects with MongoDB.

Example: Fetching all books from MongoDB:

```js
import connectDB from "@/lib/db";
import Book from "@/models/Book";

export async function GET() {
  await connectDB();
  const books = await Book.find({});
  return new Response(JSON.stringify(books), { status: 200 });
}
```

---

## **2️⃣ Working with MongoDB & Mongoose**

MongoDB plays a crucial role in our full-stack application. We have learned how to **define schemas, perform CRUD operations, and connect MongoDB with Next.js**.

### **📝 Recap of Mongoose Schema & Models**

Mongoose allows us to **define the structure of documents** in MongoDB. For example, our Book model:

```js
import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publishedYear: Number,
  coverImage: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Book || mongoose.model("Book", BookSchema);
```

### **CRUD Operations in MongoDB**

| Operation  | Description                      | Example                                   |
| ---------- | -------------------------------- | ----------------------------------------- |
| **Create** | Add a new book to the database   | `Book.create({ title: "New Book" })`      |
| **Read**   | Retrieve books from the database | `Book.find({})`                           |
| **Update** | Modify an existing book          | `Book.findByIdAndUpdate(id, updatedData)` |
| **Delete** | Remove a book                    | `Book.findByIdAndDelete(id)`              |

### **Connecting Next.js to MongoDB**

To connect Next.js with MongoDB, we used the following **database connection helper**:

```js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
```

---

## **3️⃣ User Authentication in Next.js**

To enhance our application, we introduced **user authentication** using **NextAuth.js**.

### **Steps to Set Up Authentication**

1️⃣ Install NextAuth.js:

```sh
npm install next-auth
```

2️⃣ Configure authentication providers (e.g., Google, GitHub, Email)
3️⃣ Create API route for authentication:

```js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
```

4️⃣ Protecting pages using authentication:

```js
import { useSession } from "next-auth/react";

export default function Profile() {
  const { data: session } = useSession();

  if (!session) {
    return <p>Please log in to access this page.</p>;
  }

  return <h1>Welcome, {session.user.name}!</h1>;
}
```

---

## **📌 Summary of Key Takeaways**

✅ We reinforced our understanding of **Next.js**, including API routes and dynamic routing.  
✅ We reviewed **MongoDB**, learned how to perform **CRUD operations** with Mongoose, and properly connect it to Next.js.  
✅ We introduced **user authentication** using **NextAuth.js** to handle login and user sessions.

---

## **Advanced Features and Deployment**

In the final part of this recap, we will focus on **advanced features** implemented throughout the bootcamp and the **deployment process** of our full-stack application. This section will ensure students understand how to **optimize**, **secure**, and **deploy** their applications efficiently.

---

## **1️⃣ Optimizing Performance in Next.js**

### **1.1 Image Optimization**

Next.js provides a built-in image component (`next/image`) that optimizes images by **lazy loading**, **automatic resizing**, and **format conversion**.

#### **Example: Using Next.js Image Component**

```jsx
import Image from "next/image";

export default function BookCover({ src, title }) {
  return (
    <Image
      src={src}
      alt={`Cover of ${title}`}
      width={200}
      height={300}
      priority // Loads the image with priority for better UX
    />
  );
}
```

✅ **Benefits:**

- Automatically compresses and serves images in modern formats (WebP).
- Improves load time and page speed.

---

### **1.2 API Caching with Incremental Static Regeneration (ISR)**

**ISR** allows us to **statically generate pages** but still update them **without a full rebuild**.

#### **Example: ISR in API Calls**

```js
export async function getStaticProps() {
  const res = await fetch("https://openlibrary.org/works/OL82563W.json");
  const book = await res.json();

  return {
    props: { book },
    revalidate: 60, // Regenerates the page every 60 seconds
  };
}
```

✅ **Benefits:**

- Faster page loads with pre-rendered content.
- Updates pages periodically without redeploying.

---

## **2️⃣ Securing a Full-Stack Application**

Security is critical in **Next.js applications** interacting with **databases, APIs, and authentication systems**.

### **2.1 Environment Variables**

Always store sensitive information (API keys, database credentials) in a `.env.local` file.

```sh
MONGODB_URI=mongodb+srv://yourUser:yourPassword@cluster.mongodb.net/dbname
NEXT_PUBLIC_API_URL=https://api.example.com
```

✅ **Never expose secrets** in the frontend by keeping them server-side.

---

### **2.2 Middleware for Authentication & Authorization**

Use Next.js **middleware** to protect API routes or specific pages.

#### **Example: Protecting Routes**

```js
import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("authToken");
  if (!token) {
    return NextResponse.redirect("/login");
  }
}
```

✅ **Ensures only authenticated users access restricted pages.**

---

## **3️⃣ Deploying a Next.js Full-Stack Application**

### **3.1 Deployment Options**

Next.js offers multiple deployment solutions:

1. **Vercel (Recommended)**

   - Free hosting with serverless functions.
   - Optimized for Next.js with automatic caching.
   - One-click deployment via GitHub.

2. **Netlify**

   - Great for static sites and frontend-heavy apps.
   - Provides backend functionality with serverless functions.

3. **Self-Hosting with Docker**
   - Useful for enterprise applications.
   - Requires managing infrastructure (e.g., AWS, DigitalOcean).

---

### **3.2 Deploying to Vercel**

Vercel provides **seamless Next.js deployment** with **automatic previews**.

#### **Steps to Deploy**

1. Push your project to **GitHub**.
2. Go to **[Vercel](https://vercel.com/)** and connect your GitHub repository.
3. Click **Deploy** and wait for the process to finish.

✅ **Vercel handles SSL, server-side rendering, and database connections automatically.**

---

## **4️⃣ Final Touches & Best Practices**

As we wrap up the bootcamp, here are some final **best practices**:

### ✅ **Code Quality & Structure**

- Use a **consistent folder structure** (`/app`, `/components`, `/lib`, `/models`, `/pages/api`).
- Follow **React coding standards** (functional components, hooks, proper state management).

### ✅ **Performance Optimization**

- Use **Next.js dynamic imports** for large components.
- Implement **lazy loading** for non-essential scripts.

### ✅ **Security Best Practices**

- Use **middleware for authentication**.
- **Validate API inputs** to prevent injections.
- **Never store sensitive data** in the frontend.

### ✅ **Testing & Debugging**

- Use **Jest + React Testing Library** for unit tests.
- Implement **E2E testing** with Cypress.

---

## **🎯 Wrapping Up: What We’ve Achieved**

Throughout this bootcamp, we have built a **full-stack web application** using:
✅ **React & Next.js** (Frontend & Routing)  
✅ **MongoDB & Mongoose** (Database Management)  
✅ **API Integration** (Fetching & Handling Data)  
✅ **Authentication & Security** (Protecting Routes)  
✅ **Deployment & Optimization** (Going Live!)

This bootcamp has covered **everything needed** to start building **scalable full-stack applications**. 🚀

### **What’s Next?**

Students are encouraged to:

1. **Extend the project** (Add new features, refine UI, improve UX).
2. **Learn TypeScript & GraphQL** to scale their applications.
3. **Contribute to open-source projects** to gain real-world experience.
4. **Apply for jobs & internships** using the skills learned here.

---
