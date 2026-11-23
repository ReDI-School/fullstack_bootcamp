# **Milestone 4: Authentication, Protection & Stateful UX** (JavaScript version)

> 📎 **Companion document:** every complete file of this milestone is in [`CODE-M4-JS-version.md`](CODE-M4-JS-version.md), in build order, with a checkpoint after each step. This README explains **why** we build things and what to understand; the code document is the **what**.

## 🎬 The Story So Far

In the last milestone our Twitter Clone got a memory: tweets survive a page refresh, because they live in a real database. It works. Time to show it to the world!

Meet **Alice**. She is a normal user: she wants to post a tweet, like a friend's tweet and look at her own profile. All she has to do is prove, once, that she is Alice.

Then **Mallory** shows up. (Every security course needs a Mallory: she is our imaginary attacker, and she is curious, patient and a little bit mean. She controls her own browser, Postman and `curl`.) She opens the app and tries three things:

1. She sends a tweet with `"author": "alice"` in the request. It is posted *as Alice*.
2. She sends a `DELETE` request for somebody else's tweet. It is gone.
3. She votes for her own tweet 9,000 times with a ten-line script.

Nothing in our app can stop her, for one simple reason: **our app has no idea who anybody is.**

This milestone is about changing that. First we give the app a sense of **identity** (users, passwords, login). Then we build **three walls** and, in the last chapter, we put on Mallory's hat and try to break our own work.

### The Red Line

Every chapter of this milestone follows the same pattern: **Mallory tries something, and we build the answer.** If you keep this thread in mind, the milestone is easy to follow, and every design decision has a reason.

| Scene | Mallory tries… | Our answer | Chapter |
| :-- | :-- | :-- | :-- |
| The open gates | posting as Alice, deleting tweets, voting 9,000 times | we don't know who anybody is | 1 |
| Identity | stealing or guessing passwords | bcrypt hash, signed token in an httpOnly cookie | 3 |
| Auth routes | sending `{ "$ne": null }`, probing for usernames | `typeof` check, one generic `401` | 4 |
| Shared state | editing Context in DevTools | Context is UX, the server is the truth | 5 |
| Protected API | forging `author`, deleting Alice's tweet | the token decides identity: `401` / `403` | 6 |
| Likes | double-liking, spam clicks | atomic `$addToSet`, optimistic UI with rollback | 7 |
| Proxy and guard | opening `/profile`, staying after logout | proxy verifies the token, guard reacts to state | 8, 9 |
| The revenge | all of the above | the test table: every move gets answered | 10 |

### Expected Outcomes

By the end of Milestone 4, you should:

- Register and log in users, store passwords as hashes, and recognize logged-in requests with a token in a cookie
- Explain the difference between **authentication** and **authorization**
- Explain the difference between a *client-side guard* (user experience) and *server-side protection* (security)
- Share the logged-in user and the liked tweets across your app with React Context
- Protect pages with the Next.js proxy, and protect API routes inside the route handler itself
- Use dynamic API routes for per-tweet actions (like, delete)

### Map of the Milestone

| # | Chapter | Core idea | Good live demo |
| :-- | :-- | :-- | :-- |
| 1 | The big picture | Three layers of protection; authentication vs authorization | Mallory's three attacks on the M3 app |
| 2 | Setup | Two packages, one secret | `.env.local` and the file list |
| 3 | Building blocks | Hashing, JWT, cookies | Paste a token into jwt.io; look at the cookie in DevTools |
| 4 | Users and auth routes | Register, login, logout, me | Register in Postman, look at the hash in Compass |
| 5 | AuthContext | Shared client state; the server is the truth | Refresh the page and stay logged in |
| 6 | Protected API routes | Authenticate → validate → database → authorize | `curl` with and without a cookie |
| 7 | LikesContext | Optimistic UI | Throttle the network in DevTools and click like |
| 8 | The proxy | Layer 2: the bouncer at the door | Visit `/profile` logged out |
| 9 | The client guard | Layer 1: friendly, but not security | Log out while on `/profile` |
| 10 | Mallory's revenge | Test every layer by attacking it | The attack table |

The chapters build on each other, so teach and read them **in this order**. Every chapter ends with an *In one sentence* line, and at the end of this document you'll find self-check questions, a glossary and sources for self-study.

---

## Where This Milestone Fits

You already have everything we build on: App Router pages and dynamic `[id]` routes, route handlers (`route.{js}`) with `GET`, `POST`, `PATCH` and `DELETE`, and MongoDB with Mongoose (`makeSureDbIsReady()` and the `Tweet` model) from Milestone 3. We won't explain those again. The new question is: **how does this full-stack app know who is using it, and what is each person allowed to do?**

> [!NOTE]
> **Versions.** This README is written for a fresh `create-next-app` (Next.js 16). Two things changed in that version that you will see in older tutorials: `params` must be awaited (you already do this since Milestone 3), and the old `middleware` file is now called **`proxy`** (`proxy.{js}`, with an exported function named `proxy`).
>
> If your project runs Next.js 15 or older, name the file `middleware.{js}` and the function `middleware`. In those versions it runs in the *Edge runtime*, where `jsonwebtoken` does not work (use the `jose` library there instead). You can check your version in `package.json`.

---

## 1️⃣ The Big Picture: Three Walls

Security is not one check in one place. A good castle has an outer wall, a gate and a locked vault, and an attacker has to get through all of them. We build three layers, each with a different job:

