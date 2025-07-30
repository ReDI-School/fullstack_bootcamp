# **Milestone 3: Context API, State Management & Error Handling**

## **Overview**

In this Milestone, we will refine our **e-commerce UI** by introducing **global state management using the Context API** and improving **error handling**. By using the Context API, we can efficiently manage shared state across components, such as user authentication, cart management, and theme settings.

Additionally, we will implement robust **error handling techniques** to improve the reliability of our application.

---

## **Learning Objectives**

1. **Global State Management with Context API**

   - Understand the benefits of global state in React applications.
   - Learn how to create and use the **Context API** to manage shared data.
   - Implement a **Cart Context** to manage the shopping cart state.

2. **Error Handling in React**

   - Learn best practices for handling **errors in API calls**.
   - Implement fallback UI for failed API requests.

3. **Refactoring the e-commerce Project**
   - Replace prop drilling with Context API.
   - Improve the user experience with proper error handling.
   - Optimize API requests for better performance.

## **Project Enhancements**

We will **upgrade the existing e-commerce UI** from Milestone 2 by:

1. **Using Context API** for managing the cart state.
2. **Handling API errors gracefully** using error boundaries and try/catch blocks.
3. **Refactoring state management** to make the app more scalable.

---

## **Why Use Context API?**

React’s **prop drilling** can make state management difficult when multiple components need access to the same state. The **Context API** allows us to create a **global store** that provides data to any component without needing to pass props manually.

---

## **Steps to Complete**

### **1. Implement Global State Management with Context API**

We will define a **Cart Context** that manages the cart items and provides functions to add or remove products.

#### useConext():

`useContext()` is a React Hook that allows you to share data globally across components, without passing props manually at every level.

Normally in React, we pass data from parent to child components using props. But when the same data is needed by many components across different levels of the tree, prop drilling becomes messy.

In such cases, `useContext()` is a cleaner and more efficient solution. It allows any component to access context values directly, no matter how deep it is in the component tree.

> Instead of manually passing props through many layers, we can wrap components with a `Context.Provider` and consume that context anywhere using the `useContext()` hook.

**Below one is a basic example, just to give an idea of how the useContext is working.**

### Example 1: pass simple data type in Context

**Step 1: create Context**

Add following code to `src/common.js`

```javascript
// import createContext function from react
import { createContext } from "react";

//create ThemeContext context,
//🔔 pay attention as we pass default values
export const ThemeContext = createContext("red");
```

**Step 2: use that Context and also update it**

Add following code to `src/ThemeUpdateComponent.js`

```javascript
import { useContext, useState } from "react";
import { ThemeContext } from "./common";
import ThemeUseComponent from "./ThemeUseComponent";

// we are updating the ThemeContext value and also reading it
export default function ThemeUpdateComponent() {
  let value = useContext(ThemeContext);
  let [textColor, setColor] = useState(value);
  //using ThemeContext -> color in p tag style
  //updating color on button click
  return (
    <ThemeContext value={textColor}>
      <p style={{ color: textColor }}>Parent Component</p>
      <ThemeUseComponent />
      <button
        onClick={() => {
          setColor(textColor === "green" ? "red" : "green");
        }}
      >
        {textColor === "green" ? "Red" : "Green"} Color
      </button>
    </ThemeContext>
  );
}
```

**Step 3: use Context in child component**
Add following code to `src/ThemeUseComponent.js`

```javascript
import { ThemeContext } from "./common";
import { useContext } from "react";

export default function ThemeUseComponent() {
  let value = useContext(ThemeContext);

  return <p style={{ color: value }}>Child Component: My color is {value}</p>;
}
```

**Step 4: Add our main Component to App.jsx file**
Add following to `src/App.jsx`

```javascript
import "./App.css";
import ThemeUpdateComponent from "./ThemeUpdateComponent";

function App() {
  return (
    <>
      <h1>useContext()</h1>
      <ThemeUpdateComponent />
    </>
  );
}

export default App;
```

### Example 2: Pass object in Context

**Step 1: Create a file `src/common.js` and initialize contexts**

> When creating context we added the default values for theme. Keep an eye on the object key name "theme" as we will use the same name when use context

```javascript
import { createContext } from "react";

export const ThemeContextUpdated = createContext({
  theme: {
    bgColor: "#dedede",
    textColor: "black",
    themeType: "light",
  },
  setValue: () => {},
});
```

