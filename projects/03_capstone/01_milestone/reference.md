# **Reference Guide - NoSQL & Database**

## **Overview**

This reference guide covers the fundamental concepts of **NoSQL databases**, **MongoDB**, and **data persistence** in a **Next.js full-stack application**. It includes essential commands, explanations, and examples to assist students in integrating MongoDB into their projects.

---

## **1. NoSQL vs SQL: Key Differences**

| Feature         | SQL (Relational)      | NoSQL (Document-Based) |
| --------------- | --------------------- | ---------------------- |
| **Structure**   | Tables, Rows, Columns | Collections, Documents |
| **Schema**      | Predefined Schema     | Dynamic Schema         |
| **Scalability** | Vertical Scaling      | Horizontal Scaling     |
| **Flexibility** | Strict Data Structure | Flexible & Schema-less |
| **Examples**    | MySQL, PostgreSQL     | MongoDB, Firebase      |

- **SQL databases** are best for applications requiring strict consistency and complex transactions (e.g., Banking Systems).
- **NoSQL databases** are preferred for applications needing fast reads/writes and scalability (e.g., Social Media Apps).

---

## **2. Setting Up MongoDB**

### **Local MongoDB Installation (Optional)**

- Install **MongoDB Community Edition** → [Download MongoDB](https://www.mongodb.com/try/download/community)
- Start MongoDB:
  ```sh
  mongod --dbpath=/data/db
  ```

### **Using MongoDB Atlas (Recommended)**

- Create a **MongoDB Atlas** account → [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Set up a **free cluster** and obtain the connection string (`MONGODB_URI`).

---

## **3. Connecting MongoDB to Next.js with Mongoose**

### **Installation**

```sh
npm install mongoose
```

### **Database Connection (mongodb.js)**

```js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("⚠️ Please define the MONGODB_URI in the .env file");
}

let cached = global.mongoose || { conn: null, promise: null };

async function connectToDatabase() {
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

export default connectToDatabase;
```

---

## **4. Creating a Mongoose Schema & Model**

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

## **5. CRUD Operations in Next.js API Routes**

| Operation  | Method   | Route        |
| ---------- | -------- | ------------ |
| **Create** | `POST`   | `/api/books` |
| **Read**   | `GET`    | `/api/books` |
| **Update** | `PUT`    | `/api/books` |
| **Delete** | `DELETE` | `/api/books` |

### **Example: Create a New Book (POST API)**

```js
export async function POST(req) {
  await connectToDatabase();
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

## **6. Fetching Data in Next.js (Frontend Integration)**

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

## **7. Common Errors & Fixes**

### **❌ Error: MongoDB URI is Undefined**

🔍 **Cause**: Missing `.env.local` configuration  
✅ **Fix**: Add `MONGODB_URI` in `.env.local`

```env
MONGODB_URI=mongodb+srv://your-db-user:password@cluster.mongodb.net/myDatabase
```

### **❌ Error: Model Not Found in Mongoose**

🔍 **Cause**: Model isn't cached properly  
✅ **Fix**: Use `mongoose.models.Book || mongoose.model('Book', BookSchema)`

### **❌ Error: Fetching Data Returns 500 Status**

🔍 **Cause**: API route isn't handling the request correctly  
✅ **Fix**: Check API logs in Next.js and add error handling in API functions.

---

## **8. Additional Resources**

📌 **MongoDB Atlas** → [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)  
📌 **Mongoose Docs** → [Mongoose Documentation](https://mongoosejs.com/docs/)  
📌 **Next.js API Routes** → [Next.js API Docs](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)  
📌 **MongoDB Compass** → [Compass UI Tool](https://www.mongodb.com/products/compass)  
📌 **Postman for API Testing** → [Postman](https://www.postman.com/)

---

## **Final Notes**

By completing this module, students have learned how to:

✅ **Use MongoDB in a Next.js project**  
✅ **Create Mongoose schemas and models**  
✅ **Perform CRUD operations using API routes**  
✅ **Fetch and display MongoDB data in a Next.js frontend**

🚀 **Next up → Milestone 2: Authentication & User Profiles with Next.js & MongoDB!**
