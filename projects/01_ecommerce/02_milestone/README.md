# **Milestone 2: Props and State – Lesson**

## **2.1 Introduction to Props**

### **What Are Props?**

In React, **props** (short for "properties") are used to pass data from a parent component to a child component. Props allow components to be **reusable** and **customizable**, enabling us to build dynamic user interfaces.

- Props are **immutable**, meaning they cannot be changed by the child component.
- Props allow us to make components more versatile by providing input values.

### **How Props Work**

Props are passed to components as "attributes" in JSX. Inside the component, props can be accessed using the `props` object.

#### **Example**: Passing and Using Props

```jsx
// Parent Component
function App() {
  return <Greeting name="Alice" />;
}

// Child Component
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

export default App;
```

### **Destructuring Props**

For better readability, we can use **destructuring** to extract specific properties from the `props` object.

#### **Example**: Destructuring Props

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

### **When to Use Props**

- Use props when you want to pass data from a parent to a child component.
- Props are ideal for **display-only** components, such as cards, buttons, or headers.

### **Hands-On Exercise**

Try creating a **ProductCard** component that accepts props for a product's title, price, and image.

#### **Example**: ProductCard Component

```jsx
function ProductCard({ title, price, image }) {
  return (
    <div>
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>${price}</p>
    </div>
  );
}
```

Props make this component reusable, as we can now create multiple `ProductCard` instances with different data.

---

### **Key Takeaways**

1. Props allow us to pass data to components and make them reusable.
2. They are **immutable** and should not be modified inside child components.
3. Use destructuring for cleaner and more readable code.

---

## **2.2 Introduction to React Hooks**

### **What Are Hooks?**

Hooks are special functions in React that let you use features like **state** and **lifecycle methods** in functional components. They make React more powerful and simplify component logic.

#### **Why Hooks?**

- Before hooks, state and lifecycle methods were only available in class components.
- Hooks allow functional components to be dynamic and interactive.

### **The Most Common Hooks**

1. **`useState`**: Manages state within a component (covered in the previous section).
2. **`useEffect`**: Handles **side effects**, such as data fetching, subscriptions, or manual DOM updates.

---

## **2.3 Introduction to State**

### **What Is State?**

In React, **state** refers to data that is managed inside a component and can change over time. Unlike props, which are passed from a parent component, state is **local** to the component.

- State is **mutable**, meaning it can be updated by the component itself.
- It is often used to handle dynamic data, such as user input or API responses.

### **How to Use State**

To manage state in a functional component, React provides the **`useState`** hook.

#### **Syntax of `useState`**

```jsx
const [state, setState] = useState(initialValue);
```

- `state`: The current value of the state.
- `setState`: A function to update the state.
- `initialValue`: The starting value of the state.

#### **Example**: Managing State in a Counter

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0); // Initialize state with 0

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
}

export default Counter;
```

### **When to Use State**

- Use state to track **dynamic data** that changes during the lifecycle of a component.
- Examples of state usage:
    - Handling user input (e.g., form fields).
    - Toggling UI elements visibility and options (e.g., modals, dropdowns).
    - Storing data fetched from APIs.

### **Props vs. State**

| Feature    | Props                 | State               |
| ---------- | --------------------- | ------------------- |
| Ownership  | Passed by parent      | Managed locally     |
| Mutability | Immutable             | Mutable             |
| Purpose    | Pass data to children | Handle dynamic data |

---

### **Hands-On Exercise**

Update the **ProductCard** component to include a button that toggles whether the product is marked as "Favorite."

#### **Example**: Adding State to ProductCard

```jsx
import { useState } from "react";

