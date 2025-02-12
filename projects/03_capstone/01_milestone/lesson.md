# **Milestone 1 - NoSQL & Database**

## **Introduction to NoSQL Databases**

### **What is NoSQL?**

NoSQL (**Not Only SQL**) databases are designed to handle **large-scale data storage** and **real-time processing** efficiently. Unlike relational databases (**SQL-based**) that rely on **tables, rows, and fixed schemas**, NoSQL databases provide a **flexible and scalable** structure.

### **Key Features of NoSQL Databases**

- **Schema-less data storage** 🏗️ → No rigid structure like SQL tables.
- **Horizontal scalability** 📈 → Data can be distributed across multiple servers.
- **High availability & performance** ⚡ → Optimized for fast data retrieval.
- **Variety of models** 🎭 → Document, Key-Value, Graph, and Column-based storage.

### **Why NoSQL for Our Library App?**

📚 Our Library App requires:
✅ **Efficient storage of book information and user preferences**  
✅ **Scalability** → As more books and users are added, the system should remain efficient  
✅ **Fast retrieval** → Users need real-time search and recommendation features

### **Why Choose MongoDB?**

MongoDB is a **document-oriented NoSQL database** that stores data in **JSON-like documents** instead of tables. It is an excellent choice for applications requiring **flexibility, high-speed access, and scalability**.

### **MongoDB vs SQL: Key Differences**

| Feature         | SQL (Relational DB)             | MongoDB (NoSQL)                                            |
| --------------- | ------------------------------- | ---------------------------------------------------------- |
| **Schema**      | Fixed schema                    | Dynamic schema                                             |
| **Data Model**  | Tables & Rows                   | JSON-like Documents                                        |
| **Scalability** | Vertical Scaling                | Horizontal Scaling                                         |
| **Joins**       | Uses relationships              | Embedded documents                                         |
| **Best for**    | Structured data (e.g., Banking) | Unstructured data (e.g., Social Media, Content Management) |

---

## **What is Mongoose?**

Mongoose is an **Object Data Modeling (ODM) library** for MongoDB in **Node.js**. It provides a structured way to interact with MongoDB by defining **schemas** and **models**.

### **Why Use Mongoose?**

✅ **Provides schema validation** to ensure data consistency  
✅ **Simplifies database interactions** with an easy-to-use API  
✅ **Handles relationships** between different data models

### **Basic Example of Mongoose Schema**

Here’s how we define a **Book model** in MongoDB using Mongoose:

```js
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publishedYear: Number,
  genre: String,
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
```

🔹 This defines a `Book` collection in MongoDB where each document will have:

- **title** (required)
- **author** (required)
- **publishedYear** (optional)
- **genre** (optional)

---

## **Setting Up MongoDB and Connecting with Next.js**

Now that we understand NoSQL, MongoDB, and Mongoose, it's time to set up our database and connect it to our Next.js application.

> First thing first, we need a Next.js app, let's create it, we have the ability to do it!

---

## **1️⃣ Installing MongoDB**

### **Local Installation (Optional)**

If you want to install MongoDB locally, follow these steps:

