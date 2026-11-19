# **Milestone 4: Authentication, Protection & Stateful UX** (JavaScript version)

In the last milestone we stored tweets in a real database. But right now everybody is anonymous: anyone can post as any author, delete any tweet, and vote as often as they like.

In this milestone we add **users**, and we make the app tell the difference between what is **public** and what needs a **login**.

### Expected Outcomes

By the end of Milestone 4, you should:

- Register and log in users, store passwords as hashes, and recognize logged-in requests with a token in a cookie
- Explain the difference between a *client-side guard* (UX) and *server-side protection* (security)
- Share the logged-in user and the liked tweets across your app with React Context
- Protect pages with the Next.js proxy, and protect API routes inside the route handler itself
- Use dynamic API routes for per-tweet actions (like, delete)

---

## Where This Milestone Fits

You already have everything we build on:

- App Router pages and dynamic `[id]` routes
- Route handlers (`route.js`) with `GET`, `POST`, `PATCH`, `DELETE` from Milestone 3
- MongoDB + Mongoose, `makeSureDbIsReady()` and the `Tweet` model

We won't explain those again. The new question is: **how do we make this full-stack app safer and aware of who is using it?**

> [!NOTE]
> **Versions.** This README is written for a fresh `create-next-app` (Next.js 16). Two things changed in that version that you will see in older tutorials: `params` must be awaited (you already do this since Milestone 3), and the old `middleware` file is now called **`proxy`** (`proxy.js`, with an exported function named `proxy`).
>
> If your project runs Next.js 15 or older, name the file `middleware.js` and the function `middleware`. In those versions it runs in the *Edge runtime*, where `jsonwebtoken` does not work (use the `jose` library there instead). You can check your version in `package.json`.

---

## 1️⃣ The Big Picture: Three Layers of Protection

Security is not one check in one place. We build three layers, and each one has a different job:

```text
 BROWSER                          SERVER
┌─────────────────────┐   ┌──────────────────┐   ┌───────────────────────┐
│ 1. Client guard     │──▶│ 2. proxy         │──▶│ 3. Route handler      │──▶ MongoDB
│ Context + redirects │   │ page requests    │   │ checks the token      │
└─────────────────────┘   └──────────────────┘   └───────────────────────┘
  UX only                   first gate,            THE real gate
  anyone can bypass it      not the last one       (protects the data)
```

| Layer | Where it lives | What it is good for | Can it be bypassed? |
| :-- | :-- | :-- | :-- |
| **Client guard** | React components, Context | Nice experience: hide buttons, redirect to `/login` | **Yes.** It runs in the user's browser, so the user controls it |
| **Proxy** | `proxy.js` on the server | Redirect page requests before the page even loads | Not by the browser, but see below |
| **API protection** | Inside every route handler | Protects the data and every action that changes it | No. This is the real security boundary |

### Why is the proxy not enough on its own?

In March 2025 a vulnerability (CVE-2025-29927) showed that on affected Next.js versions a specially crafted request header could make the app **skip middleware completely**. Apps whose only login check lived in middleware were wide open. It has been patched, but the lesson stays: **check again where the data is.** That is why every route handler in this milestone calls `getAuthUser()` itself.

> [!IMPORTANT]
> React Context is **not** security. It only holds state in the browser, and anybody can open DevTools and change it. Anything that matters must be checked on the server.

### A "Like" click, end to end

Once we are done, one click on a heart button travels through the whole app:

1. The button updates the UI **immediately** (Context), so the app feels fast
2. The browser sends `POST /api/tweets/<id>/like`, and the browser automatically attaches the login cookie
3. The route handler reads the cookie and verifies the token → no valid token means `401`
4. It validates the `id` and updates MongoDB
5. It answers with JSON, and the UI keeps the server's answer (or rolls back if something failed)

---

## 2️⃣ Setup

### Install two packages

```bash
npm install bcryptjs jsonwebtoken
```

- **bcryptjs** hashes passwords. (There is also a package called `bcrypt`. It does the same but needs native code to compile, which causes install problems on some machines. `bcryptjs` is plain JavaScript.)
- **jsonwebtoken** creates and verifies JWTs.

### Add a secret to `.env.local`

Next to your `MONGODB_URI`, add a secret that is used to sign tokens. Generate a long random one:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```bash
JWT_SECRET=paste-the-long-random-string-here
```

> [!WARNING]
> Never commit `.env.local`, and never use a short or guessable secret. Anybody who knows the secret can create tokens for **any** user. Restart `npm run dev` after changing `.env.local`, and note that changing the secret logs everybody out.

