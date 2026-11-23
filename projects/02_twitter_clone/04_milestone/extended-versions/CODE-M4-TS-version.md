# **Milestone 4: Code Reference** (TypeScript version)

> 📘 This document contains **every complete file** of Milestone 4, in build order. The explanation (the *why*) is in [`README-M4-TS-version.md`](README-M4-TS-version.md). Read the matching README chapter **before** each step, and don't skip the checkpoints: if one fails, fix it before you move on.

## How to use this document

1. Work through the steps **in order**. Each step builds on the previous one.
2. Type or paste each file into the path shown in its heading.
3. Run the **checkpoint** at the end of the step.
4. Stuck? See *Common Problems* in the README.

> [!NOTE]
> Files marked *(changed)* already exist from Milestone 3: update them, don't replace your whole project. The code uses the names from Milestone 3 (`makeSureDbIsReady` from `@/lib/db`, the named `Tweet` export) and assumes the `@/` import alias that `create-next-app` sets up.

## Contents

- [Step 1: Setup and the two helper files](#step-1-setup-and-the-two-helper-files)
- [Step 2: The models](#step-2-the-models)
- [Step 3: The auth routes](#step-3-the-auth-routes)
- [Step 4: Context, providers and the login page](#step-4-context-providers-and-the-login-page)
- [Step 5: Protect the API](#step-5-protect-the-api)
- [Step 6: Show likes in the feed](#step-6-show-likes-in-the-feed)
- [Step 7: The proxy and the client guard](#step-7-the-proxy-and-the-client-guard)
- [Stretch: a dynamic page](#stretch-a-dynamic-page)

## Overview of all files

```text
app/
├── layout.tsx                    (changed: wraps everything in Providers)
├── providers.tsx                 (new)
├── page.tsx                      (changed: uses TweetCard)
├── login/page.tsx                (new)
├── profile/page.tsx              (new: protected)
└── api/
    ├── auth/
    │   ├── register/route.ts
    │   ├── login/route.ts
    │   ├── logout/route.ts
    │   └── me/route.ts
    ├── likes/route.ts            (ids of the tweets I liked)
    └── tweets/
        ├── route.ts              (changed: POST needs a login)
        └── [id]/
            ├── route.ts          (changed: GET + DELETE with owner check)
            └── like/route.ts     (dynamic route inside a dynamic route)
components/
├── Header.tsx
└── TweetCard.tsx
context/
├── AuthContext.tsx
└── LikesContext.tsx
lib/
├── db.ts                         (from Milestone 3)
├── jwt.ts                        (new: sign and verify tokens)
└── auth.ts                       (new: cookie helpers)
models/
├── Tweet.ts                      (changed: likedBy)
└── User.ts                       (new)
types/
└── tweet.ts                     (new: shared Tweet type)
proxy.ts                         (new: next to the app folder)
```

## Step 0: Install and configure

```bash
npm install bcryptjs jsonwebtoken
```

```bash
npm install --save-dev @types/jsonwebtoken
```

In `.env.local`, next to `MONGODB_URI` (generate the value with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`):

```bash
JWT_SECRET=paste-the-long-random-string-here
```

---

## Step 1: Setup and the two helper files

*Explained in: README chapters 2 and 3.* Install the packages, create the secret, and add the token helpers everything else uses.

<a id="lib-jwt"></a>

### `lib/jwt.ts`

*Sign and verify tokens (pure, no cookies).*

```ts
// lib/jwt.ts
// Pure token helpers: no cookies, no Next.js imports, so the proxy can use them too.

import jwt from "jsonwebtoken";
import assert from "node:assert";

export const COOKIE_NAME = "token";
export const TOKEN_MAX_AGE = 60 * 60; // 1 hour, in seconds

// What we put inside the token (and what we get back from it)
export type AuthPayload = {
  id: string;
  username: string;
};

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  assert(
    secret,
    "Please define the JWT_SECRET environment variable inside .env.local"
  );
  return secret;
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: TOKEN_MAX_AGE });
}

// Returns the payload if the token is valid, otherwise null
export function verifyToken(token: string): AuthPayload | null {
  const secret = getSecret(); // outside the try: a missing secret should crash loudly
  try {
    const decoded = jwt.verify(token, secret);
    // jwt.verify can also return a plain string, but we only ever sign objects
    if (typeof decoded === "string") return null;
    return { id: decoded.id, username: decoded.username };
  } catch {
    // bad signature, expired, malformed, ...
    return null;
  }
}
```

<a id="lib-auth"></a>

### `lib/auth.ts`

*Cookie helpers and getAuthUser().*

```ts
// lib/auth.ts
// Cookie helpers for route handlers (and Server Components).

import { cookies } from "next/headers";
import {
  COOKIE_NAME,
  TOKEN_MAX_AGE,
  verifyToken,
  type AuthPayload,
} from "@/lib/jwt";

export async function setAuthCookie(token: string) {
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
export async function getAuthUser(): Promise<AuthPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
```

> [!TIP]
> **Checkpoint.** Nothing to see in the browser yet. Check that `.env.local` contains `JWT_SECRET` and that you **restarted** `npm run dev`.

---

## Step 2: The models

*Explained in: README chapter 4.* A new `User` model, and one new field on `Tweet`.

<a id="model-user"></a>

### `models/User.ts`

*The User model.*

```ts
// models/User.ts
import { Schema, model, models, Model } from "mongoose";

export interface IUser {
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
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

export const User: Model<IUser> =
  (models.User as Model<IUser>) ?? model<IUser>("User", UserSchema);
```

<a id="model-tweet"></a>

### `models/Tweet.ts`

*The Tweet model with the new likedBy field.*

```ts
// models/Tweet.ts
import { Schema, model, models, Model } from "mongoose";

export interface ITweet {
  content: string;
  author: string;
  upvotes: number;
  downvotes: number;
  likedBy: string[]; // NEW
  createdAt: Date;
  updatedAt: Date;
}

const TweetSchema = new Schema<ITweet>(
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

export const Tweet: Model<ITweet> =
  (models.Tweet as Model<ITweet>) ?? model<ITweet>("Tweet", TweetSchema);
```

> [!TIP]
> **Checkpoint.** The app still starts without errors, and your M3 feed still shows your tweets.

---

## Step 3: The auth routes

*Explained in: README chapter 4.* Register, login, logout and "who am I?".

<a id="route-register"></a>

### `app/api/auth/register/route.ts`

*Register.*

```ts
// app/api/auth/register/route.ts
import bcrypt from "bcryptjs";
import { setAuthCookie } from "@/lib/auth";
import { makeSureDbIsReady } from "@/lib/db";
import { signToken } from "@/lib/jwt";
import { User } from "@/models/User";

export async function POST(request: Request) {
  // "unknown" = we don't trust what the client sent, we check it first
  const { username, password }: { username?: unknown; password?: unknown } =
    await request.json();

  // The typeof checks also protect against NoSQL injection: without them a client
  // could send { "username": { "$ne": null } } and smuggle in a query operator.
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
    if ((error as { code?: number }).code === 11000) {
      // 11000 = MongoDB "duplicate key" (the unique username)
      return Response.json({ error: "Username already taken" }, { status: 409 });
    }
    if (error instanceof Error && error.name === "ValidationError") {
      return Response.json({ error: error.message }, { status: 400 });
    }
    return Response.json({ error: "Could not create user" }, { status: 500 });
  }
}
```

<a id="route-login"></a>

### `app/api/auth/login/route.ts`

*Login.*

```ts
// app/api/auth/login/route.ts
import bcrypt from "bcryptjs";
import { setAuthCookie } from "@/lib/auth";
import { makeSureDbIsReady } from "@/lib/db";
import { signToken } from "@/lib/jwt";
import { User } from "@/models/User";

export async function POST(request: Request) {
  const { username, password }: { username?: unknown; password?: unknown } =
    await request.json();

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

<a id="route-logout"></a>

### `app/api/auth/logout/route.ts`

*Logout.*

```ts
// app/api/auth/logout/route.ts
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  await clearAuthCookie();
  return Response.json({ message: "Logged out" });
}
```

<a id="route-me"></a>

### `app/api/auth/me/route.ts`

*Who am I?.*

```ts
// app/api/auth/me/route.ts
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
> **Checkpoint.** With Thunder Client or Postman: register (`201`, a `Set-Cookie` header with `HttpOnly`), log in with a wrong password (`401`), call `GET /api/auth/me` with and without the cookie. In Compass the `passwordHash` starts with `$2`.

---

## Step 4: Context, providers and the login page

*Explained in: README chapters 5 and 7.* The client side of identity. `LikesContext` is already here because `Providers` imports it; its API arrives in step 5 (until then it simply loads nothing).

<a id="types-tweet"></a>

### `types/tweet.ts`

*Shared Tweet type.*

```ts
// types/tweet.ts
// The shape of a tweet as the browser receives it (JSON, so _id is a string)
export type Tweet = {
  _id: string;
  content: string;
  author: string;
  upvotes: number;
  downvotes: number;
  likedBy: string[];
};
```

<a id="ctx-auth"></a>

### `context/AuthContext.tsx`

*AuthContext, AuthProvider and useAuth.*

```tsx
// context/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type AuthUser = { username: string };

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

// null = "no provider above us". The useAuth hook below turns that into a clear error.
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
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

  // both routes answer with { user }
  async function authenticate(
    mode: "login" | "register",
    username: string,
    password: string
  ) {
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

  const login = (username: string, password: string) =>
    authenticate("login", username, password);
  const register = (username: string, password: string) =>
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

// A small hook so components don't have to import useContext + AuthContext.
// Because it throws when there is no provider, the return type is never null.
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}
```

<a id="ctx-likes"></a>

### `context/LikesContext.tsx`

*LikesContext with optimistic updates.*

```tsx
// context/LikesContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";

type LikesContextValue = {
  likedTweetIds: string[];
  toggleLike: (tweetId: string) => Promise<void>;
};

const LikesContext = createContext<LikesContextValue | null>(null);

export function LikesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [likedIds, setLikedIds] = useState<string[]>([]);

  // Load this user's likes from the server whenever the user changes
  useEffect(() => {
    if (!user) return;

    async function loadLikes() {
      const res = await fetch("/api/likes");
      if (res.ok) {
        const data: { likedTweetIds: string[] } = await res.json();
        setLikedIds(data.likedTweetIds);
      }
    }
    loadLikes();
  }, [user]);

  // Logged out? Then nothing is liked, whatever is left in state.
  const likedTweetIds = user ? likedIds : [];

  function setLiked(tweetId: string, liked: boolean) {
    setLikedIds((previous) => {
      const without = previous.filter((id) => id !== tweetId);
      return liked ? [...without, tweetId] : without;
    });
  }

  async function toggleLike(tweetId: string) {
    const wasLiked = likedTweetIds.includes(tweetId);

    setLiked(tweetId, !wasLiked); // 1. update the UI immediately (optimistic)
    try {
      const res = await fetch(`/api/tweets/${tweetId}/like`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Like failed");

      const data: { liked: boolean } = await res.json();
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

export function useLikes(): LikesContextValue {
  const context = useContext(LikesContext);
  if (!context) {
    throw new Error("useLikes must be used inside <LikesProvider>");
  }
  return context;
}
```

<a id="providers"></a>

### `app/providers.tsx`

*All providers in one client file.*

```tsx
// app/providers.tsx
"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { LikesProvider } from "@/context/LikesContext";

// LikesProvider uses useAuth(), so it has to sit INSIDE AuthProvider
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LikesProvider>{children}</LikesProvider>
    </AuthProvider>
  );
}
```

<a id="layout"></a>

### `app/layout.tsx`

*Root layout using the providers.*

```tsx
// app/layout.tsx  (keep the fonts, metadata and globals.css import that create-next-app generated)
import Providers from "./providers";
import Header from "@/components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

<a id="header"></a>

### `components/Header.tsx`

*Header with login / logout.*

```tsx
// components/Header.tsx
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

<a id="page-login"></a>

### `app/login/page.tsx`

*Login and register page.*

```tsx
// app/login/page.tsx
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
  async function submit(action: (username: string, password: string) => Promise<void>) {
    setError("");
    try {
      await action(username, password);
      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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

> [!TIP]
> **Checkpoint.** Open `/login` and register. The header shows `@yourname`. Refresh: you are **still logged in**. Click *Log out*: the *Log in* link is back.

---

## Step 5: Protect the API

*Explained in: README chapter 6.* Authenticate, validate, query, authorize.

<a id="route-tweets"></a>

### `app/api/tweets/route.ts`

*GET (public) and POST (login required).*

```ts
// app/api/tweets/route.ts
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
export async function POST(request: Request) {
  const authUser = await getAuthUser();
  if (!authUser) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await makeSureDbIsReady();
  const body: { content?: string } = await request.json();
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

<a id="route-tweet-id"></a>

### `app/api/tweets/[id]/route.ts`

*GET and DELETE with owner check.*

```ts
// app/api/tweets/[id]/route.ts
import { isValidObjectId } from "mongoose";
import { getAuthUser } from "@/lib/auth";
import { makeSureDbIsReady } from "@/lib/db";
import { Tweet } from "@/models/Tweet";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/tweets/<id>  →  public
export async function GET(_request: Request, { params }: RouteContext) {
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
export async function DELETE(_request: Request, { params }: RouteContext) {
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

<a id="route-like"></a>

### `app/api/tweets/[id]/like/route.ts`

*Like / unlike.*

```ts
// app/api/tweets/[id]/like/route.ts
import { isValidObjectId } from "mongoose";
import { getAuthUser } from "@/lib/auth";
import { makeSureDbIsReady } from "@/lib/db";
import { Tweet } from "@/models/Tweet";

type RouteContext = { params: Promise<{ id: string }> };

// POST /api/tweets/<id>/like  →  like the tweet, or unlike it if you already did
export async function POST(_request: Request, { params }: RouteContext) {
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

<a id="route-likes"></a>

### `app/api/likes/route.ts`

*Ids of the tweets I liked.*

```ts
// app/api/likes/route.ts
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

> [!TIP]
> **Checkpoint.** Run the first rows of Mallory's table (README chapter 10): `401` without cookie, `201` with cookie and the author is **you**, `403` when deleting someone else's tweet, `400` for a bad id.

---

## Step 6: Show likes in the feed

*Explained in: README chapter 7.* `TweetCard` and the changes to your home page.

<a id="tweetcard"></a>

### `components/TweetCard.tsx`

*One tweet with a like button.*

```tsx
// components/TweetCard.tsx
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLikes } from "@/context/LikesContext";
import type { Tweet } from "@/types/tweet";

export default function TweetCard({ tweet }: { tweet: Tweet }) {
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

<a id="page-home"></a>

### `app/page.tsx`

*The changes to your home page and create form.*

```tsx
// app/page.tsx  (only the changed parts)
import TweetCard from "@/components/TweetCard";
import type { Tweet } from "@/types/tweet"; // replaces the inline type from Milestone 3

// ...inside your component, replace the <li> you rendered in Milestone 3:
<ul>
  {tweets.map((tweet) => (
    <TweetCard key={tweet._id} tweet={tweet} />
  ))}
</ul>
```

And in your "create tweet" form from Milestone 3:

```ts
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

> [!TIP]
> **Checkpoint.** Click a heart: it fills at once and the number goes up. Refresh: still liked. Log out: hearts are empty. As a guest, clicking a heart takes you to `/login`.

---

## Step 7: The proxy and the client guard

*Explained in: README chapters 8 and 9.* Layers 2 and 1, for pages.

<a id="proxy"></a>

### `proxy.ts`

*Layer 2: redirect guests away from /profile.*

```ts
// proxy.ts  (project root, next to the app folder)
import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, verifyToken } from "@/lib/jwt";

export function proxy(request: NextRequest) {
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

<a id="page-profile"></a>

### `app/profile/page.tsx`

*Protected page with client guard.*

```tsx
// app/profile/page.tsx
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

> [!TIP]
> **Checkpoint.** Logged out, open `/profile`: you land on `/login`. Logged in: you see your profile. Click *Log out* while on `/profile`: the guard sends you away. Change the cookie value in DevTools: still redirected.

---

## Stretch: a dynamic page

*Explained in: README chapter 6 (dynamic routes).* A page for one tweet. As a Server Component it talks to the database directly.

<a id="page-tweet-dynamic"></a>

### `app/tweet/[id]/page.tsx`

*Stretch: dynamic page as Server Component.*

```tsx
// app/tweet/[id]/page.tsx
import { notFound } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { makeSureDbIsReady } from "@/lib/db";
import { Tweet } from "@/models/Tweet";

export default async function TweetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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

> [!TIP]
> **Checkpoint.** Open `/tweet/<a real id>`; a made-up id shows the 404 page.

---

**That's the whole milestone.** Now go through *Mallory's Revenge* in the README (chapter 10) and try to break every layer.
