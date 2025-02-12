# **Milestone 2: NoSQL with React & Next.js - Authentication & User Profiles**

## **Overview**
In Milestone 2, we enhance our Library App by introducing **authentication**, **user profile management**, and **favorite books functionality** using **MongoDB and Mongoose**. This will allow users to sign up, log in, and store personalized data.

---

## **Learning Objectives**
1. **User Authentication:**
   - Implement sign-up and login features.
   - Use JWT or session-based authentication for security.

2. **User Profiles & Personalization:**
   - Store user details in MongoDB.
   - Allow users to manage favorite books and retrieve personal data.

3. **Secure API Routes & Middleware:**
   - Protect routes using authentication middleware.
   - Restrict access based on user roles.

4. **CRUD Operations for User Data:**
   - Create, Read, Update, and Delete user data in MongoDB.
   - Associate users with their saved books.

---

## **Why is Authentication Important?**
Authentication ensures that users can securely log in and access personalized features. It allows us to protect sensitive user data and maintain proper access control.

---

## **Project Enhancements - Library App**

### **1. User Authentication System**
📌 **Goal:** Implement user login and sign-up features.

- **Sign-up form:** Users can create an account.
- **Login system:** Validate credentials and generate JWT tokens.
- **Session management:** Keep users logged in using authentication middleware.

🔹 **Code Example - Creating a User Model in MongoDB (Mongoose Schema):**

```js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
```

---

### **2. Protecting Routes & Securing APIs**
📌 **Goal:** Restrict access to certain pages based on authentication status.

🔹 **Code Example - Authentication Middleware:**

```js
import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = user;
    next();
  });
}
```

🔹 **Protecting API routes:**

```js
import { authenticate } from "@/middleware/auth";
import connectToDatabase from "@/lib/mongodb";

export async function GET(req, res) {
  authenticate(req, res, async () => {
    await connectToDatabase();
    const books = await Book.find({ userId: req.user.id });
    return res.status(200).json(books);
  });
}
```

---

### **3. Managing Favorite Books**
📌 **Goal:** Allow users to save and retrieve their favorite books.

🔹 **Code Example - Adding a Book to Favorites:**

```js
export async function POST(req, res) {
  const { userId, bookId } = await req.json();
  await connectToDatabase();

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  if (!user.favorites.includes(bookId)) {
    user.favorites.push(bookId);
    await user.save();
  }

  return res.status(200).json({ message: "Book added to favorites" });
}
```

---

## **Expected Outcomes**
- Users can **sign up** and **log in**.
- Authenticated users can access **personalized profiles**.
- Users can **add/remove favorite books** from their accounts.
- API routes are **protected** from unauthorized access.

---

## **Bonus Challenge**
🎯 **Implement "Remember Me" functionality**  
- Use cookies or local storage to persist login sessions.

🎯 **User Roles & Permissions**  
- Create an admin role with access to additional book management features.

---

## **Resources**
1. [JWT Authentication in Next.js](https://next-auth.js.org/)
2. [MongoDB & Mongoose for Beginners](https://www.mongodb.com/developer/products/mongodb/)
3. [Handling API Authentication in Next.js](https://nextjs.org/docs/authentication)
4. [Building Secure APIs with Next.js Middleware](https://nextjs.org/docs/middleware)

---

# **Conclusion - Milestone 2**
This Milestone, we implemented authentication, secured API routes, and allowed users to manage favorite books. Next, we will **explore SSH, shell commands, and deploy our app** in **Milestone 3**.
