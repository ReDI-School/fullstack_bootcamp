# **Milestone 2: Props and State – Lesson (TypeScript Version)**

> 📘 This is the **TypeScript** version of the Milestone 2 lesson. The concepts are identical to the JavaScript version (`README.md`) – the difference is that we now add **types** to our props, state, and API data so that mistakes are caught *before* the code runs.
>
> **Starting a new project with TypeScript?** Use the Vite React + TypeScript template:
>
> ```sh
> npm create vite@latest my-app -- --template react-ts
> ```
>
> In a TypeScript project, component files use the **`.tsx`** extension (TypeScript + JSX) and plain logic files use **`.ts`**.

---

## **2.0 TypeScript Quick Primer for React**

Before diving in, here are the few TypeScript concepts we will use throughout this lesson.

### **Basic Types**

```ts
const name: string = "Alice";
const price: number = 19.99;
const isFavorite: boolean = false;
const tags: string[] = ["new", "sale"];
```

### **Interfaces (and Type Aliases)**

An **interface** describes the *shape* of an object. We will use interfaces to describe our **props** and our **API data**.

```ts
interface Product {
  id: number;
  title: string;
  price: number;
}
```

> 💡 `type` aliases (`type Product = { ... }`) work almost identically. In this course we use `interface` for object shapes.

### **Optional Properties and Union Types**

```ts
interface ButtonProps {
  label: string;
  disabled?: boolean; // optional → boolean | undefined
}

let product: Product | null = null; // union → either a Product or null
```

### **Generics**

Generics let a function work with different types. We will use them with `useState<T>`:

```ts
const [products, setProducts] = useState<Product[]>([]);
```

---

## **2.1 Introduction to Props**

### **What Are Props?**

In React, **props** (short for "properties") are used to pass data from a parent component to a child component. Props allow components to be **reusable** and **customizable**, enabling us to build dynamic user interfaces.

- Props are **immutable**, meaning they cannot be changed by the child component.
- Props allow us to make components more versatile by providing input values.
- In TypeScript, props are **typed**: the compiler checks that the parent passes the right props, with the right types.

### **How Props Work**

Props are passed to components as "attributes" in JSX. Inside the component, props can be accessed using the `props` object.

In TypeScript, we describe the shape of that object with an **interface**.

#### **Example**: Passing and Using Props

```tsx
// Describe the props the component expects
interface GreetingProps {
  name: string;
}

// Parent Component
function App() {
  return <Greeting name="Alice" />;
}

// Child Component
function Greeting(props: GreetingProps) {
  return <h1>Hello, {props.name}!</h1>;
}

export default App;
```

What TypeScript gives us for free:

```tsx
<Greeting name="Alice" />   // ✅ OK
<Greeting />                // ❌ Error: Property 'name' is missing
<Greeting name={42} />      // ❌ Error: Type 'number' is not assignable to type 'string'
<Greeting nme="Alice" />    // ❌ Error: Property 'nme' does not exist (typo caught!)
```

### **Destructuring Props**

For better readability, we can use **destructuring** to extract specific properties from the `props` object. The type annotation goes **after** the destructured object.

#### **Example**: Destructuring Props

```tsx
interface GreetingProps {
  name: string;
}

function Greeting({ name }: GreetingProps) {
  return <h1>Hello, {name}!</h1>;
}
```

### **When to Use Props**

- Use props when you want to pass data from a parent to a child component.
- Props are ideal for **display-only** components, such as cards, buttons, or headers.

### **Hands-On Exercise**

Try creating a **ProductCard** component that accepts props for a product's title, price, and image.

#### **Example**: ProductCard Component

```tsx
interface ProductCardProps {
  title: string;
  price: number;
  image: string;
}

function ProductCard({ title, price, image }: ProductCardProps) {
  return (
    <div>
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>${price}</p>
    </div>
  );
}
```

Props make this component reusable, as we can now create multiple `ProductCard` instances with different data – and TypeScript makes sure every instance receives valid data.

> 💡 **Tip – `React.FC`**: You may see components written as `const Greeting: React.FC<GreetingProps> = ...`. It works, but the modern recommendation is to simply type the props parameter as we did above.

---

### **Key Takeaways**

1. Props allow us to pass data to components and make them reusable.
2. They are **immutable** and should not be modified inside child components.
3. Use destructuring for cleaner and more readable code.
4. Use an **interface** to define the props a component accepts – TypeScript will then validate every usage.

---

## **2.2 Introduction to React Hooks**

