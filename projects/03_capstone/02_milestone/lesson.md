# **Milestone 2 - NoSQL with React and Next.js**

## **1️⃣ Advanced MongoDB Management**

In this section, we will extend our MongoDB integration by managing user accounts, storing favorite books, and handling relationships between users and books.

---

## **Why Extend Our Database?**

So far, we have successfully integrated MongoDB with our Next.js app and implemented CRUD operations for books. However, a real-world application requires:
✅ **User Authentication**  
✅ **User Profiles & Saved Books**  
✅ **Relationships between Users and Books**

To achieve this, we need to extend our **Mongoose schemas** and implement **user interactions**.

---

## **2️⃣ Updating the Database Schema**

To manage **users and their favorite books**, we will modify our existing `Book` schema and introduce a new **User schema**.

📁 **Project Structure**

```
/models
 ├── Book.js
 ├── User.js  (New User Schema)
```

### **User Schema (`models/User.js`)**

We will define a `User` schema with:

- A **unique email** as the primary identifier
- A **password hash** for security (we'll handle authentication later)
- A **list of favorite books** saved by the user

```js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
```

### **Adding Relationships to Book Schema (`models/Book.js`)**

We will also add a `favoritedBy` field to track which users have saved a book.

```js
import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publishedYear: Number,
  coverImage: String,
  description: String,
  favoritedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.models.Book || mongoose.model("Book", BookSchema);
```

---

## **3️⃣ Creating API Endpoints for User Data**

Now that we have a **User model**, let's create API routes to:

- **Register a new user**
- **Get user data**
- **Save favorite books**
- **Retrieve user's favorite books**

📁 **Project Structure**

```
/app
 ├── /api
 │   ├── /users
 │   │   ├── route.js (User registration, login, and favorites management)
```

### **Register a New User (`POST` Request)**

We need a secure endpoint to create a new user.

```js
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectToDatabase();
  const { name, email, password } = await req.json();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return new Response(
      JSON.stringify({ message: "User created successfully" }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error creating user" }), {
      status: 500,
    });
  }
}
```

---

## **2️⃣ Implementing Authentication with NextAuth.js**

In this section, we will integrate **NextAuth.js**, a robust authentication library for Next.js, to allow users to sign up, log in, and maintain secure sessions.

---

## **Why Use NextAuth.js?**

✅ **Secure and easy authentication management**  
✅ **Session management with JWT (JSON Web Tokens)**  
✅ **Supports OAuth providers, credentials, and social logins**

---

## **1️⃣ Installing NextAuth.js**

To install NextAuth.js, run the following command in your Next.js project:

```sh
npm install next-auth bcryptjs
```

We also installed `bcryptjs` to handle password hashing.

---

## **2️⃣ Configuring NextAuth.js**

📁 **Project Structure**

```
/app
 ├── /api
 │   ├── /auth
 │   │   ├── [...nextauth].js (Handles authentication)
```

Inside `/app/api/auth/`, create a file called `route.js` and configure NextAuth.

### **Setting Up NextAuth.js (`/app/api/auth/route.js`)**

```js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("User not found");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return { id: user._id, name: user.name, email: user.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### **Environment Variables (`.env.local`)**

Add the following variables to `.env.local`:

```
NEXTAUTH_SECRET=your_random_secret_key
NEXTAUTH_URL=http://localhost:3000
```

---

## **3️⃣ Creating Authentication Pages**

NextAuth provides built-in authentication routes, but we can also create custom login and signup pages.

📁 **Project Structure**

```
/app
 ├── /auth
 │   ├── login/page.js (Custom Login Page)
 │   ├── signup/page.js (User Registration)
```

### **Signup Page (`/app/auth/signup/page.js`)**

This page allows new users to register.

```js
"use client";
import { useState } from "react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      alert("User created! Please login.");
    }
  }

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
```

### **Login Page (`/app/auth/login/page.js`)**

This page allows users to log in using NextAuth.

```js
"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      callbackUrl: "/",
    });
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
```

---

## **4️⃣ Protecting Routes (User Dashboard)**

We want to create a **dashboard** page where only logged-in users can access their saved books.

📁 **Project Structure**

```
/app
 ├── /dashboard
 │   ├── page.js (Protected Route)