### What we are going to build

New and changed files:

```text
app/
├── layout.js                    (changed: wraps everything in Providers)
├── providers.js                 (new)
├── page.js                      (changed: uses TweetCard)
├── login/page.js                (new)
├── profile/page.js              (new: protected)
└── api/
    ├── auth/
    │   ├── register/route.js
    │   ├── login/route.js
    │   ├── logout/route.js
    │   └── me/route.js
    ├── likes/route.js            (ids of the tweets I liked)
    └── tweets/
        ├── route.js              (changed: POST needs a login)
        └── [id]/
            ├── route.js          (changed: GET + DELETE with owner check)
            └── like/route.js     (dynamic route inside a dynamic route)
components/
├── Header.js
└── TweetCard.js
context/
├── AuthContext.js
└── LikesContext.js
lib/
├── db.js                         (from Milestone 3)
├── jwt.js                        (new: sign and verify tokens)
└── auth.js                       (new: cookie helpers)
models/
├── Tweet.js                      (changed: likedBy)
└── User.js                       (new)
proxy.js                         (new: next to the app folder)
```

---

## 3️⃣ Building Blocks: Passwords, Tokens, Cookies

Before the code, three ideas.

**Hashing with bcrypt.** We never store a password. We store a *hash*: the result of a one-way function. When someone logs in, we hash what they typed and compare the two hashes (`bcrypt.compare`). If the database leaks, the passwords do not. bcrypt is deliberately slow and adds a random *salt*, so two users with the same password get different hashes. The `10` in `bcrypt.hash(password, 10)` is the cost: every +1 doubles the work.

