# Milestone 1: Introduction to React (TypeScript version)

> **Which README should I follow?**
> This is the TypeScript (`.tsx`) version of Milestone 1. The JavaScript version is in [README.md](./README.md). The concepts are identical; only the project template, file extensions and a few type annotations differ. Pick one version and stick with it for the whole milestone.

## Overview

Welcome to your first React milestone! You will set up a React project from scratch, understand what components are, and build a working UI using React's core principles. By the end you will have a live app running in your browser, and you will have written your first TypeScript.

---

## Learning Objectives

- Understand React fundamentals and its component-based architecture
- Create a new React + TypeScript project using Vite
- Build and compose reusable functional components
- Pass data between components with typed props
- Style your application using Tailwind CSS

---

## Sections

1. [Why React?](#1-why-react)
2. [Single Page Applications (SPAs)](#2-single-page-applications-spas)
3. [Project Setup](#3-project-setup)
4. [TypeScript: just enough to get started](#4-typescript-just-enough-to-get-started)
5. [Components and JSX](#5-components-and-jsx)
6. [Props: passing data between components](#6-props-passing-data-between-components)
7. [JSX rules to remember](#7-jsx-rules-to-remember)
8. [Tailwind CSS](#8-tailwind-css)
9. [Putting it all together](#9-putting-it-all-together)

---

## 1. Why React?

### The problem React solves

Imagine building a shopping cart without any framework. Every time a user adds an item you have to:

1. Find the right `<div>` in the DOM
2. Read what is already there
3. Calculate the new total
4. Write updated HTML back

This gets messy fast. React flips the model: you describe **what the UI should look like** for a given state, and React works out the minimum set of DOM changes needed to get there. This is called **declarative programming**.

> **Analogy: GPS vs. turn-by-turn directions**
> Imperative code is like reading out every turn ("turn left, go 200m, turn right..."). Declarative code is like typing a destination into a GPS: you describe *where you want to end up* and let React figure out the route.

### The Virtual DOM

React keeps a lightweight copy of the DOM in memory (the "Virtual DOM"). When something changes, it compares the new virtual tree with the old one, finds the differences, and only touches the real DOM nodes that actually changed.

> **Analogy: editing a document**
> Instead of reprinting the whole page every time you fix a typo, you just erase and rewrite that one word.

### Component-based architecture

React UIs are built from **components**: small, self-contained pieces of UI that you compose together like LEGO bricks.

```
App
├── Header
├── Main
│   ├── ProductCard
│   ├── ProductCard
│   └── ProductCard
└── Footer
```

Each brick has its own logic and appearance. You can reuse the same `ProductCard` for every product just by passing it different data.

---

## 2. Single Page Applications (SPAs)

Traditional websites reload the entire page every time you navigate. SPAs load once and then update only what needs to change, with no page refresh.

> **Analogy: projector slide vs. whiteboard**
> A traditional site is like swapping the whole projector slide every time you want to show something new. A SPA is like a whiteboard where you only erase and redraw the part that changed.

### How React SPAs work

1. The browser downloads one `index.html` file plus your bundled JavaScript
2. React mounts itself into a single `<div id="root">`
3. Navigation and updates are handled in JavaScript, with no full page reload

You use SPAs every day: Gmail, Google Maps, Notion and Figma are all SPAs.

Later in the bootcamp you will also see server-side rendering. SPAs and server rendering are not opposites; they are different tools with different trade-offs. For now, the SPA is a great mental model for understanding how React works.

---

## 3. Project Setup

### Prerequisites

- **Node.js**: the runtime that lets JavaScript run outside the browser. Install the current LTS version from [nodejs.org](https://nodejs.org/en/download). Vite needs a reasonably recent Node version, so check the [Vite guide](https://vite.dev/guide/) if `npm run dev` complains.
- **npm**: comes bundled with Node.js. It is the package manager you use to install dependencies.
- **VS Code** (recommended): it shows TypeScript errors directly in your editor as you type.

### Step 1: Create the project with Vite

[Vite](https://vite.dev/guide/) is a build tool that scaffolds a project and runs a fast development server.

```bash
npm create vite@latest my-store -- --template react-ts
cd my-store
npm install
npm run dev
```

> The `--` before `--template` is required: it tells npm to pass the flag on to Vite. If Vite asks extra questions, the default answers are fine.
> `react-ts` means React **with TypeScript**. For the plain JavaScript track, use `--template react` and follow the [JavaScript README](./README.md).

Open the URL shown in the terminal (usually `http://localhost:5173`). You should see the Vite + React starter page.

### Step 2: Add Tailwind CSS

```bash
npm install tailwindcss @tailwindcss/vite
```

Register the plugin in `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

Replace the **entire content** of `src/index.css` with a single line (the template's default styles would interfere with your layout), and delete `src/App.css`:

```css
@import "tailwindcss";
```

Sanity check: put this in `App.tsx` and confirm the style applies.

```tsx
<h1 className="text-4xl font-bold text-blue-500">Hello Tailwind!</h1>
```

### Step 3: Bring in the starter components

The `project/` folder in this milestone contains starter components (`Header`, `Main`, `App`). Copy them into your new project and use the **`.tsx`** extension (`Header.tsx`, `Main.tsx`, `App.tsx`). The starter components don't take any props yet, so the code itself needs no changes.

### Key files explained

| File | Purpose |
|---|---|
| `index.html` | The single HTML page. React mounts into `<div id="root">` |
| `src/main.tsx` | Entry point. Calls `createRoot(...).render(...)` to start React |
| `src/App.tsx` | Your root component, the top of the component tree |
| `vite.config.ts` | Vite and plugin configuration |
| `tsconfig.json` (and `tsconfig.app.json`, `tsconfig.node.json`) | TypeScript compiler settings. You won't need to edit these |
| `package.json` | Lists all dependencies and npm scripts |
| `package-lock.json` | Locks exact dependency versions. **Never delete this** |

> **What is Vite doing?** It also starts a dev server with hot module replacement: your browser updates instantly when you save a file, without a full reload.

### Understanding `package.json` version numbers

```json
{
  "dependencies": {
    "react": "^19.1.0"
  }
}
```

| Part | Meaning |
|---|---|
| Major (`19`) | Can contain breaking changes, such as removed functions |
| Minor (`1`) | New features, backwards compatible |
| Patch (`0`) | Bug fixes |

| Symbol | Meaning |
|---|---|
| `19.1.0` | Locked to this exact version |
| `~19.1.0` | Accept patch updates only (19.1.x) |
| `^19.1.0` | Accept minor + patch updates (19.x.x), but never a new major |

`package-lock.json` records the exact versions that were installed, so every developer on the team gets the same code. Commit it. Do not delete it.

> **When things break:** delete the `node_modules/` folder and run `npm install` again. This reinstalls everything based on `package-lock.json`.

---

## 4. TypeScript: just enough to get started

You already know JavaScript. **TypeScript is JavaScript plus types**: you describe what kind of data a variable, function parameter or prop is supposed to hold, and the compiler warns you when you break that promise. All valid JavaScript is valid TypeScript, and the browser never sees the types (they are removed during the build).

```ts
const storeName: string = "My Store";   // text
const price: number = 89.99;            // all numbers, integer or decimal
const inStock: boolean = true;          // true / false
const tags: string[] = ["sale", "new"]; // an array of strings
```

TypeScript can often work out the type by itself (this is called *inference*), so you rarely need to write it for simple variables:

```ts
const storeName = "My Store"; // TypeScript already knows this is a string
```

### Describing the shape of an object

Use an `interface` to describe an object's properties:

```ts
interface Product {
  id: number;
  name: string;
  price: number;
}

const shoes: Product = { id: 1, name: "Running Shoes", price: 89.99 };
```

### Why bother?

```ts
const broken: Product = { id: 2, name: "Yoga Mat", price: "cheap" };
//                                                  ~~~~~ Type 'string' is not assignable to type 'number'
```

The mistake is highlighted in your editor *before* you run anything. In plain JavaScript, you would only discover it when something breaks in the browser.

### A few more tools you will meet

| Syntax | Meaning | Example |
|---|---|---|
| `?` | Optional property | `image?: string` |
| `\|` | Union: one of several types | `"Footwear" \| "Fitness"` |
| `Type[]` | Array of that type | `Product[]` |
| `import type` | Import something that exists only as a type | `import type { Product } from "./types"` |

### Where do I see the errors?

- **In VS Code:** red squiggly lines, and hover for the message.
- **When building:** `npm run build` runs the TypeScript compiler first and lists all errors.
- The dev server (`npm run dev`) does **not** stop for type errors, so do not rely on the browser alone.

> **Good to know:** in TypeScript React projects, files that contain JSX must end in **`.tsx`**. Files with only plain TypeScript (like a file of types) end in **`.ts`**.

---

## 5. Components and JSX

### Your first component

A React component is a function that returns UI. The function name must start with a **capital letter** so React knows it is a component and not a plain HTML tag.

```tsx
function Header() {
  return <h1>Welcome to My Store</h1>;
}

export default Header;
```

This is the same code as in JavaScript. TypeScript works out for itself that `Header` returns JSX, so you do not need to add a return type.

> **Tip:** older tutorials write `const Header: React.FC = () => ...`. You do not need `React.FC` in modern React.

### What is JSX?

JSX (JavaScript XML) is a syntax extension that lets you write HTML-like markup directly inside JavaScript/TypeScript. It looks like HTML, but it compiles down to function calls behind the scenes.

```tsx
// What you write
const Greeting = () => <p>Hello, React!</p>;

// Roughly what it becomes (you never write this yourself)
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

```tsx
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

> **Rule of thumb:** anything you could pass to `console.log()` can go inside `{}`. Statements (like `if` or `for` loops) cannot go directly in JSX. Use ternaries or helper functions instead.

### Naming conventions

| What | Convention | Example |
|---|---|---|
| Component function | PascalCase | `ProductCard` |
| Component file | PascalCase + `.tsx` | `ProductCard.tsx` |
| Types-only file | camelCase + `.ts` | `types.ts` |
| Regular variables | camelCase | `productList` |
| Types and interfaces | PascalCase | `Product`, `ProductCardProps` |

Component name and file name are normally the same.

### Default and named exports

When you export something you have two options:

```tsx
// Default export: one per file, import with any name you like
export default ProductCard;

// In another file:
import ProductCard from "./ProductCard";
import Card from "./ProductCard"; // also valid
```

```tsx
// Named export: several per file, must import with the same name
export function ProductCard() { /* ... */ }
export function ProductGrid() { /* ... */ }

// In another file:
import { ProductCard, ProductGrid } from "./ProductCard";
```

Components usually use `export default`. Named exports are common for helper functions and shared types.

---

### Exercise 1: Your first component

Open `src/components/Header.tsx`. The component already renders a heading and two nav links. (The Tailwind classes are given to you; Section 8 explains them.)

**Tasks:**

1. Change the store name from `"My E-Commerce Store"` to a name of your own choice.
2. Add a third nav link, `"About"`, pointing to `/about`.
3. Create a new file `src/components/Footer.tsx` that renders a `<footer>` with the text `© <current year> My Store`. Get the year with `{new Date().getFullYear()}` instead of typing it.
4. Import and render `<Footer />` in `App.tsx`, below `<Main />`.

<details>
<summary>Solution</summary>

**Header.tsx** (the store name can be anything you like)
```tsx
function Header() {
  return (
    <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Stellar Goods</h1>
      <nav>
        <a href="/" className="text-white mr-4 hover:underline">Home</a>
        <a href="/products" className="text-white mr-4 hover:underline">Products</a>
        <a href="/about" className="text-white hover:underline">About</a>
      </nav>
    </header>
  );
}

export default Header;
```

**Footer.tsx**
```tsx
function Footer() {
  return (
    <footer className="text-center p-4 text-gray-500 text-sm">
      © {new Date().getFullYear()} My Store
    </footer>
  );
}

export default Footer;
```

**App.tsx**
```tsx
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
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

## 6. Props: passing data between components

Props (short for "properties") are how you pass data **down** from a parent component to a child. Think of them like function arguments, but for UI. Props are **read-only** in the child: a component never changes the props it receives.

> **Analogy: a stamp maker**
> A `ProductCard` component is like a rubber stamp mold. Props are the ink color and text you load into it each time. Same mold, different output.

### Typed props

In TypeScript you describe the shape of a component's props with an `interface`, then use it to annotate the destructured parameter:

```tsx
interface WelcomeMessageProps {
  firstName: string;
  lastName: string;
}

function WelcomeMessage({ firstName, lastName }: WelcomeMessageProps) {
  return (
    <h2>
      Welcome, {firstName} {lastName}!
    </h2>
  );
}

export default WelcomeMessage;
```

The parent uses the child like an HTML tag and passes the props as attributes:

```tsx
import WelcomeMessage from "./WelcomeMessage";

function ParentComponent() {
  return <WelcomeMessage firstName="John" lastName="Doe" />;
}
```

Strings can be passed in quotes. For anything else (numbers, variables, expressions) use curly braces:

```tsx
function ParentComponent() {
  const firstName = "John";
  const lastName = "Doe";
  return <WelcomeMessage firstName={firstName} lastName={lastName} />;
}
```

### What TypeScript does for you here

| What you write | What TypeScript says |
|---|---|
| `<WelcomeMessage firstName="John" />` | Error: `lastName` is missing |
| `<WelcomeMessage firstName={42} lastName="Doe" />` | Error: `number` is not assignable to `string` |
| `<WelcomeMessage firstName="John" lastName="Doe" age={30} />` | Error: `age` does not exist in `WelcomeMessageProps` |
| Typing `<WelcomeMessage ` and pressing Ctrl+Space | The editor suggests the available props |

The props interface works as both documentation and a safety net.

### Rendering lists with `.map()`

In a real app you loop over an array rather than writing each card by hand. First, describe the data:

```ts
// src/types.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}
```

Then map over it:

```tsx
import type { Product } from "../types";
import ProductCard from "./ProductCard";

const products: Product[] = [
  { id: 1, name: "Running Shoes", price: 89.99, description: "Lightweight and fast." },
  { id: 2, name: "Yoga Mat", price: 24.99, description: "Non-slip, 6mm thick." },
  { id: 3, name: "Water Bottle", price: 14.99, description: "Insulated, 750ml." },
];

function Main() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          name={product.name}
          price={product.price}
          description={product.description}
        />
      ))}
    </section>
  );
}
```

Notice two things:

- `export interface Product` is a **named export**, so you import it with `{ Product }`. We write `import type` because `Product` exists only for the compiler and disappears at build time. (With the Vite template's settings, a plain `import { Product }` gives an error asking you to use `import type`.)
- `products.map((product) => ...)`: because `products` is typed as `Product[]`, TypeScript knows that `product` has `name`, `price` and so on, and your editor autocompletes them.

> **What is `key`?** When rendering a list, React needs a stable identifier for each item so it can efficiently update only the cards that changed. Always use a unique, stable value (like a database ID). Avoid the array index if the list order can change.

---

### Exercise 2: Build a typed ProductCard

Open `src/components/Main.tsx`. Right now it has three hardcoded placeholder `<div>` blocks for products. Replace them with a reusable `ProductCard` component.

**Tasks:**

1. Create `src/types.ts` and export a `Product` interface with `id`, `name`, `price` and `description`.
2. Create `src/components/ProductCard.tsx`. Define a `ProductCardProps` interface with `name`, `price` and `description`, and use it for the component's props.
3. Render the name in a bold heading, the description in a muted paragraph, and the price in a coloured paragraph.
4. In `Main.tsx`, define a `products` array (type `Product[]`) with at least 3 items and use `.map()` to render a `<ProductCard />` for each. Remember the `key` prop. Keep the "Welcome" section.
5. **See TypeScript at work:** temporarily change one price to `"free"` (a string). Read the error in your editor, then fix it.

<details>
<summary>Solution</summary>

**src/types.ts**
```ts
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}
```

**src/components/ProductCard.tsx**
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
      <p className="text-blue-600 font-semibold mt-2">${price.toFixed(2)}</p>
    </div>
  );
}

export default ProductCard;
```

> `price.toFixed(2)` always shows two decimals. Your editor can suggest `toFixed` because it knows `price` is a `number`.

**src/components/Main.tsx**
```tsx
import type { Product } from "../types";
import ProductCard from "./ProductCard";

const products: Product[] = [
  { id: 1, name: "Running Shoes", price: 89.99, description: "Lightweight and fast." },
  { id: 2, name: "Yoga Mat", price: 24.99, description: "Non-slip, 6mm thick." },
  { id: 3, name: "Water Bottle", price: 14.99, description: "Insulated, 750ml." },
];

function Main() {
  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      {/* Welcome Section */}
      <section className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-blue-700">Welcome to Our Store!</h2>
        <p className="mt-4 text-gray-600">Discover our amazing products and enjoy exclusive deals.</p>
      </section>

      {/* Products */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            description={product.description}
          />
        ))}
      </section>
    </main>
  );
}

export default Main;
```

</details>

---

## 7. JSX rules to remember

These are the most common mistakes newcomers make. Keep this section as a reference.

### One root element per component

```tsx
// Wrong: two siblings at the top level
function Header() {
  return (
    <h1>Welcome</h1>
    <span>John Doe</span>   // Error!
  );
}

// Correct: wrap in a div
function Header() {
  return (
    <div>
      <h1>Welcome</h1>
      <span>John Doe</span>
    </div>
  );
}

// Correct: use a Fragment if you don't want an extra DOM node
function Header() {
  return (
    <>
      <h1>Welcome</h1>
      <span>John Doe</span>
    </>
  );
}
```

### Use parentheses for multi-line JSX

Put the JSX in `( )` after `return`. If you write `return` and start the JSX on the next line without parentheses, JavaScript ends the statement early and the component returns nothing.

```tsx
// Wrong: returns undefined
function Header() {
  return
    <h1>Welcome</h1>;
}

// Correct
function Header() {
  return (
    <h1>Welcome</h1>
  );
}
```

### Self-closing tags

HTML lets you write `<img src="...">` without a closing tag. JSX does not.

```tsx
// Wrong
<img src="logo.png">
<input type="text">

// Correct
<img src="logo.png" />
<input type="text" />
```

### Component names must start with a capital letter

```tsx
function header() { /* ... */ }  // React treats <header /> as the HTML tag
function Header() { /* ... */ }  // React treats <Header /> as your component
```

### Curly braces for JavaScript expressions

```tsx
const discount = 10;

// Wrong: prints the literal text "discount%"
<p>discount%</p>

// Correct
<p>{discount}%</p>
```

### TypeScript errors you will meet in React

| Message (roughly) | Usual cause |
|---|---|
| `Property 'price' is missing in type ... but required in type 'ProductCardProps'` | You forgot to pass a prop |
| `Type 'string' is not assignable to type 'number'` | You passed `"89.99"` (text) instead of `{89.99}` (number) |
| `Property 'nme' does not exist on type 'Product'` | A typo in a property name |
| `'Product' is a type and must be imported using a type-only import` | Use `import type { Product } from "..."` |

---

## 8. Tailwind CSS

Tailwind is already installed (Section 3). Here is what it is and how to read the classes in your components.

### What is it?

Tailwind is a utility-first CSS framework. Instead of writing a CSS file with class names like `.product-card`, you apply small, single-purpose classes directly in your JSX.

> **Analogy: IKEA vs. a custom carpenter**
> Writing traditional CSS is like hiring a carpenter to build custom furniture. Tailwind is like IKEA: a huge catalogue of standardised parts you snap together quickly. Less bespoke, but much faster.

```tsx
// Traditional CSS approach
// In ProductCard.css: .card { padding: 16px; background: white; border-radius: 8px; }
<div className="card">...</div>

// Tailwind approach: no CSS file needed
<div className="p-4 bg-white rounded-lg shadow-md">...</div>
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

> The number maps to `n * 0.25rem`. So `p-4` = 1rem = 16px and `p-8` = 2rem = 32px. (`rem` is relative to the root font size, which is 16px by default.)

**Typography**

| Class | What it does |
|---|---|
| `text-xl` | larger font size |
| `text-2xl` | even larger font size |
| `font-bold` | font-weight: 700 |
| `text-gray-600` | a medium gray text colour |
| `text-center` | text-align: center |

**Layout**

| Class | What it does |
|---|---|
| `flex` | display: flex |
| `items-center` | align-items: center |
| `justify-between` | justify-content: space-between |
| `grid` | display: grid |
| `grid-cols-3` | three equal columns |

**Colour**: classes follow the pattern `bg-{colour}-{shade}`, `text-{colour}-{shade}`, `border-{colour}-{shade}`, with shades from 50 (very light) to 950 (very dark). Example: `bg-blue-500`, `text-gray-800`.

### Responsive design

Tailwind is **mobile-first**. A class without a prefix applies to all screen sizes. Add a prefix to override it from a given width upwards:

```tsx
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
| `2xl:` | 1536px | Large monitors |

> **Common mistake:** do not use `sm:` to target mobile. Style mobile first (no prefix) and *override* at larger sizes.

```tsx
// Wrong: only centres on screens >= 640px, mobile stays left-aligned
<p className="sm:text-center">

// Correct: centred on mobile, left-aligned from 640px up
<p className="text-center sm:text-left">
```

The `<meta name="viewport" ...>` tag that responsive design needs is already included in Vite's `index.html`.

### State modifiers

Prefixes also work for interaction states, for example `hover:underline` or `hover:bg-blue-700`.

---

### Exercise 3: Style your ProductCard with Tailwind

Go back to `ProductCard.tsx` from Exercise 2 and improve the styling using only Tailwind utility classes.

**Tasks:**

1. Add a hover effect so the card lifts slightly on hover: `hover:shadow-xl hover:-translate-y-1`, plus `transition duration-200` so it animates smoothly.
2. Make the price green instead of blue: `text-green-600`.
3. Add a coloured top border to the card: `border-t-4 border-blue-500`.
4. In `Main.tsx`, extend the product grid so that very wide screens (1280px and up) show **4 columns**. Check it by resizing the browser window or using the device toolbar in your browser's developer tools.

<details>
<summary>Solution</summary>

**ProductCard.tsx**
```tsx
interface ProductCardProps {
  name: string;
  price: number;
  description: string;
}

function ProductCard({ name, price, description }: ProductCardProps) {
  return (
    <div
      className="p-4 bg-white shadow-md rounded-lg border-t-4 border-blue-500
                 hover:shadow-xl hover:-translate-y-1 transition duration-200"
    >
      <h3 className="text-lg font-bold text-gray-800">{name}</h3>
      <p className="text-gray-500 text-sm mt-1">{description}</p>
      <p className="text-green-600 font-semibold mt-2">${price.toFixed(2)}</p>
    </div>
  );
}

export default ProductCard;
```

**Main.tsx** (the products grid element)
```tsx
<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
```

</details>

---

## 9. Putting it all together

### The component tree

```
App                      ← owns the products data
├── Header
├── Main                 ← receives `products` as a prop
│   └── ProductCard (×3) ← receives name, price, description, category
└── Footer
```

### The project structure

```
src/
├── components/
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Main.tsx
│   └── ProductCard.tsx
├── App.tsx
├── index.css
├── main.tsx
└── types.ts
```

### Exercise 4: Capstone

This exercise combines everything from this milestone.

**Tasks:**

1. Make sure `Header`, `Footer`, `Main` and `ProductCard` are in place from the previous exercises.
2. Add a `category` property (a `string`, e.g. `"Footwear"`, `"Fitness"`, `"Hydration"`) to the `Product` interface and to `ProductCardProps`. Display it as a small badge above the product name using: `text-xs font-semibold uppercase tracking-wide text-white bg-blue-500 px-2 py-0.5 rounded-full`.
3. Add an `"Add to Cart"` button at the bottom of each card. It does not need to do anything yet. Just style it with Tailwind.
4. Move the `products` array from `Main.tsx` to `App.tsx` and pass it down: `<Main products={products} />`. Give `Main` a typed props interface (`MainProps`) so it accepts `products: Product[]`.

> Step 4 is the key React idea of this milestone: **data lives as high as it needs to, and is passed down through props.** In the next milestone you will add state to `App` so the cart button can actually update a total.

<details>
<summary>Solution</summary>

**src/types.ts**
```ts
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
}
```

**src/components/ProductCard.tsx**
```tsx
interface ProductCardProps {
  name: string;
  price: number;
  description: string;
  category: string;
}

function ProductCard({ name, price, description, category }: ProductCardProps) {
  return (
    <div
      className="p-4 bg-white shadow-md rounded-lg border-t-4 border-blue-500
                 hover:shadow-xl hover:-translate-y-1 transition duration-200"
    >
      <span
        className="text-xs font-semibold uppercase tracking-wide text-white
                   bg-blue-500 px-2 py-0.5 rounded-full"
      >
        {category}
      </span>
      <h3 className="text-lg font-bold text-gray-800 mt-2">{name}</h3>
      <p className="text-gray-500 text-sm mt-1">{description}</p>
      <p className="text-green-600 font-semibold mt-2">${price.toFixed(2)}</p>
      <button
        className="mt-3 w-full bg-blue-500 text-white text-sm font-semibold
                   py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
```

**src/components/Main.tsx** (now receives the products as a prop)
```tsx
import type { Product } from "../types";
import ProductCard from "./ProductCard";

interface MainProps {
  products: Product[];
}

function Main({ products }: MainProps) {
  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      {/* Welcome Section */}
      <section className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-blue-700">Welcome to Our Store!</h2>
        <p className="mt-4 text-gray-600">Discover our amazing products and enjoy exclusive deals.</p>
      </section>

      {/* Products */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            description={product.description}
            category={product.category}
          />
        ))}
      </section>
    </main>
  );
}

export default Main;
```

**src/App.tsx** (owns the data, passes it down)
```tsx
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import type { Product } from "./types";

const products: Product[] = [
  { id: 1, name: "Running Shoes", price: 89.99, description: "Lightweight and fast.", category: "Footwear" },
  { id: 2, name: "Yoga Mat", price: 24.99, description: "Non-slip, 6mm thick.", category: "Fitness" },
  { id: 3, name: "Water Bottle", price: 14.99, description: "Insulated, 750ml.", category: "Hydration" },
];

function App() {
  return (
    <div className="App">
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
| SPAs | One HTML page, JavaScript handles updates and navigation |
| Vite | Scaffolds the project and runs the dev server (`react-ts` template for TypeScript) |
| TypeScript | JavaScript plus types; mistakes show up in the editor before you run the code |
| Components | Functions that return JSX, named in PascalCase, in `.tsx` files |
| JSX | HTML-like syntax inside TypeScript; `{}` embeds expressions |
| Props | Data passed from parent to child, read-only in the child, described with an `interface` |
| Lists | `.map()` plus a stable `key` |
| Tailwind | Utility classes applied directly in JSX, mobile-first |

---

## What's Next?

In Milestone 2 you will add **state** with `useState`, handle **user events** (like clicking "Add to Cart"), and make the cart interactive. You will also meet `useEffect` and learn how to **fetch real product data** from an API, and you will type that data with the same kind of interfaces you wrote today.

---

## Milestone 1: Expected Deliverables

- A working React + TypeScript project created with Vite
- Tailwind CSS set up and visibly working
- Five components: `App`, `Header`, `Main`, `ProductCard` and `Footer`
- A shared `Product` interface in `src/types.ts`
- Props used to pass data from parent to child, with typed props interfaces
- `npm run build` finishes without TypeScript errors

---

## Bonus Challenges

- Add an **optional** `image?: string` prop to `ProductCard` and display a product photo when it is provided (placeholder images are available at [picsum.photos](https://picsum.photos)).
- Replace `category: string` with a **union type**, for example `"Footwear" | "Fitness" | "Hydration"`, and see what TypeScript says when you misspell a category.
- Add an `inStock: boolean` property and show an "Out of stock" label when it is `false` (hint: a ternary or `&&` inside `{}`).

---

## Additional Resources

- [React Official Docs](https://react.dev)
- [React Docs: Using TypeScript](https://react.dev/learn/typescript)
- [TypeScript in 5 minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [React TypeScript Cheatsheets](https://react-typescript-cheatsheet.netlify.app/)
- [Vite Documentation](https://vite.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MDN: JavaScript Basics](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