```

### **Protecting Routes in Next.js (`/app/dashboard/page.js`)**

```js
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push("/auth/login");
    return <p>Redirecting...</p>;
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <p>Your favorite books will appear here.</p>
    </div>
  );
}
```

---

## **3️⃣ Implementing Authentication and User Profiles**

### **Introduction to Authentication in Next.js**

To allow users to **sign up, log in, and manage their profiles**, we need an **authentication system**.
In Next.js, authentication can be handled in several ways:

1. **Session-based Authentication** - Managed via cookies and sessions.
2. **JWT (JSON Web Tokens)** - Tokens stored in local storage or HTTP-only cookies.
3. **Third-party Authentication** - Using services like Firebase, Auth0, or NextAuth.js.

For our Library App, we will use **NextAuth.js**, a robust authentication solution for Next.js applications.

---

## **Setting Up NextAuth.js**

### **1️⃣ Install NextAuth.js**

In your Next.js project, install NextAuth.js and required dependencies:

```sh
npm install next-auth @next-auth/mongodb-adapter bcryptjs
```

- **next-auth** → Provides authentication handlers
- **@next-auth/mongodb-adapter** → Connects authentication to MongoDB
- **bcryptjs** → Hashes user passwords securely

### **2️⃣ Creating the API Route for Authentication**

NextAuth requires an **API route** to handle authentication logic. We will create it under `/app/api/auth/[...nextauth]/route.js`.

📁 **Project Structure**

```
/app
 ├── /api
 │   ├── /auth
 │   │   ├── [...nextauth]/route.js  (Handles authentication)
```

Create the authentication route:

```js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "user@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email });
        if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
          throw new Error("Invalid email or password");
        }
        return user;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

🔹 **How It Works:**

- Users submit **email** and **password**.
- The system **checks MongoDB** for an existing user.
- If the password is valid, the user gets **authenticated**.

---

## **3️⃣ Creating the User Model in MongoDB**

Inside the `/models` folder, create a file called `User.js`:

📁 **Project Structure**

```
/models
 ├── User.js  (User schema)
```

Define the schema:

```js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  favoriteBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
```

🔹 This schema allows users to:
✅ Store their **name, email, and hashed password**  
✅ Maintain a **list of favorite books**

---

## **4️⃣ Registering New Users**

Create an API route to **register users** in `/app/api/auth/register/route.js`:

```js
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectToDatabase();
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return new Response(JSON.stringify({ error: "All fields are required" }), {
      status: 400,
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ error: "User already exists" }), {
      status: 400,
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });

  return new Response(
    JSON.stringify({ message: "User registered successfully" }),
    { status: 201 }
  );
}
```

🔹 **How It Works:**

- **Validates user input**
- **Checks if the email is already registered**
- **Hashes the password** before storing it
- **Saves the user** in MongoDB

---

## **5️⃣ Adding Login and Registration Pages**

### **Creating a Registration Page**

Inside `/app/auth/register/page.js`:

```js
"use client";
import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    setMessage(result.message || result.error);
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
```

### **Adding Authentication to Protected Pages**

If a user tries to access a **protected page**, they must be **authenticated**.

Modify the `/app/library/page.js` to **require login**:

```js
"use client";
import { useSession } from "next-auth/react";

export default function Library() {
  const { data: session } = useSession();

  if (!session) {
    return <p>Please log in to view your library.</p>;
  }

  return <h1>Welcome to your Library, {session.user.name}!</h1>;
}
```

🔹 **How It Works:**

- The `useSession` hook **checks if a user is logged in**.
- If not authenticated, the page **shows a message** instead of content.

---

# **Conclusion**

## **Key Takeaways from This Milestone**

1. **Advanced NoSQL Integration**

   - Expanded our use of MongoDB by integrating **user authentication** and managing user data.
   - Learned how to create **secure and scalable database interactions** in a Next.js environment.

2. **Authentication & Security**

   - Implemented user **registration, login, and session management** with NextAuth.js.
   - Learned how to use **hashed passwords** for security and session-based authentication for persistent user logins.

3. **User Profile & Personalization**

   - Users can now **save and manage their favorite books**, enhancing personalization.
   - We explored CRUD operations on user profiles.

4. **Protected Routes & API Authorization**

   - Implemented **role-based access control** and protected specific routes based on authentication.
   - Ensured that users can only manage their own data securely.

5. **Connecting Frontend and Backend**
   - Used **API routes in Next.js** to fetch, update, and manage user/book data efficiently.
   - Implemented dynamic UI updates based on authentication state.

---

## **Next Steps - Preparing for Milestone 3**

📌 In **Milestone 3**, we will explore **server management and deployment** for our application.  
This includes:
✅ **Setting up SSH for secure server access**  
✅ **Deploying the full-stack application to a cloud provider**  
✅ **Managing environment variables and database configurations in production**

🚀 **Amazing progress so far! Get ready for the next challenge!**