**JWT (JSON Web Token).** After a successful login, the server hands out a token. A JWT has three parts, `header.payload.signature`. The payload holds data (our user id and username) and an expiry. The signature is made with `JWT_SECRET`. Anyone can *read* the payload (try pasting a token into [jwt.io](https://jwt.io)), but nobody can *change* it without the secret. So: a JWT is **signed, not encrypted**. Never put a password or anything private in it.

**Where do we keep the token?** We put it in a cookie:

| | `httpOnly` cookie (we use this) | `localStorage` |
| :-- | :-- | :-- |
| Readable by JavaScript in the page? | **No** | Yes |
| Sent to the server automatically? | Yes, with every request | No, you attach it yourself |
| If an attacker injects a script (XSS) | They cannot steal the token | They can steal it |

That is why the login routes set the cookie on the **server**, and why our `AuthContext` does *not* store the user in `localStorage` (a second copy there would create two sources of truth: the cookie says one thing, `localStorage` another). Cookie options we use: `httpOnly`, `sameSite: "lax"` (not sent on cross-site POSTs), and `secure` in production (HTTPS only).

### Two small helper files

We keep the token logic in **one place**, so the proxy, the login routes and every protected route all use exactly the same code.

`lib/jwt.js` is *pure*: it only signs and verifies. `lib/auth.js` deals with cookies (`next/headers`). We split them because the proxy needs `verifyToken` but reads cookies from its own `request` object.

```js
// lib/jwt.js
// Pure token helpers: no cookies, no Next.js imports, so the proxy can use them too.

import jwt from "jsonwebtoken";
import assert from "node:assert";

export const COOKIE_NAME = "token";
export const TOKEN_MAX_AGE = 60 * 60; // 1 hour, in seconds

function getSecret() {
  const secret = process.env.JWT_SECRET;
  assert(
    secret,
    "Please define the JWT_SECRET environment variable inside .env.local"
  );
  return secret;
}

// payload: { id, username }
export function signToken(payload) {
  return jwt.sign(payload, getSecret(), { expiresIn: TOKEN_MAX_AGE });
}

// Returns the payload if the token is valid, otherwise null
export function verifyToken(token) {
  const secret = getSecret(); // outside the try: a missing secret should crash loudly
  try {
    const { id, username } = jwt.verify(token, secret);
    return { id, username };
  } catch {
    // bad signature, expired, malformed, ...
    return null;
  }
}
```

```js
// lib/auth.js
// Cookie helpers for route handlers (and Server Components).

import { cookies } from "next/headers";
import { COOKIE_NAME, TOKEN_MAX_AGE, verifyToken } from "@/lib/jwt";

export async function setAuthCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true, // JavaScript in the browser cannot read this cookie
    sameSite: "lax", // not sent along with cross-site POST requests
    secure: process.env.NODE_ENV === "production", // HTTPS only once deployed
    path: "/",
    maxAge: TOKEN_MAX_AGE,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// The one function every protected route handler calls:
// returns { id, username } for a valid login, otherwise null.
export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
```

---

## 4️⃣ Users and Auth Routes

### The `User` model

```js
// models/User.js
import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // MongoDB refuses a second user with the same name
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username cannot be more than 20 characters"],
    },
    // We never store the password itself, only its bcrypt hash
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const User = models.User ?? model("User", UserSchema);
```

### Add `likedBy` to the `Tweet` model

Your Milestone 3 model stays as it is; we only add one field. In Milestone 3 anybody could vote as many times as they liked, because we only counted (`$inc`). A **like** is different: one per user, and you can take it back. So we remember *who* liked. (Old tweets without the field get an empty `likedBy` automatically when they are loaded.)

```js
// models/Tweet.js
import { Schema, model, models } from "mongoose";

const TweetSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      maxlength: [280, "Tweet cannot be more than 280 characters"],
    },
    author: {
      type: String,
      default: "anonymous",
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
    // NEW: the usernames of everyone who liked this tweet
    likedBy: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const Tweet = models.Tweet ?? model("Tweet", TweetSchema);
```

> [!NOTE]
> A real product would store user **ids** instead of usernames. We keep Milestone 3's plain-text `author` field so you don't have to migrate your data. Usernames are unique in our app, so it works.

### Register, login, logout, me

```js
// app/api/auth/register/route.js
import bcrypt from "bcryptjs";
import { setAuthCookie } from "@/lib/auth";
import { makeSureDbIsReady } from "@/lib/db";
import { signToken } from "@/lib/jwt";
import { User } from "@/models/User";

export async function POST(request) {
  const { username, password } = await request.json();

  // typeof matters: without it a client could send { "username": { "$ne": null } }
  // and trick MongoDB into running a query operator (NoSQL injection).
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    password.length < 8
  ) {
    return Response.json(
      { error: "A username and a password of at least 8 characters are required" },
      { status: 400 }
    );
  }

  await makeSureDbIsReady();
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash });

    // Log the new user in right away
    const token = signToken({ id: user._id.toString(), username: user.username });
    await setAuthCookie(token);

    return Response.json({ user: { username: user.username } }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      // 11000 = MongoDB "duplicate key" (the unique username)
      return Response.json({ error: "Username already taken" }, { status: 409 });
    }
    if (error.name === "ValidationError") {
      return Response.json({ error: error.message }, { status: 400 });
    }
    return Response.json({ error: "Could not create user" }, { status: 500 });
  }
}
```

```js
// app/api/auth/login/route.js
import bcrypt from "bcryptjs";
import { setAuthCookie } from "@/lib/auth";
import { makeSureDbIsReady } from "@/lib/db";
import { signToken } from "@/lib/jwt";
import { User } from "@/models/User";

export async function POST(request) {
  const { username, password } = await request.json();

  if (typeof username !== "string" || typeof password !== "string") {
    return Response.json(
      { error: "Username and password are required" },
      { status: 400 }
    );
  }

  await makeSureDbIsReady();
  const user = await User.findOne({ username });

  // Same answer whether the user does not exist or the password is wrong,
  // so nobody can use this route to find out which usernames are taken.
  const passwordIsCorrect = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  if (!user || !passwordIsCorrect) {
    return Response.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  }

  const token = signToken({ id: user._id.toString(), username: user.username });
  await setAuthCookie(token);

  return Response.json({ user: { username: user.username } });
}
```

A few things worth noticing:

- **Hash before saving, compare when logging in.** The password itself never touches the database.
- **Login answers with the same generic `401` for "no such user" and "wrong password".** Otherwise the route can be used to find out which usernames exist.
- **`typeof ... !== "string"`** stops a client from sending an object like `{ "$ne": null }` as the username, which MongoDB would treat as a query operator (*NoSQL injection*).
- The cookie is set with `setAuthCookie`. The browser stores it and sends it back on every later request, and our JavaScript never sees it.

```js
// app/api/auth/logout/route.js
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  await clearAuthCookie();
  return Response.json({ message: "Logged out" });
}
```

```js
// app/api/auth/me/route.js
import { getAuthUser } from "@/lib/auth";

// "Who am I?" The client asks this once when the app loads.
// Not logged in is a normal answer here, so it is 200 with user: null.
export async function GET() {
  const authUser = await getAuthUser();
  return Response.json({
    user: authUser ? { username: authUser.username } : null,
  });
}
```

> [!TIP]
> **Checkpoint.** Register a user with Thunder Client or Postman. In the response, look at the `Set-Cookie` header (it contains `HttpOnly`). Open MongoDB Compass: the `passwordHash` of your user should start with `$2` and must **not** look like your password.

---

## 5️⃣ AuthContext: Who Is Logged In?

Many components need to know the current user: the header, the profile page, the tweet cards. Passing `user` down through every level (*prop drilling*) gets messy, so we put it in a **Context**.

Three things are important in this provider:

1. The provider **asks the server** (`/api/auth/me`) who is logged in, instead of reading `localStorage`. The cookie is the truth.
2. There is a **`loading`** state. At the first render we do not know yet if somebody is logged in, and we must not treat "not known yet" as "logged out".
3. `login` and `register` call our API routes, which set the cookie.

```jsx
// context/AuthContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until /api/auth/me answered

  // Ask the server who we are. The server is the source of truth, not localStorage.
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  // mode is "login" or "register": both routes answer with { user }
  async function authenticate(mode, username, password) {
    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error ?? "Something went wrong");
    }
    setUser(data.user);
  }

  const login = (username, password) =>
    authenticate("login", username, password);
  const register = (username, password) =>
    authenticate("register", username, password);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// A small hook so components don't have to import useContext + AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}
```

### Providers, layout, header, login page

Context providers use state, so they must be **Client Components**. But we don't want to turn the whole root layout into one, so we put the providers into their own small client file and use it inside the (server) layout. Note that `<html>` and `<body>` stay at the top.

```jsx
// app/providers.js
"use client";

import { AuthProvider } from "@/context/AuthContext";
import { LikesProvider } from "@/context/LikesContext";

// LikesProvider uses useAuth(), so it has to sit INSIDE AuthProvider
export default function Providers({ children }) {
  return (
    <AuthProvider>
      <LikesProvider>{children}</LikesProvider>
    </AuthProvider>
  );
}
```

```jsx
// app/layout.js  (keep the fonts, metadata and globals.css import that create-next-app generated)
import Providers from "./providers";
import Header from "@/components/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

```jsx
// components/Header.js
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, loading, logout } = useAuth();

  return (
    <header>
      <Link href="/">Twitter Clone</Link>
      <nav>
        {loading ? null : user ? (
          <>
            <Link href="/profile">@{user.username}</Link>
            <button onClick={logout}>Log out</button>
          </>
        ) : (
          <Link href="/login">Log in</Link>
        )}
      </nav>
    </header>
  );
}
```

```jsx
// app/login/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, register } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // action is either login or register from the context
  async function submit(action) {
    setError("");
    try {
      await action(username, password);
      router.push("/profile");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main>
      <h1>Log in or register</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit(login);
        }}
      >
        <input
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          type="password"
          placeholder="Password (min. 8 characters)"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Log in</button>
        <button type="button" onClick={() => submit(register)}>
          Register
        </button>
      </form>
      {error && <p role="alert">{error}</p>}
    </main>
  );
}
```

> [!NOTE]
> Context only updates the **UI**. The login itself has happened on the server (the cookie). That is why a page refresh keeps you logged in: the provider asks `/api/auth/me` again and the cookie answers.

---

## 6️⃣ Protected API Routes and Dynamic Routes

Remember: **the route handler is the real gate.** Every handler that changes data, or returns private data, follows the same order:

1. **Authenticate**: `getAuthUser()`. No valid token → `401`
2. **Validate the input**: is the `id` a valid ObjectId? → `400`
3. **Talk to the database**
4. **Authorize**: is this user *allowed* to do this to *this* tweet? → `403`

| Status | Meaning | Example here |
| :-- | :-- | :-- |
| `400` | The request itself is malformed | `/api/tweets/not-an-id` |
| `401` | We don't know who you are | no cookie, fake or expired token |
| `403` | We know who you are, but you may not do this | deleting somebody else's tweet |
| `404` | It does not exist | a valid id that is not in the database |
| `409` | Conflict | username already taken |

### Create a tweet: the author comes from the token

In Milestone 3 the client sent the `author` in the request body. That means anybody could post as anybody. Now the server decides, based on the verified token.

```js
// app/api/tweets/route.js
import { getAuthUser } from "@/lib/auth";
import { makeSureDbIsReady } from "@/lib/db";
import { Tweet } from "@/models/Tweet";