**Step 2: Use Context and update their values**

`src/ThemeUpdateCompUpdated.jsx`

```javascript
import { useContext, useState } from "react";
import { ThemeContextUpdated } from "./common";
import ThemeUseComponentUpdated from "./ThemeUseComponentUpdated";

// we are updating the ThemeContext value and also reading it
export default function ThemeUpdateCompUpdated() {
  //key point: 🔔 Pay attention to {theme}
  //the name should be same what we declared in createContext
  let { theme } = useContext(ThemeContextUpdated);
  let [themeState, setTheme] = useState(theme);

  function updateTheme() {
    let newTheme = { ...themeState }; //spread operator

    if (newTheme.themeType === "light") {
      newTheme.themeType = "dark";
      newTheme.textColor = "#fff";
      newTheme.bgColor = "#333";
    } else {
      newTheme.themeType = "light";
      newTheme.textColor = "#000";
      newTheme.bgColor = "#dedede";
    }

    setTheme(newTheme);
  }

  return (
    //key point: name of the value object needs to be same as we declared in createContext
    <ThemeContextUpdated value={{ theme: themeState, setTheme }}>
      <div style={{ backgroundColor: themeState.bgColor, padding: "20px" }}>
        <p style={{ color: themeState.textColor }}>Parent Component</p>
        <ThemeUseComponentUpdated />
        <button
          onClick={() => {
            updateTheme();
          }}
        >
          Change Theme
        </button>
      </div>
    </ThemeContextUpdated>
  );
}
```

**Step 3: Child component using context**

`src/ThemeUpdateCompUpdated.jsx`

```javascript
import { ThemeContextUpdated } from "./common";
import { useContext } from "react";

export default function ThemeUseComponentUpdated() {
  // 🔔 The name that we passed as key in context
  // <ThemeContextUpdated value={{ theme: themeState, setTheme }}>
  let { theme } = useContext(ThemeContextUpdated);
  return (
    <p style={{ color: theme.textColor }}>
      Child Component: My color is {theme.textColor}, Theme: {theme.themeType}
    </p>
  );
}
```

**Step 4: Add main component to app.jsx**

`src/App.jsx`

```javascript
import "./App.css";

import ThemeUpdateCompUpdated from "./ThemeUpdateCompUpdated";

function App() {
  return (
    <>
      <h1>useContext()</h1>
      <ThemeUpdateCompUpdated />
    </>
  );
}

export default App;
```

---

**CartContext.js**

As new documentation of React `CartContext.Provider` might change with `CartContext`

```javascript
import { createContext, useState, useContext } from "react";

// Create a context
const CartContext = createContext();

// Cart Provider Component
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook for using cart context
export function useCart() {
  return useContext(CartContext);
}
```

**Usage in App.js**

```javascript
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import Main from "./components/Main";

function App() {
  return (
    <CartProvider>
      <Header />
      <Main />
    </CartProvider>
  );
}

export default App;
```

---

### **2. Implement Error Handling in API Requests**

We will improve our **fetch logic** by handling API errors.

**Updating Main.jsx**

```javascript
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

function Main() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) throw new Error("Failed to load products");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default Main;
```

---

## **Expected Outcome**

1. **Cart State Management:** Products added to the cart remain accessible throughout the app.
2. **Error Handling:** API errors display user-friendly messages instead of crashing the app.
3. **Code Refactoring:** Cleaner and more modular structure using **Context API**.

---

## **Bonus Challenge**

1. Allow users to **update product quantities** in the cart.
2. Implement **local storage** to persist cart items across page reloads.
3. Show a **loading spinner** instead of just text while fetching data.

---

## **Resources**