1. **Download MongoDB**: [MongoDB Download](https://www.mongodb.com/try/download/community)
2. **Install and Start MongoDB**: Follow the installation guide for your OS.
3. **Run MongoDB**:
   ```sh
   mongod --dbpath /data/db
   ```

### **Using MongoDB Atlas (Recommended)**

For production-ready applications, we use **MongoDB Atlas**, a cloud-hosted NoSQL database.

1. **Sign Up for MongoDB Atlas**: [Create an Account](https://www.mongodb.com/cloud/atlas/register)
2. **Create a Free Cluster**
3. **Obtain a Connection String**  
   You will get a **MongoDB URI** that looks like this:
   ```sh
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
   ```

---

## **2️⃣ Setting Up Mongoose in Next.js**

### **Installing Dependencies**

We use **Mongoose** to interact with MongoDB. Install it in your Next.js project:

```sh
npm install mongoose dotenv
```

### **Creating a Database Connection File**

Inside your **Next.js project**, create a new folder `/lib` and a file `mongodb.js` inside it.

📁 **Project Structure**

```
/lib
 ├── mongodb.js  (Handles DB connection)
```

### **Connecting to MongoDB in Next.js**

Edit `mongodb.js`:

```js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("⚠️ Please define the MONGODB_URI in the .env file");
}

let cached = global.mongoose || { conn: null, promise: null };

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

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

### **Adding the `.env` File**

Create a `.env.local` file in the root of your project and add:

```
MONGODB_URI=mongodb+srv://<your-username>:<your-password>@cluster0.mongodb.net/myDatabaseName?retryWrites=true&w=majority
```

> 📝 **Note:** Replace `<your-username>` and `<your-password>` with your MongoDB credentials.

---

## **3️⃣ Creating a Books Model with Mongoose**

### **Defining a Schema for Books**

Inside the `/models` folder, create a file called `Book.js`:

📁 **Project Structure**

```
/models
 ├── Book.js  (Schema for books)
```

### **Book.js Model**

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

## **4️⃣ Creating an API Route to Fetch Books**

### **Setting Up the API Route**

Next.js API routes are located inside the `/app/api` folder.

📁 **Project Structure**

```
/app
 ├── /api
 │   ├── /books
 │   │   ├── route.js  (Fetch books from DB)
```

### **API Route for Fetching Books (`route.js`)**

```js
import connectToDatabase from "@/lib/mongodb";
import Book from "@/models/Book";

export async function GET(req) {
  await connectToDatabase();
  const books = await Book.find({});
  return new Response(JSON.stringify(books), { status: 200 });
}
```

---

## **CRUD Operations with MongoDB & Mongoose**

Now that our database is connected, let's implement **CRUD (Create, Read, Update, Delete) operations** to manage books in our Library App.

---

## **1️⃣ Understanding CRUD Operations**

| Operation  | HTTP Method      | Description                       |
| ---------- | ---------------- | --------------------------------- |
| **Create** | `POST`           | Add a new book to the database    |
| **Read**   | `GET`            | Retrieve books from the database  |
| **Update** | `PUT` or `PATCH` | Modify an existing book's details |
| **Delete** | `DELETE`         | Remove a book from the database   |

---

## **2️⃣ Creating API Routes for CRUD Operations**

In **Next.js App Router**, we structure our API routes inside `/app/api/books/`.

📁 **Project Structure**

```
/app
 ├── /api
 │   ├── /books
 │   │   ├── route.js  (Handles CRUD operations)
```

---

## **3️⃣ Implementing CRUD Routes**

### **📌 Create a New Book (`POST`)**

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
    return new Response(JSON.stringify({ error: "Error creating book" }), {
      status: 500,
    });
  }
}
```

### **📌 Read All Books (`GET`)**

```js
export async function GET(req) {
  await connectToDatabase();
  try {
    const books = await Book.find({});
    return new Response(JSON.stringify(books), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching books" }), {
      status: 500,
    });
  }
}
```

### **📌 Update a Book (`PUT` or `PATCH`)**

```js
export async function PUT(req) {
  await connectToDatabase();
  const { id, ...updatedData } = await req.json();
  try {
    const updatedBook = await Book.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return new Response(JSON.stringify(updatedBook), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error updating book" }), {
      status: 500,
    });
  }
}
```

### **📌 Delete a Book (`DELETE`)**

```js
export async function DELETE(req) {
  await connectToDatabase();
  const { id } = await req.json();
  try {
    await Book.findByIdAndDelete(id);
    return new Response(
      JSON.stringify({ message: "Book deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error deleting book" }), {
      status: 500,
    });
  }
}
```

---

## **4️⃣ Testing API Routes with Postman or Thunder Client**

### **Testing a `POST` Request**

1. Open **Postman** or **Thunder Client** (VSCode extension).
2. Set the method to `POST`.
3. Use the URL: `http://localhost:3000/api/books`
4. Set the request body to JSON:
   ```json
   {
     "title": "The Hobbit",
     "author": "J.R.R. Tolkien",
     "publishedYear": 1937,
     "coverImage": "https://example.com/hobbit.jpg",
     "description": "A classic fantasy novel."
   }
   ```
5. Click **Send** → Expect a `201 Created` response.

### **Testing a `GET` Request**

1. Set the method to `GET`.
2. Use the URL: `http://localhost:3000/api/books`
3. Click **Send** → Expect a JSON array of books.

### **Testing an `UPDATE` Request**

1. Set the method to `PUT`.
2. Use the URL: `http://localhost:3000/api/books`
3. Set the request body:
   ```json
   {
     "id": "64b2ff...",
     "title": "The Hobbit - Updated Edition"
   }
   ```
4. Click **Send** → Expect a `200 OK` response with updated data.

### **Testing a `DELETE` Request**

1. Set the method to `DELETE`.
2. Use the URL: `http://localhost:3000/api/books`
3. Set the request body:
   ```json
   { "id": "64b2ff..." }
   ```
4. Click **Send** → Expect a `200 OK` confirmation.

---

## **5️⃣ Frontend Integration (Fetching Books in Next.js)**

### **Fetching Books from the API in Next.js**

Inside `/app/library/page.js`, add:

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

# **Conclusion - NoSQL & Database**

## **Key Takeaways from This Milestone**

1. **Understanding NoSQL** → We explored how NoSQL databases like MongoDB differ from relational databases, offering flexibility and scalability.
2. **MongoDB Basics** → We set up a MongoDB database and learned how to interact with it using Mongoose.
3. **Database Connection** → We established a connection between our Next.js app and MongoDB using Mongoose.
4. **CRUD Operations** → We implemented Create, Read, Update, and Delete functionalities in our Library App.
5. **Frontend Integration** → We fetched book data from our API and displayed it on the frontend.

## **What’s Next?**

📌 **In Milestone 2**, we will expand our app by adding **user authentication and profile management**. This will allow users to:

✅ Sign up and log in  
✅ Save their favorite books  
✅ Manage personalized book lists

This will involve integrating **authentication**, **user sessions**, and **protected routes** in Next.js.

🔜 **Coming Up Next → Milestone 2: NoSQL with React and Next.js - Authentication & User Profiles**

🚀 **Great job! Keep pushing forward!**