// GET /api/tweets  →  public, exactly as in Milestone 3
export async function GET() {
  await makeSureDbIsReady();
  try {
    const tweets = await Tweet.find({}).sort({ createdAt: -1 });
    return Response.json(tweets);
  } catch (error) {
    return Response.json({ error: "Error fetching tweets" }, { status: 500 });
  }
}

// POST /api/tweets  →  now requires a login
export async function POST(request) {
  const authUser = await getAuthUser();
  if (!authUser) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await makeSureDbIsReady();
  const body = await request.json();
  try {
    const tweet = await Tweet.create({
      content: body.content,
      // The author comes from the verified token, NOT from the request body.
      author: authUser.username,
    });
    return Response.json(tweet, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error creating tweet";
    return Response.json({ error: message }, { status: 400 });
  }
}
```

### Per-tweet routes: `/api/tweets/[id]`

The folder `[id]` makes the route dynamic: `/api/tweets/665f1c2a...` arrives in your code as `params.id`. Remember that `params` is a Promise, so we `await` it.

```js
// app/api/tweets/[id]/route.js
import { isValidObjectId } from "mongoose";
import { getAuthUser } from "@/lib/auth";
import { makeSureDbIsReady } from "@/lib/db";
import { Tweet } from "@/models/Tweet";

// GET /api/tweets/<id>  →  public
export async function GET(_request, { params }) {
  const { id } = await params;
  if (!isValidObjectId(id)) {
    return Response.json({ error: "Invalid tweet id" }, { status: 400 });
  }

  await makeSureDbIsReady();
  const tweet = await Tweet.findById(id);
  if (!tweet) {
    return Response.json({ error: "Tweet not found" }, { status: 404 });
  }
  return Response.json(tweet);
}

// PATCH (the upvote / downvote from Milestone 3) stays exactly as it was.

// DELETE /api/tweets/<id>  →  logged in AND only your own tweets
export async function DELETE(_request, { params }) {
  // 1. Who are you?
  const authUser = await getAuthUser();
  if (!authUser) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!isValidObjectId(id)) {
    return Response.json({ error: "Invalid tweet id" }, { status: 400 });
  }

  await makeSureDbIsReady();

  // 2. Does it exist?
  const tweet = await Tweet.findById(id);
  if (!tweet) {
    return Response.json({ error: "Tweet not found" }, { status: 404 });
  }

  // 3. Is it yours?
  if (tweet.author !== authUser.username) {
    return Response.json(
      { error: "You can only delete your own tweets" },
      { status: 403 }
    );
  }

  await tweet.deleteOne();
  return Response.json({ message: "Tweet deleted successfully" });
}
```

### Like a tweet: a dynamic route inside a dynamic route

A route for *one action on one tweet* lives in a folder **under** `[id]`: `/api/tweets/<id>/like`. We use `$addToSet` and `$pull`, in the same spirit as `$inc` in Milestone 3: the database changes the array in one step, and liking twice can never create a duplicate.

```js
// app/api/tweets/[id]/like/route.js
import { isValidObjectId } from "mongoose";
import { getAuthUser } from "@/lib/auth";
import { makeSureDbIsReady } from "@/lib/db";
import { Tweet } from "@/models/Tweet";

