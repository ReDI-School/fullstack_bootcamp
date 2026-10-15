# Milestone 3: Context API, Error Handling, Search & Filters, and a First Look at Next.js (TypeScript version)

> **Which README should I follow?**
> This is the TypeScript (`.tsx`) version of Milestone 3. The JavaScript version is in [README.md](./README.md). The concepts are identical; the code examples, file extensions and type annotations differ. Pick one version and stick with it.
>
> This milestone continues the **Vite + React + TypeScript** project from the previous milestones (parts 1 to 3). Part 4 starts a separate, new Next.js project.

## Overview

In this milestone we refine our **e-commerce app** in four steps:

1. **Global state with the Context API**: a typed cart that every component can use without prop drilling.
2. **Error handling**: show friendly messages when API calls fail, and stop one broken component from taking down the whole page.
3. **Search and category filters**: dynamic rendering driven by state.
4. **A first look at Next.js**: a React framework that is TypeScript-first.

---

## Learning Objectives

1. **Global state management with the Context API**
   - Understand why global state helps, and when it does not.
   - Create typed contexts, providers and custom hooks.
   - Build a **Cart Context** and replace prop drilling with it.

2. **Error handling in React**
   - Handle errors in API calls with `try...catch` and show a fallback UI.
   - Use an error boundary for errors that happen while rendering.

3. **Dynamic rendering**
   - Combine `useState` with `.filter()` to build search and category filters.
   - Type event handlers.

4. **Next.js basics**
   - Know what Next.js adds to React.
   - Create a TypeScript Next.js project and a first route.

---

## Sections

