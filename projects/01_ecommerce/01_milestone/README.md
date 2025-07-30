# **Milestone 1: Introduction to React**

## **Overview**

Welcome to your first milestone in learning React.js! You will learn how to set up a React project, understand components, and build a basic UI structure using React’s core principles.

---

## **Learning Objectives**

✅ Understand React fundamentals and its component-based architecture \
✅ Create a new React project using Vite \
✅ Build and compose reusable functional components \
✅ Style your application using Tailwind CSS \
✅ Fetch and display dynamic data from an API

---

## **1.1 React Basics**

### **What is React?**

React is a powerful JavaScript library for building dynamic and efficient user interfaces. It simplifies the development process with its focus on reusable components and declarative programming.

#### **Key Features**

1. **Virtual DOM**:

   - React uses a virtual representation of the DOM, called the Virtual DOM, which tracks changes and updates only the necessary parts of the actual DOM.
   - This approach improves performance and makes the application more responsive.

2. **Component-Based Architecture**:

   - React applications are built with components, which are independent, reusable pieces of UI.
   - **Analogy**: Think of components as LEGO blocks. Each block is self-contained, and together they create the full application.

3. **Declarative Programming**:
   - React focuses on describing **what** the UI should look like, while React handles **how** to update it.
   - This approach simplifies complex UI logic.

#### **Why Use React?**

- **Efficient**: React updates the UI efficiently using the Virtual DOM.
- **Reusable**: Components can be reused across different parts of the application.
- **Community Support**: React has a large and active developer community with extensive resources.

---

### **Core Concepts**

#### **1. Naming Convention:** Component file names should have its first letter capital and then with uppercase first letter with every changed word (PascalCase). The name of the component follows the same logic, and component and file name are usually the same.

- i.e: FileName: GreetingCard.jsx, Header.jsx
- i.e: Component Name: GreenCard, Header

#### **2. Components**

- Components are the building blocks of React applications.
- They can be functional or class-based, with functional components being the modern standard.
- **Example**: A functional component in React:
  ```jsx
  function Header() { //1 - Create a component, First letter capital
    return <h1>Welcome to My Store</h1>; //2 - return ui element
  } //3
  export default Header; //4 - export to use it into another components
  ```

#### Let's explain above code:

- **Line 1:** Declare/initialize a Component name, start with Capital letter
- **Line 2:** Return the html element h1. Interestingly React treat HTML tags as valid syntax in Javascript.
- **Line 4:** With `export` keyword, we expose this component to the outside world, so it can be use with import statement in other pages/components. Keyword `default` means that this would be a default import component.

  - Default Import can be use like the following in other pages.

    `import Header from './Header';`

    OR

    `import HeaderAsOtherName from './Header';`

  - Named Import: named import are where we omit/don't use the default keyword.

    `import { Header } from './Header';`

    `import { Component1, Component2 } from './Header';`

#### **3. JSX (JavaScript XML)**

- JSX is a syntax extension that allows you to write HTML-like code in JavaScript.
- It simplifies the process of creating UI components by combining structure (HTML) and logic (JavaScript).
- **Example**:
  ```jsx
  const Greeting = () => {
    return <p>Hello, React!</p>;
  };
  ```

#### **4. Props**

- **Props** (short for "properties") allow data to be passed from a parent component to a child component.
- Props are immutable and help make components reusable.
- **Example**:

  ```jsx
  //Filename: WelcomeMessage.jsx
  function WelcomeMessage({ firstName, lastName }) { //L1
    return (
      <h2>
        Welcome, {firstName} {lastName}! //L2
      </h2>
    ); 
  } //L3

  export default WelcomeMessage; //L4
  ```

  ```jsx
  //FileName: ParentComponent.jsx
  import WelcomeMessage from "./WelcomeMessage"; //L1

  function ParentComponent() { //L2
    return <WelcomeMessage firstName="John" lastName="Doe" />; //L3
  } //L4
  ```

  #### Let's explain above code:

  **File Name:** `WelcomeMessage.jsx`

  **Code Explanation:**

- **L1:** declare component name, pass an object as a function parameter.
  Under the hood, React automatically assign the values with matched
  properties that are passed as i.e. (from ParentComponent.jsx)
  as John and Doe with `firstName` and `lastName`.
- **L2:** Interesting :) we can use h2 HTML element with **dynamic** values or **variables**. To print/show the value of the variable we use curly braces `{}` and the name of the variable in between. i.e. `{firsname}` `{lastName}`
- **L4:** export default to expose it to import in other components.

