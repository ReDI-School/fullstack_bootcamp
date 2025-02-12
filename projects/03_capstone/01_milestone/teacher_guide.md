# **Teacher Guide - NoSQL & Database**

## **Introduction**

This guide provides a structured approach to teaching **NoSQL databases**, **MongoDB**, and **CRUD operations** in a Next.js application. The primary objective is to introduce students to database management concepts while implementing them in a real-world project.

---

## **Teaching Objectives**

1. **Understand NoSQL & MongoDB** → Explain why NoSQL databases are useful and how they differ from relational databases.
2. **Set Up a MongoDB Database** → Guide students in setting up MongoDB (locally or with Atlas) and integrating it with Next.js.
3. **Use Mongoose for Data Modeling** → Teach schema creation and validation with Mongoose.
4. **Implement CRUD Operations** → Demonstrate how to create, read, update, and delete data using API routes in Next.js.
5. **Fetch Data in a Next.js Frontend** → Show how to retrieve data and display it dynamically in the Library App.

---

## **Classroom Flow**

### **1. NoSQL & MongoDB Overview**

- Introduce **NoSQL databases** and compare them with relational databases.
- Discuss **MongoDB’s strengths** (scalability, flexibility, performance).

#### **Discussion Prompts:**

- When should we use NoSQL instead of SQL?
- What are the trade-offs of using MongoDB?

### **2. Setting Up MongoDB**

- Guide students through setting up MongoDB **locally** or using **MongoDB Atlas**.
- Explain **MongoDB Compass** for visual database management.

#### **Common Issues:**

- Connection errors → Ensure `.env.local` contains the correct `MONGODB_URI`.
- Cluster authentication → Verify database user credentials.

### **3. Connecting MongoDB to Next.js**

- Walk students through installing **Mongoose** and setting up the **connection file (`mongodb.js`)**.
- Explain **why we use a global connection cache** in Next.js.

#### **Live Code Example:**

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

### **4. Creating the Mongoose Model**

- Show how to define a **Book schema** and why Mongoose requires schemas.

#### **Live Code Example:**

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

### **5. Implementing CRUD Operations**

| Operation  | Method   | Route        |
| ---------- | -------- | ------------ |
| **Create** | `POST`   | `/api/books` |
| **Read**   | `GET`    | `/api/books` |
| **Update** | `PUT`    | `/api/books` |
| **Delete** | `DELETE` | `/api/books` |

#### **Live Code Example - API Route for `POST`**:

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

### **6. Fetching Data in Next.js**

- Explain **how Next.js fetches data** from the API and displays it on the frontend.
- Demonstrate use of `useEffect` to fetch books dynamically.

#### **Live Code Example:**

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

## **Common Mistakes & Troubleshooting**

1. **Incorrect MongoDB URI in `.env` file**

   - Solution: Ensure it matches your **MongoDB Atlas connection string**.

2. **CORS errors when fetching data**

   - Solution: Add `headers: { "Content-Type": "application/json" }` to fetch requests.

3. **Model not recognized in Mongoose**

   - Solution: Ensure models use `mongoose.models.Book || mongoose.model('Book', BookSchema)`.

4. **Network Errors (500 Status Code)**
   - Solution: Check the Next.js API logs to debug the error message.

---

## **Learning Outcomes**

✅ Students understand the **difference between SQL and NoSQL** databases.  
✅ They can **set up and configure MongoDB** using Atlas.  
✅ They can **connect Next.js to MongoDB** using Mongoose.  
✅ They know how to **implement CRUD operations**.  
✅ They have **integrated a NoSQL database into a working Next.js application**.

---

## **Additional Resources**

🔗 **MongoDB Atlas** - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)  
🔗 **Mongoose Documentation** - [Mongoose Docs](https://mongoosejs.com/docs/)  
🔗 **Next.js API Routes** - [Next.js API Docs](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)  
🔗 **Postman for API Testing** - [Postman](https://www.postman.com/)

---

## **Final Notes**

### **Key Takeaways for Instructors**:

- NoSQL databases like **MongoDB** provide flexibility and scalability.
- **Mongoose** simplifies database interactions with **schema-based models**.
- CRUD operations allow full database control via API routes.
- **Next.js API routes** act as backend endpoints in a full-stack application.
- Frontend integration requires **fetching data from the backend** and handling it dynamically.

### **Suggestions for Assignments & Discussions**:

1. **Modify the Schema**: Have students add new fields like "genres" or "ratings" to the `Book` model.
2. **Enhance the UI**: Ask students to create a **better book display** with images and descriptions.
3. **Error Handling Practice**: Have students implement better validation and error messages.
4. **Deploy the App**: Guide students through **deploying the app** with Vercel and MongoDB Atlas.

By completing this module, students have built a **full-stack Next.js application** powered by **MongoDB**. They now have a strong foundation in **handling databases in modern web applications**.

🚀 **Next up → Milestone 2: Authentication & User Profiles with Next.js & MongoDB!**
