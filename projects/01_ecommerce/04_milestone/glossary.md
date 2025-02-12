# **Glossary: Milestones 1, 2, and 3**

This glossary provides definitions and explanations of the key terms and concepts covered in the first three Milestones of the React Bootcamp.

---

## **React Concepts**

### **Component**
- **Definition**: The building block of a React application. Components are reusable, independent pieces of UI.
- **Example**: A `Header` or `ProductCard` component.

### **useState**
- **Definition**: A React hook that allows functional components to manage local state.
- **Example**:
  ```javascript
  const [count, setCount] = useState(0);
  ```
  This initializes a state variable `count` with a default value of `0`.

### **Props**
- **Definition**: Short for "properties", props are used to pass data from a parent component to a child component.
- **Example**: Passing a `title` prop to a `ProductCard`:
  ```javascript
  <ProductCard title="Laptop" />
  ```

### **Hooks**
- **Definition**: Functions that let you "hook into" React state and lifecycle features in functional components.
- **Key Hooks**: `useState`, `useEffect`.

### **useEffect**
- **Definition**: A React hook used to perform side effects in functional components, such as fetching data.
- **Example**:
  ```javascript
  useEffect(() => {
    console.log("Component mounted!");
  }, []);
  ```

---

## **JavaScript Methods**

### **.map()**
- **Definition**: A method used to transform an array by applying a function to each element.
- **Example**:
  ```javascript
  const numbers = [1, 2, 3];
  const doubled = numbers.map(num => num * 2); // [2, 4, 6]
  ```

### **.filter()**
- **Definition**: A method used to create a new array containing elements that pass a given test.
- **Example**:
  ```javascript
  const products = [{ price: 10 }, { price: 20 }];
  const expensive = products.filter(product => product.price > 15);
  ```

### **.includes()**
- **Definition**: Checks if a string or array contains a specified value.
- **Example**:
  ```javascript
  const name = "React";
  console.log(name.includes("Re")); // true
  ```

---

## **CSS Concepts**

### **Responsive Design**
- **Definition**: An approach to web design that ensures layouts adapt to different screen sizes.
- **Key Techniques**: CSS Grid, Flexbox, media queries.

### **Transitions**
- **Definition**: Used to animate changes in CSS properties.
- **Example**:
  ```css
  button {
    transition: background-color 0.3s ease;
  }
  ```

### **Hover Effects**
- **Definition**: CSS rules that apply when an element is hovered over by a cursor.
- **Example**:
  ```css
  button:hover {
    background-color: blue;
  }
  ```

---

## **Project-Specific Terms**

### **State**
- **Definition**: Data managed within a React component that changes over time.

### **Props Drilling**
- **Definition**: The process of passing props through multiple levels of components.

### **Dynamic Filtering**
- **Definition**: Filtering data based on user input, such as a search term or category.

---

## **Additional References**

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [JavaScript Array Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [CSS Tricks on Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

---