function ProductCard({ title, price, image }) {
  const [isFavorite, setIsFavorite] = useState(false); // Initialize state

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <img src={image} alt={title} className="w-32 h-32 object-cover mb-4" />
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-gray-600">${price.toFixed(2)}</p>
      <button
        onClick={() => setIsFavorite(!isFavorite)} // Toggle state
        className={`mt-2 py-1 px-3 rounded ${
          isFavorite ? "bg-red-500" : "bg-gray-300"
        }`}
      >
        {isFavorite ? "Unfavorite" : "Favorite"}
      </button>
    </div>
  );
}
```

---

### **Key Takeaways**

1. State is used to manage dynamic data that changes over time.
2. Use the `useState` hook to define and update state in functional components.
3. State enables components to become interactive and respond to user actions.

---

### **What Is `useEffect`?**

The `useEffect` hook lets you perform side effects in a functional component. It runs after the component renders.

#### **Syntax of `useEffect`**

```jsx
useEffect(() => {
  // Side effect logic here
}, [dependencyArray]);
```

- **Callback Function**: Contains the logic for the side effect.
- **Dependency Array**: Determines when the effect runs. An empty array (`[]`) ensures the effect runs only once after the initial render. Passing no array will trigger the callback function after every render (this should be avoided, as it might trigger unnecessary side effects).

#### **Example**: Using `useEffect` to Log a Message

```jsx
import { useEffect } from "react";

function Logger() {
  useEffect(() => {
    console.log("Component has been rendered!");
  }, []); // Runs only once

  return <h1>Check your console!</h1>;
}

export default Logger;
```

---

### **Fetching Data with `useEffect`**

One of the most common use cases for `useEffect` is **fetching data** from an API.

#### **Example**: Fetching Products

```jsx
import { useState, useEffect } from "react";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      setProducts(data);
    }

    fetchProducts();
  }, []); // Runs only once

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.title}</li>
      ))}
    </ul>
  );
}

export default ProductList;
```

---

### **Using Multiple `useEffect` Hooks**

You can use multiple `useEffect` hooks in the same component for different side effects.

#### **Example**: Logging and Fetching

```jsx
useEffect(() => {
  console.log("Component mounted!");
}, []);

useEffect(() => {
  console.log("Component re-rendered!");
});
```

---

### **Key Takeaways**

1. Hooks bring state and lifecycle methods to functional components.
2. The `useEffect` hook is essential for managing side effects.
3. Dependency arrays control when effects are executed, ensuring efficient rendering.

---

## **2.4 API Fetching and Integration**

### **What Is API Fetching?**

API (Application Programming Interface) fetching is the process of retrieving data from a server. In React, we commonly use the `fetch` API or libraries like Axios to make HTTP requests.

#### **Why API Fetching?**

- To display **dynamic data** in our applications.
- To interact with external services (e.g., product catalogs, user data).

---

### **Steps to Fetch Data**

1. Use the `fetch` function or an equivalent library to make a request to an API endpoint.
2. Parse the response and extract the data.
3. Update the component state with the fetched data.

#### **Example**: Basic Fetch Workflow

```jsx
useEffect(() => {
  fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((data) => console.log(data));
}, []);
```

---

### **Practical Integration: Product List**

Let’s integrate API fetching into our e-commerce application to dynamically display products.

#### **Steps**:

1. Fetch data from the **Fake Store API**: `https://fakestoreapi.com/products`.
2. Store the product data in state using the `useState` hook.
3. Display the data using the `map` function.

#### **Example**: Fetching and Displaying Products

```jsx
import { useState, useEffect } from "react";

function ProductList() {
  const [products, setProducts] = useState([]); // Initialize state for products
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        setProducts(data); // Update state with fetched products
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    }

    fetchProducts();
  }, []); // Run once after component mounts

  return (
    <div>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>{product.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProductList;
```

---

### **Best Practices for API Fetching**

1. **Handle Errors Gracefully**:

    - Use `try...catch` blocks or `.catch()` for error handling.
    - Provide fallback UI for error states.

   ```jsx
   if (error) return <p>Error loading data.</p>;
   ```

2. **Use Loading States**:

    - Display a loading spinner or message while waiting for the data.