### **What Are Hooks?**

Hooks are special functions in React that let you use features like **state** and **lifecycle methods** in functional components. They make React more powerful and simplify component logic.

#### **Why Hooks?**

- Before hooks, state and lifecycle methods were only available in class components.
- Hooks allow functional components to be dynamic and interactive.

### **The Most Common Hooks**

1. **`useState`**: Manages state within a component (covered in the next section). Accepts a **generic type** to describe the state.
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

```tsx
const [state, setState] = useState<StateType>(initialValue);
```

- `state`: The current value of the state.
- `setState`: A function to update the state.
- `initialValue`: The starting value of the state.
- `<StateType>`: The type of the state value (the **generic**).

#### **Type Inference vs. Explicit Types**

For simple values, TypeScript **infers** the type from the initial value, so you don't need to write it:

```tsx
const [count, setCount] = useState(0);        // inferred as number
const [name, setName] = useState("");         // inferred as string
const [isOpen, setIsOpen] = useState(false);  // inferred as boolean
```

You **must** provide the type explicitly when the initial value doesn't tell the full story, such as empty arrays or `null`:

```tsx
const [products, setProducts] = useState<Product[]>([]);        // empty array → needs a type
const [product, setProduct] = useState<Product | null>(null);   // null at first, Product later
```

> ⚠️ Without the generic, `useState([])` is inferred as `never[]` and `useState(null)` as `null`, which means you couldn't store any data in them later.

#### **Example**: Managing State in a Counter

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0); // Initialize state with 0 → inferred as number

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

```tsx
setCount("hello"); // ❌ Error: Argument of type 'string' is not assignable to parameter of type 'SetStateAction<number>'
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
| Typed with | `interface` / `type`  | `useState<Type>()`  |

---

### **Hands-On Exercise**

Update the **ProductCard** component to include a button that toggles whether the product is marked as "Favorite."

#### **Example**: Adding State to ProductCard

```tsx
import { useState } from "react";

interface ProductCardProps {
  title: string;
  price: number;
  image: string;
}

function ProductCard({ title, price, image }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false); // Initialize state → boolean

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

> 💡 Notice that `price.toFixed(2)` is only safe because `price` is typed as `number`. If `price` were a `string`, TypeScript would flag this line as an error.

---

### **Key Takeaways**

1. State is used to manage dynamic data that changes over time.
2. Use the `useState` hook to define and update state in functional components.
3. State enables components to become interactive and respond to user actions.
4. TypeScript infers simple state types, but you must pass a generic (`useState<Type>`) for arrays, objects, and `null`.

---

### **What Is `useEffect`?**

The `useEffect` hook lets you perform side effects in a functional component. It runs after the component renders.

#### **Syntax of `useEffect`**

```tsx
useEffect(() => {
  // Side effect logic here
}, [dependencyArray]);
```

- **Callback Function**: Contains the logic for the side effect.
- **Dependency Array**: Determines when the effect runs. An empty array (`[]`) ensures the effect runs only once after the initial render. Passing no array will trigger the callback function after every render (this should be avoided, as it might trigger unnecessary side effects).

> 💡 `useEffect` needs no extra type annotations. The only rule TypeScript enforces is that the callback must return either nothing or a cleanup function – **never a Promise**. This is why we can't write `useEffect(async () => { ... })` and instead define an `async` function **inside** the effect (as shown below).

#### **Example**: Using `useEffect` to Log a Message

```tsx
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

When fetching data in TypeScript, we first **describe the shape of the data** we expect from the API. The Fake Store API returns products that look like this:

```ts
// src/types.ts
export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}
```

> 💡 Putting shared types in a dedicated file (e.g., `src/types.ts`) lets every component import the same `Product` definition.

> ⚠️ `response.json()` returns `Promise<any>`, so TypeScript does **not** verify that the API really returns a `Product[]`. When we write `const data: Product[] = await response.json()`, we are *telling* TypeScript what to expect. The types are a contract for our code – not a runtime check.

#### **Example**: Fetching Products

```tsx
import { useState, useEffect } from "react";
import type { Product } from "../types";

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch("https://fakestoreapi.com/products");
      const data: Product[] = await response.json();
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

Thanks to the `Product` type, your editor now **autocompletes** `product.title`, `product.price`, etc. – and flags typos like `product.titel`.

---

### **Using Multiple `useEffect` Hooks**

You can use multiple `useEffect` hooks in the same component for different side effects.

#### **Example**: Logging and Fetching

