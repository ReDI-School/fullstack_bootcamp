# **Glossary (Next.js, Tailwind CSS, NoSQL & MongoDB)**

This glossary provides definitions and explanations for key terms introduced. It serves as a reference for students working with **Next.js, Tailwind CSS, and NoSQL databases (MongoDB).**

---

## **1. Next.js Fundamentals**

### **Next.js**

A **React framework** for building full-stack applications with **server-side rendering (SSR)**, **static site generation (SSG)**, and **API routes**.

### **App Router**

The modern Next.js routing system that organizes files inside the `app/` directory, replacing the traditional `pages/` directory.

### **Routing (File-Based Routing)**

In Next.js, each file inside the `app/` directory automatically becomes a **route**. Example:

```
/app/page.js → "/" (Home page)
/app/about/page.js → "/about" (About page)
```

### **API Routes**

Server-side functions inside the `app/api/` directory that act as backend endpoints.

```js
export async function GET(req) {
  return new Response(JSON.stringify({ message: "Hello API!" }), {
    status: 200,
  });
}
```

### **useState Hook**

A React hook for managing **component-level state**.

```js
const [count, setCount] = useState(0);

<button onClick={() => setCount(count + 1)}>Increase</button>;
```

### **useEffect Hook**

A React hook that runs **side effects** in components (e.g., fetching data, updating the DOM).

```js
useEffect(() => {
  console.log("Component Mounted!");
}, []);
```

---

## **2. Tailwind CSS (Utility-First CSS Framework)**

### **Utility-First CSS**

A styling approach where **predefined classes** control the layout and appearance of elements.

Example:

```html
<button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700">
  Click Me
</button>
```

### **Flexbox Utilities**

Used for creating **responsive layouts**. Example:

```html
<div class="flex items-center justify-between">
  <div>Left Content</div>
  <div>Right Content</div>
</div>
```

### **Grid Utilities**

Used for **grid-based layouts**.

```html
<div class="grid grid-cols-3 gap-4">
  <div class="bg-gray-200 p-4">1</div>
  <div class="bg-gray-200 p-4">2</div>
  <div class="bg-gray-200 p-4">3</div>
</div>
```

### **Responsiveness in Tailwind**

Tailwind provides **mobile-first responsive classes**:

- `sm:` (small screens)
- `md:` (medium screens)
- `lg:` (large screens)

Example:

```html
<p class="text-sm md:text-lg lg:text-xl">Responsive Text</p>
```

---

## **3. NoSQL & MongoDB Basics**

### **MongoDB**

A **NoSQL document database** that stores data as **JSON-like documents** instead of tables.

### **Collections & Documents**

- **Collection** → A group of related data (like a table in SQL).
- **Document** → A single entry (like a row in SQL). Example:

```json
{
  "title": "The Lord of the Rings",
  "author": "J.R.R. Tolkien",
  "publishedYear": 1954
}
```

### **Mongoose**

An **ODM (Object Data Modeling) library** for MongoDB and Node.js, providing schema-based models.

### **CRUD Operations**

- **C**reate (`POST`)
- **R**ead (`GET`)
- **U**pdate (`PUT`)
- **D**elete (`DELETE`)

### **Example: Create a MongoDB Schema**

```js
import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: Number,
});

export default mongoose.models.Book || mongoose.model("Book", BookSchema);
```

### **Connecting MongoDB in Next.js**

```js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

export default connectDB;
```

---

## **4. Common Errors & Fixes**

### ❌ **Error: MongoDB URI is Undefined**

**Cause:** Missing `.env.local` file.  
✅ **Fix:** Add `MONGODB_URI` to `.env.local`:

```env
MONGODB_URI=mongodb+srv://yourUser:yourPassword@cluster.mongodb.net/myDatabase
```

### ❌ **Error: Model Not Found in Mongoose**

**Cause:** Incorrect schema definition.  
✅ **Fix:** Use:

```js
mongoose.models.Book || mongoose.model("Book", BookSchema);
```

### ❌ **Error: CORS Issues in API Requests**

**Cause:** Fetching data from a different domain without proper headers.  
✅ **Fix:** Enable CORS in API routes:

```js
export async function GET(req) {
  return new Response(JSON.stringify({ message: "Hello" }), {
    status: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}
```

---

## **5. Additional Resources**

📌 **Next.js Official Docs** → [Next.js Docs](https://nextjs.org/docs)  
📌 **Tailwind CSS Guide** → [Tailwind Docs](https://tailwindcss.com/docs)  
📌 **MongoDB Atlas** → [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)  
📌 **Mongoose Documentation** → [Mongoose Docs](https://mongoosejs.com/docs/)  
📌 **Postman for API Testing** → [Postman](https://www.postman.com/)

---

## **Final Notes**

By mastering the concepts covered in these Milestones, students are now equipped to:

✅ Build a **full-stack web app** with Next.js  
✅ Style UI using **Tailwind CSS**  
✅ Integrate **MongoDB as a NoSQL database**  
✅ Perform **CRUD operations** with API routes

🚀 **Next Up → Milestone 1: Authentication & User Profiles with Next.js & MongoDB!**