3. **Avoid Infinite Loops**:

    - Ensure the `useEffect` dependency array is configured correctly.

---

### **Key Takeaways**

1. API fetching enables data integration into React applications.
2. Use `useEffect` for fetching data after the component mounts.
3. Always handle errors and loading states for a better user experience.

---

## **What Have We Learned?**

Over the course of this lesson, we explored several fundamental concepts in React that allow us to create dynamic and interactive applications. Here's a summary:

1. **Props**:

    - Enable parent components to pass data to child components.
    - Immutable, making components reusable and predictable.

2. **Hooks**:

    - Bring powerful features to functional components.
    - `useEffect` helps manage side effects, such as data fetching.

3. **State**:

    - Local to a component and mutable, enabling dynamic behavior.
    - Managed using the `useState` hook.

4. **API Fetching**:
    - Integrates external data into our application using the `fetch` API.
    - Requires proper handling of errors, loading states, and performance considerations.

---

### **Why These Concepts Matter**

- Props and state form the core of React's data flow.
- Hooks simplify component logic, making it easier to write and maintain.
- API fetching allows us to integrate real-world data and build meaningful applications.

---

### **Next Steps**

In the next lesson, we will dive deeper into **React Router**, **global state management**, and error handling, expanding our e-commerce project to include routing and advanced interactivity.

Stay curious, and keep practicing! 🚀

---

# **Milestone 2.5: React – Routing, API Fetching, and State Management**

## **Overview**

In **Milestone 2.5**, we are advancing our React-based **e-commerce App** by adding:

✅ **Routing with React Router** → Multiple pages in our app  
✅ **Fetching data from an API** → Using the Fake Store API  
✅ **Dynamic State Updates** → Managing data and rendering updates

This Milestone builds upon **Milestone 1**, transforming our static product listings into a functional app.

---

## **Learning Objectives**

1. **Implement Client-Side Routing** with `React Router`
2. **Fetch Data from an API** and display product information
3. **Create Dynamic Product Pages** that update based on user selection
4. **Manage State** to track and display cart items

---

## **Project Outcome**

At the end of this Milestone, students will have:  
- 🚀 **A working multi-page e-commerce app** that fetches product data  
- 🛒 **Users can browse products and view details with React Router**
- 🔗 **Each product has a dedicated page**
- 🚀 **Cart updates in real-time as users add items**

---

## **Project Breakdown**

### **1️⃣ Setting Up Routing with React Router**

👉 First, install `react-router-dom`:

```sh
npm install react-router-dom
```

👉 Update `App.jsx` to include the **Router and Routes**:

```jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductDetails from "./pages/ProductDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
```

---

### **2️⃣ Fetching Product Data from an API**

👉 Use **Fake Store API** to load product data dynamically:

```js
import { useState, useEffect } from "react";

function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div>
      <h1>Product List</h1>

      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.title}</h2>
          <p>${product.price}</p>
        </div>
      ))}
      
    </div>
  );
}

export default HomePage;
```

---

### **3️⃣ Creating a Dynamic Product Page**

👉 Use **React Router Params** to load product details dynamically:

```js
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h1>{product.title}</h1>
      <img src={product.image} alt={product.title} />
      <p>{product.description}</p>
      <p>${product.price}</p>
    </div>
  );
}

export default ProductDetails;
```

---

### **4️⃣ Managing State for the Cart**

👉 Update `App.jsx` to manage cart state globally:

```js
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductDetails from "./pages/ProductDetails";

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage addToCart={addToCart} />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
```

---

## **Bonus Challenge**

- ✅ Add a **Cart Page** with a list of all items that were inserted in the cart
- ✅ Implement a **"Remove from Cart"** button  
- ✅ Enhance UI with **Tailwind CSS**

---

## **Resources**

1. [React Router Documentation](https://reactrouter.com/)
2. [MDN Guide on Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
3. [JavaScript State Management](https://react.dev/learn/state-management)