```tsx
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
4. Define interfaces for your API data so that state, props, and JSX are all type-checked.

---

## **2.4 API Fetching and Integration**

### **What Is API Fetching?**

API (Application Programming Interface) fetching is the process of retrieving data from a server. In React, we commonly use the `fetch` API or libraries like Axios to make HTTP requests.

#### **Why API Fetching?**

- To display **dynamic data** in our applications.
- To interact with external services (e.g., product catalogs, user data).

---

### **Steps to Fetch Data**

1. Define a **type** (interface) describing the data returned by the API.
2. Use the `fetch` function or an equivalent library to make a request to an API endpoint.
3. Parse the response and extract the data.
4. Update the component state (typed with the same interface) with the fetched data.

#### **Example**: Basic Fetch Workflow

```tsx
useEffect(() => {
  fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((data: Product[]) => console.log(data));
}, []);
```

---

### **Practical Integration: Product List**

Let's integrate API fetching into our e-commerce application to dynamically display products.

#### **Steps**:

1. Fetch data from the **Fake Store API**: `https://fakestoreapi.com/products`.
2. Store the product data in state using the `useState<Product[]>` hook.
3. Display the data using the `map` function.

#### **Example**: Fetching and Displaying Products

```tsx
import { useState, useEffect } from "react";
import type { Product } from "../types";

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]); // Initialize state for products
  const [loading, setLoading] = useState(true); // Track loading state → boolean

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data: Product[] = await response.json();
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
    - Remember: in TypeScript, the `error` in a `catch` block is of type `unknown`. Check its type before using its properties.

   ```tsx
   const [error, setError] = useState<string | null>(null);

   // inside the catch block:
   catch (err) {
     setError(err instanceof Error ? err.message : "Something went wrong");
   }

   // in the JSX:
   if (error) return <p>Error loading data: {error}</p>;
   ```

2. **Use Loading States**:

    - Display a loading spinner or message while waiting for the data.

3. **Avoid Infinite Loops**:

    - Ensure the `useEffect` dependency array is configured correctly.

4. **Check `response.ok`**:

    - `fetch` does **not** throw on HTTP errors like 404 or 500. Check `response.ok` and throw manually if needed.

   ```tsx
   const response = await fetch("https://fakestoreapi.com/products");
   if (!response.ok) {
     throw new Error(`Request failed with status ${response.status}`);
   }
   ```

---

### **Key Takeaways**

1. API fetching enables data integration into React applications.
2. Use `useEffect` for fetching data after the component mounts.
3. Always handle errors and loading states for a better user experience.
4. Type your API responses with interfaces and your state with `useState<Type>`.

---

## **What Have We Learned?**

Over the course of this lesson, we explored several fundamental concepts in React that allow us to create dynamic and interactive applications. Here's a summary:

1. **Props**:

    - Enable parent components to pass data to child components.
    - Immutable, making components reusable and predictable.
    - Typed with interfaces, so incorrect usage is caught at compile time.

2. **Hooks**:

    - Bring powerful features to functional components.
    - `useEffect` helps manage side effects, such as data fetching.

3. **State**:

    - Local to a component and mutable, enabling dynamic behavior.
    - Managed using the `useState` hook, typed with generics when needed.

4. **API Fetching**:
    - Integrates external data into our application using the `fetch` API.
    - Requires proper handling of errors, loading states, and performance considerations.
    - Response data is described with interfaces (e.g., `Product`).

---

### **Why These Concepts Matter**

- Props and state form the core of React's data flow.
- Hooks simplify component logic, making it easier to write and maintain.
- API fetching allows us to integrate real-world data and build meaningful applications.
- TypeScript makes all of the above safer, self-documenting, and easier to refactor.

---

### **Next Steps**

In the next lesson, we will dive deeper into **React Router**, **global state management**, and error handling, expanding our e-commerce project to include routing and advanced interactivity.

Stay curious, and keep practicing! 🚀

---

# **Milestone 2.5: React – Routing, API Fetching, and State Management (TypeScript)**

## **Overview**

In **Milestone 2.5**, we are advancing our React-based **e-commerce App** by adding:

✅ **Routing with React Router** → Multiple pages in our app  
✅ **Fetching data from an API** → Using the Fake Store API  
✅ **Dynamic State Updates** → Managing data and rendering updates  
✅ **Type Safety with TypeScript** → Typed props, state, and API data

This Milestone builds upon **Milestone 1**, transforming our static product listings into a functional app.

---

## **Learning Objectives**

1. **Implement Client-Side Routing** with `React Router`
2. **Fetch Data from an API** and display product information
3. **Create Dynamic Product Pages** that update based on user selection
4. **Manage State** to track and display cart items
5. **Type** components, state, route params, and API responses with TypeScript

---

## **Project Outcome**

At the end of this Milestone, students will have:  
- 🚀 **A working multi-page e-commerce app** that fetches product data  
- 🛒 **Users can browse products and view details with React Router**
- 🔗 **Each product has a dedicated page**
- 🚀 **Cart updates in real-time as users add items**
- 🛡️ **A fully typed codebase** that catches errors at compile time

---

## **Project Breakdown**

### **0️⃣ Shared Types**

👉 Create `src/types.ts` so every file uses the same `Product` definition:

```ts
// src/types.ts
export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}
```

---

### **1️⃣ Setting Up Routing with React Router**

👉 First, install `react-router-dom` (it ships with its own TypeScript types – no `@types` package needed):

```sh
npm install react-router-dom
```

👉 Update `App.tsx` to include the **Router and Routes**:

```tsx
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