// POST /api/tweets/<id>/like  →  like the tweet, or unlike it if you already did
export async function POST(_request, { params }) {
  const authUser = await getAuthUser();
  if (!authUser) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!isValidObjectId(id)) {
    return Response.json({ error: "Invalid tweet id" }, { status: 400 });
  }

  await makeSureDbIsReady();

  // Is my username already in the likedBy array?
  const alreadyLiked = await Tweet.exists({
    _id: id,
    likedBy: authUser.username,
  });

  // $addToSet adds the name only if it is not there yet, $pull removes it.
  // Like $inc in Milestone 3, the database does the work, so nothing gets lost.
  const update = alreadyLiked
    ? { $pull: { likedBy: authUser.username } }
    : { $addToSet: { likedBy: authUser.username } };

  const tweet = await Tweet.findByIdAndUpdate(id, update, { new: true });
  if (!tweet) {
    return Response.json({ error: "Tweet not found" }, { status: 404 });
  }

  return Response.json({ liked: !alreadyLiked });
}
```

And one more route, so that the client can ask *"which tweets did I like?"*:

```js
// app/api/likes/route.js
import { getAuthUser } from "@/lib/auth";
import { makeSureDbIsReady } from "@/lib/db";
import { Tweet } from "@/models/Tweet";

// GET /api/likes  →  the ids of all tweets the logged-in user liked
export async function GET() {
  const authUser = await getAuthUser();
  if (!authUser) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await makeSureDbIsReady();
  const tweets = await Tweet.find({ likedBy: authUser.username }).select("_id");

  return Response.json({
    likedTweetIds: tweets.map((tweet) => tweet._id.toString()),
  });
}
```

> [!NOTE]
> Both of these answer `401` to guests. Also: nobody can like "as" somebody else, because the username comes from the verified token and not from anything the client sends.

---

## 7️⃣ LikesContext and TweetCard

Liked tweets are needed in many places (every card in the feed, later a profile page), so they get their own Context.

The click should feel instant, so we use an **optimistic update**: change the UI first, then ask the server, then either keep the server's answer or **roll back** if the request failed.

```jsx
// context/LikesContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const LikesContext = createContext(null);