- [Part 1: Global state with the Context API](#part-1-global-state-with-the-context-api)
- [Part 2: Error handling](#part-2-error-handling)
- [Part 3: Search and category filters](#part-3-search-and-category-filters)
- [Part 4: A first look at Next.js](#part-4-a-first-look-at-nextjs)
- [What have we learned?](#what-have-we-learned)

---

## Part 1: Global state with the Context API

### Why Context?

So far, data moves **down** the component tree through props. That works well until many components at different levels need the same data. Imagine the cart: the `Header` shows how many items are in it, every `ProductCard` has an "Add to Cart" button, and later a cart page lists the items. Passing `cart` and `addToCart` through every level in between is called **prop drilling**, and it gets messy quickly.

The **Context API** lets a component *provide* a value, and any component below it in the tree *consume* that value directly, no matter how deep it is.

```
App
└── CartProvider          ← provides { cart, addToCart, removeFromCart }
    ├── Header            ← reads cart.length
    └── Main
        └── ProductCard   ← calls addToCart(product)
```

> **Use Context for state that is truly shared** (cart, theme, logged-in user). State that only one component needs should stay local with `useState`. Also remember that when a context value changes, every component that consumes it re-renders. For a small app like ours that is perfectly fine.

### Context in three parts

Every context we build follows the same three-part pattern:

1. **The context**: created with `createContext`.
2. **The provider**: a component that holds the state and makes it available to its `children`.
3. **A custom hook**: a small function (like `useCart()`) that components use to read the context.

> **Generics:** in TypeScript, the `<...>` after a function name (like `createContext<Theme>(...)` or `useState<Product[]>([])`) tells TypeScript which type that function should work with. You will see this a lot in this milestone.

> **React 19 note:** since React 19 you can render the context itself as the provider: `<CartContext value={...}>`. Older tutorials write `<CartContext.Provider value={...}>`, which still works. Check your `package.json` for `"react": "^19..."`.

---

### Example 1: sharing a simple value

A context holding one simple value: a text colour. The context file has no JSX in it, so it ends in `.ts`.

**src/context/ColorContext.ts**
```ts
import { createContext } from "react";

export type TextColor = "red" | "green";

// "red" is the default value, used when no provider is above the component.
export const ColorContext = createContext<TextColor>("red");
```

The **provider** side: a parent that owns the state and provides it.

**src/components/ColorSwitcher.tsx**
```tsx
import { useState } from "react";
import { ColorContext, type TextColor } from "../context/ColorContext";
import ColoredText from "./ColoredText";

export default function ColorSwitcher() {
  // The generic is needed: without it, TypeScript would infer plain `string`
  const [color, setColor] = useState<TextColor>("red");

  return (
    <ColorContext value={color}>
      <p style={{ color }}>Parent component</p>
      <ColoredText />
      <button onClick={() => setColor(color === "green" ? "red" : "green")}>
        Switch to {color === "green" ? "red" : "green"}
      </button>
    </ColorContext>
  );
}
```

The **consumer** side: a child that reads the value with `useContext`.

**src/components/ColoredText.tsx**
```tsx
import { useContext } from "react";
import { ColorContext } from "../context/ColorContext";

export default function ColoredText() {
  const color = useContext(ColorContext);

  return <p style={{ color }}>Child component: my colour is {color}</p>;
}
```

Notice that `ColoredText` receives **no props**, yet always shows the current colour. Try passing `"blue"` to `setColor` and read the error TypeScript gives you.

**src/App.tsx** (to try it out)
```tsx
import ColorSwitcher from "./components/ColorSwitcher";

function App() {
  return (
    <>
      <h1>useContext()</h1>
      <ColorSwitcher />
    </>
  );
}

export default App;
```

---

### Example 2: sharing an object, plus a function to update it

Real contexts usually share **an object that contains both data and functions**. We describe its shape with an `interface`, and move the state into a dedicated **provider component** with a **custom hook**. This is the pattern we will reuse for the cart.

**src/context/ThemeContext.tsx**
```tsx
import { createContext, useContext, useState, type ReactNode } from "react";

export interface Theme {
  bgColor: string;
  textColor: string;
  themeType: "light" | "dark";
}

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const lightTheme: Theme = { bgColor: "#dedede", textColor: "#000", themeType: "light" };
const darkTheme: Theme = { bgColor: "#333", textColor: "#fff", themeType: "dark" };

// No sensible default exists outside a provider, so the default is `undefined`
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(lightTheme);

  const toggleTheme = () => {
    setTheme((current) => (current.themeType === "light" ? darkTheme : lightTheme));
  };

  return <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>;
}

// Custom hook: components call useTheme() instead of useContext(ThemeContext)
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used inside a <ThemeProvider>");
  }
  return context;
}
```

Three TypeScript details to notice:

- `ReactNode` is the type of "anything React can render" and is the standard type for `children`.
- `createContext<ThemeContextValue | undefined>(undefined)` says: "the value is either our object or `undefined`".
- The `if (context === undefined) throw ...` check does two jobs. It gives a clear error if you forget the provider, and it **narrows** the type, so `useTheme()` returns `ThemeContextValue` and not `ThemeContextValue | undefined`. Components never have to check for `undefined` themselves.

A component that uses the hook:

**src/components/ThemedBox.tsx**
```tsx
import { useTheme } from "../context/ThemeContext";

export default function ThemedBox() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ backgroundColor: theme.bgColor, color: theme.textColor, padding: "20px" }}>
      <p>Current theme: {theme.themeType}</p>
      <button onClick={toggleTheme}>Change theme</button>
    </div>
  );
}
```

**src/App.tsx** (to try it out)
```tsx
import { ThemeProvider } from "./context/ThemeContext";
import ThemedBox from "./components/ThemedBox";

function App() {
  return (
    <ThemeProvider>
      <ThemedBox />
    </ThemeProvider>
  );
}

export default App;
```

---

### The real thing: a Cart Context

Now we apply the same pattern to the e-commerce app.

#### Step 1: Describe the data

The Fake Store API returns products shaped like this. Put the type in `src/types.ts`:

```ts
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

> If your `Product` type from earlier milestones used `name` instead of `title`, update it to match the API data used here.

#### Step 2: Create the Cart Context

**src/context/CartContext.tsx**
```tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "../types";

interface CartContextValue {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  return (
    <CartContext value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext>
  );
}

// Custom hook for using the cart
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used inside a <CartProvider>");
  }
  return context;
}
```

> Three things to be aware of:
> - `useState<Product[]>([])` needs its generic. Without it, TypeScript infers `never[]` (an array that can hold nothing), and `setCart` would complain.
> - Because the same product can be added several times, `removeFromCart` removes **all** copies of that product. Tracking a quantity per product is one of the bonus challenges.
> - Your editor may show a yellow "Fast refresh only works when a file only exports components" warning, because this file exports both a component and a hook. For this course you can ignore it. Larger projects usually put the hook in its own file.

#### Step 3: Wrap the app in the provider

**src/App.tsx**
```tsx
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

Everything inside `<CartProvider>` can now call `useCart()`.

#### Step 4: Use the cart

The `Header` shows how many items are in the cart:

**src/components/Header.tsx**
```tsx
import { useCart } from "../context/CartContext";

function Header() {
  const { cart } = useCart();

  return (
    <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">My E-Commerce Store</h1>
      <nav>
        <a href="/" className="text-white mr-4 hover:underline">Home</a>
        <a href="/products" className="text-white mr-4 hover:underline">Products</a>
        <span className="font-semibold">Cart ({cart.length})</span>
      </nav>
    </header>
  );
}

export default Header;
```

The `ProductCard` takes a whole `Product` and adds it to the cart:

**src/components/ProductCard.tsx**
```tsx
import type { Product } from "../types";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="p-4 bg-white shadow-md rounded-lg border-t-4 border-blue-500 flex flex-col">
      <img src={product.image} alt={product.title} className="h-40 object-contain mb-4" />
      <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{product.title}</h3>
      <p className="text-green-600 font-semibold mt-2">${product.price.toFixed(2)}</p>
      <div className="mt-auto pt-4">
        <button
          onClick={() => addToCart(product)}
          className="w-full bg-blue-500 text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
```

> No prop was passed from `App` through `Main` to `ProductCard` to make this work. That is the whole point of Context.

#### Checkpoint

- Clicking "Add to Cart" increases the number in the header.
- Remove `<CartProvider>` from `App.tsx` temporarily and read the error from `useCart()`. Then put it back.
- **Your turn:** the cart exists but you cannot see its contents yet. Create a `Cart` component that lists `cart` items with a "Remove" button that calls `removeFromCart`, and render it somewhere in `App.tsx` (it must be inside `<CartProvider>`).

---

## Part 2: Error handling

### Why is error handling important?

Errors are inevitable: the network drops, the API is down, the data looks different than expected. Good error handling means:

- the user is never left staring at a blank screen,
- developers can find out what went wrong,
- the app recovers or degrades gracefully.

### Handling errors in API calls

Our `Main` component fetches the products. It keeps track of **three things**: the data, whether we are still loading, and whether something went wrong.

**src/components/Main.tsx**
```tsx
import { useEffect, useState } from "react";
import type { Product } from "../types";
import ProductCard from "./ProductCard";

function Main() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
          throw new Error(`Failed to load products (status ${response.status})`);
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) return <p className="p-6 text-center text-gray-600">Loading...</p>;
  if (error) return <p className="p-6 text-center text-red-600">Error: {error}</p>;

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </main>
  );
}

export default Main;
```

Let's go through the parts that are new in TypeScript:

| Code | Why |
|---|---|
| `useState<Product[]>([])` | Without the generic, TypeScript would infer `never[]` |
| `useState<string \| null>(null)` | Without the generic, TypeScript would infer plain `null` and `setError("...")` would be an error |
| `err instanceof Error ? err.message : "..."` | In a `catch` block, `err` has the type `unknown`: anything can be thrown in JavaScript. You must check what it is before using `.message` |
| `const data: Product[] = await response.json()` | `response.json()` returns `any`. We tell TypeScript what to expect |

> **Important:** types exist only at compile time. `const data: Product[]` is a *promise from you* to TypeScript, not a check. If the API sends something different, TypeScript will not notice. Libraries like Zod can validate data at runtime; you may meet them later.

> **`fetch` does not throw on HTTP errors.** A `404` or `500` response is a "successful" request as far as `fetch` is concerned. That is why we check `response.ok` and throw ourselves.

### Error boundaries: when `try...catch` is not enough

`try...catch` only protects the code *inside* it (like the fetch). It cannot catch an error that happens while React is **rendering**. For example, if one product were missing its `rating`, the code `product.rating.rate` would throw during rendering and, by default, the whole app would turn into a blank page.

An **error boundary** is a component that catches errors in the components below it and shows a fallback UI instead. React's built-in version has to be written as a class, so most projects use the small library `react-error-boundary`:

```bash
npm install react-error-boundary
```

**src/components/ErrorFallback.tsx**
```tsx
import type { FallbackProps } from "react-error-boundary";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    <div role="alert" className="p-6 text-center">
      <p className="text-red-600 font-semibold">Something went wrong:</p>
      <pre className="text-sm text-gray-600 my-2">{message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Try again
      </button>
    </div>
  );
}

export default ErrorFallback;
```

**src/App.tsx**
```tsx
import { ErrorBoundary } from "react-error-boundary";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import Main from "./components/Main";
import ErrorFallback from "./components/ErrorFallback";

function App() {
  return (
    <CartProvider>
      <Header />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Main />
      </ErrorBoundary>
    </CartProvider>
  );
}

export default App;
```

Notice that the boundary wraps only `<Main />`. If the product list breaks, the `Header` (with the cart count) stays alive. Place boundaries close to the part of the UI that can fail, not only at the very top.

**Try it:** temporarily add `throw new Error("Boom");` at the start of the `ProductCard` function and look at the result. Remove it afterwards.

### Best practices

1. **Fallback UI**: always show something useful for critical failures: a friendly message, and where possible a "Try again" button.
2. **Granular boundaries**: put error handling around separate parts of the page (product list, cart, ...) so one failure does not break everything.
3. **Error logging**: `console.error` is fine for development. In production, use a monitoring tool such as Sentry or LogRocket to learn about errors your users hit.
4. **Be honest and helpful in messages**: tell users what happened and what they can do, not a raw stack trace.

---

## Part 3: Search and category filters

We now add two features to the product list in `Main.tsx`: a **search bar** and a **category dropdown**. Both rely on `useState` and on one important idea: the filtered list is **not stored in state**. It is *calculated* from the full list and the current filter values on every render.

### Step 1: State for the filters

```tsx
const [searchTerm, setSearchTerm] = useState("");
const [selectedCategory, setSelectedCategory] = useState("");
```

No generics are needed here: `useState("")` makes TypeScript infer `string`.

### Step 2: Typed event handlers

When the user types, the input fires a change event. In TypeScript we describe that event with the type `ChangeEvent`, with the kind of element in `< >`:

```tsx
import { type ChangeEvent } from "react";

function handleSearch(event: ChangeEvent<HTMLInputElement>) {
  setSearchTerm(event.target.value);
}

function handleFilterChange(event: ChangeEvent<HTMLSelectElement>) {
  setSelectedCategory(event.target.value);
}
```

| Event | Type |
|---|---|
| Typing in an `<input>` | `ChangeEvent<HTMLInputElement>` |
| Choosing in a `<select>` | `ChangeEvent<HTMLSelectElement>` |
| Clicking a `<button>` | `MouseEvent<HTMLButtonElement>` |
| Submitting a `<form>` | `FormEvent<HTMLFormElement>` |

> When you write the handler **inline** (`onChange={(e) => setSearchTerm(e.target.value)}`), TypeScript infers the event type for you. You only write the type yourself when you define the handler as a separate function, like above.

> We store the text exactly as typed and make it lowercase only when **comparing**. If you lowercased it in the handler, the input would show the user's text in lowercase while they type.

### Step 3: The inputs

```tsx
<input
  type="text"
  placeholder="Search products..."
  value={searchTerm}
  onChange={handleSearch}
  className="flex-1 p-2 rounded border border-gray-300 bg-white"
/>

<select
  value={selectedCategory}
  onChange={handleFilterChange}
  className="p-2 rounded border border-gray-300 bg-white"
>
  <option value="">All categories</option>
  {categories.map((category) => (
    <option key={category} value={category}>
      {category}
    </option>
  ))}
</select>
```

### Step 4: Derive the categories and the filtered list

```tsx
// Unique categories, taken from the data (no hardcoded list needed)
const categories = [...new Set(products.map((product) => product.category))];

const filteredProducts = products.filter((product) => {
  const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesCategory = selectedCategory === "" || product.category === selectedCategory;
  return matchesSearch && matchesCategory;
});
```

`new Set(...)` removes duplicates, and the spread `[...]` turns it back into an array. Because `products` is a `Product[]`, TypeScript knows that `product.title` is a string and `categories` is a `string[]`.

### The complete `Main.tsx`

> **Rule of hooks:** every `useState` and `useEffect` must be called **before** the early `return`s (`if (loading) return ...`). Hooks cannot be called conditionally, so put all of them at the top of the component.

**src/components/Main.tsx**
```tsx
import { useEffect, useState, type ChangeEvent } from "react";
import type { Product } from "../types";
import ProductCard from "./ProductCard";

function Main() {
  // Data
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
          throw new Error(`Failed to load products (status ${response.status})`);
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }

  function handleFilterChange(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedCategory(event.target.value);
  }

  // Early returns come AFTER all hooks
  if (loading) return <p className="p-6 text-center text-gray-600">Loading...</p>;
  if (error) return <p className="p-6 text-center text-red-600">Error: {error}</p>;

  const categories = [...new Set(products.map((product) => product.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          className="flex-1 p-2 rounded border border-gray-300 bg-white"
        />
        <select
          value={selectedCategory}
          onChange={handleFilterChange}
          className="p-2 rounded border border-gray-300 bg-white"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600">No products match your search.</p>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </main>
  );
}

export default Main;
```

### Checkpoint

- Typing in the search bar narrows the list immediately.
- Choosing a category narrows the list, and search and category work together.
- A search with no matches shows the "No products match" message.
- Turn off your internet (or change the URL to something wrong) and confirm that the error message appears.
- `npm run build` finishes without TypeScript errors.

---

## Part 4: A first look at Next.js

> Part 4 is an introduction. You will build a small separate project; the e-commerce app moves to Next.js in a later milestone.

### What is Next.js?

Next.js is a **React framework**. React itself only handles the UI; Next.js adds the things almost every real project needs: routing, server rendering, optimisation and a build setup. It is widely used, and it is **TypeScript-first**: new projects are created with TypeScript by default.

#### Core features

1. **Server rendering**: pages can be rendered on the server and sent to the browser as HTML, which helps performance and SEO.
2. **File-based routing**: the folder structure *is* the route structure, with no routing code to write.
3. **Server Components**: in the App Router, components run on the server by default. They can fetch data directly and send only the result to the browser.
4. **Built-in optimisation**: images, fonts, links with prefetching, code splitting.
5. **Route handlers**: you can write backend API endpoints inside the same project.

### React (with Vite) vs. Next.js

| | React + Vite (what we use so far) | Next.js |
|---|---|---|
| Rendering | In the browser (an SPA) | On the server and in the browser |
| Routing | Add a library yourself | Built in, based on files |
| Optimisation | Mostly manual | Many things built in |
| TypeScript | Choose the template (`react-ts`) | On by default |

### Which Next.js router?

Next.js has two routers. Older tutorials, and the JavaScript version of this milestone's examples, use the **Pages Router** (a `pages/` folder, `getServerSideProps`). The Next.js docs recommend the **App Router** (an `app/` folder) for new projects, and that is what we use here.

### Create a project

```bash
npx create-next-app@latest my-next-app --yes
cd my-next-app
npm run dev
```

The `--yes` flag accepts the recommended defaults: TypeScript, ESLint, Tailwind CSS and the App Router. (Without it, the command asks you questions; choose the same answers.) Open `http://localhost:3000`.

### Project structure

| Path | Purpose |
|---|---|
| `app/` | Your routes and layouts (App Router) |
| `app/layout.tsx` | The root layout, wrapped around every page |
| `app/page.tsx` | The home page (`/`) |
| `public/` | Static files like images |
| `next.config.ts` | Next.js configuration |
| `tsconfig.json` | TypeScript configuration |

### File-based routing

Every folder inside `app/` with a `page.tsx` file becomes a route:

**app/about/page.tsx**
```tsx
export default function AboutPage() {
  return <h1>About Us</h1>;
}
```

Open `http://localhost:3000/about` to see it.

### Fetching data on the server

In the App Router a page is a **Server Component** by default, so it can be `async` and `await` data directly. There is no `useEffect` and no loading state to manage by hand:

**app/products/page.tsx**
```tsx
interface Product {
  id: number;
  title: string;
}

export default async function ProductsPage() {
  const response = await fetch("https://fakestoreapi.com/products");
  if (!response.ok) {
    throw new Error("Failed to load products");
  }
  const products: Product[] = await response.json();

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.title}</li>
      ))}
    </ul>
  );
}
```

> How and when a page is rendered (at build time or on every request) depends on what the page does and on your Next.js version. The Next.js docs explain the current rules.

### Loading and error states are files

The `loading` and `error` ideas from Part 2 are built in. Add files next to `page.tsx`:

**app/products/loading.tsx** (shown while the page fetches)
```tsx
export default function ProductsLoading() {
  return <p>Loading products...</p>;
}
```

**app/products/error.tsx** (shown when the page throws)
```tsx
"use client"; // error files must be Client Components

interface ProductsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductsError({ error, reset }: ProductsErrorProps) {
  return (
    <div>
      <p>Something went wrong: {error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

`error.tsx` is an error boundary that Next.js sets up for you. (In production Next.js hides detailed server error messages from users.)

### Server Components vs. Client Components

Server Components cannot use `useState`, `useEffect`, `useContext` or event handlers like `onClick`. When a component needs those, add `"use client"` at the top of its file. For example, our `CartProvider` and anything that calls `useCart()` would need it. A good rule of thumb: **keep components on the server until they need interactivity.**

### Best practices

1. **Optimise images**: use the `<Image>` component from `next/image`. Images from other sites must be allowed in `next.config.ts`:

   ```ts
   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     images: {
       remotePatterns: [{ protocol: "https", hostname: "fakestoreapi.com" }],
     },
   };

   export default nextConfig;
   ```

2. **Use `<Link>`**: `import Link from "next/link"` gives client-side navigation with prefetching.
3. **Use environment variables for secrets**: put them in `.env.local` (never commit it). Variables starting with `NEXT_PUBLIC_` are exposed to the browser; all others stay on the server.

---

## What have we learned?

| Topic | Key idea |
|---|---|
| Context API | Share state without prop drilling: **context + provider + custom hook** |
| Typed context | `createContext<Value \| undefined>(undefined)` plus a hook that checks for `undefined` |
| Generics | `useState<Product[]>([])`, `useState<string \| null>(null)`: give TypeScript the type it cannot infer |
| API errors | `try...catch`, check `response.ok`, `err` is `unknown`, show loading and error UI |
| Error boundaries | Catch errors thrown while rendering and show a fallback; place them close to what can fail |
| Types are not runtime checks | `const data: Product[] = await response.json()` is a promise, not a validation |
| Search and filters | Keep raw filter values in state; **derive** the filtered list on each render |
| Typed events | `ChangeEvent<HTMLInputElement>`, `ChangeEvent<HTMLSelectElement>` |
| Next.js | A React framework: file-based routing, server components, built-in optimisation, TypeScript by default |

---

## Milestone 3: Expected Deliverables

- A `CartContext.tsx` with a typed provider and a `useCart` hook, wrapping the app
- A header that shows the number of items in the cart and product cards that add to it
- Loading and error states for the product fetch, plus an error boundary around the product list
- Working search and category filters with typed event handlers
- `npm run build` finishes without TypeScript errors
- A small Next.js (TypeScript, App Router) project with an `/about` page and a `/products` page

---

## Bonus Challenges

1. **Quantities:** change the cart so adding the same product increases a quantity instead of adding a duplicate. (Hint: introduce `interface CartItem { product: Product; quantity: number }`.)
2. **Persist the cart:** save the cart in `localStorage` so it survives a page reload. (Hint: read it in the initial value of `useState`, and save it in a `useEffect`.)
3. **Loading spinner:** show a spinner instead of the text "Loading...".
4. **Retry button:** add a "Try again" button to the fetch error message that fetches the products again.
5. **Sorting:** add a dropdown to sort the filtered products by price. Use a union type for the options, for example `"price-asc" | "price-desc"`.

---

## Resources

1. [React: `createContext`](https://react.dev/reference/react/createContext)
2. [React: Passing data deeply with context](https://react.dev/learn/passing-data-deeply-with-context)
3. [React: Using TypeScript](https://react.dev/learn/typescript)
4. [MDN: Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
5. [`react-error-boundary` on GitHub](https://github.com/bvaughn/react-error-boundary)
6. [Next.js documentation](https://nextjs.org/docs)
7. [Next.js: Installation](https://nextjs.org/docs/app/getting-started/installation)
8. [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

## Next Steps

In the next milestone we will move the e-commerce project to Next.js and build on the server-rendering ideas from Part 4.

Great work, and keep building!