- **File Name:** `ParentComponent.jsx`

- **Code Explanation:**

- **L1:** import `WelcomeMessage` component to use it
- **L2:** Declare `ParentComponent` component
- **L3:** Interesting :) Use `WelcomeMessage` component like like a HTML tag and pass two properties with their respective values. `firstName`, `lastName` are properties of `WelcomeMessage`.

#### **5. Pass Dynamic Props**

- **Examples**:

  ```jsx
  //FileName: ParentComponent.jsx
  import WelcomeMessage from "./WelcomeMessage"; //L1 - Import the child component

  function ParentComponent() { //L2  - Declare the parent component
    const firstName = "John"; //L3 - Declare a constant variable for first name
    const lastName = "Doe"; //L4 - Declare a constant variable for last name
    return <WelcomeMessage firstName={firstName} lastName={lastName} />; //L5 - Pass props to child component
  } //L6
  ```

- **Code Explanation:**
- **L3 & L4:** Line 3 and Line 4 are just simple constant values declaration and assignment.
- **L5:** Interesting :) Props `firstName` and `lastName` are passed dynamically to the `WelcomeMessage` component using curly braces `{}`. Curly braces allow you to pass JavaScript expressions (variables, constants, functions) into JSX. `{firstName}` `{lastName}`.

#### **6. Key Points:**

- There should be only one root element that would return from Component.

```jsx
 // ❌ Wrong Way: Do not return multiple elements side-by-side without a wrapper.
    function Header() {
        return 
        <h1>Welcome, </h1>
        <span> John Doe</span>;
    }

 // ✅ Correct Way:
    function Header() {
        return <h1>Welcome, <span> John Doe</span></h1>;
    }

 // 🔔 If multiline then use braces ( )
    function Header() {
        return (
            <div>
                <h1>Welcome</h1>
                <span>John Doe</span>
            </div>
        );
    }
```

- JSX Must Be Properly Closed

```jsx
function Header() {
  return (
    <>
      <img src="abc.jpg"> // ❌ Wrong Way - no closing tag
      <img src="abc.jpg" />  // ✅ Correct Way: pay attention on />
    </>
  );
}
```

- Use Fragments to Avoid Extra DOM Elements: (React Fragments) `<>` `</>`

```jsx
function Header() {
  return (
    <> // 🔔Pay attention on me
      <h1>Welcome</h1>
      <span>John Doe</span>
    </> // 🔔 Pay attention on me
  );
}
```

- Component name should be always start with Capital letter (PascalCase)

```jsx
 // ❌ Wrong Way:
function header() { ... } //React won't treat this as a component.

// ✅ Correct Way:
function Header() { ... }
```

- Inside JSX, curly braces `{}` are used to embed JavaScript expressions, like variables, functions, and calculations.

```jsx
function ParentComponent() { //L2  - Declare the parent component
  const firstName = "John"; //L3 - Declare a constant variable for first name
  const lastName = "Doe"; //L4 - Declare a constant variable for last name
  return <WelcomeMessage firstName={firstName} lastName={lastName} />; //L5 - Pass props to child component
} //L6
```

- **Default Export:** Can be imported with any name.

```jsx
function Header() { ... }

export default Header;

//OtherFile.jsx
import Header from './Header'; //OR
import ABC from './Header';
```

- **Named Export:** Should import with same name

```jsx
function Header() { ... }
export Header; // named export

//OtherFile.jsx
❌ Wrong:
    import Header  from './Header'; //OR
    import ABC from './Header';

✅ Correct:
import { Header } from './Header';
```

---

## **1.2 Single Page Applications (SPAs)**

### **What are SPAs?**

Single Page Applications (SPAs) are web applications that load a single HTML page and dynamically update content as the user interacts with the app, without requiring a full page reload.

Most of React projects are SPAs, although we are also going to learn in the future how to use more the server-side to render our content.

#### **Key Features**

1. **Dynamic Content Loading**:

   - SPAs update only the necessary parts of the page instead of reloading the entire page.
   - This improves user experience by making interactions faster and smoother.

2. **Reduced Server Load**:

   - SPAs minimize the number of requests sent to the server, as the initial load includes most of the resources.

3. **Enhanced User Experience**:
   - SPAs feel more like desktop applications with seamless navigation and fewer interruptions.

#### **How SPAs Work**

SPAs rely on JavaScript to handle routing and content updates:

- The browser loads the initial HTML, CSS, and JavaScript files.
- JavaScript handles user interactions and updates the DOM dynamically.

