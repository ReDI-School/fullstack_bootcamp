# **Milestone 1 - Reference Guide: Next.js Basics & Twitter Clone**

## **📌 Key Concepts Covered**
This reference guide includes:
✔️ **Next.js App Router** structure and setup.  
✔️ **Fetching data in Server Components** for optimized performance.  
✔️ **Dynamic routing with `[id]` parameters** to create tweet pages.  
✔️ **Using `<Link>` for client-side navigation**.  

---

## **1️⃣ Setting Up Next.js Project**

To create a new Next.js project, use:

```bash
npx create-next-app@latest my-twitter-clone
cd my-twitter-clone
npm install
npm run dev
```

✅ **App runs at** `http://localhost:3000`  
✅ Uses **App Router instead of Page Router**  

---

## **2️⃣ Next.js Folder Structure**

```
my-twitter-clone/
├── app/
│   ├── layout.js    # Global layout (Header, Sidebar)
│   ├── page.js      # Homepage with tweet feed
│   ├── tweet/       # Route for individual tweets
│   │   ├── [id]/    # Dynamic route for each tweet
│   │   │   ├── page.js  # Single tweet page
├── components/      # Reusable UI components
│   ├── Header.js    # Top navigation bar
│   ├── TweetCard.js # Tweet component
│   ├── Footer.js    # Footer component
├── styles/          # Global CSS styling
│   ├── globals.css  # General styles
└── package.json     # Project dependencies
```

✅ **Modular and scalable project structure**  
✅ **Separates UI components from routing logic**  

---

## **3️⃣ Fetching Data in Next.js (Server Component)**
Fetching **tweets from an API** inside `app/page.js`:

```javascript
// app/page.js - Fetching tweets from DummyJSON API
async function getTweets() {
  const res = await fetch("https://dummyjson.com/posts");
  return res.json();
}

export default async function HomePage() {
  const tweets = await getTweets();

  return (
    <main>
      <h1>📝 Latest Tweets</h1>
      {tweets.posts.map((tweet) => (
        <p key={tweet.id}>{tweet.body}</p>
      ))}
    </main>
  );
}
```

✅ Fetches **before rendering**, improving performance.  
✅ No need for **`useEffect`**, since data is fetched **server-side**.  

---

## **4️⃣ Creating Dynamic Routes for Tweets**

Next.js automatically generates pages **dynamically** inside `app/tweet/[id]/page.js`:

```javascript
// app/tweet/[id]/page.js - Fetches a single tweet dynamically
async function getTweet(id) {
  const res = await fetch(`https://dummyjson.com/posts/${id}`);
  return res.json();
}

export default async function TweetDetail({ params }) {
  const tweet = await getTweet(params.id);

  return (
    <main>
      <h1>{tweet.title}</h1>
      <p>{tweet.body}</p>
      <p>👍 {tweet.reactions.likes} | 👎 {tweet.reactions.dislikes}</p>
    </main>
  );
}
```

✅ Uses `params.id` to **dynamically fetch the correct tweet**.  
✅ Works **without predefined routes**, making it fully scalable.  

---

## **5️⃣ Navigating Between Pages with `<Link>`**

Instead of `<a>`, we use `<Link>` to enable **client-side navigation**:

```javascript
// app/page.js - Adding clickable tweets
import Link from "next/link";
import TweetCard from "@/components/TweetCard";

async function getTweets() {
  const res = await fetch("https://dummyjson.com/posts");
  return res.json();
}

export default async function HomePage() {
  const tweets = await getTweets();

  return (
    <main>
      <h1>📝 Latest Tweets</h1>
      {tweets.posts.map((tweet) => (
        <Link key={tweet.id} href={`/tweet/${tweet.id}`}>
          <TweetCard tweet={tweet} />
        </Link>
      ))}
    </main>
  );
}
```

✅ Prevents **full page reloads**, keeping the app smooth.  
✅ Improves **performance and user experience**.  

---

## **6️⃣ Debugging Common Issues**

| ❌ Error | ✅ Solution |
|----------|------------|
| **Page reloads instead of smooth navigation** | Use `<Link>` instead of `<a>` |
| **"Cannot read properties of undefined"** | Ensure API response format matches expectations |
| **Data is fetched too often** | Move API calls inside Server Components |
| **Slow loading times** | Use `Suspense` with `fetch()` for better performance |

---

## **📌 Summary**

✔️ **Next.js App Router replaces traditional routing**.  
✔️ **Server Components improve performance & SEO**.  
✔️ **Dynamic routes allow automatic tweet pages**.  
✔️ **Client-side navigation (`<Link>`) ensures smooth UX**.  

---

## **📌 Next Steps (Milestone 2 Preview)**  
Next Milestone, we will:  
✔️ **Introduce Tailwind CSS** for styling the Twitter Clone.  
✔️ **Improve UI design and layout responsiveness**.  
✔️ **Make our app visually appealing and professional**.  

🚀 **Great job! Let’s build a beautiful UI next!**  

---

## **🔹 Additional Learning Resources**  
📘 **Next.js App Router Docs:** [https://nextjs.org/docs/app](https://nextjs.org/docs/app)  
📘 **Fetching Data in Next.js:** [https://nextjs.org/docs/app/building-your-application/data-fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)  
📘 **Dynamic Routes in Next.js:** [https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)  