export function LikesProvider({ children }) {
  const { user } = useAuth();
  const [likedIds, setLikedIds] = useState([]);

  // Load this user's likes from the server whenever the user changes
  useEffect(() => {
    if (!user) return;

    async function loadLikes() {
      const res = await fetch("/api/likes");
      if (res.ok) {
        const data = await res.json();
        setLikedIds(data.likedTweetIds);
      }
    }
    loadLikes();
  }, [user]);

  // Logged out? Then nothing is liked, whatever is left in state.
  const likedTweetIds = user ? likedIds : [];

  function setLiked(tweetId, liked) {
    setLikedIds((previous) => {
      const without = previous.filter((id) => id !== tweetId);
      return liked ? [...without, tweetId] : without;
    });
  }

  async function toggleLike(tweetId) {
    const wasLiked = likedTweetIds.includes(tweetId);

    setLiked(tweetId, !wasLiked); // 1. update the UI immediately (optimistic)
    try {
      const res = await fetch(`/api/tweets/${tweetId}/like`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Like failed");

      const data = await res.json();
      setLiked(tweetId, data.liked); // 2. trust the server's answer
    } catch {
      setLiked(tweetId, wasLiked); // 3. something failed: roll back
    }
  }

  return (
    <LikesContext.Provider value={{ likedTweetIds, toggleLike }}>
      {children}
    </LikesContext.Provider>
  );
}

export function useLikes() {
  const context = useContext(LikesContext);
  if (!context) {
    throw new Error("useLikes must be used inside <LikesProvider>");
  }
  return context;
}
```

```jsx
// components/TweetCard.js
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLikes } from "@/context/LikesContext";

export default function TweetCard({ tweet }) {
  const { user } = useAuth();
  const { likedTweetIds, toggleLike } = useLikes();
  const router = useRouter();

  const liked = likedTweetIds.includes(tweet._id);

  // Everyone else's likes come from the server data, yours comes from Context.
  // That way the number changes the moment you click, before the server answered.
  const othersCount = tweet.likedBy.filter(
    (name) => name !== user?.username
  ).length;
  const likeCount = othersCount + (liked ? 1 : 0);

  function handleLike() {
    if (!user) {
      router.push("/login"); // friendly UX only. The API checks again!
      return;
    }
    toggleLike(tweet._id);
  }

  return (
    <li>
      <p>{tweet.content}</p>
      <small>@{tweet.author}</small>
      <button onClick={handleLike}>
        {liked ? "❤️" : "♡"} {likeCount}
      </button>
      {/* your upvote / downvote buttons from Milestone 3 can stay here */}
    </li>
  );
}
```

Now use the card in your feed, and update your create-tweet form:

```jsx
// app/page.js  (only the changed parts)
import TweetCard from "@/components/TweetCard";

// ...inside your component, replace the <li> you rendered in Milestone 3:
<ul>
  {tweets.map((tweet) => (
    <TweetCard key={tweet._id} tweet={tweet} />
  ))}
</ul>
```

And in your "create tweet" form from Milestone 3:

```js
// Don't send an author any more, the server knows who you are.
const res = await fetch("/api/tweets", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ content }),
});

if (res.status === 401) {
  router.push("/login"); // not logged in → go log in
  return;
}
```

> [!NOTE]
> The `if (!user) router.push("/login")` in `TweetCard` is a **client guard**: it is only there to be friendly. If you removed it, a guest's click would still reach the API, and the API would answer `401`. Both layers matter; only one of them is security.

---

## 8️⃣ Layer 2: The Proxy

The proxy runs **before** a page request is completed. We use it to send visitors without a valid token away from `/profile`.

```js
// proxy.js  (project root, next to the app folder)
import { NextResponse } from "next/server";
import { COOKIE_NAME, verifyToken } from "@/lib/jwt";