```tsx
// src/pages/HomePage.tsx
import { useState, useEffect } from "react";
import type { Product } from "../types";

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data));
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

👉 Use **React Router Params** to load product details dynamically.

`useParams` returns route params as `string | undefined`, so we guard against a missing `id` before fetching:

```tsx
// src/pages/ProductDetails.tsx
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Product } from "../types";

function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!id) return; // id could be undefined

    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((data: Product) => setProduct(data));
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

> 💡 Because `product` is typed as `Product | null`, TypeScript **forces** us to handle the `null` case (`if (!product) return ...`) before accessing `product.title`. After that check, TypeScript knows `product` is a `Product`. This is called **type narrowing**.

---

### **4️⃣ Managing State for the Cart**

👉 Update `App.tsx` to manage cart state globally. We type the cart as `Product[]`, and we describe the props that `HomePage` now receives:

```tsx
// src/App.tsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductDetails from "./pages/ProductDetails";
import type { Product } from "./types";

function App() {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product): void => {
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

👉 Since `HomePage` now receives an `addToCart` function, we **must** update its props – otherwise TypeScript will report an error in `App.tsx` (`Property 'addToCart' does not exist on type 'IntrinsicAttributes'`). A function prop is typed with its **signature**:

```tsx
// src/pages/HomePage.tsx
import { useState, useEffect } from "react";
import type { Product } from "../types";

interface HomePageProps {
  addToCart: (product: Product) => void;
}

function HomePage({ addToCart }: HomePageProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data));
  }, []);

  return (
    <div>
      <h1>Product List</h1>

      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.title}</h2>
          <p>${product.price}</p>
          <button onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

export default HomePage;
```

---

## **Common TypeScript Errors (and What They Mean)**

| Error message | Likely cause | Fix |
| --- | --- | --- |
| `Property 'x' is missing in type ... but required in type 'Props'` | A required prop was not passed | Pass the prop, or mark it optional with `?` |
| `Type 'string' is not assignable to type 'number'` | Wrong value type passed to a prop or state setter | Convert the value (e.g., `Number(value)`) or fix the type |
| `Argument of type 'X' is not assignable to parameter of type 'never'` | `useState([])` without a generic | Use `useState<Product[]>([])` |
| `'product' is possibly 'null'` | Accessing a `T \| null` value without checking | Add a guard: `if (!product) return ...` |
| `Argument of type 'string \| undefined' is not assignable to parameter of type 'string'` | `useParams` values may be `undefined` | Guard with `if (!id) return;` |
| `'err' is of type 'unknown'` | Using properties of a caught error directly | Narrow it: `err instanceof Error` |

---

## **Bonus Challenge**

- ✅ Add a **Cart Page** with a list of all items that were inserted in the cart (hint: pass `cart` as a typed prop: `cart: Product[]`)
- ✅ Implement a **"Remove from Cart"** button (hint: `removeFromCart: (id: number) => void`)
- ✅ Enhance UI with **Tailwind CSS**
- ✅ Extract the fetching logic into a **typed custom hook**, e.g. `useProducts(): { products: Product[]; loading: boolean; error: string | null }`

---

## **Resources**

1. [React Router Documentation](https://reactrouter.com/)
2. [MDN Guide on Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
3. [JavaScript State Management](https://react.dev/learn/state-management)
4. [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
5. [React Docs – Using TypeScript](https://react.dev/learn/typescript)
6. [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
