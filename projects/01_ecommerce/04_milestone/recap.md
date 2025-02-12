# **Recap: Milestone 1 – Introduction to React**

## **Introduction**

In Milestone 1, we began our journey into React, a powerful library for building dynamic and reusable user interfaces. This Milestone focused on understanding the core principles of React, setting up the development environment, and creating the foundational components for our e-commerce project.

---

## **Key Concepts**

### **1. React Overview**

- React is a JavaScript library for building fast, interactive, and component-based web applications.
- **Why React?**:
  - Component-based architecture: Breaks the UI into reusable pieces.
  - Virtual DOM: Efficiently updates and renders changes.
  - Declarative syntax: Write components as functions of the UI state.

### **2. Functional Components**

- Functional components are simple JavaScript functions that return JSX.
- **Advantages**:
  - Easier to write and maintain.
  - Can accept props to customize their behavior.
- **Example**:
  ```javascript
  function Header() {
    return <h1>Welcome to My E-Commerce Store</h1>;
  }
  ```

### **3. JSX (JavaScript XML)**

- JSX allows you to write HTML-like syntax in JavaScript, making it easier to build UI components.
- **Key Features**:
  - Allows embedding JavaScript expressions in curly braces `{}`.
  - Closely resembles HTML but requires proper closing of tags (e.g., `<img />`).
- **Example**:
  ```javascript
  const element = <h1>Hello, React!</h1>;
  ```

### **4. Setting Up a React Project**

- We used Vite for setting up our React project:
  - **Why Vite?**: Fast build tool with hot module replacement (HMR).
  - Steps to create a React app:
    1. Run `npm create vite@latest my-react-app --template react`.
    2. Navigate to the project folder and install dependencies: `npm install`.
    3. Start the development server: `npm run dev`.

### **5. Project Structure**

- Organized the project into reusable components:
  - `src/components/`: Folder for all React components.
  - `App.jsx`: Root component combining all parts of the application.

---

## **Project: Milestone 1**

In Milestone 1, we created the foundational components for an e-commerce store:

### **1. Header Component**

- Displays the website title and basic navigation links.
- **Key Features**:
  - The title uses a `h1` element styled for visibility.
  - Navigation links (`<a>`) provide placeholders for routing.

### **2. ProductCard Component**

- Represents a single product with its title, price, and image.
- **Purpose**:
  - Demonstrates the use of props to pass data from the parent to the child component.
- **Example Usage**:
  ```javascript
  <ProductCard title="Laptop" price={999} image="laptop.jpg" />
  ```

---

## **Learning Outcomes**

By the end of Milestone 1, students were able to:

1. Understand the basic structure and syntax of a React application.
2. Create functional components to build reusable UI elements.
3. Set up a development environment using Vite.

---

# **Recap: Milestone 2 – State Management and Event Handling**

## **Introduction**

In Milestone 2, we explored the fundamentals of state management and event handling in React. These skills are crucial for building interactive and dynamic web applications. By the end of this Milestone, students implemented a shopping cart feature and dynamically fetched product data for the e-commerce project.

---

## **Key Concepts**

### **1. State Management with `useState`**

- **What is State?**
  - State is a dynamic piece of data that determines how a component behaves or renders.
  - React’s `useState` hook allows functional components to manage state.
- **Key Features**:
  - State is preserved across re-renders of a component.
  - Updating state triggers a re-render of the component.
- **Example**:

  ```javascript
  const [count, setCount] = useState(0);

  function increment() {
    setCount(count + 1);
  }
  ```

### **2. Prop Drilling**

- **What are Props?**
  - Props (short for properties) allow data to flow from a parent component to its child components.
- **Challenges of Prop Drilling**:
  - Passing props through multiple levels of components can become cumbersome as the app grows.

### **3. Event Handling**

- **What is Event Handling?**
  - React uses synthetic events to handle user interactions like clicks, key presses, and form submissions.
- **Example**:

  ```javascript
  function handleClick() {
    alert("Button clicked!");
  }

  <button onClick={handleClick}>Click Me</button>;
  ```

