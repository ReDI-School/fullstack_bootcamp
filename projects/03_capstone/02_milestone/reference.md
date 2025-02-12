# Reference - Milestone 2: NoSQL with React and Next.js

## Introduction

This reference guide provides key resources and explanations for working with NoSQL databases in a **Next.js** and **React** environment. The focus is on **MongoDB**, **Mongoose**, and how to integrate them efficiently in a full-stack web application.

---

## **1️⃣ Understanding NoSQL & MongoDB**

### **📌 What is NoSQL?**

- NoSQL (**Not Only SQL**) databases are **schema-less**, meaning they allow **flexible and scalable** data storage.
- Designed to handle **large amounts of unstructured data**.
- Unlike **SQL databases (relational)**, NoSQL stores data in various forms, such as:
  - **Document-based** (e.g., MongoDB)
  - **Key-Value stores** (e.g., Redis)
  - **Graph databases** (e.g., Neo4j)

### **📌 Why MongoDB?**

MongoDB is a **document-based NoSQL database** that stores data in **JSON-like** documents instead of tables.

| Feature         | SQL Database                 | MongoDB (NoSQL)                    |
| -------------- | --------------------------- | ---------------------------------- |
| **Schema**     | Fixed schema                 | Dynamic schema                     |
| **Data Model** | Tables & Rows                | JSON-like Documents                |
| **Scalability**| Vertical Scaling             | Horizontal Scaling                  |
| **Relationships** | Uses Foreign Keys | Embedded Documents |
| **Best for** | Structured data (e.g., Banking) | Unstructured data (e.g., Social Media) |

---

## **2️⃣ Connecting MongoDB to Next.js with Mongoose**

### **📌 What is Mongoose?**

Mongoose is an **ODM (Object Data Modeling) library** for MongoDB in **Node.js**.

- Helps structure data with **schemas**.
- Provides built-in **data validation**.
- Simplifies interactions with MongoDB.

### **📌 Setting Up MongoDB in Next.js**

#### **Step 1: Install Dependencies**

Run the following command:

```sh
npm install mongoose dotenv
```

#### **Step 2: Create a Database Connection File**

Inside your **Next.js project**, create a **lib** folder and add a **mongodb.js** file.

📂 **Project Structure**:

```
/lib
 ├── mongodb.js  (Database connection setup)
```

📌 **Code for `mongodb.js`**:

```js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("⚠️ Please define MONGODB_URI in your .env file");
}

let cached = global.mongoose || { conn: null, promise: null };

async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
```

#### **Step 3: Configure `.env` file**

Create a **.env.local** file and add your MongoDB URI:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/myDatabase?retryWrites=true&w=majority
```

---

## **3️⃣ CRUD Operations with MongoDB**

### **📌 Define a Model with Mongoose**

Inside **/models**, create a **Book.js** file:

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

### **📌 Creating API Routes for CRUD Operations**

In Next.js App Router, we structure our API routes inside **/app/api/books/**.

📂 **Project Structure**:

```
/app
 ├── /api
 │   ├── /books
 │   │   ├── route.js  (Handles CRUD operations)
```

#### **Create a New Book (`POST`)**

```js
import connectToDatabase from "@/lib/mongodb";
import Book from "@/models/Book";

export async function POST(req) {
  await connectToDatabase();
  const body = await req.json();
  try {
    const newBook = await Book.create(body);
    return new Response(JSON.stringify(newBook), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error creating book" }), { status: 500 });
  }
}
```

#### **Read All Books (`GET`)**

```js
export async function GET(req) {
  await connectToDatabase();
  try {
    const books = await Book.find({});
    return new Response(JSON.stringify(books), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching books" }), { status: 500 });
  }
}
```

#### **Update a Book (`PUT`)**

```js
export async function PUT(req) {
  await connectToDatabase();
  const { id, ...updatedData } = await req.json();
  try {
    const updatedBook = await Book.findByIdAndUpdate(id, updatedData, { new: true });
    return new Response(JSON.stringify(updatedBook), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error updating book" }), { status: 500 });
  }
}
```

#### **Delete a Book (`DELETE`)**

```js
export async function DELETE(req) {
  await connectToDatabase();
  const { id } = await req.json();
  try {
    await Book.findByIdAndDelete(id);
    return new Response(JSON.stringify({ message: "Book deleted successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error deleting book" }), { status: 500 });
  }
}
```

---

## **4️⃣ Frontend Integration - Fetching Books**

Inside **/app/library/page.js**, add:

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

## **Additional Resources**

📌 **MongoDB & Mongoose Documentation**:  
- [MongoDB Official Docs](https://www.mongodb.com/docs/)  
- [Mongoose ODM Guide](https://mongoosejs.com/docs/guide.html)  
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/router-handlers)  

📌 **Learning Resources**:  
- [MongoDB University](https://university.mongodb.com/)  
- [NoSQL Database Basics](https://www.digitalocean.com/community/tutorial_series/understanding-nosql-databases)  

---

## **Conclusion**

- We learned about **NoSQL databases** and why **MongoDB** is ideal for scalable applications.
- We implemented **Mongoose** in a **Next.js App Router** project.
- We set up **CRUD API routes** for managing books in our Library App.
- We integrated MongoDB with **React frontend** for dynamic data rendering.

🚀 **Next Step → Milestone 3: SSH Basics & Deployment!**

