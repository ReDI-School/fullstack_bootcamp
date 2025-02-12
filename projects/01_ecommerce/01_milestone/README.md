# **Milestone 1: Introduction to React – Milestone Guide**

## **Overview**
In Milestone 1, you will take your first steps into **React.js**, one of the most popular JavaScript libraries for building user interfaces. You will learn how to set up a React project, understand components, and build a basic UI structure using React’s core principles.

This milestone is a **basic e-commerce UI**, where you will build reusable components such as a **Header, Main Content, and Product Listing**.

---

## **Learning Objectives**
1. **Understand the Basics of React**:
   - What is React and why use it?
   - Key features and advantages of React.

2. **Project Setup**:
   - Using Vite to create a React application.
   - Understanding the folder structure of a React project.

3. **React Components**:
   - Understanding the concept of **components**.
   - Difference between **functional** and **class-based** components.
   - Creating and using basic React components.

4. **JSX (JavaScript XML)**:
   - What is JSX and how does it work?
   - Writing HTML-like syntax in JavaScript.

5. **Props and State (Introduction)**:
   - Passing data between components using **props**.
   - Managing local component state with **useState**.

---

## **Example from Milestone 1 Project: E-commerce UI**

### **Project Setup**

We created a new React project using Vite:

```sh
npm create vite@latest my-ecommerce-app --template react
cd my-ecommerce-app
npm install
npm run dev
```

### **Component Structure**

In this project, we broke the UI into **reusable components**. The main structure includes:

📂 **Project Structure**
```
/src
 ├── /components
 │   ├── Header.jsx
 │   ├── Main.jsx
 │   ├── ProductCard.jsx
 ├── App.jsx
 ├── index.css
```

### **Header Component Example**

The `Header.jsx` component displays the store's title and a navigation bar with a cart counter.

```jsx
function Header({ cartCount }) {
  return (
    <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">My E-Commerce Store</h1>
      <nav className="flex items-center space-x-6">
        <button className="bg-blue-600 py-1 px-3 rounded hover:bg-blue-700">
          View Cart ({cartCount})
        </button>
      </nav>
    </header>
  );
}

export default Header;
```

### **Main Component Example**

The `Main.jsx` component fetches products and displays them using the `ProductCard` component.

```jsx
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

function Main({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading products...</p>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))
        )}
      </section>
    </main>
  );
}

export default Main;
```

### **Adding Interactivity with `useState`**

We used React's `useState` hook to manage the shopping cart.

```jsx
import { useState } from "react";
import Header from "./components/Header";
import Main from "./components/Main";

function App() {
  const [cart, setCart] = useState([]);

  function handleAddToCart(product) {
    setCart((prevCart) => [...prevCart, product]);
  }

  return (
    <div>
      <Header cartCount={cart.length} />
      <Main onAddToCart={handleAddToCart} />
    </div>
  );
}

export default App;
```

### **Styling the Project**

We applied basic styles using `index.css`:

```css
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f9;
  color: #333;
}
```

---

## **Expected Outcome**
By the end of Milestone 1, you should have:
✅ A working **React project** with a simple e-commerce UI.  
✅ A basic understanding of **React components, JSX, and state management**.  
✅ The ability to **fetch and display data dynamically** using the Fake Store API.  

---

## **Bonus Challenge**
- Improve the **product card design** using CSS.  
- Add a **"Remove from Cart"** feature.  
- Implement a **product search bar**.  

---

## **Resources**
1. [React Docs - Introduction](https://react.dev/)
2. [JSX Guide](https://react.dev/learn/writing-markup-with-jsx)
3. [State Management](https://react.dev/reference/react/useState)
4. [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

---

📌 **Next Step → Milestone 2: State and Props in React**

