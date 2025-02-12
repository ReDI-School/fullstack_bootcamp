# **Teacher Guide – Milestone 2: NoSQL with React and Next.js**

## **Introduction**
This guide will help instructors effectively teach students how to integrate NoSQL databases (MongoDB) into a Next.js application, focusing on authentication, user profiles, and API security.

---

## **Teaching Objectives**

1. **Understand MongoDB & Mongoose for User Data**
   - Explain the need for **database integration** in web applications.
   - Guide students in **storing and retrieving user profiles** with MongoDB.

2. **Authentication & Authorization**
   - Introduce **NextAuth.js** for secure user authentication.
   - Implement **session management and protected routes**.

3. **User Profile & Data Persistence**
   - Demonstrate how users can **save and retrieve favorite books**.
   - Explain **CRUD operations on user profiles**.

4. **API Security & Best Practices**
   - Introduce **JWT-based authentication** and **role-based access control**.
   - Secure database interactions with **server-side validation**.

---

## **Classroom Flow**

### **1. Introduction to MongoDB & Mongoose**
- **Concept**: Why do we need a NoSQL database?
- **Example**: Show how MongoDB stores user profiles as JSON-like documents.

```js
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

const User = mongoose.model("User", userSchema);
export default User;
```

#### **Discussion Prompts**
- Why is a **schema-less database** beneficial for our app?
- What’s the difference between a **relational** and **NoSQL** database?

---

### **2. Implementing Authentication with NextAuth.js**
- **Concept**: Secure user authentication in Next.js.
- **Example**: Implement sign-in and sign-out.

```js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectToDatabase from "@/lib/mongodb";

export default NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email });
        if (!user || !bcrypt.compareSync(credentials.password, user.hashedPassword)) {
          throw new Error("Invalid credentials");
        }
        return { id: user._id, email: user.email };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});
```

#### **Teaching Tips**
- Explain why **passwords are hashed** before storing in the database.
- Show how **session-based authentication** works in NextAuth.js.

---

### **3. User Profiles & Personalization**
- **Concept**: Allow users to store and retrieve their **favorite books**.
- **Example**: Fetch user favorites from MongoDB.

```js
import { getSession } from "next-auth/react";
import User from "@/models/User";
import connectToDatabase from "@/lib/mongodb";

export async function GET(req) {
  await connectToDatabase();
  const session = await getSession({ req });

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email }).populate("favorites");
  return new Response(JSON.stringify(user.favorites), { status: 200 });
}
```

#### **Teaching Tips**
- Explain **role-based access control** and why we **protect API routes**.
- Discuss how **MongoDB relationships** (like favorites) work with `populate()`.

---

### **4. Protecting Routes & API Security**
- **Concept**: Prevent unauthorized access to user data.
- **Example**: Restrict access to pages requiring authentication.

```js
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function ProtectedPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push("/login");
    return <p>Redirecting...</p>;
  }

  return <div>Welcome {session.user.email}, this is a protected page!</div>;
}
```

#### **Discussion Prompts**
- What happens if an **unauthenticated user** tries to access this page?
- Why is it important to check authentication **both on the frontend and backend**?

---

## **Common Mistakes to Address**
1. **Not handling authentication errors properly**
   - Use `try/catch` blocks in authentication handlers.
2. **Storing passwords in plain text**
   - Always **hash passwords** before storing them.
3. **Not validating user input**
   - Prevent **SQL Injection-like attacks** by sanitizing input.

---

## **Learning Outcomes**
By the end of this Milestone, students should:
1. **Implement authentication** with NextAuth.js.
2. **Use MongoDB to store user profiles and favorites**.
3. **Protect API routes and pages** with authentication.
4. **Handle user sessions and persist login state**.

---

## **Additional Resources**
- **MongoDB Documentation**: [MongoDB Official Docs](https://www.mongodb.com/docs/)
- **NextAuth.js Guide**: [NextAuth.js Documentation](https://next-auth.js.org/)
- **Mongoose ODM**: [Mongoose Guide](https://mongoosejs.com/docs/)