---

### **Examples of SPAs**

- Gmail
- Google Maps
- Facebook
- Twitter

These applications demonstrate how SPAs enhance user experience with dynamic and interactive interfaces.

---

## **1.3 Tailwind CSS**

### **What is Tailwind CSS?**

Tailwind CSS is a utility-first CSS framework designed to enable rapid and consistent development. Instead of writing custom CSS, you use pre-defined utility classes to style elements directly in your HTML or JSX.

#### **Key Features**

1. **Utility-First Approach**:

   - Tailwind provides utility classes for common CSS properties (e.g., `text-center`, `p-4`, `bg-blue-500`).
   - This eliminates the need for writing lengthy custom CSS rules.

2. **Highly Customizable**:

   - Tailwind can be extended and configured using its configuration file (`tailwind.config.js`), allowing you to define custom colors, fonts, and more.

3. **Responsive Design**:

   - Built-in responsive utilities make it easy to design for different screen sizes using breakpoints.

4. **Component-Based**:

   - Tailwind integrates seamlessly with React's component-based architecture, enabling clean and reusable code.

5. **Mobile First**:
   - Mobile-first means that the base styles you write without any breakpoints apply to mobile (small screens) by default. Base styles means if we don't use any prefix like `sm:`, `md:`

---

### **Why Use Tailwind CSS?**

- **Consistency**: Utility classes ensure a consistent look and feel across the application.
- **Speed**: Pre-defined classes reduce the time spent writing and debugging custom CSS.
- **Flexibility**: The configuration file allows complete customization to suit project needs.

---

### **Core Concepts**

#### **1. Utility Classes**

Utility classes are the building blocks of Tailwind CSS. Each class applies a single CSS property.

**Examples**:

```html
<div class="text-center font-bold p-4 bg-gray-100 rounded-lg">
  Welcome to Tailwind CSS!
</div>
```

- `text-center`: Centers the text.
- `font-bold`: Makes the text bold.
- `p-4`: Adds padding of 1rem (16px).
- `bg-gray-100`: Sets the background color to light gray.
- `rounded-lg`: Rounds the corners of the element.

---

#### **2. Responsive Design**

Tailwind simplifies responsive design with **breakpoints**.

**Example**:

```html
<div class="p-4 md:p-8 lg:p-12">Responsive Padding Example</div>
```

- `p-4`: Applies padding on small screens.
- `md:p-8`: Increases padding on medium screens (≥768px).
- `lg:p-12`: Increases padding on large screens (≥1024px).

---

#### **3. Customization**

Tailwind allows developers to extend the default theme in the `tailwind.config.js` file.

**Example**:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF",
        secondary: "#FACC15",
      },
    },
  },
};
```

Now, you can use the custom colors as utility classes:

```html
<div class="bg-primary text-secondary">Customized Tailwind Colors</div>
```

#### **4. Key points**

- Make sure this meta tag is added in main html file to support responsive design in general and with TailwindCSS as well  
  `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`

- Design Classes in Tailwind Css:

| Prefix | Minimum Width >= | Devices                                                  |
| ------ | ---------------- | -------------------------------------------------------- |
| sm     | 40rem (640px)    | Large phones, small tablets (portrait)                   |
| md     | 48rem (768px)    | Common tablet landscape width or start of small desktops |
| lg     | 64rem (1024px)   | Latest tablets, Ipads                                    |
| xl     | 80rem (1280px)   | Standard Laptops, Desktop Monitors                       |
| 2xl    | 96rem (1536px)   | Large Monitors, High Res. Laptops                        |

- Example `width: md:wd-48;` 48 width on medium screen. so 48 _ 0.25 = 12rem _ 16px = 192px. `rem` here is root element font size which is html here. So html font-size is 16px and 1 rem = 16px
- **If No prefix then mobile-first, base/default style**

> ❌ Don't use sm: to target mobile devices
>
> > This will only center text on screens 640px and wider, not on small screens
> > `<div class="sm:text-center"></div>`
>
> ✅ Use unprefixed utilities to target mobile, and override them at larger breakpoints
>
> > This will center text on mobile, and left align it on screens 640px and wider  
> > `<div class="text-center sm:text-left"></div>`

---

### **Setting Up Tailwind CSS**

#### **1. Install Tailwind**

Install Tailwind CSS in your project:

```bash
#as we are using vite so there is easier way to install it
npm install tailwindcss @tailwindcss/vite
```

#### **2. Configure Tailwind**

Configure the Vite plugin: Add the @tailwindcss/vite plugin to your Vite configuration. Add following lines in: `vite.config.ts`

`import tailwindcss from '@tailwindcss/vite'`

`tailwindcss()`

```javascript
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite"; //🔔 Pay attention on me