1. [React Context API Guide](https://react.dev/reference/react/createContext)
2. [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

---

## **Next Steps**

In **Milestone 4**, we will **recap all the fundamental React concepts** and **optimize our application further**. We will also discuss **best practices** to write clean and maintainable React code.

🚀 **Great work! Keep building!**


# **Milestone 3.1: Advanced React Concepts – Lesson**

## **3.1 Error Handling in React**

### **Why Is Error Handling Important?**

Errors are inevitable in software development. In React applications, error handling ensures that:

- The user experience is not interrupted by unexpected errors.
- Developers can debug issues effectively.
- The application gracefully recovers from errors.

---

### **Error Handling in API Calls**

When fetching data, handle errors using `try...catch` or `.catch()`.

#### **Example**: Handling API Errors

```jsx
useEffect(() => {
  async function fetchData() {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(true);
    }
  }
  fetchData();
}, []);

if (error) return <p>Error loading products. Please try again.</p>;
```

---

### **Best Practices for Error Handling**

1. **Fallback UI**:

   - Always provide a fallback UI for critical errors.
   - Example: Display a friendly error message or a "Try Again" button.

2. **Error Logging**:

   - Use tools like Sentry or LogRocket for error monitoring.

3. **Granular Boundaries**:
   - Use multiple Error handling messages or codes to localize errors and prevent breaking the entire application.

---

### **Key Takeaways**

1. Handle API errors gracefully with `try...catch` or `.catch()`.
2. Always provide fallback UI to enhance user experience.

---

# **3.2 Advanced React Concepts – Lesson**

## **Overview**

This Milestone, we will enhance the e-commerce application by implementing two important features:

1. **Search Functionality**: Allow users to search for products by name.
2. **Category Filters**: Enable users to filter products based on specific categories.

These features will improve the user experience and introduce key React concepts such as state management and dynamic rendering.

---

## **Concepts Covered**

1. **State Management with useState**:

   - Track user input and selected categories using state.

2. **Dynamic Filtering**:

   - Use filtering logic to dynamically update the product list.

3. **Event Handling**:
   - Implement `onChange` handlers for real-time updates.

---

## **Feature 1: Search Functionality**

### **Objective**

The search functionality allows users to filter products by typing into a search bar. We will use the `useState` hook to track the search term and filter the product list dynamically.

### **Implementation Steps**

1. **Create a State Variable**:
   Use `useState` to store the search term entered by the user.

   ```jsx
   const [searchTerm, setSearchTerm] = useState("");
   ```

2. **Handle Input Changes**:
   Update the state as the user types in the search bar.

   ```jsx
   function handleSearch(event) {
     setSearchTerm(event.target.value.toLowerCase());
   }
   ```

3. **Render a Search Bar**:
   Add an input field above the product list.

   ```jsx
   <input
     type="text"
     placeholder="Search products..."
     value={searchTerm}
     onChange={handleSearch}
   />
   ```

---

## **Feature 2: Category Filters**

### **Objective**

The filter functionality allows users to filter products by category. We will use a dropdown menu to display category options.

### **Implementation Steps**

1. **Create a State Variable**:
   Use `useState` to store the selected category.

   ```jsx
   const [selectedCategory, setSelectedCategory] = useState("");
   ```

2. **Handle Filter Changes**:
   Update the state when a user selects a category.

   ```jsx
   function handleFilterChange(event) {
     setSelectedCategory(event.target.value);
   }
   ```

3. **Render a Dropdown Menu**:
   Add a dropdown menu above the product list.

   ```jsx
   <select value={selectedCategory} onChange={handleFilterChange}>
     <option value="">All Categories</option>
     <option value="electronics">Electronics</option>
     <option value="jewelery">Jewelery</option>
     <option value="men's clothing">Men's Clothing</option>
     <option value="women's clothing">Women's Clothing</option>
   </select>
   ```

---

## **Combining Search and Filters**

To filter the products dynamically based on both the search term and the selected category:

1. **Apply Filtering Logic**:
   Use the `.filter()` method to apply both criteria.

   ```jsx
   const filteredProducts = products.filter((product) => {
     const matchesSearch = product.title.toLowerCase().includes(searchTerm);
     const matchesCategory = selectedCategory
       ? product.category === selectedCategory
       : true;

     return matchesSearch && matchesCategory;
   });
   ```

2. **Render Filtered Products**:
   Display only the products that match the criteria.

   ```jsx
   <div className="products-grid">
     {filteredProducts.map((product) => (
       <div key={product.id} className="product-card">
         <img src={product.image} alt={product.title} />
         <h3>{product.title}</h3>
         <p>${product.price}</p>
       </div>
     ))}
   </div>
   ```

---

## **Key Takeaways**

1. The `useState` hook is a powerful tool for managing local state in functional components.
2. Combining multiple states allows for dynamic and user-friendly features.
3. React's event handling makes it easy to update the UI in real-time.

---

## **Next Steps**

In the next Milestone, we will begin transitioning the e-commerce application to Next.js, exploring features like server-side rendering (SSR) and API routes.

---

## **3.3 Intro to Next.js**

### **What Is Next.js?**

Next.js is a **React framework** that provides additional features and optimizations for building web applications. It is widely used for its ability to render content on the server and its simplified file-based routing system.

#### **Core Features of Next.js**:

1. **Server-Side Rendering (SSR)**:

   - Renders pages on the server and sends the HTML to the client.
   - Improves performance and SEO.

2. **Static Site Generation (SSG)**:

   - Generates static HTML during build time for fast page loads.

3. **File-Based Routing**:

   - Simplifies routing by using the file system.

4. **API Routes**:
   - Enables building APIs directly within the Next.js application.

---

### **Why Use Next.js?**

- **SEO-Friendly**: SSR ensures that pages are indexed effectively by search engines.
- **Faster Performance**: SSG and SSR reduce load times for users.
- **Developer Experience**: Built-in features like routing and API integration save time.

---

### **How Next.js Differs from React**

| Feature                  | React            | Next.js       |
| ------------------------ | ---------------- | ------------- |
| Rendering                | Client-Side Only | SSR, SSG, CSR |
| Routing                  | Custom Solutions | File-Based    |
| Performance Optimization | Manual           | Automatic     |

---

### **Setting Up a Next.js Project**

1. **Install Next.js**:
   Run the following command to create a new Next.js project:

   ```bash
   npx create-next-app my-next-app
   cd my-next-app
   ```

2. **Start the Development Server**:

   ```bash
   npm run dev
   ```

3. **Project Structure**:
   - `pages/`: Contains all the routes for the application.
   - `public/`: Static assets like images.
   - `styles/`: CSS and styling files.

---

### **Example: File-Based Routing**

Create a new file in the `pages/` directory to define a route.

#### **Code Example**:

```jsx
// pages/about.js
function AboutPage() {
  return <h1>About Us</h1>;
}

export default AboutPage;
```

Navigate to `http://localhost:3000/about` to see the route in action.

---

### **Server-Side Rendering in Next.js**

To implement SSR, use the `getServerSideProps` function in your component.

#### **Code Example**:

```jsx
export async function getServerSideProps() {
  const response = await fetch("https://fakestoreapi.com/products");
  const products = await response.json();

  return { props: { products } };
}

function ProductsPage({ products }) {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.title}</li>
      ))}
    </ul>
  );
}

export default ProductsPage;
```

---

### **Best Practices for Next.js**

1. **Optimize Images**:

   - Use the `<Image>` component for better performance.

2. **Prefetch Routes**:

   - Use `Link` for client-side navigation with prefetching.

3. **Use Environment Variables**:
   - Store sensitive information like API keys securely.

---

### **Key Takeaways**

1. Next.js enhances React with SSR, SSG, and file-based routing.
2. It simplifies common tasks like routing and API integration.
3. Ideal for applications where performance and SEO are priorities.

---

## **What Have We Learned?**

This Milestone, we expanded the functionality of our e-commerce application by introducing two new features:

1. **Search Functionality**:

   - Users can dynamically search for products by typing into a search bar.
   - We used the `useState` hook to track the search term and update the product list in real-time.

2. **Category Filters**:
   - Users can filter products by selecting a category from a dropdown menu.
   - We combined the selected category with the search term to refine the product list.

---

## **Key Takeaways**

1. **State Management**:

   - The `useState` hook is essential for managing local component state in React.
   - Multiple state variables can be combined to create powerful filtering logic.

2. **Dynamic Rendering**:

   - Using `.filter()` allows us to dynamically update the UI based on user input.

3. **Event Handling**:
   - React's event handling system (`onChange`) enables real-time updates for search and filter functionality.

---

## **Next Steps**

Next Milestone, we will:

1. Transition the e-commerce project to Next.js, learning about server-side rendering (SSR) and static site generation (SSG).
2. Explore how to integrate APIs with Next.js for enhanced performance and SEO.

---

Congratulations on completing Milestone 3! Keep practicing and building on your React skills as we dive into advanced topics in the next lesson.

---