export function proxy(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // Not just "is there a cookie?" but "is it a valid, unexpired token?"
  if (!token || !verifyToken(token)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Only run for these paths. /login must NOT be in here (redirect loop!)
export const config = {
  matcher: ["/profile/:path*"],
};
```

Things to know:

- The file must be named `proxy.js` and live in the **project root** (or in `src/`, if you use that folder), at the same level as `app`. Restart the dev server if it doesn't seem to run.
- The `matcher` decides which paths it runs for. Our API routes are **not** in it on purpose: they protect themselves (layer 3), and an API should answer `401`, not redirect to an HTML page.
- We call `verifyToken`, we don't just check that a cookie *exists*. A cookie called `token` with the value `hello` must not get you in.

---

## 9️⃣ Layer 1: The Client Route Guard

The proxy only runs when the browser makes a **new request**. If you click "Log out" while you are looking at `/profile`, no new request happens, and you would stay on a page you shouldn't see. The guard handles this: it reacts to the Context changing.

```jsx
// app/profile/page.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until loading is over, otherwise logged-in users get bounced too
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) return <p>Loading…</p>;

  return (
    <main>
      <h1>@{user.username}</h1>
      <p>Only logged-in users get to see this page.</p>
    </main>
  );
}
```

Look at the `loading` check. Without it, a logged-in user who reloads `/profile` is sent to `/login` for a moment, because `user` is `null` until `/api/auth/me` has answered.

---

## 🔟 Test Every Layer

Don't trust protection you have never tried to break. Use the terminal, or Thunder Client / Postman (they keep cookies for you after the login request).

```bash
# 1. Without a cookie: expect 401
curl -i -X POST http://localhost:3000/api/tweets \
  -H "Content-Type: application/json" \
  -d '{"content":"I am not logged in"}'

# 2. Register. -c saves the cookie the server sets into cookies.txt
curl -i -c cookies.txt -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"supersecret"}'

# 3. Same as 1, but -b sends the cookie: expect 201
curl -i -b cookies.txt -X POST http://localhost:3000/api/tweets \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello from alice","author":"someone-else"}'

# 4. A made-up token: expect 401
curl -i -b "token=not.a.real-token" -X POST http://localhost:3000/api/tweets \
  -H "Content-Type: application/json" \
  -d '{"content":"hacker tweet"}'
