# **Milestone 1 - Teacher Guide: Next.js Basics & Twitter Clone**

## **📌 Teaching Objectives**
This Milestone, students will:
✔️ Understand the **Next.js App Router structure**.  
✔️ Learn to **fetch and display tweets dynamically** using API calls.  
✔️ Implement **dynamic routing** for individual tweet pages.  
✔️ Use **Server Components** for efficient data fetching.  

---

## **1️⃣ Lesson Breakdown**
### **A. Understanding Next.js App Router**
1. Explain how **Next.js manages routing** using `app/` directory.  
2. Compare it to traditional React `pages/` routing.  
3. Discuss **why Server Components are useful** (better performance, SEO).  

Example prompt for discussion:
- "How is Next.js different from traditional React routing?"
- "Why is it better to fetch data on the server instead of the client?"

---

### **B. Fetching Tweets from an API**
1. Show how to **fetch data inside a Server Component**.  
2. Explain **why we use async functions in Server Components**.  
3. Demonstrate how **tweets are rendered dynamically** in `app/page.js`.  

Example Code:
```javascript
// app/page.js - Fetches tweets from API
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
✅ Ensures tweets are **pre-fetched before rendering**.  
✅ Reduces **client-side load**.  

Discussion prompts:
- "Why do we fetch data inside a Server Component instead of using `useEffect`?"
- "What are the benefits of Server Components in Next.js?"

---

### **C. Creating a Dynamic Route for Tweets**
1. Explain **how Next.js handles dynamic routes**.  
2. Show how the `[id]` folder structure generates dynamic tweet pages.  
3. Walk through `app/tweet/[id]/page.js` where individual tweet details are displayed.  

Example Code:
```javascript
// app/tweet/[id]/page.js - Fetches details for a single tweet
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
✅ Uses `params.id` to **fetch and display the correct tweet** dynamically.  
✅ Eliminates **hardcoded routes**, making the app scalable.  

Discussion prompts:
- "How does Next.js generate pages dynamically?"
- "What happens if a tweet doesn’t exist? How can we handle errors?"

---

## **2️⃣ Common Pitfalls**
⚠️ **Students forget `async` in Server Components**  
✔️ Ensure API functions are wrapped in `async function getTweets()`.

⚠️ **Page reloads instead of smooth navigation**  
✔️ Use `<Link>` instead of `<a>` for navigation.

⚠️ **"Cannot read properties of undefined" error**  
✔️ Ensure API response matches expected format (`posts`, `id`, etc.).

---

## **3️⃣ Discussion Points**
💬 **Concepts to reinforce**:
✔️ Difference between **static and dynamic routes**.  
✔️ When to use **Server Components vs. Client Components**.  
✔️ The advantages of **fetching data inside the server**.  

Example Questions:
- "How would you modify this project to support user profiles?"
- "What are the limitations of static pages in a social app?"

---

## **4️⃣ Summary & Next Steps**
✅ Next.js App Router simplifies **file-based routing**.  
✅ Server Components enable **faster loading and better SEO**.  
✅ Dynamic routes allow us to **create scalable social apps**.  

📌 **Next Milestone (Milestone 2)**:
✔️ **Introducing Tailwind CSS for UI design**  
✔️ **Improving the Twitter Clone layout and responsiveness**  
✔️ **Enhancing the app's visual appeal and structure**  

---

## **🔹 Additional Resources**
📘 **Next.js Routing Docs:** [https://nextjs.org/docs/app/building-your-application/routing](https://nextjs.org/docs/app/building-your-application/routing)  
📘 **Fetching Data in Next.js:** [https://nextjs.org/docs/app/building-your-application/data-fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)  
📘 **Dynamic Routes in Next.js:** [https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)  
