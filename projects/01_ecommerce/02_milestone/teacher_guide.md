# **Milestone 2: Props, State, Hooks, and API Fetching – Teacher Guide**

## **Objective**

This guide provides instructors with insights and strategies to effectively teach props, state, hooks, and API fetching in React. These concepts are foundational for building dynamic and interactive applications.

---

## **Key Concepts to Teach**

### **1. Props**

- Explain the purpose of props: Passing data from parent to child components.
- Emphasize immutability and the importance of reusability in components.
- Discuss destructuring for cleaner code.

#### **Example Discussion Prompt**:

- "Why are props immutable, and how does this benefit component design?"

### **2. State**

- Differentiate between props and state.
- Highlight that state is mutable and managed locally in a component.
- Use `useState` to demonstrate basic state management.

#### **Example Discussion Prompt**:

- "What is the difference between props and state in React? Can they work together?"

### **3. Hooks**

- Introduce hooks as a way to manage state and lifecycle methods in functional components.
- Focus on `useState` for dynamic state and `useEffect` for side effects like data fetching.

#### **Example Discussion Prompt**:

- "How does `useEffect` help manage API calls or subscriptions in React?"

### **4. API Fetching**

- Walk through the process of fetching data using the `fetch` API.
- Explain the importance of error handling and loading states.
- Discuss how to optimize API calls using dependency arrays in `useEffect`.

#### **Example Discussion Prompt**:

- "Why is it important to handle errors and loading states during API fetching?"

---

## **Classroom Flow**

### **1. Warm-Up: Introduction to Props**

- Start by showing how props pass data to child components.
- Use a simple example like a `Greeting` component.

#### **Example Code**:

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

### **2. Hands-On: State with `useState`**

- Demonstrate state management by building a counter component.
- Engage students in toggling states, such as marking a product as a "favorite."

#### **Example Code**:

```jsx
const [isFavorite, setIsFavorite] = useState(false);
<button onClick={() => setIsFavorite(!isFavorite)}>
  {isFavorite ? "Unfavorite" : "Favorite"}
</button>;
```

### **3. Exploration: Hooks and `useEffect`**

- Explain how `useEffect` runs after rendering and demonstrate its use for logging or API fetching.
- Fetch products dynamically and update the UI.

#### **Example Code**:

```jsx
useEffect(() => {
  async function fetchData() {
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
    setProducts(data);
  }
  fetchData();
}, []);
```

### **4. Integration: Fetching Products**

- Guide students in integrating API data into the e-commerce project.
- Map through the fetched data to display products dynamically.

#### **Example Code**:

```jsx
products.map((product) => (
  <ProductCard
    key={product.id}
    product={product}
    onAddToCart={handleAddToCart}
  />
));
```

---

## **Common Pitfalls and How to Address Them**

1. **Confusing Props and State**:

   - Clarify that props are passed from parent to child, while state is local to a component.

2. **Infinite Loops in `useEffect`**:

   - Ensure students understand how dependency arrays work.

3. **Not Handling Errors Gracefully**:

   - Emphasize the importance of try-catch blocks and fallback UIs.

4. **Unnecessary Re-Renders**:
   - Discuss how to optimize performance by properly managing state and props.

---

## **Learning Outcomes**

By the end of this Milestone, students should:

1. Pass and use props in child components.
2. Manage state with `useState`.
3. Use `useEffect` to handle side effects and fetch API data.
4. Build dynamic UI components that integrate real-world data.

---

## **Additional Resources**

1. [React Docs: Props](https://react.dev/learn/passing-props-to-a-component)
2. [React Docs: State](https://react.dev/learn/state-a-components-memory)
3. [React Docs: Hooks](https://react.dev/reference/react/hooks)
4. [Fake Store API](https://fakestoreapi.com/)

---
