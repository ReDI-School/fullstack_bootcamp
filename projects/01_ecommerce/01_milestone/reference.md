# **Milestone 1: Introduction to React – Reference Guide**

## **Overview**

This Milestone introduces the foundational concepts of React, including its architecture, component-based design, and single-page application (SPA) capabilities.

---

## **Key Concepts**

### **1. What Is React?**

- A **JavaScript library** for building user interfaces.
- Developed by Facebook and widely adopted for its efficiency and flexibility.

#### **Core Features**:

- **Component-Based Architecture**: Build UI by combining reusable components.
- **Virtual DOM**: Improves performance by minimizing direct DOM manipulations.
- **Declarative Syntax**: Define what the UI should look like based on the current state.

---

### **2. Single Page Application (SPA)**

- An application where navigation occurs without full page reloads.
- React dynamically updates the content, providing a seamless user experience.

#### **Advantages of SPA**:

- Faster load times after the initial load.
- Smoother transitions between pages.
- Reduced server load due to fewer requests.

---

### **3. React Components**

- **Functional Components**: Simplified components using functions.
- **Class Components**: Components using ES6 classes (less common with hooks).

#### **Code Example**:

Functional Component Example:

```jsx
function Greeting() {
  return <h1>Hello, World!</h1>;
}
export default Greeting;
```

---

## **Key Commands for Setup**

1. **Install Node.js and npm**:

   - Required for managing dependencies.

2. **Set Up a React Project**:
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

## **Learning Objectives**

By the end of Milestone 1, students should be able to:

1. Understand React's core architecture and features.
2. Set up a React project using Vite.
3. Create and render functional components.

---

## **Additional Resources**

1. [React Official Docs](https://react.dev/blog/2023/03/16/introducing-react-dev)
2. [MDN Web Docs: JavaScript Basics](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
3. [Vite Documentation](https://vitejs.dev/guide/)
4. [React Documentation](https://react.dev/blog/2023/03/16/introducing-react-dev)
5. [Tailwind CSS Documentation](https://tailwindcss.com/docs/installation)

---
