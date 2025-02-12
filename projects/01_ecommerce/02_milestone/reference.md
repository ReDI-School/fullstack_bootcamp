# **Milestone 2: Props, State, Hooks, and API Fetching – Gitbook**

## **Overview**

This Milestone focuses on four key React concepts that enable dynamic and interactive applications:

1. **Props**: Passing data between components.
2. **State**: Managing dynamic data within components.
3. **Hooks**: Simplifying state management and side effects.
4. **API Fetching**: Integrating external data into the application.

---

## **Key Concepts**

### **Props**

- Used to pass data from parent to child components.
- **Immutable**: Cannot be modified by the child component.

#### **Code Example**:

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

---

### **State**

- **Local** and **mutable**, allowing components to manage dynamic data.
- Managed using the `useState` hook.

#### **Code Example**:

```jsx
const [count, setCount] = useState(0);
<button onClick={() => setCount(count + 1)}>Increment</button>;
```

---

### **Hooks**

- Extend functionality of functional components.
- **`useState`**: Manages state.
- **`useEffect`**: Handles side effects, such as API calls or logging.

#### **Code Example**:

```jsx
useEffect(() => {
  console.log("Component mounted!");
}, []);
```

---

### **API Fetching**

- Retrieve data from external APIs using the `fetch` function.
- Handle errors and loading states for a smooth user experience.

#### **Code Example**:

```jsx
useEffect(() => {
  async function fetchProducts() {
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
    setProducts(data);
  }
  fetchProducts();
}, []);
```

---

## **Best Practices**

1. **Props**:

   - Use destructuring for cleaner code.
   - Ensure props are immutable.

2. **State**:

   - Keep state local and simple.
   - Avoid directly modifying state.

3. **Hooks**:

   - Use dependency arrays in `useEffect` to control execution.
   - Handle side effects properly.

4. **API Fetching**:
   - Always use try-catch blocks for error handling.
   - Optimize performance with proper dependency management.

---

## **Learning Objectives**

By the end of this Milestone, students should be able to:

1. Use props to pass data between components.
2. Manage dynamic data using `useState`.
3. Utilize `useEffect` for side effects.
4. Fetch and display external data in a React application.

---

## **Additional Resources**

1. [React Docs: Props](https://react.dev/learn/passing-props-to-a-component)
2. [React Docs: State](https://react.dev/learn/state-a-components-memory)
3. [React Docs: Hooks](https://react.dev/reference/react/hooks)
4. [Fake Store API](https://fakestoreapi.com/)

---
