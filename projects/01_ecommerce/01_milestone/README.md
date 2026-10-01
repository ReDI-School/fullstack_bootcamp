# Milestone 1: Introduction to React

## Overview

Welcome to your first milestone! Tonight you will set up a React project from scratch, understand what components are, and build a working UI using React's core principles. By the end of the session you will have a live app running in your browser.

---

## Learning Objectives

- Understand React fundamentals and its component-based architecture
- Create a new React project using Vite
- Build and compose reusable functional components
- Style your application using Tailwind CSS
- Know how TypeScript relates to the JavaScript you already write

---

## Sections

1. [Why React?](#1-why-react)
2. [Components and JSX](#2-components-and-jsx)
3. [Props — passing data between components](#3-props--passing-data-between-components)
4. [JSX Rules to remember](#4-jsx-rules-to-remember)
5. [Single Page Applications (SPAs)](#5-single-page-applications-spas)
6. [Tailwind CSS](#6-tailwind-css)
7. [Project Setup](#7-project-setup)
8. [Putting it all together](#8-putting-it-all-together)

---

## 1. Why React?

### The problem React solves

Imagine building a shopping cart without any framework. Every time a user adds an item you have to:

1. Find the right `<div>` in the DOM
2. Read what is already there
3. Calculate the new total
4. Write updated HTML back

This gets messy fast. React flips the model: you describe **what the UI should look like** for a given state, and React works out the minimum set of DOM changes needed to get there. This is called **declarative programming**.

> **Analogy — GPS vs. turn-by-turn directions**
> Imperative code is like reading out every turn ("turn left, go 200m, turn right…"). Declarative code is like typing a destination into a GPS — you describe *where you want to end up* and let React figure out the route.

### The Virtual DOM

React keeps a lightweight copy of the DOM in memory (the "Virtual DOM"). When something changes it compares the new virtual tree with the old one, finds the differences (called a "diff"), and only touches the real DOM nodes that actually changed.

> **Analogy — editing a document**
> Instead of reprinting the whole page every time you fix a typo, you just erase and rewrite that one word.

### Component-based architecture

React UIs are built from **components** — small, self-contained pieces of UI that you compose together like LEGO bricks.

```
App
├── Header
└── Main
    ├── ProductCard
    ├── ProductCard
    └── ProductCard
```

Each brick has its own logic and appearance. You can reuse the same `ProductCard` component for every product just by passing it different data.

---

## 2. Components and JSX

### Your first component

A React component is a JavaScript function that returns UI. The function name must start with a **capital letter** so React knows it is a component and not a plain HTML tag.

**JavaScript (JSX)**
```jsx
function Header() {
  return <h1>Welcome to My Store</h1>;
}

export default Header;
```

**TypeScript (TSX)** — the only difference at this stage is the file extension and optional type annotations
```tsx
function Header(): JSX.Element {
  return <h1>Welcome to My Store</h1>;
}

export default Header;
```

> **Light touch on TypeScript:** For now the TS version looks almost identical. TypeScript adds a return type annotation (`: JSX.Element`) so the compiler can catch mistakes if you accidentally return the wrong thing. You will see more TS features in later milestones.

### What is JSX?

JSX (JavaScript XML) is a syntax extension that lets you write HTML-like markup directly inside JavaScript. It looks like HTML, but it compiles down to `React.createElement()` calls behind the scenes.

```jsx
// What you write
const Greeting = () => <p>Hello, React!</p>;

// What it compiles to (you never write this yourself)
const Greeting = () => React.createElement("p", null, "Hello, React!");
```

JSX is **not** HTML. A few things behave differently:

| HTML attribute | JSX equivalent | Why |
|---|---|---|
| `class="..."` | `className="..."` | `class` is a reserved word in JavaScript |
| `for="..."` | `htmlFor="..."` | `for` is also reserved |
| `onclick="..."` | `onClick={...}` | Events use camelCase in JSX |
| `style="color:red"` | `style={{ color: "red" }}` | Styles are objects in JSX |

### Embedding JavaScript in JSX

Use curly braces `{}` to drop any JavaScript expression into your markup:

```jsx
function Greeting() {
  const name = "Fatima";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : "Good evening";

  return (
    <p>
      {greeting}, {name}!
    </p>
  );
}
```

> **Rule of thumb:** Anything you could pass to `console.log()` can go inside `{}`. Statements (like `if` or `for` loops) cannot go directly in JSX — use ternaries or helper functions instead.

### Naming conventions

| What | Convention | Example |
|---|---|---|
| Component function | PascalCase | `ProductCard` |
| Component file | PascalCase | `ProductCard.jsx` |
| Regular variables | camelCase | `productList` |
| CSS class strings | kebab-case | `"product-card"` |

---

### Exercise 1: Your first component

Open `src/components/Header.jsx` in the starter project. The component already renders a heading and nav links.

**Tasks:**

1. Change the store name from `"My E-Commerce Store"` to something of your own choice.
2. Add a third nav link — `"About"` — pointing to `/about`.
3. Create a brand new file `src/components/Footer.jsx` that renders a `<footer>` with the text `"© 2025 My Store"`.
4. Import and render `<Footer />` inside `App.jsx` below `<Main />`.

<details>
<summary>Solution</summary>

**Header.jsx**
```jsx
function Header() {
  return (
    <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Stellar Goods</h1>
      <nav className="flex gap-4">
        <a href="/" className="hover:underline">Home</a>
        <a href="/products" className="hover:underline">Products</a>
        <a href="/about" className="hover:underline">About</a>
      </nav>
    </header>
  );
}

export default Header;
```

**Footer.jsx**
```jsx
function Footer() {
  return (
    <footer className="text-center p-4 text-gray-500 text-sm">
      © 2025 My Store
    </footer>
  );
}

export default Footer;
```

**App.jsx**
```jsx
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";

function App() {
  return (
    <div>
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

export default App;
```

</details>

---

## 3. Props — passing data between components

Props (short for "properties") are how you pass data **down** from a parent component to a child. Think of them like function arguments, but for UI.

> **Analogy — a stamp maker**
> A `ProductCard` component is like a rubber stamp mold. Props are the ink color and text you load into it each time. Same mold, different output.

### Basic props

**JavaScript**
```jsx
// Child component
function ProductCard({ name, price }) {
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3>{name}</h3>
      <p>${price}</p>
    </div>
  );
}

// Parent component
function Main() {
  return (
    <div>
      <ProductCard name="Running Shoes" price={89.99} />
      <ProductCard name="Yoga Mat" price={24.99} />
    </div>
  );
}
```

**TypeScript** — you define the shape of the props with an interface or type
```tsx
interface ProductCardProps {
  name: string;
  price: number;
}

function ProductCard({ name, price }: ProductCardProps) {
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3>{name}</h3>
      <p>${price}</p>
    </div>
  );
}
```

> **Why this matters:** In TypeScript, if you pass `price="free"` (a string instead of a number) the compiler will highlight the error *before* you run the code. In plain JavaScript you only find out at runtime.

### Dynamic props from data

In a real app you will loop over an array of products rather than writing each card manually:

**JavaScript**
```jsx
const products = [
  { id: 1, name: "Running Shoes", price: 89.99 },
  { id: 2, name: "Yoga Mat", price: 24.99 },
  { id: 3, name: "Water Bottle", price: 14.99 },
];

function Main() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} name={product.name} price={product.price} />
      ))}
    </div>
  );
}
```

**TypeScript**
```tsx
interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: "Running Shoes", price: 89.99 },
  { id: 2, name: "Yoga Mat", price: 24.99 },
  { id: 3, name: "Water Bottle", price: 14.99 },
];
```

> **What is `key`?** When rendering a list, React needs a stable identifier for each item so it can efficiently update only the cards that changed. Always use a unique, stable value (like a database ID) — never use the array index if the list order can change.

### Default and named exports

When you export a component you have two options:

```jsx
// Default export — one per file, import with any name you like
export default ProductCard;

// In another file:
import ProductCard from "./ProductCard";
import Card from "./ProductCard";       // also valid
```

```jsx
// Named export — can export multiple per file, must import with same name
export function ProductCard() { ... }
export function ProductGrid() { ... }

// In another file:
import { ProductCard, ProductGrid } from "./ProductCard";
```

Most components use `export default`. Named exports are common for utility functions and shared types.

---

### Exercise 2: Build a ProductCard component

Open `src/components/Main.jsx`. Right now it has three hardcoded `<div>` blocks for products. Your job is to replace them with a reusable `ProductCard` component.

**Tasks:**

1. Create a new file `src/components/ProductCard.jsx`.
2. The component should accept three props: `name`, `price`, and `description`.
3. Render the name in a bold heading, the description in a muted paragraph, and the price in a coloured span.
4. In `Main.jsx`, define an array of at least 3 product objects and use `.map()` to render a `<ProductCard />` for each one. Remember the `key` prop.

<details>
<summary>Solution</summary>

**ProductCard.jsx**
```jsx
function ProductCard({ name, price, description }) {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h3 className="text-lg font-bold text-gray-800">{name}</h3>
      <p className="text-gray-500 text-sm mt-1">{description}</p>
      <p className="text-blue-600 font-semibold mt-2">${price}</p>
    </div>
  );
}

export default ProductCard;
```

**Main.jsx**
```jsx
import ProductCard from "./ProductCard";

const products = [
  { id: 1, name: "Running Shoes", price: 89.99, description: "Lightweight and fast." },
  { id: 2, name: "Yoga Mat", price: 24.99, description: "Non-slip, 6mm thick." },
  { id: 3, name: "Water Bottle", price: 14.99, description: "Insulated, 750ml." },
];

function Main() {
  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold text-center mb-6">Our Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            description={product.description}
          />
        ))}
      </div>
    </main>
  );
}

export default Main;
```

</details>

---

## 4. JSX Rules to Remember

These are the most common mistakes newcomers make. Keep this section as a reference.

### One root element per component

```jsx
// Wrong — two siblings at the top level
function Header() {
  return (
    <h1>Welcome</h1>
    <span>John Doe</span>   // Error!
  );
}

// Correct — wrap in a div
function Header() {
  return (
    <div>
      <h1>Welcome</h1>
      <span>John Doe</span>
    </div>
  );
}

// Correct — use a Fragment if you don't want an extra DOM node
function Header() {
  return (
    <>
      <h1>Welcome</h1>
      <span>John Doe</span>
    </>
  );
}
```

### Self-closing tags

HTML lets you write `<img src="...">` without a closing tag. JSX does not.

```jsx
// Wrong
<img src="logo.png">
<input type="text">

// Correct
<img src="logo.png" />
<input type="text" />
```

### Component names must start with a capital letter

```jsx
function header() { ... }  // React treats this as an HTML <header> tag
function Header() { ... }  // React treats this as a component
```

### Curly braces for JavaScript expressions

```jsx
const discount = 10;

// Wrong — this prints the literal string "discount%"
<p>discount%</p>

// Correct
<p>{discount}%</p>
```

---

## 5. Single Page Applications (SPAs)

Traditional websites reload the entire page every time you navigate. SPAs load once and then update only what needs to change — no page refresh.

> **Analogy — a whiteboard vs. a projector slide**
> A traditional site is like swapping out the whole projector slide every time you want to show something new. A SPA is like having a whiteboard where you just erase and redraw the part that changed.

### How React SPAs work

1. The browser downloads one `index.html` file plus your bundled JavaScript
2. React mounts itself into a single `<div id="root">`
3. Navigation changes are handled in JavaScript — React swaps out components without a server round-trip

You use this every day without noticing: Gmail, Google Maps, Notion, and Figma are all SPAs.

### SPAs vs. Server-Side Rendering

Later in this bootcamp (Project 2) you will learn Next.js, which renders HTML on the server. SPAs and SSR are not opposites — they are different tools with different trade-offs. For now, SPAs are a great mental model for understanding how React works.

---

## 6. Tailwind CSS

### What is it?

Tailwind is a utility-first CSS framework. Instead of writing a CSS file with class names like `.product-card`, you apply small, single-purpose classes directly in your JSX.

> **Analogy — IKEA vs. a custom carpenter**
> Writing traditional CSS is like hiring a carpenter to build custom furniture. Tailwind is like IKEA: a huge catalogue of standardised parts you snap together quickly. Less bespoke, but much faster.

```jsx
// Traditional CSS approach
// In ProductCard.css: .card { padding: 16px; background: white; border-radius: 8px; }
<div className="card">...</div>

// Tailwind approach — no CSS file needed
<div className="p-4 bg-white rounded-lg shadow">...</div>
```

### The most useful classes

**Spacing**

| Class | What it does |
|---|---|
| `p-4` | padding: 1rem on all sides |
| `px-4` | padding: 1rem left and right |
| `py-2` | padding: 0.5rem top and bottom |
| `m-4` | margin: 1rem on all sides |
| `mt-2` | margin-top: 0.5rem |
| `gap-4` | gap between flex/grid items: 1rem |

> The number maps to `n * 0.25rem`. So `p-4` = 1rem = 16px, `p-8` = 2rem = 32px.

**Typography**

| Class | What it does |
|---|---|
| `text-xl` | font-size: 1.25rem |
| `text-2xl` | font-size: 1.5rem |
| `font-bold` | font-weight: 700 |
| `text-gray-600` | color: a medium gray |
| `text-center` | text-align: center |

**Layout**

| Class | What it does |
|---|---|
| `flex` | display: flex |
| `items-center` | align-items: center |
| `justify-between` | justify-content: space-between |
| `grid` | display: grid |
| `grid-cols-3` | grid-template-columns: repeat(3, 1fr) |

### Responsive design

Tailwind is **mobile-first**. A class without a prefix applies to all screen sizes. Add a prefix to override at larger sizes:

```jsx
// 1 column on mobile, 2 on tablet, 3 on desktop
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
```

| Prefix | Minimum width | Typical device |
|---|---|---|
| _(none)_ | 0px | Mobile (default) |
| `sm:` | 640px | Large phones, small tablets |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |

> **Common mistake:** Do not use `sm:` to target mobile. Tailwind is mobile-first, so you style mobile first (no prefix) and *override* at larger sizes.

```jsx
// Wrong — this only centers on screens >= 640px, mobile is left-aligned
<p className="sm:text-center">

// Correct — centered everywhere, left-aligned on tablet and up
<p className="text-center sm:text-left">
```

### Setting up Tailwind with Vite

```bash
npm install tailwindcss @tailwindcss/vite
```

`vite.config.js`
```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

`src/index.css`
```css
@import "tailwindcss";
```

Quick sanity check — add this to any component and confirm the style applies:

```jsx
<h1 className="text-4xl font-bold text-blue-500">Hello Tailwind!</h1>
```

---

### Exercise 3: Style your ProductCard with Tailwind

Go back to your `ProductCard.jsx` from Exercise 2 and improve the styling using only Tailwind utility classes.

**Tasks:**

1. Add a hover effect so the card lifts slightly on hover: `hover:shadow-xl hover:-translate-y-1 transition-transform`.
2. Give the price a green colour instead of blue: `text-green-600`.
3. Add a coloured top border to the card using `border-t-4 border-blue-500`.
4. Make the layout responsive: the grid in `Main.jsx` should show 1 column on mobile, 2 on tablet, 3 on desktop.

> **Hint:** Tailwind's `transition-transform` class enables smooth CSS transitions. You will need to add `duration-200` alongside it for a noticeable effect.

<details>
<summary>Solution</summary>

**ProductCard.jsx**
```jsx
function ProductCard({ name, price, description }) {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg border-t-4 border-blue-500
                    hover:shadow-xl hover:-translate-y-1 transition-transform duration-200">
      <h3 className="text-lg font-bold text-gray-800">{name}</h3>
      <p className="text-gray-500 text-sm mt-1">{description}</p>
      <p className="text-green-600 font-semibold mt-2">${price}</p>
    </div>
  );
}

export default ProductCard;
```

**Main.jsx grid div**
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
```

</details>

---

## 7. Project Setup

### Prerequisites

- **Node.js** (v18 or later): the runtime that lets JavaScript run outside the browser. Download from [nodejs.org](https://nodejs.org/en/download)
- **npm**: comes bundled with Node.js. It is the package manager you will use to install dependencies.

### Create a new React project with Vite

[Vite](https://vitejs.dev/guide/) is a build tool that scaffolds a project and runs a fast development server.

```bash
npm create vite@latest my-store -- --template react
cd my-store
npm install
npm run dev
```

For TypeScript:

```bash
npm create vite@latest my-store -- --template react-ts
```

> **What is Vite doing?** It creates `index.html`, `src/main.jsx`, and all the config files you need. It also starts a dev server with hot module replacement — your browser updates instantly when you save a file, without a full reload.

### Key files explained

| File | Purpose |
|---|---|
| `index.html` | The single HTML page. React mounts into `<div id="root">` |
| `src/main.jsx` | Entry point. Calls `ReactDOM.createRoot()` to start React |
| `src/App.jsx` | Your root component — the top of the component tree |
| `package.json` | Lists all dependencies and npm scripts |
| `package-lock.json` | Locks exact dependency versions — **never delete this** |
| `vite.config.js` | Vite and plugin configuration |

### Understanding `package.json` version numbers

```json
{
  "dependencies": {
    "react": "^19.1.0"
  }
}
```

| Symbol | Meaning |
|---|---|
| `19.1.0` | Locked to this exact version |
| `~19.1.0` | Accept patch updates only (19.1.x) |
| `^19.1.0` | Accept minor + patch updates (19.x.x) |

`package-lock.json` records the exact versions that were installed so every developer on the team gets the same code. Commit it. Do not delete it.

> **When things break:** Delete `node_modules/` and run `npm install` again. This reinstalls everything fresh based on `package-lock.json`.

---

## 8. Putting it all together

Here is the component tree for the starter app you will build today:

```
App
├── Header       — site logo + nav
└── Main
    └── ProductCard (×3)  — product name + price
```

### `Header.jsx`

```jsx
function Header() {
  return (
    <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">My Store</h1>
      <nav className="flex gap-4">
        <a href="/" className="hover:underline">Home</a>
        <a href="/products" className="hover:underline">Products</a>
      </nav>
    </header>
  );
}

export default Header;
```

### `ProductCard.jsx`

**JavaScript**
```jsx
function ProductCard({ name, price, description }) {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h3 className="text-lg font-bold text-gray-800">{name}</h3>
      <p className="text-gray-500 text-sm mt-1">{description}</p>
      <p className="text-blue-600 font-semibold mt-2">${price}</p>
    </div>
  );
}

export default ProductCard;
```

**TypeScript**
```tsx
interface ProductCardProps {
  name: string;
  price: number;
  description: string;
}

function ProductCard({ name, price, description }: ProductCardProps) {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h3 className="text-lg font-bold text-gray-800">{name}</h3>
      <p className="text-gray-500 text-sm mt-1">{description}</p>
      <p className="text-blue-600 font-semibold mt-2">${price}</p>
    </div>
  );
}

export default ProductCard;
```

### `App.jsx`

```jsx
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";

const products = [
  { id: 1, name: "Running Shoes", price: 89.99, description: "Lightweight and fast." },
  { id: 2, name: "Yoga Mat", price: 24.99, description: "Non-slip, 6mm thick." },
  { id: 3, name: "Water Bottle", price: 14.99, description: "Insulated, 750ml." },
];

function App() {
  return (
    <div>
      <Header />
      <main className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-semibold text-center mb-6">Our Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              description={product.description}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
```

---

### Exercise 4: Capstone — put it all together

This exercise brings all the concepts from tonight into one task. Work in the starter project.

**Tasks:**

1. Make sure you have `Header`, `Footer`, and `ProductCard` components in place from the previous exercises.
2. Add a `category` prop to `ProductCard` (e.g. `"Footwear"`, `"Fitness"`, `"Hydration"`). Display it as a small badge above the product name using Tailwind: `text-xs font-semibold uppercase tracking-wide text-white bg-blue-500 px-2 py-0.5 rounded`.
3. Add a `"Add to Cart"` button at the bottom of each card. It does not need to do anything yet — just render it with appropriate Tailwind classes.
4. In `App.jsx`, pass your products array down to `Main` as a prop instead of defining it inside `Main`. Update `Main` to receive and use that prop.

> This last task (step 4) is the key React concept: data lives as high as it needs to, and gets passed down. Next milestone you will lift state into `App` so the cart button can actually update a total.

<details>
<summary>Solution</summary>

**ProductCard.jsx**
```jsx
function ProductCard({ name, price, description, category }) {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg border-t-4 border-blue-500
                    hover:shadow-xl hover:-translate-y-1 transition-transform duration-200">
      <span className="text-xs font-semibold uppercase tracking-wide text-white
                       bg-blue-500 px-2 py-0.5 rounded">
        {category}
      </span>
      <h3 className="text-lg font-bold text-gray-800 mt-2">{name}</h3>
      <p className="text-gray-500 text-sm mt-1">{description}</p>
      <p className="text-green-600 font-semibold mt-2">${price}</p>
      <button className="mt-3 w-full bg-blue-600 text-white text-sm font-semibold
                         py-2 rounded hover:bg-blue-700 transition-colors">
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
```

**Main.jsx** (now receives products as a prop)
```jsx
import ProductCard from "./ProductCard";

function Main({ products }) {
  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold text-center mb-6">Our Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            description={product.description}
            category={product.category}
          />
        ))}
      </div>
    </main>
  );
}

export default Main;
```

**App.jsx** (owns the data, passes it down)
```jsx
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";

const products = [
  { id: 1, name: "Running Shoes", price: 89.99, description: "Lightweight and fast.", category: "Footwear" },
  { id: 2, name: "Yoga Mat", price: 24.99, description: "Non-slip, 6mm thick.", category: "Fitness" },
  { id: 3, name: "Water Bottle", price: 14.99, description: "Insulated, 750ml.", category: "Hydration" },
];

function App() {
  return (
    <div>
      <Header />
      <Main products={products} />
      <Footer />
    </div>
  );
}

export default App;
```

</details>

---

## What Have We Learned?

| Topic | Key idea |
|---|---|
| React | Declarative, component-based, efficient Virtual DOM |
| Components | Functions that return JSX, named in PascalCase |
| JSX | HTML-like syntax inside JavaScript, compiled by Vite |
| Props | Data passed from parent to child, immutable in the child |
| SPAs | One HTML page, JavaScript handles all navigation |
| Tailwind | Utility classes applied directly in JSX, mobile-first |

---

## What's Next?

In Milestone 2 you will add **state** with `useState`, handle **user events** (like clicking "Add to Cart"), and make the cart interactive. You will also meet `useEffect` and learn how to **fetch real product data** from an API.

---

## Milestone 1 — Expected Deliverables

- A working React project created with Vite
- At least three components (`App`, `Header`, one more of your choice)
- Tailwind CSS set up and visibly working
- Props used to pass data from a parent to a child component

---

## Bonus Challenges

- Add an `image` prop to `ProductCard` and display a product photo (you can use placeholder images from [picsum.photos](https://picsum.photos))
- Add a `category` badge to each card (e.g. "Footwear", "Fitness")
- Try converting one of your components to TypeScript (rename `.jsx` to `.tsx` and add a props interface)

---

## Additional Resources

- [React Official Docs](https://react.dev)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MDN: JavaScript Basics](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [TypeScript in 5 minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
