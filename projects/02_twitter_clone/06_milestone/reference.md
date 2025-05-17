# **Reference Guide: Milestones 5 - 7**

## **📌 Overview**
This document serves as a reference for the key concepts, techniques, and resources covered in Milestones 5 - 7 of the Bootcamp. It includes essential links, commands, and explanations of the most important topics.

---

## **🛠️ Next.js Fundamentals (Milestone 1)**
### 🔹 File-Based Routing in Next.js
- Pages are created automatically based on the file structure inside the `app/` directory.
- Example: Dynamic User Profile (`app/user/[id]/page.js`)
```jsx
export default function UserProfile({ params }) {
  return <h1>Profile of User {params.id}</h1>;
}
```

### 🔹 API Routes in Next.js
- Next.js allows us to create API endpoints within the project.
- Example: Fetching Users (`app/api/users/route.js`)
```js
export async function GET() {
  const response = await fetch("https://dummyjson.com/users");
  const data = await response.json();
  return Response.json(data.users);
}
```

🔗 **Official Docs**: [Next.js Routing](https://nextjs.org/docs/routing/introduction)  

---

## **🎨 Tailwind CSS & UI Design (Milestone 2)**
### 🔹 Installing Tailwind CSS in Next.js
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
- Configure `tailwind.config.js`:
```js
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
```

### 🔹 Using Tailwind Utility Classes
- Example: Responsive Tweet Card
```jsx
<div className="bg-white shadow-md p-4 rounded-lg hover:shadow-lg transition-all">
  <h3 className="text-lg font-bold">Tweet Title</h3>
  <p className="text-gray-600">This is a sample tweet.</p>
</div>
```

🔗 **Official Docs**: [Tailwind CSS Guide](https://tailwindcss.com/docs)  

---

## **🔗 API Integration & Authentication (Milestone 3)**
### 🔹 Fetching Data from an API
Example: Fetching tweets from **DummyJSON API**
```js
fetch("https://dummyjson.com/posts")
  .then((res) => res.json())
  .then((data) => console.log(data.posts));
```

### 🔹 Authentication in Next.js
We implemented **global authentication state** using context:
```js
const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
```
🔗 **Official Docs**: [Next.js Authentication](https://next-auth.js.org/getting-started/introduction)  

---

## **📚 Additional Resources**
🔹 **Next.js Docs:** [https://nextjs.org/docs](https://nextjs.org/docs)  
🔹 **Tailwind CSS Docs:** [https://tailwindcss.com/docs](https://tailwindcss.com/docs)  
🔹 **DummyJSON API:** [https://dummyjson.com/](https://dummyjson.com/)  
🔹 **NextAuth.js:** [https://next-auth.js.org/](https://next-auth.js.org/)  

