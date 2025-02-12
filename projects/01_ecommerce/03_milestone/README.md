# **Milestone 3: Context API, State Management & Error Handling**

## **Overview**
This Milestone, we will refine our **E-commerce UI** by introducing **global state management using the Context API** and improving **error handling**. By using the Context API, we can efficiently manage shared state across components, such as user authentication, cart management, and theme settings.

Additionally, we will implement robust **error handling techniques** to improve the reliability of our application.

---

## **Learning Objectives**
1. **Global State Management with Context API**
   - Understand the benefits of global state in React applications.
   - Learn how to create and use the **Context API** to manage shared data.
   - Implement a **Cart Context** to manage the shopping cart state.

2. **Error Handling in React**
   - Learn best practices for handling **errors in API calls**.
   - Use **error boundaries** to catch UI-related errors.
   - Implement fallback UI for failed API requests.

3. **Refactoring the E-commerce Project**
   - Replace prop drilling with Context API.
   - Improve the user experience with proper error handling.
   - Optimize API requests for better performance.

---

## **Why Use Context API?**
React’s **prop drilling** can make state management difficult when multiple components need access to the same state. The **Context API** allows us to create a **global store** that provides data to any component without needing to pass props manually.

---

## **Project Enhancements**
We will **upgrade the existing E-commerce UI** from Milestone 2 by:
1. **Using Context API** for managing the cart state.
2. **Handling API errors gracefully** using error boundaries and try/catch blocks.
3. **Refactoring state management** to make the app more scalable.

---

## **Steps to Complete**

### **1. Implement Global State Management with Context API**
We will define a **Cart Context** that manages the cart items and provides functions to add or remove products.

**CartContext.js**
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

### **3. Using an Error Boundary**
React **Error Boundaries** allow us to **catch runtime errors** and display a fallback UI instead of crashing the entire app.

**Creating ErrorBoundary.jsx**
```javascript
import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong. Please try again later.</h2>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

**Using Error Boundary in App.js**
```javascript
import ErrorBoundary from "./components/ErrorBoundary";
import Main from "./components/Main";

function App() {
  return (
    <ErrorBoundary>
      <Main />
    </ErrorBoundary>
  );
}

export default App;
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
2. [Handling API Errors in React](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
3. [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

---

## **Next Steps**
In **Milestone 4**, we will **recap all the fundamental React concepts** and **optimize our application further**. We will also discuss **best practices** to write clean and maintainable React code.

🚀 **Great work! Keep building!**
