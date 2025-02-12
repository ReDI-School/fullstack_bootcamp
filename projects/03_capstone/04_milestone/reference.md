# **Milestone 4 - Recap & Final Review**

## **Reference Guide**
This document serves as a reference guide for all major concepts covered in **Milestones 9-11**, reinforcing key ideas related to **NoSQL Databases, MongoDB, Authentication, API Routes, and SSH Basics**.

---

## **1️⃣ NoSQL & MongoDB**
### 🔹 **NoSQL Overview**
- **Definition**: NoSQL (**Not Only SQL**) databases are designed for **scalability, flexibility, and high performance**.
- **Types**: Document-based (e.g., MongoDB), Key-Value (e.g., Redis), Column-based (e.g., Cassandra), Graph-based (e.g., Neo4j).
- **Advantages**:
  - Schema-less structure 🏗️
  - Horizontal scalability 📈
  - High availability & performance ⚡

### 🔹 **MongoDB Essentials**
- **Key Features**:
  - Stores data as **JSON-like documents (BSON)**
  - Allows **flexible schema design**
  - Supports **replication and sharding** for high availability

#### **Common MongoDB Commands**
```sh
# Show all databases
show dbs;

# Use a specific database
use myDatabase;

# Show collections inside a database
show collections;

# Insert a document
db.books.insertOne({ title: "The Hobbit", author: "J.R.R. Tolkien" });

# Find all documents in a collection
db.books.find();

# Delete a document
db.books.deleteOne({ title: "The Hobbit" });
```

---

## **2️⃣ Authentication & User Management**
### 🔹 **Authentication in Next.js**
- Uses **JWT (JSON Web Tokens)** for authentication.
- Can integrate with **third-party OAuth providers (Google, GitHub, Facebook)**.
- **Session-based authentication** via NextAuth.js.

#### **Implementing JWT Authentication**
```js
import jwt from "jsonwebtoken";

export function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}
```

### 🔹 **NextAuth.js for Authentication**
```js
import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
});
```

---

## **3️⃣ API Routes in Next.js**
### 🔹 **API Routes in App Router**
- Located inside **`/app/api`** in Next.js App Router.
- Handles **CRUD operations** and database interactions.

#### **Example API Route (Fetching Books)**
```js
import connectDB from "@/lib/db";
import Book from "@/models/Book";

export async function GET(req) {
  await connectDB();
  const books = await Book.find({});
  return new Response(JSON.stringify(books), { status: 200 });
}
```

---

## **4️⃣ Secure Shell (SSH) & Deployment**
### 🔹 **SSH Basics**
- **What is SSH?** Secure Shell (**SSH**) is a cryptographic protocol used to securely connect to remote servers.
- **Common SSH Commands**:
  ```sh
  # Connect to a remote server
  ssh user@your-server-ip

  # Copy files to a server
  scp file.txt user@your-server-ip:/destination/path

  # Restart a service (e.g., MongoDB)
  sudo systemctl restart mongod
  ```
- **Using SSH Keys**:
  ```sh
  # Generate an SSH key pair
  ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

  # Copy public key to server
  ssh-copy-id user@your-server-ip
  ```

---

## **5️⃣ Deployment & Environment Variables**
### 🔹 **Deploying a Next.js App**
- **Hosting Platforms**:
  - [Vercel](https://vercel.com/) – Recommended for Next.js apps.
  - [Railway](https://railway.app/) – Database hosting.
  - [DigitalOcean](https://www.digitalocean.com/) – VPS & Managed Databases.

- **Environment Variables in Next.js**
  ```sh
  NEXT_PUBLIC_API_URL="https://api.example.com"
  MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/database"
  ```
- **Using `.env` in Next.js**
  ```js
  process.env.NEXT_PUBLIC_API_URL;
  process.env.MONGODB_URI;
  ```

---

# **📌 Summary**
This reference consolidates the most crucial topics covered in **Milestones 9-11**, ensuring you have a **quick-access guide** to essential commands, concepts, and best practices.

✅ **MongoDB & NoSQL Fundamentals**  
✅ **User Authentication (JWT & NextAuth.js)**  
✅ **API Routes in Next.js**  
✅ **SSH & Secure Remote Access**  
✅ **Deployment & Environment Variables**  

---

# **💡 Next Steps**
As we approach the final stages of the bootcamp, here are the upcoming focus areas:

🔹 **Final Capstone Project** – Implementing all learned concepts into a real-world application  
🔹 **Refining Full-Stack Development Skills**  
🔹 **Deploying & Managing a Live Web Application**  

🚀 **Keep pushing forward! You're almost there!**