```

> [!NOTE]
> On Windows PowerShell, `curl` is an alias for something else: use `curl.exe`, or use Thunder Client.

| What you try | What you should see |
| :-- | :-- |
| `POST /api/tweets` without a cookie | `401` |
| `POST /api/tweets` logged in, with `"author": "someone-else"` in the body | `201`, and the tweet's `author` is **your** username |
| `DELETE` a tweet written by another user | `403` |
| `DELETE /api/tweets/not-an-id` | `400` |
| `DELETE` a valid id that doesn't exist | `404` |
| `POST /api/tweets/<id>/like` twice | `{ "liked": true }`, then `{ "liked": false }` |
| Open `/profile` in a private window (logged out) | redirected to `/login` |
| In DevTools → Application → Cookies, change the `token` value to `abc`, reload `/profile` | still redirected: the proxy checks the token, not just the cookie |
| Type `document.cookie` in the console while logged in | the token is **not** listed (`httpOnly`) |
| Click "Log out" while on `/profile` | the guard sends you to `/login` |
| Reload the home page while logged in | you stay logged in, hearts you liked are still red |

---

## 🧯 Common Problems

| Problem | Likely cause |
| :-- | :-- |
| `Please define the JWT_SECRET environment variable` | Missing in `.env.local`, or you didn't restart the dev server |
| The proxy never runs | Wrong file name or location (`proxy.js` in the project root), or the path is not in `matcher` |
| Redirect loop on `/login` | `/login` is in the proxy `matcher`. Remove it |
| `useAuth must be used inside <AuthProvider>` | `Providers` is missing in `layout.js`, or `LikesProvider` is outside `AuthProvider` |
| "You're importing a component that needs `useState`..." | A file with Context, hooks or `onClick` is missing `"use client"` at the very top |
| `Route "/api/tweets/[id]" used params.id. params should be awaited` | Use `const { id } = await params` |
| Logged-in users get bounced to `/login` for a moment | The guard ignores `loading` |
| Every request is `401` although you logged in | The cookie was not sent: test with `curl -b` or check DevTools → Cookies. Different port or domain than the one you logged in on? |
| A Context value is `undefined` | You used `useContext(AuthContext)` outside of a provider. Use the `useAuth()` hook, which tells you |
| `The edge runtime does not support Node.js 'crypto' module` | Next.js 15 or older: `middleware` runs on Edge. Use `jose` there |

---

## ✅ Task

Extend your Twitter Clone so it distinguishes between public and protected behavior.

**Core**

- [ ] Add the `User` model, `lib/jwt`, `lib/auth`, and `JWT_SECRET`
- [ ] Build `register`, `login`, `logout` and `me`, and test them
- [ ] Build `AuthContext`, `Providers`, `Header` and the login page
- [ ] Protect `POST /api/tweets`: the author comes from the token
- [ ] Add `GET` and `DELETE` (with owner check) to `/api/tweets/[id]`
- [ ] Add `likedBy`, the like route, `/api/likes`, `LikesContext` and `TweetCard`
- [ ] Protect `/profile` with the proxy **and** the client guard
- [ ] Run through the test table and make every row behave as expected

**Stretch**

- [ ] Add a delete button to your tweet cards that is only shown for your own tweets
- [ ] Protect the upvote/downvote `PATCH` from Milestone 3 as well
- [ ] Add a dynamic page `app/tweet/[id]/page.js` (below)
- [ ] Make `/api/auth/me` check that the user still exists in the database

A dynamic *page* looks a lot like a dynamic route handler, but it renders UI, and as a Server Component it can use the database directly instead of calling your own API:

```jsx
// app/tweet/[id]/page.js
import { notFound } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { makeSureDbIsReady } from "@/lib/db";
import { Tweet } from "@/models/Tweet";

export default async function TweetPage({ params }) {
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();

  // A Server Component runs on the server: it can talk to the database directly
  await makeSureDbIsReady();
  const tweet = await Tweet.findById(id).lean();
  if (!tweet) notFound();

  return (
    <main>
      <h1>@{tweet.author}</h1>
      <p>{tweet.content}</p>
      <small>{tweet.likedBy.length} likes</small>
    </main>
  );
}
```

---

## 🔎 A Note on SSR, SSG and ISR

You may have seen tutorials using `getServerSideProps()` and `getStaticProps()`. Those belong to the **Pages Router** and do not exist in the App Router we use. In the App Router, a page is a Server Component: it can be `async`, fetch or query on the server, and Next.js decides how to render it. Pages that read request data, like cookies, are rendered on each request.

Caching and revalidation changed between Next.js versions, so when you need it, read the **Caching** section of the docs for the version you use ([nextjs.org/docs](https://nextjs.org/docs)). It is not needed for this milestone: our pages load their tweets from our own API in the browser.

---

# **Conclusion - Authentication & Protection**

## **Key Takeaways from This Milestone**

1. **Three layers** → client guard (UX), proxy (page requests), route handler (the real boundary)
2. **Passwords** → hashed with bcrypt, never stored, compared with `bcrypt.compare`
3. **Tokens** → a signed JWT in an `httpOnly` cookie, verified on the server on every protected request
4. **Context** → shared client state (`AuthContext`, `LikesContext`) that improves UX, but is **not** security
5. **Dynamic routes** → `/api/tweets/[id]` and `/api/tweets/[id]/like` for per-item actions, with `401` / `403` / `404` used correctly
6. **Optimistic UI** → update first, confirm with the server, roll back on failure

## **What We Left Out**

Real products also need email verification, password reset, refresh tokens, rate limiting against password guessing, and more. In practice many teams use a library or service (for example Auth.js or a hosted provider) for these. Understanding the building blocks from this milestone makes using those much easier.

## **Next Steps**

In the next milestone we deploy the app (for example to Vercel). The environment variables you created, `MONGODB_URI` and `JWT_SECRET`, will have to be set there too.

---

## READ THE DOCS & LEARN 🤓

- [Next.js: Authentication guide](https://nextjs.org/docs/app/guides/authentication)
- [Next.js: Proxy](https://nextjs.org/docs/app/getting-started/proxy)
- [Next.js: Route Handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route)
- [React: Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
- [jwt.io: decode and inspect a token](https://jwt.io)
- [OWASP: Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
