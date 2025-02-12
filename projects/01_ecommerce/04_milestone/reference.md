# **Recap: Milestones 1, 2, and 3**

---

## **Milestone 1: Introduction to React**

### **Key Concepts**

1. **Understanding React Basics**:

   - React is a library for building user interfaces using a component-based architecture.
   - Components are reusable, independent pieces of UI.
   - JSX (JavaScript XML) allows writing HTML-like syntax directly in JavaScript.

2. **Functional Components**:

   - Functional components are simple JavaScript functions that return JSX.
   - Example:
     ```javascript
     function Header() {
       return <h1>Welcome to My App</h1>;
     }
     ```

3. **Project Setup**:
   - Using Vite for a fast development environment.
   - Folder structure: `src/components/` for reusable components.

### **Milestone 1 Project Overview**

- **Header Component**:
  - Displays the title and navigation links.
  - Encourages reusability and separation of concerns.
- **ProductCard Component**:
  - Represents individual products with a title, price, and placeholder for an image.

---

## **Milestone 2: State Management and Event Handling**

### **Key Concepts**

1. **State with `useState`**:

   - `useState` is a React hook that manages dynamic data in functional components.
   - Example:
     ```javascript
     const [count, setCount] = useState(0);
     ```

2. **Event Handling**:

   - React uses synthetic events to handle user interactions like clicks.
   - Example:
     ```javascript
     function handleClick() {
       console.log("Button clicked!");
     }
     ```

3. **Prop Drilling**:
   - Passing data (props) from parent to child components.
   - Example:
     ```javascript
     <ProductCard title="Laptop" price={999} />
     ```

### **Milestone 2 Project Overview**

- **Main Component**:

  - Fetches product data dynamically from the Fake Store API.
  - Uses state to manage the product list and loading state.

- **Shopping Cart**:
  - Implemented state for adding products to the cart.
  - Updates dynamically when items are added.

---

## **Milestone 3: Search and Filters**

### **Key Concepts**

1. **Search Functionality**:

   - Filtering data based on user input using `.filter()` and `.includes()`.
   - Example:
     ```javascript
     const filteredProducts = products.filter((product) =>
       product.title.toLowerCase().includes(searchTerm.toLowerCase())
     );
     ```

2. **Category Filtering**:

   - Using dropdown menus to filter by category.
   - Example:
     ```javascript
     const filteredByCategory = products.filter(
       (product) => product.category === selectedCategory
     );
     ```

3. **Combining Filters**:
   - Applying multiple filters simultaneously for a better user experience.

### **Milestone 3 Project Overview**

- **Filters Component**:

  - Provides an input field for search and a dropdown for category selection.

- **Enhanced UI**:
  - Improved visual elements with transitions and hover effects.
  - Products dynamically update based on search and filter criteria.

---
