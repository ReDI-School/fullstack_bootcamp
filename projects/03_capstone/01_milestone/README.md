# **Milestone 1: NoSQL & Database Integration**

## **Overview**

This Milestone, we introduce **NoSQL databases** and integrate **MongoDB** into our Next.js Library App. We will learn how to set up a database, define schemas, perform CRUD operations, and connect our Next.js app to MongoDB using **Mongoose**.

By the end of the Milestone, you will:
✅ Understand how **NoSQL databases** differ from SQL  
✅ Be able to **connect** MongoDB with Next.js  
✅ Perform **CRUD operations** (Create, Read, Update, Delete)  
✅ Learn how to **fetch and display books** from the database in the Library App

---

## **Why NoSQL & MongoDB?**

Traditional SQL databases use **tables and relationships**, while NoSQL databases like **MongoDB** use **documents and collections**. This makes NoSQL **flexible** and **scalable**, especially for dynamic applications like our Library App.

| Feature      | SQL (Relational) | MongoDB (NoSQL)              |
| ------------ | ---------------- | ---------------------------- |
| **Schema**   | Fixed structure  | Flexible JSON-like documents |
| **Scaling**  | Vertical scaling | Horizontal scaling           |
| **Best for** | Structured data  | Unstructured, scalable data  |

MongoDB stores data in **documents** (JSON format), which allows us to **store book details** in an easy-to-query structure.

---

## **Project Update: Integrating MongoDB**

In this milestone, we **replace the static books data** with a **real MongoDB database**. Our Next.js app will now:

- **Fetch books from MongoDB**
- **Store user favorite books**
- **Allow users to add and delete books from their collection**

---

## **1️⃣ Setting Up MongoDB Atlas**

MongoDB Atlas is a cloud-based MongoDB solution.

🔹 **Steps to Set Up MongoDB Atlas:**

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a **new cluster** (free tier available)
3. Get your **connection string**
4. Add it to your `.env.local` file:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/myLibraryDB?retryWrites=true&w=majority
   ```

---

## **2️⃣ Connecting MongoDB to Next.js**

We use **Mongoose** to connect Next.js to MongoDB.

📌 **Install Mongoose:**

```sh
npm install mongoose dotenv
```

📁 **Project Structure**

```
/lib
 ├── mongodb.js  (Handles DB connection)
```

📌 **Database Connection (`lib/mongodb.js`)**

```js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("⚠️ Missing MONGODB_URI in .env.local file");
}

let cached = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  console.log("✅ MongoDB Connected!");
  return cached.conn;
}

export default connectDB;
```

---

## **3️⃣ Creating a Books Model**

📁 **Project Structure**

```
/models
 ├── Book.js  (Schema for books)
```

📌 **Book Model (`models/Book.js`)**

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

---

## **4️⃣ API Routes for CRUD Operations**

📁 **Project Structure**

```
/app
 ├── /api
 │   ├── /books
 │   │   ├── route.js  (Handles CRUD operations)
```

📌 **API Route for CRUD (`app/api/books/route.js`)**

```js
import connectDB from "@/lib/mongodb";
import Book from "@/models/Book";

export async function GET(req) {
  await connectDB();
  try {
    const books = await Book.find({});
    return new Response(JSON.stringify(books), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching books" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  try {
    const newBook = await Book.create(body);
    return new Response(JSON.stringify(newBook), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error creating book" }), {
      status: 500,
    });
  }
}
```

---

## **5️⃣ Fetching Books in Next.js**

We now update our Next.js frontend to **fetch and display books** from MongoDB.

📁 **Project Structure**

```
/app/library/page.js
```

📌 **Fetching Books (`app/library/page.js`)**

```js
"use client";
import { useEffect, useState } from "react";

export default function Library() {
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
      <h1>Library</h1>
      <ul>
        {books.map((book) => (
          <li key={book._id}>
            {book.title} - {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## **🔹 Expected Outcome**

✅ Users can view books stored in the MongoDB database  
✅ The app dynamically fetches and displays books  
✅ Users can **add** books to their library  
✅ Users can **delete** books from their collection

---

## **🔹 Bonus Challenge**

1️⃣ **Add a "Favorite Books" Feature**

- Create a `favorites` collection in MongoDB
- Allow users to **add books to their favorites**

2️⃣ **Implement Search & Filters**

- Add a **search bar** to filter books
- Create a **category filter**

3️⃣ **Enhance Error Handling**

- Show meaningful messages for database errors

---

## **🔹 Resources**

📌 [MongoDB Official Documentation](https://www.mongodb.com/docs/)  
📌 [Mongoose Guide](https://mongoosejs.com/docs/guide.html)  
📌 [Next.js Data Fetching](https://nextjs.org/docs/pages/building-your-application/data-fetching)

---

🚀 **Great job! In Milestone 2, we will enhance our app with authentication and user profiles!**