```text
 BROWSER                          SERVER
┌─────────────────────┐   ┌──────────────────┐   ┌───────────────────────┐
│ 1. Client guard     │──▶│ 2. proxy         │──▶│ 3. Route handler      │──▶ MongoDB
│ Context + redirects │   │ page requests    │   │ checks the token      │
└─────────────────────┘   └──────────────────┘   └───────────────────────┘
  UX only                   first gate,            THE real gate
  anyone can bypass it      not the last one       (protects the data)
```

| Layer | Where it lives | What it is good for | Can Mallory bypass it? |
| :-- | :-- | :-- | :-- |
| **Client guard** | React components, Context | A nice experience: hide buttons, redirect to `/login` | **Yes.** It runs in *her* browser, so she controls it |
| **Proxy** | `proxy.{js}` on the server | Turn visitors away from pages before the page even loads | Not from the browser, but it must never be the only wall (see chapter 8) |
| **API protection** | Inside every route handler | Protects the data and every action that changes it | No. This is the real security boundary |

> [!IMPORTANT]
> **The golden rule: never trust the client.** Everything that arrives from the browser (a request body, a header, a Context value) can be faked. Anything that matters must be checked on the server, as close to the data as possible.

### Two words you must not mix up

| | Question it answers | Example in our app | When it fails |
| :-- | :-- | :-- | :-- |
| **Authentication** | *Who are you?* | Login: password check, token | `401 Unauthorized` |
| **Authorization** | *Are you allowed to do this?* | Only the author may delete a tweet | `403 Forbidden` |

Authentication happens **once** (at login). Authorization has to happen on **every** request that touches protected data. Being logged in does *not* mean "allowed to do anything": Alice is authenticated, but she still may not delete Bob's tweet.

### A "Like" click, end to end

Once we are done, one click on a heart button travels through the whole app:

1. The button updates the UI **immediately** (Context), so the app feels fast
2. The browser sends `POST /api/tweets/<id>/like`, and attaches the login cookie by itself
3. The route handler reads the cookie and verifies the token → no valid token means `401`
4. It validates the `id` and updates MongoDB
5. It answers with JSON, and the UI keeps the server's answer (or rolls back if something failed)

> **In one sentence:** security comes from several layers, only the server-side ones can be trusted, and "who are you?" (authentication) is a different question from "may you do this?" (authorization).

---

## 2️⃣ Setup

```bash
npm install bcryptjs jsonwebtoken
```

- **bcryptjs** hashes passwords. (A package called `bcrypt` does the same but needs native code to compile, which causes install problems on some machines. `bcryptjs` is plain JavaScript.)
- **jsonwebtoken** creates and verifies JWTs.

Next to your `MONGODB_URI` in `.env.local`, add a **secret** that is used to sign tokens. Generate a long random one:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```bash
JWT_SECRET=paste-the-long-random-string-here
```

> [!WARNING]
> Never commit `.env.local`, and never use a short or guessable secret. Anybody who knows the secret can create tokens for **any** user. Restart `npm run dev` after changing `.env.local`. Changing the secret logs everybody out.

<details>
<summary>📁 All the files we will create or change</summary>

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

</details>

---

## 3️⃣ Building Blocks: Passwords, Tokens, Cookies

Four ideas, and then the code is easy.

### HTTP has no memory

Every HTTP request is independent: when the browser sends request number two, the server has already forgotten request number one. So a login would be useless, unless **every later request carries proof of who sent it**. Our proof is a *token* that travels in a *cookie*, and that is what the rest of this chapter explains.

### Passwords: hashing, not storing

We never store a password. We store a **hash**: the result of a one-way function that is easy to compute and practically impossible to reverse. At login we hash what the user typed and compare the two hashes.

```js
import bcrypt from "bcryptjs";

const hash = await bcrypt.hash("supersecret", 10);      // registering → store THIS
const ok = await bcrypt.compare("supersecret", hash);   // logging in → true or false
```

Why bcrypt, and not just any hash? bcrypt is **deliberately slow**, so guessing millions of passwords takes an attacker a very long time, and it adds a random **salt**, so two users with the same password get different hashes (no lookup tables). The `10` is the *cost*: every +1 doubles the work. If our database ever leaks, the attacker gets hashes, not passwords.

### Tokens: a signed ticket

After a successful login the server hands the browser a **JWT** (JSON Web Token), like a signed ticket for a concert. It has three parts, `header.payload.signature`:

```text
eyJhbGciOiJIUzI1NiJ9 . eyJpZCI6IjY2NWYx… . SflKxwRJSMeKKF2QT4fw…
      header                 payload              signature

payload, decoded:  { "id": "665f1c2a…", "username": "alice", "iat": 1760000000, "exp": 1760003600 }
```