export default defineConfig({
  plugins: [
    tailwindcss(), //🔔 Pay attention on me
  ],
});
```

Update the `tailwind.config.js` file to include your React file paths:

```javascript
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

#### **3. Add Tailwind to CSS**

Import Tailwind's base, components, and utilities into your `index.css`:

```css
@import "tailwindcss";
```

#### **4. Run the Development Server**

Start the development server to see Tailwind in action:

```bash
npm run dev
```

---

## **General Extra Info**

- npm: Node package manager. Used to install libraries or to handle dependencies in Node/React/NextJS project. Bundled with NodeJs.
- NodeJs: Javascript Runtime environment that allows Javascript to run outside of the browser. Built on Chrome's Javascript Engine.
  Installation: https://nodejs.org/en/download
- nvm: Node version manager to allow use to work with different node versions.
- `package.json`: Track dependencies of the project and scripts to automate tasks like start and build. Helps to transfer project, as there is no need to send the required dependencies.
  
| Type    | Description                                                                                                             |
|---------|-------------------------------------------------------------------------------------------------------------------------|
| Major   | Major changes can break old code, like removable of functions                                                           |
| Minor   | New Features but still backward compatibility                                                                           |
| Patch   | Bug fixes usually                                                                                                       |
| ^19.1.0 | Allow updates but major version will not change, 19 here. 19.x.x, x can change here, minor and patch can to any version |
| ~19.1.0 | Allow updates only patch version, like 19.1.x, x is to any version                                                      |
| 19.1.0  | Locked to same version so no change                                                                                     | 

- `package-lock.json`: maintain/lock the exact package versions when you run `npm install`. It regenerates every time with `npm install` but will keep the exist version number when we install any package first time. So `package-lock.json` file makes sure that our colleagues always install the same package versions.
- **Deleting package-lock.json could lead to inconsistency and can break the project**

- **Sometimes to solve errors we may need to delete node_modules folder in our project and may need to run `npm instal` to install all packages again**

---

## **What Have We Learned?**

In this lesson, we covered the foundational concepts of building dynamic web applications using **React** and **Tailwind CSS**. Here's a quick summary of what we've learned:

---

### **1. React Basics**

- React simplifies the development of user interfaces with its component-based architecture, Virtual DOM, and declarative programming approach.
- Components, JSX, and props are the building blocks of any React application.

### **2. Single Page Applications (SPAs)**

- SPAs enhance user experience by dynamically updating content without reloading the page.
- React is an ideal library for building SPAs due to its efficiency and flexibility.

### **3. Tailwind CSS**

- Tailwind CSS allows rapid styling using utility-first classes.
- Responsive design utilities and customization options make it a powerful tool for modern UI development.

---

### **What's Next?**

In the next lesson, we will dive deeper into **React Props** and **State**, explore hooks like `useState` and `useEffect`, and implement routing and dynamic data fetching. This will further enhance our e-commerce application.

---

## Milestone 1 - Expected Deliverables

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

## **Key Commands for Setup**

1. **Install Node.js and npm**:

   - Required for managing dependencies.

2. **Set Up a React Project**:
   - Vite is tool to quickly create a project with all required dependencies for all popular frameworks, like React.
   - More about Vite: https://vite.dev/guide/
   - Use Vite for a lightweight and fast setup:
     ```bash
     npm create vite@latest my-app --template react
     ```
   - Navigate to your project and install dependencies:
     ```bash
     cd my-app
     npm install
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```

---

## **Best Practices**

1. **Component Design**:

   - Keep components small and focused.
   - Use meaningful names for components.

2. **File Structure**:

   - Organize files logically (e.g., `components`, `assets`).

3. **Code Quality**:
   - Use linting tools like ESLint.
   - Format code with Prettier for consistency.

---

## **Additional Resources**

1. [React Official Docs](https://react.dev/blog/2023/03/16/introducing-react-dev)
2. [MDN Web Docs: JavaScript Basics](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
3. [Understanding SPAs](https://www.smashingmagazine.com/2018/11/guide-single-page-applications/)
4. [Vite Documentation](https://vitejs.dev/guide/)
5. [React Documentation](https://react.dev/blog/2023/03/16/introducing-react-dev)
6. [Tailwind CSS Documentation](https://tailwindcss.com/docs/installation)

---