### **4. Fetching Data from APIs**

- **Why Fetch Data?**
  - Dynamic applications require data fetched from external sources like APIs.
- **How to Fetch Data?**
  - Use the `fetch` function inside a `useEffect` hook to load data when a component mounts.
- **Example**:

  ```javascript
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      console.log(data);
    }

    fetchData();
  }, []);
  ```

---

## **Project: Milestone 2**

In Milestone 2, students expanded the e-commerce project with the following features:

### **1. Shopping Cart**

- **Purpose**: To allow users to add products to a shopping cart.
- **Implementation**:
  - Managed cart items using the `useState` hook in the `App` component.
  - Passed the `onAddToCart` function as a prop to child components.

### **2. Dynamic Product Listings**

- **Purpose**: Display products dynamically fetched from the Fake Store API.
- **Implementation**:
  - Used the `useEffect` hook to fetch data when the `Main` component loads.
  - Rendered each product using the `ProductCard` component.

### **3. Event-Driven Interactions**

- **Purpose**: Enable user interactions, such as adding products to the cart.
- **Implementation**:
  - Added an "Add to Cart" button to the `ProductCard` component.
  - Handled the button click to update the cart state.

---

## **Learning Outcomes**

By the end of Milestone 2, students were able to:

1. Use the `useState` hook to manage local state in components.
2. Fetch data dynamically from an API and display it in the UI.
3. Handle user interactions using event handlers.

---

# **Recap: Milestone 3 – Search and Filters**

## **Introduction**

In Milestone 3, we enhanced the e-commerce project by introducing search functionality and category-based filtering. These features allow users to interact with the application more effectively, providing a personalized shopping experience. This Milestone also focused on improving the user interface with dynamic updates and better styling.

---

## **Key Concepts**

### **1. Search Functionality**

- **What is Search Functionality?**
  - Enables users to filter displayed items based on text input.
  - Commonly used to find products by name or description.
- **Implementation**:
  - Use JavaScript's `.filter()` method to filter data based on a search term.
  - Example:
    ```javascript
    const filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    ```

### **2. Category-Based Filtering**

- **What is Category Filtering?**
  - Filters products by categories like "Electronics" or "Clothing".
- **Implementation**:
  - Use a dropdown menu (`<select>`) to capture the selected category.
  - Combine the filter logic with search functionality for comprehensive filtering.
  - Example:
    ```javascript
    const filteredByCategory = products.filter((product) =>
      selectedCategory ? product.category === selectedCategory : true
    );
    ```

### **3. Combining Filters**

- **Why Combine Filters?**
  - Combining search and category filters provides a seamless user experience.
  - It allows users to narrow down their search efficiently.
- **Implementation**:
  - Apply both filters sequentially to the same data set.
  - Example:
    ```javascript
    const filteredProducts = products
      .filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((product) =>
        selectedCategory ? product.category === selectedCategory : true
      );
    ```

### **4. Enhanced Styling and UI Improvements**

- **What are UI Enhancements?**
  - Adding visual feedback (e.g., hover effects) and animations to improve usability.
- **Implementation**:
  - Highlight active filters using CSS classes.
  - Add animations for smoother transitions between filtered states.

---

## **Project: Milestone 3**

In Milestone 3, students enhanced the e-commerce app with the following features:

### **1. Filters Component**

- **Purpose**: Provides an input field for search and a dropdown menu for category selection.
- **Implementation**:
  - Captures user input and passes it as state to the parent component.
  - Dynamically updates the displayed products.

### **2. Search and Filter Integration**

- **Purpose**: Combines search and category filters to refine the product list.
- **Implementation**:
  - Managed state for `searchTerm` and `selectedCategory` in the `App` component.
  - Passed these states as props to the `Filters` component.

### **3. Improved User Interface**

- **Enhancements**:
  - Added hover effects to product cards for better visual feedback.
  - Highlighted the selected category in the dropdown menu.