- The **payload** carries data (who you are, when the token expires).
- The **signature** is computed from header + payload + our `JWT_SECRET`.
- Anyone can **read** the payload (paste a token into [jwt.io](https://jwt.io) and see). Nobody can **change** it without the secret, because then the signature no longer matches.

So a JWT is **signed, not encrypted**. Never put a password or anything private in it.

```js
import jwt from "jsonwebtoken";
// secret = process.env.JWT_SECRET (only the server knows it)

// at login: create a signed token that expires in one hour
const token = jwt.sign({ id: "665f…", username: "alice" }, secret, { expiresIn: 3600 });

// on every protected request: verify it. Throws if it was changed or has expired.
const payload = jwt.verify(token, secret);
```

**Sessions or tokens?** There are two common ways to remember a login:

| | Database sessions | Stateless tokens (JWT, our choice) |
| :-- | :-- | :-- |
| What the browser holds | A random session id | A signed token with the identity inside |
| What the server does per request | Looks the session up in a database | Only verifies the signature, no lookup |
| Log someone out *immediately* (revoke) | Easy: delete the session | **Not possible** until the token expires |
| Extra database table | Yes | No |

We use JWTs because they need no extra table and teach you signing and verifying. The honest trade-off: logging out just deletes the cookie, and a stolen token keeps working until it expires. That is why our tokens expire after **one hour**. (The Next.js docs call both approaches fine; real products often combine them.)

### Cookies: the browser carries the ticket

A **cookie** is a small piece of data the server asks the browser to keep. The browser then sends it back **automatically with every request to that site**.

```text
POST /api/auth/login   ───────────────────▶  server checks the password, signs a token
                       ◀───────────────────  Set-Cookie: token=eyJ…; HttpOnly
GET  /api/likes        ───────────────────▶  the browser adds "Cookie: token=eyJ…" by itself,
                                             the server verifies it → "this is alice"
```

```js
cookieStore.set("token", token, {
  httpOnly: true,  // JavaScript in the page cannot read it
  sameSite: "lax", // not sent along with cross-site POST requests
  secure: process.env.NODE_ENV === "production", // HTTPS only once deployed
  maxAge: 60 * 60, // lifetime in seconds
});
```

| | `httpOnly` cookie (our choice) | `localStorage` |
| :-- | :-- | :-- |
| Readable by JavaScript in the page? | **No** | Yes |
| Sent to the server automatically? | Yes, with every request | No, you attach it yourself |
| If an attacker injects a script (XSS) | They **cannot** steal the token | They can steal it |

`sameSite: "lax"` stops the browser from sending the cookie along with cross-site `POST` requests (that protects against *CSRF*, where another site tricks your browser into acting for you). `secure` means "HTTPS only", which we switch on in production.

### Two small helper files

We keep all token logic in **one place**, so the login routes, the proxy and every protected route use exactly the same code. `jwt` only signs and verifies; `auth` deals with cookies and gives us `getAuthUser()`, the one function every protected route handler will call. (In the Next.js docs, a central function like this is part of what they call a *Data Access Layer*: one place that decides "who is asking?".)

- 📄 **Full file:** [`lib/jwt.js`](CODE-M4-JS-version.md#lib-jwt): sign and verify tokens (pure, no cookies)
- 📄 **Full file:** [`lib/auth.js`](CODE-M4-JS-version.md#lib-auth): cookie helpers and getAuthUser()

> **In one sentence:** HTTP forgets everything, so after login the browser carries a signed token in an httpOnly cookie, and the server verifies the signature on every request.

---

## 4️⃣ Users and Auth Routes

### The `User` model

A user has a `username` (unique: MongoDB refuses a second user with the same name) and a `passwordHash`. We named the field *hash* on purpose, so nobody is ever tempted to store the real password in it.

- 📄 **Full file:** [`models/User.js`](CODE-M4-JS-version.md#model-user): the User model

### `likedBy` on the `Tweet` model

Your Milestone 3 model stays as it is; we add one field. In Milestone 3 anybody could vote as often as they liked, because we only counted (`$inc`). A **like** is different: one per user, and you can take it back. So we remember *who* liked: `likedBy` is an array of usernames. (Old tweets without the field get an empty array automatically when they are loaded.)

> [!NOTE]
> A real product would store user **ids**. We keep Milestone 3's plain-text `author` field so you don't have to migrate your data. Usernames are unique in our app, so it works.

- 📄 **Full file:** [`models/Tweet.js`](CODE-M4-JS-version.md#model-tweet): the Tweet model with the new likedBy field

### The four routes

| Route | What it does | Answers |
| :-- | :-- | :-- |
| `POST /api/auth/register` | Validate → hash → create user → set cookie (log in right away) | `201`, `400`, `409` |
| `POST /api/auth/login` | Find user → `bcrypt.compare` → set cookie | `200`, `401` |
| `POST /api/auth/logout` | Delete the cookie | `200` |
| `GET /api/auth/me` | "Who am I?" Reads the cookie, returns the user or `null` | `200` |

- 📄 **Full file:** [`app/api/auth/register/route.js`](CODE-M4-JS-version.md#route-register): register
- 📄 **Full file:** [`app/api/auth/login/route.js`](CODE-M4-JS-version.md#route-login): login
- 📄 **Full file:** [`app/api/auth/logout/route.js`](CODE-M4-JS-version.md#route-logout): logout
- 📄 **Full file:** [`app/api/auth/me/route.js`](CODE-M4-JS-version.md#route-me): who am I?

Three details that are easy to miss:

- **Login gives the same generic `401` for "no such user" and "wrong password".** Otherwise the route tells Mallory which usernames exist, and she only has to guess passwords for those.
- **`me` answers `200` with `user: null` for guests.** "Not logged in" is a perfectly normal answer to the question "who am I?", not an error.
- **`typeof` checks protect against NoSQL injection.** MongoDB queries are JSON objects, so a client can send an *object* where we expect a string:

```js
// A normal client sends:    { "username": "alice", "password": "…" }
// Mallory sends instead:    { "username": { "$ne": null }, "password": "…" }

// Without a typeof check this runs as a query operator, "any user whose name is not null":
await User.findOne({ username: { $ne: null } });

// The fix is one line, before we touch the database:
if (typeof username !== "string" || typeof password !== "string") { /* answer 400 */ }
```

> [!TIP]
> **Checkpoint.** Register a user with Thunder Client or Postman. In the response headers, look at `Set-Cookie` (it contains `HttpOnly`). Open MongoDB Compass: the `passwordHash` should start with `$2` and must **not** look like your password.

> **In one sentence:** register hashes and stores, login compares and hands out the cookie, and every check on user input happens before the database is touched.

---

## 5️⃣ AuthContext: Who Is Logged In?

Many components need to know the current user: the header, the profile page, every tweet card. The naive way is to pass `user` down as a prop through every level. That is called **prop drilling**, and it gets messy fast:

```js
<Page user={user}>
  <Layout user={user}>
    <Header user={user} />   {/* only Header needs it, but everybody passes it along */}
  </Layout>
</Page>
```

**React Context** solves it in three steps: create a channel, let a provider put a value on it, and let any component below read it:

```js
const AuthContext = createContext(null);                // 1. create the "channel"

<AuthContext.Provider value={{ user, login, logout }}>  // 2. a provider puts a value on it
  {children}
</AuthContext.Provider>

const { user } = useContext(AuthContext);               // 3. any component below can read it
```

Three truths about Context that are worth remembering:

1. **It lives in the browser, so it is user experience, not security.** Anybody can change it in DevTools. (Golden rule from chapter 1.)
2. **It resets on every page refresh.** That is why our provider asks the server who is logged in when the app loads.
3. **When the value changes, every component that reads it re-renders.** Context is great for a few stable, widely shared things (the user, the likes). It is not a replacement for all state.

### Our `AuthContext`

The provider has three important design choices:

1. It **asks the server** (`/api/auth/me`) who is logged in, instead of reading `localStorage`. The cookie is the truth; a second copy somewhere else could disagree with it.
2. It has a **`loading`** state. On the very first render we don't know yet if somebody is logged in, and "not known yet" must not be treated as "logged out" (we'll see the bug this prevents in chapter 9).
3. `login` and `register` call our API routes. The *server* sets the cookie; Context only updates what the UI shows.

```js
// inside AuthProvider (simplified: the full file also has try/catch)
useEffect(() => {
  async function loadUser() {
    const res = await fetch("/api/auth/me"); // the cookie travels along automatically
    const data = await res.json();
    setUser(data.user);                      // a user object, or null
    setLoading(false);                       // NOW we know
  }
  loadUser();
}, []);
```

- 📄 **Full file:** [`context/AuthContext.js`](CODE-M4-JS-version.md#ctx-auth): AuthContext, AuthProvider and useAuth

### Client or server component?

Context uses state and effects, so these files need `"use client"` at the very top. That marks a **client component**: it also runs in the browser, and may use hooks and `onClick`. We don't want to turn the whole root layout into one, so the providers live in their own small client file, and the (server) layout simply uses it. Notice that `<html>` and `<body>` must stay at the top:

```js
// app/layout: a SERVER component that uses a CLIENT component (Providers)
<html lang="en">
  <body>
    <Providers>   {/* the "use client" file with AuthProvider + LikesProvider */}
      <Header />
      {children}
    </Providers>
  </body>
</html>
```

- 📄 **Full file:** [`app/providers.js`](CODE-M4-JS-version.md#providers): all providers in one client file
- 📄 **Full file:** [`app/layout.js`](CODE-M4-JS-version.md#layout): root layout using the providers
- 📄 **Full file:** [`components/Header.js`](CODE-M4-JS-version.md#header): header with login / logout
- 📄 **Full file:** [`app/login/page.js`](CODE-M4-JS-version.md#page-login): login and register page

> **In one sentence:** Context shares the current user without prop drilling, it is only a mirror of what the server knows, and `loading` means "we haven't asked yet".

---

## 6️⃣ Protected API Routes and Dynamic Routes

Remember: **the route handler is the real gate.** Every handler that changes data, or returns private data, follows the same four steps, in this order:

| Step | Question | If it fails |
| :-- | :-- | :-- |
| 1. **Authenticate** | Who are you? (`getAuthUser()`) | `401` |
| 2. **Validate** | Is the input sane? (Is the `id` a valid ObjectId?) | `400` |
| 3. **Database** | Does it exist? | `404` |
| 4. **Authorize** | Are *you* allowed to do this to *this* tweet? | `403` |

<details>
<summary>📄 The four steps of a protected route handler (DELETE as example)</summary>

```js
export async function DELETE(request, { params }) {
  const authUser = await getAuthUser();                  // 1. AUTHENTICATE: who are you?
  if (!authUser) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;                           // 2. VALIDATE the input
  if (!isValidObjectId(id)) return Response.json({ error: "Invalid tweet id" }, { status: 400 });

  const tweet = await Tweet.findById(id);                // 3. DATABASE
  if (!tweet) return Response.json({ error: "Tweet not found" }, { status: 404 });

  if (tweet.author !== authUser.username)                // 4. AUTHORIZE: may YOU do this?
    return Response.json({ error: "You can only delete your own tweets" }, { status: 403 });

  await tweet.deleteOne();
  return Response.json({ message: "Tweet deleted successfully" });
}
```

</details>

| Status | Meaning | Example here |
| :-- | :-- | :-- |
| `400` | The request itself is malformed | `/api/tweets/not-an-id` |
| `401` | We don't know who you are | no cookie, fake or expired token |
| `403` | We know who you are, but you may not do this | deleting somebody else's tweet |
| `404` | It does not exist | a valid id that is not in the database |
| `409` | Conflict | username already taken |

### Mallory can't pick the author any more

In Milestone 3 the client sent `author` in the body, so anybody could post as anybody. Now the server decides, using the **verified token**. `POST /api/tweets` requires a login, and whatever `author` Mallory puts in her request is simply ignored.

- 📄 **Full file:** [`app/api/tweets/route.js`](CODE-M4-JS-version.md#route-tweets): GET (public) and POST (login required)

### Dynamic routes for one tweet

The folder `[id]` makes the route dynamic: `/api/tweets/665f1c2a…` arrives in your code as `params.id`, and `params` is a Promise, so we `await` it. `isValidObjectId` checks the format *before* we ask MongoDB, so a garbage id gives a clean `400` instead of a server crash.

- 📄 **Full file:** [`app/api/tweets/[id]/route.js`](CODE-M4-JS-version.md#route-tweet-id): GET and DELETE with owner check

### A dynamic route inside a dynamic route

An action on one tweet gets its own folder **under** `[id]`: `/api/tweets/<id>/like`. In the handler we use two MongoDB operators, in the same spirit as `$inc` in Milestone 3: the *database* changes the array in one step (no read-modify-write that can lose data), and `$addToSet` can never create a duplicate, even if somebody clicks twice very fast. That property (doing it twice gives the same result as once) is called being **idempotent**.

```js
const alreadyLiked = await Tweet.exists({ _id: id, likedBy: authUser.username });

const update = alreadyLiked
  ? { $pull: { likedBy: authUser.username } }       // take the like back
  : { $addToSet: { likedBy: authUser.username } };  // add it (never twice)

await Tweet.findByIdAndUpdate(id, update);
```

- 📄 **Full file:** [`app/api/tweets/[id]/like/route.js`](CODE-M4-JS-version.md#route-like): like / unlike

One more route lets the client ask *"which tweets did I like?"*. Like the others, it answers `401` to guests:

- 📄 **Full file:** [`app/api/likes/route.js`](CODE-M4-JS-version.md#route-likes): ids of the tweets I liked

> **In one sentence:** every protected handler authenticates first, validates next, and authorizes last, and it takes the user's identity from the token, never from the request body.

---

## 7️⃣ LikesContext and the Optimistic UI

The liked tweets are needed in many places (every card in the feed), so they get their own Context. It also solves a UX problem: waiting for the server before the heart turns red feels slow. Most apps use an **optimistic update**:

1. **Update the UI immediately**, as if the request already worked
2. **Send the request** and, when it answers, trust the server's answer
3. If the request fails, **roll back** to what it was before

```js
async function toggleLike(tweetId) {
  const wasLiked = likedTweetIds.includes(tweetId);

  setLiked(tweetId, !wasLiked);               // 1. optimistic: update the UI right now
  try {
    const res = await fetch(`/api/tweets/${tweetId}/like`, { method: "POST" });
    if (!res.ok) throw new Error("Like failed");
    const data = await res.json();
    setLiked(tweetId, data.liked);            // 2. trust the server's answer
  } catch {
    setLiked(tweetId, wasLiked);              // 3. it failed: roll back
  }
}
```

> [!TIP]
> Try it: in DevTools → Network, set throttling to "Slow 3G" and click a heart. It turns red at once, even though the server needs seconds to confirm. Then go offline and click: after the request fails, the heart jumps back.

In `TweetCard`, the number next to the heart is computed from two sources: everyone else's likes come from the server data, and *your* like comes from Context. So the number changes the instant you click:

```js
const liked = likedTweetIds.includes(tweet._id);
const othersCount = tweet.likedBy.filter((name) => name !== user?.username).length;
const likeCount = othersCount + (liked ? 1 : 0); // everyone else + me (if I liked it)
```

- 📄 **Full file:** [`context/LikesContext.js`](CODE-M4-JS-version.md#ctx-likes): LikesContext with optimistic updates
- 📄 **Full file:** [`components/TweetCard.js`](CODE-M4-JS-version.md#tweetcard): one tweet with a like button
- 📄 **Full file:** [`app/page.js`](CODE-M4-JS-version.md#page-home): the changes to your home page and create form

Notice `if (!user) router.push("/login")` in the card. It is a **client guard**: friendly, but not security. Remove it and a guest's click still reaches the API, and the API answers `401`. Both layers exist for different reasons.

> **In one sentence:** an optimistic update changes the UI first and corrects it if the server disagrees; the server's answer always wins.

---

## 8️⃣ Layer 2: The Proxy

The proxy runs **before** a page request is completed. Think of a **bouncer at the door of the page**: it looks at your ticket (the cookie) and turns you away or lets you in. It is the right tool for sending visitors without a valid login away from `/profile` quickly.

```js
export function proxy(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token || !verifyToken(token)) {        // not "is there a cookie?" but "is it valid?"
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();                 // let the request through
}

export const config = { matcher: ["/profile/:path*"] };  // only run for these paths
```

- 📄 **Full file:** [`proxy.js`](CODE-M4-JS-version.md#proxy): layer 2: redirect guests away from /profile

Things to know:

- The file must be named `proxy.{js}` and live in the **project root** (or in `src/`, if you use that folder), next to `app`. Restart the dev server if it doesn't seem to run.
- The `matcher` decides which paths it runs for. Our API routes are **not** in it on purpose: they protect themselves (layer 3), and an API should answer `401`, not redirect to an HTML page.
- We call `verifyToken`; we don't just check that a cookie *exists*. A cookie `token=hello` must not get Mallory in. (The Next.js docs call checks like this *optimistic checks*: quick and cheap, no database call.)

### Why the proxy can never be the only wall

In March 2025 a vulnerability (CVE-2025-29927) showed that on affected, self-hosted Next.js apps a specially crafted request header could make the app **skip middleware completely**. Apps whose only login check lived in middleware were wide open. It was patched quickly, and apps on Vercel or Netlify were not affected, but the lesson is permanent: *design as if one layer can fail*. That is why every route handler in this milestone checks the token again, right next to the data. The Next.js documentation says the same: the proxy "should not be your only line of defense".

> **In one sentence:** the proxy is a fast bouncer for page requests, but the real checks belong next to the data.

---

## 9️⃣ Layer 1: The Client Route Guard

The proxy only runs when the browser makes a **new request**. If you click "Log out" while you are looking at `/profile`, no new request happens, and you'd stay on a page you shouldn't see. The guard handles this, because it reacts to the Context changing:

```js
useEffect(() => {
  if (!loading && !user) router.replace("/login"); // wait for loading, THEN decide
}, [loading, user, router]);

if (loading || !user) return <p>Loading…</p>;
```

Look at the `loading` check. Without it, a logged-in user who reloads `/profile` is sent to `/login` for a moment, because `user` is `null` until `/api/auth/me` has answered. That is the bug `loading` prevents: **"not known yet" is not the same as "logged out".**

- 📄 **Full file:** [`app/profile/page.js`](CODE-M4-JS-version.md#page-profile): protected page with client guard

> **In one sentence:** the client guard makes the app feel right when the user's state changes, but it protects nothing, because Mallory controls her own browser.

---

## 🔟 Mallory's Revenge: Test Every Layer

Never trust protection you haven't tried to break. Time to put on Mallory's hat. Use the terminal, or Thunder Client / Postman (they keep cookies for you after the login request).

<details>
<summary>⌨️ curl commands for the first attacks</summary>

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

On Windows PowerShell, `curl` is an alias for something else: use `curl.exe`, or use Thunder Client.

</details>

| Mallory's move | What should happen |
| :-- | :-- |
| `POST /api/tweets` without a cookie | `401` |
| `POST /api/tweets` as herself, with `"author": "alice"` in the body | `201`, but the author is **Mallory's** username |
| `DELETE` a tweet written by another user | `403` |
| `DELETE /api/tweets/not-an-id` | `400` |
| `DELETE` a valid id that doesn't exist | `404` |
| Register with `{ "username": { "$ne": null }, "password": "…" }` | `400` |
| Log in with a wrong password, then with a username that doesn't exist | the **same** `401` message both times |
| `POST /api/tweets/<id>/like` twice | `{ "liked": true }`, then `{ "liked": false }` |
| Open `/profile` in a private window (logged out) | redirected to `/login` |
| In DevTools → Application → Cookies, change `token` to `abc`, reload `/profile` | still redirected: the proxy checks the token, not just the cookie |
| Type `document.cookie` in the console while logged in | the token is **not** listed (`httpOnly`) |
| Click "Log out" while on `/profile` | the guard sends you to `/login` |
| Reload the home page while logged in | still logged in, your liked hearts are still filled |

If every row behaves, Mallory has lost this round. (Note: she is patient. A stolen token would still work for an hour. See the self-check questions.)

---

## 🧯 Common Problems

| Problem | Likely cause |
| :-- | :-- |
| `Please define the JWT_SECRET environment variable` | Missing in `.env.local`, or you didn't restart the dev server |
| The proxy never runs | Wrong file name or location (`proxy.{js}` in the project root), or the path is not in `matcher` |
| Redirect loop on `/login` | `/login` is in the proxy `matcher`. Remove it |
| `useAuth must be used inside <AuthProvider>` | `Providers` is missing in `layout.{js}`, or `LikesProvider` is outside `AuthProvider` |
| "You're importing a component that needs `useState`…" | A file with Context, hooks or `onClick` is missing `"use client"` at the very top |
| `params should be awaited` | Use `const { id } = await params` |
| Logged-in users get bounced to `/login` for a moment | The guard ignores `loading` |
| Every request is `401` although you logged in | The cookie was not sent: check DevTools → Application → Cookies. Different port or domain than where you logged in? |
| `The edge runtime does not support Node.js 'crypto' module` | Next.js 15 or older: `middleware` runs on Edge. Use `jose` there |

---

## ✅ Task

Extend your Twitter Clone so it distinguishes between public and protected behavior. The code document walks you through it in eight steps, with a checkpoint after each.

**Core**

- [ ] Add the `User` model, `lib/jwt`, `lib/auth` and `JWT_SECRET`
- [ ] Build `register`, `login`, `logout` and `me`, and test them
- [ ] Build `AuthContext`, `Providers`, `Header` and the login page
- [ ] Protect `POST /api/tweets`: the author comes from the token
- [ ] Add `GET` and `DELETE` (with owner check) to `/api/tweets/[id]`
- [ ] Add `likedBy`, the like route, `/api/likes`, `LikesContext` and `TweetCard`
- [ ] Protect `/profile` with the proxy **and** the client guard
- [ ] Run through Mallory's table and make every row behave

**Stretch**

- [ ] Show a delete button only on your own tweet cards
- [ ] Protect the upvote/downvote `PATCH` from Milestone 3 as well
- [ ] Add a dynamic *page* `app/tweet/[id]/page.{js}` (it is in the code document: as a Server Component it can use the database directly)
- [ ] Make `/api/auth/me` check that the user still exists in the database

---

## 🔎 A Note on SSR, SSG and ISR

You may have seen tutorials using `getServerSideProps()` and `getStaticProps()`. Those belong to the **Pages Router** and don't exist in the App Router we use. In the App Router a page is a Server Component: it can be `async`, fetch or query on the server, and Next.js decides how to render it. Pages that read request data, like cookies, are rendered on each request.

Caching and revalidation changed between Next.js versions, so when you need them, read the **Caching** section of the docs for your version ([nextjs.org/docs](https://nextjs.org/docs)). It is not needed for this milestone: our pages load their tweets from our own API in the browser.

---

# **Conclusion - Authentication & Protection**

## **Key Takeaways**

1. **Three layers** → client guard (UX), proxy (page requests), route handler (the real boundary)
2. **Authentication vs authorization** → "who are you?" (`401`) vs "may you do this?" (`403`)
3. **Passwords** → hashed with bcrypt (slow, salted), never stored, checked with `bcrypt.compare`
4. **Tokens** → a signed JWT in an `httpOnly` cookie, verified on the server on every protected request
5. **Context** → shared client state (`AuthContext`, `LikesContext`) that improves UX but is **not** security
6. **Dynamic routes** → `/api/tweets/[id]` and `/api/tweets/[id]/like` for per-item actions
7. **Never trust the client** → identity comes from the token, input is validated, errors don't leak information
8. **Optimistic UI** → update first, confirm with the server, roll back on failure

## **What We Left Out**

Real products also need email verification, password reset, refresh tokens, rate limiting against password guessing and more. In practice many teams use a library or service (for example Auth.js or a hosted provider) for these. Understanding the building blocks from this milestone makes using those much easier.

## **Next Steps**

In the next milestone we deploy the app (for example to Vercel). The environment variables you created, `MONGODB_URI` and `JWT_SECRET`, will have to be set there too.

---

## 🧠 Check Yourself

Try to answer before you open the answer. These are also good questions for a quiz.

<details>
<summary><b>1.</b> Why is a client-side route guard not real security?</summary>

It runs in the user's own browser, so the user controls it. Anyone can change Context in DevTools, disable JavaScript, or send requests with `curl` that never touch your React code. Real checks must happen on the server.
</details>

<details>
<summary><b>2.</b> What is the difference between authentication and authorization? Which status code belongs to which?</summary>

Authentication = *who are you?* (failure: `401`). Authorization = *are you allowed to do this?* (failure: `403`). Alice is authenticated when she logs in, but she is not authorized to delete Bob's tweet.
</details>

<details>
<summary><b>3.</b> Why do we store a password hash instead of the password? What does the salt do?</summary>

If the database leaks, the attacker gets hashes, which cannot be reversed, and not the real passwords. The salt is random data added before hashing, so identical passwords produce different hashes and precomputed lookup tables don't work. bcrypt is also deliberately slow, which makes guessing expensive.
</details>

<details>
<summary><b>4.</b> Is a JWT encrypted? What does that mean for what you put in it?</summary>

No. It is *signed*. Anyone can read the payload, but nobody can change it without the secret. So never put passwords or private data in a token.
</details>

<details>
<summary><b>5.</b> Why do we put the token in an <code>httpOnly</code> cookie instead of <code>localStorage</code>?</summary>

JavaScript in the page cannot read an `httpOnly` cookie, so a script injected by an attacker (XSS) cannot steal the token. `localStorage` is readable by any script on the page. The browser also sends the cookie automatically.
</details>

<details>
<summary><b>6.</b> Why does the register route check <code>typeof username !== "string"</code>?</summary>

To prevent NoSQL injection: MongoDB queries are objects, so a client could send `{ "$ne": null }` as the username and have it executed as a query operator. The check guarantees we only ever search for plain strings.
</details>

<details>
<summary><b>7.</b> Why does login give the same error for "unknown user" and "wrong password"?</summary>

Different messages would let an attacker find out which usernames exist, and then only guess passwords for those.
</details>

<details>
<summary><b>8.</b> Why is <code>author</code> taken from the token instead of the request body?</summary>

The request body is controlled by the client, so it can be faked. The verified token is the only thing the server can trust to say who is asking.
</details>

<details>
<summary><b>9.</b> If the proxy already redirects guests, why does every route handler check the token again?</summary>

The proxy is a convenience layer for page requests and must not be the only wall: a framework bug (CVE-2025-29927) once let attackers skip middleware entirely on affected self-hosted apps, and APIs can also be called directly. The handler sits next to the data, so its check cannot be skipped.
</details>

<details>
<summary><b>10.</b> What is the <code>loading</code> state in <code>AuthContext</code> for? What happens without it?</summary>

On the first render we don't yet know whether somebody is logged in. Without `loading`, `user` is `null`, the guard treats that as "logged out", and a logged-in user who reloads `/profile` is bounced to `/login`.
</details>

<details>
<summary><b>11.</b> Why use <code>$addToSet</code> / <code>$pull</code> instead of reading the tweet, changing the array in JavaScript and saving it?</summary>

The database does the change in one step, so two quick requests cannot overwrite each other's change, and `$addToSet` never adds the same name twice (the operation is idempotent).
</details>

<details>
<summary><b>12.</b> What happens in the UI when an optimistic like request fails?</summary>

The UI was already updated, so the `catch` branch rolls it back to the previous state (`setLiked(tweetId, wasLiked)`).
</details>

<details>
<summary><b>13.</b> You click "Log out" while on <code>/profile</code>. Which layer sends you away, and why not the proxy?</summary>

The client guard. Logging out doesn't make a new page request, so the proxy never runs. The guard reacts to the Context changing (`user` becomes `null`).
</details>

<details>
<summary><b>14.</b> A JWT cannot be revoked before it expires. What does our app do about that, and what else could it do?</summary>

We keep tokens short-lived (one hour), so a stolen token stops working soon. Other options: database sessions that can be deleted, a blocklist of revoked tokens, or short-lived access tokens plus refresh tokens.
</details>

---

## 📖 Glossary

| Term | Meaning |
| :-- | :-- |
| **Authentication** | Proving who you are (login) |
| **Authorization** | Deciding what you are allowed to do |
| **Hash** | One-way scrambled version of a password; cannot be reversed |
| **Salt** | Random data added before hashing so equal passwords get different hashes |
| **JWT** | JSON Web Token: signed `header.payload.signature` ticket that carries identity |
| **Payload** | The data inside a JWT (readable by anyone) |
| **Signature** | Proof that a token was created by someone who knows the secret |
| **Cookie** | Data the server asks the browser to store and send back with every request |
| **`httpOnly`** | Cookie flag: JavaScript in the page cannot read the cookie |
| **Stateless session** | The browser holds a signed token; the server stores nothing |
| **Context** | React feature to share a value with many components without passing props |
| **Prop drilling** | Passing props through many levels only so a deep component gets them |
| **Provider** | Component that puts a value on a Context for everything below it |
| **Client component** | Component marked `"use client"`; runs in the browser, may use hooks |
| **Optimistic update** | Update the UI first, confirm with the server afterwards |
| **Proxy** (formerly *middleware*) | Code that runs before a page request is completed |
| **Route handler** | A `route.js/ts` file: your API endpoint |
| **Dynamic route** | A folder like `[id]`; the URL part becomes a parameter |
| **Idempotent** | Doing it twice has the same result as doing it once |
| **XSS** | Cross-site scripting: an attacker gets their script to run on your page |
| **CSRF** | Cross-site request forgery: another site tricks your browser into sending a request |
| **NoSQL injection** | Sending an object (like `{"$ne": null}`) where a string is expected |

---

## 🔗 Further Reading, Watching & Practice

**Read**

| Topic | Source |
| :-- | :-- |
| Authentication in Next.js (sessions, proxy checks, data access layer) | [Next.js: Authentication guide](https://nextjs.org/docs/app/guides/authentication) |
| Why checks belong next to the data | [Next.js: Data security guide](https://nextjs.org/docs/app/guides/data-security) |
| The proxy file | [Next.js: Proxy](https://nextjs.org/docs/app/getting-started/proxy) |
| Route handlers and dynamic segments | [Next.js: Route Handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route) |
| Context, from the source | [React: Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context) |
| Cookies | [MDN: HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies) |
| Status codes (400, 401, 403, 404, 409) | [MDN: HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) |
| What is inside a JWT | [jwt.io: Introduction](https://jwt.io/introduction) |
| How to store passwords properly | [OWASP: Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) |
| `$addToSet`, `$pull`, `$inc` | [MongoDB: update operators](https://www.mongodb.com/docs/manual/reference/operator/update/addToSet/) |
| A real-world story: the middleware bypass | [Vercel: Postmortem on the Next.js middleware bypass](https://vercel.com/blog/postmortem-on-next-js-middleware-bypass) · [Simon Willison's summary](https://simonwillison.net/2025/Mar/23/nextjs-and-the-corrupt-middleware) |

**Watch**

- [Understanding JSON Web Tokens (Tech with Tim, 8 min)](https://www.youtube.com/watch?v=vLTJ_03Dq4M): what a JWT is, its structure and the signature
- *What Is JWT and Why Should You Use JWT* (Web Dev Simplified): a longer walkthrough with code. Search by title.
- *Authentication on the Web (Sessions, Cookies, JWT, localStorage, and more)* (Code Realm): compares the approaches we discussed in chapter 3. Search by title.

**Practice (free, hands-on)**

- [PortSwigger Web Security Academy: Access control](https://portswigger.net/web-security/access-control): labs on exactly the "who may do what" problem of chapter 6
- [PortSwigger: NoSQL injection](https://portswigger.net/web-security/nosql-injection): attack a MongoDB query yourself
- [PortSwigger: JWT attacks](https://portswigger.net/web-security/jwt): what goes wrong with badly verified tokens
- [OWASP Top 10: A01 Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/): the number one web vulnerability, and our layers 2 and 3 in a nutshell
