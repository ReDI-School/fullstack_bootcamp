# **Milestone 2: React – Routing, API Fetching, and State Management**

## **Overview**
In **Milestone 2**, we are advancing our React-based **E-commerce App** by adding:
✅ **Routing with React Router** → Multiple pages in our app  
✅ **Fetching real data from an API** → Using the Fake Store API  
✅ **Dynamic State Updates** → Managing data and rendering updates  

This Milestone builds upon **Milestone 1**, transforming our static product listings into a fully functional app.

---

## **Learning Objectives**
1. **Implement Client-Side Routing** with `React Router`
2. **Fetch Data from an API** and display real-time product information
3. **Create Dynamic Product Pages** that update based on user selection
4. **Manage State** to track and display cart items

---

## **Project Outcome**
At the end of this Milestone, students will have:  
🚀 **A working multi-page E-commerce app** that fetches live product data  
🛒 **A cart system that updates dynamically**  
🔗 **Navigation between pages with React Router**  

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

## **Expected Output**

- 🛒 **Users can browse products and view details dynamically**
- 🔗 **Each product has a dedicated page**
- 🚀 **Cart updates in real-time as users add items**

---

## **Bonus Challenge**
✅ Add a **Cart Page**  
✅ Implement a **"Remove from Cart"** button  
✅ Enhance UI with **Tailwind CSS**  

---

## **Resources**
1. [React Router Documentation](https://reactrouter.com/)
2. [MDN Guide on Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
3. [JavaScript State Management](https://react.dev/learn/state-management)
