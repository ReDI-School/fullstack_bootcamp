# **Milestone 3: Advanced React Concepts – Lesson**

## **3.1 Error Handling in React**

### **Why Is Error Handling Important?**

Errors are inevitable in software development. In React applications, error handling ensures that:

- The user experience is not interrupted by unexpected errors.
- Developers can debug issues effectively.
- The application gracefully recovers from errors.

---

### **Error Handling in API Calls**

When fetching data, handle errors using `try...catch` or `.catch()`.

#### **Example**: Handling API Errors

```jsx
useEffect(() => {
  async function fetchData() {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(true);
    }
  }
  fetchData();
}, []);

if (error) return <p>Error loading products. Please try again.</p>;
```

---

### **Best Practices for Error Handling**

1. **Fallback UI**:

   - Always provide a fallback UI for critical errors.
   - Example: Display a friendly error message or a "Try Again" button.

2. **Error Logging**:

   - Use tools like Sentry or LogRocket for error monitoring.

3. **Granular Boundaries**:
   - Use multiple Error handling messages or codes to localize errors and prevent breaking the entire application.

---

### **Key Takeaways**

1. Handle API errors gracefully with `try...catch` or `.catch()`.
2. Always provide fallback UI to enhance user experience.

---

# **3.2 Advanced React Concepts – Lesson**

## **Overview**

This Milestone, we will enhance the e-commerce application by implementing two important features:

1. **Search Functionality**: Allow users to search for products by name.
2. **Category Filters**: Enable users to filter products based on specific categories.

These features will improve the user experience and introduce key React concepts such as state management and dynamic rendering.

---

## **Concepts Covered**

1. **State Management with useState**:

   - Track user input and selected categories using state.

2. **Dynamic Filtering**:

   - Use filtering logic to dynamically update the product list.

3. **Event Handling**:
   - Implement `onChange` handlers for real-time updates.

---

## **Feature 1: Search Functionality**

### **Objective**

The search functionality allows users to filter products by typing into a search bar. We will use the `useState` hook to track the search term and filter the product list dynamically.

### **Implementation Steps**

1. **Create a State Variable**:
   Use `useState` to store the search term entered by the user.

   ```jsx
   const [searchTerm, setSearchTerm] = useState("");
   ```

2. **Handle Input Changes**:
   Update the state as the user types in the search bar.

   ```jsx
   function handleSearch(event) {
     setSearchTerm(event.target.value.toLowerCase());
   }
   ```

3. **Render a Search Bar**:
   Add an input field above the product list.

   ```jsx
   <input
     type="text"
     placeholder="Search products..."
     value={searchTerm}
     onChange={handleSearch}
   />
   ```

---

## **Feature 2: Category Filters**

### **Objective**

The filter functionality allows users to filter products by category. We will use a dropdown menu to display category options.

### **Implementation Steps**

1. **Create a State Variable**:
   Use `useState` to store the selected category.

   ```jsx
   const [selectedCategory, setSelectedCategory] = useState("");
   ```

2. **Handle Filter Changes**:
   Update the state when a user selects a category.

   ```jsx
   function handleFilterChange(event) {
     setSelectedCategory(event.target.value);
   }
   ```

3. **Render a Dropdown Menu**:
   Add a dropdown menu above the product list.

   ```jsx
   <select value={selectedCategory} onChange={handleFilterChange}>
     <option value="">All Categories</option>
     <option value="electronics">Electronics</option>
     <option value="jewelery">Jewelery</option>
     <option value="men's clothing">Men's Clothing</option>
     <option value="women's clothing">Women's Clothing</option>
   </select>
   ```

---

## **Combining Search and Filters**

To filter the products dynamically based on both the search term and the selected category:

1. **Apply Filtering Logic**:
   Use the `.filter()` method to apply both criteria.

   ```jsx
   const filteredProducts = products.filter((product) => {
     const matchesSearch = product.title.toLowerCase().includes(searchTerm);
     const matchesCategory = selectedCategory
       ? product.category === selectedCategory
       : true;

     return matchesSearch && matchesCategory;
   });
   ```

2. **Render Filtered Products**:
   Display only the products that match the criteria.

   ```jsx
   <div className="products-grid">
     {filteredProducts.map((product) => (
       <div key={product.id} className="product-card">
         <img src={product.image} alt={product.title} />
         <h3>{product.title}</h3>
         <p>${product.price}</p>
       </div>
     ))}
   </div>
   ```

---

## **Key Takeaways**

1. The `useState` hook is a powerful tool for managing local state in functional components.
2. Combining multiple states allows for dynamic and user-friendly features.
3. React's event handling makes it easy to update the UI in real-time.

---

## **Next Steps**

In the next Milestone, we will begin transitioning the e-commerce application to Next.js, exploring features like server-side rendering (SSR) and API routes.

---

## **3.3 Intro to Next.js**

### **What Is Next.js?**

Next.js is a **React framework** that provides additional features and optimizations for building web applications. It is widely used for its ability to render content on the server and its simplified file-based routing system.

#### **Core Features of Next.js**:

1. **Server-Side Rendering (SSR)**:

   - Renders pages on the server and sends the HTML to the client.
   - Improves performance and SEO.

2. **Static Site Generation (SSG)**:

   - Generates static HTML during build time for fast page loads.

3. **File-Based Routing**:

   - Simplifies routing by using the file system.

4. **API Routes**:
   - Enables building APIs directly within the Next.js application.

---

### **Why Use Next.js?**

- **SEO-Friendly**: SSR ensures that pages are indexed effectively by search engines.
- **Faster Performance**: SSG and SSR reduce load times for users.
- **Developer Experience**: Built-in features like routing and API integration save time.

---

### **How Next.js Differs from React**

| Feature                  | React            | Next.js       |
| ------------------------ | ---------------- | ------------- |
| Rendering                | Client-Side Only | SSR, SSG, CSR |
| Routing                  | Custom Solutions | File-Based    |
| Performance Optimization | Manual           | Automatic     |

---

### **Setting Up a Next.js Project**

1. **Install Next.js**:
   Run the following command to create a new Next.js project:

   ```bash
   npx create-next-app my-next-app
   cd my-next-app
   ```

2. **Start the Development Server**:

   ```bash
   npm run dev
   ```

3. **Project Structure**:
   - `pages/`: Contains all the routes for the application.
   - `public/`: Static assets like images.
   - `styles/`: CSS and styling files.

---

### **Example: File-Based Routing**

Create a new file in the `pages/` directory to define a route.

#### **Code Example**:

```jsx
// pages/about.js
function AboutPage() {
  return <h1>About Us</h1>;
}

export default AboutPage;
```

Navigate to `http://localhost:3000/about` to see the route in action.

---

### **Server-Side Rendering in Next.js**

To implement SSR, use the `getServerSideProps` function in your component.

#### **Code Example**:

```jsx
export async function getServerSideProps() {
  const response = await fetch("https://fakestoreapi.com/products");
  const products = await response.json();

  return { props: { products } };
}

function ProductsPage({ products }) {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.title}</li>
      ))}
    </ul>
  );
}

export default ProductsPage;
```

---

### **Best Practices for Next.js**

1. **Optimize Images**:

   - Use the `<Image>` component for better performance.

2. **Prefetch Routes**:

   - Use `Link` for client-side navigation with prefetching.

3. **Use Environment Variables**:
   - Store sensitive information like API keys securely.

---

### **Key Takeaways**

1. Next.js enhances React with SSR, SSG, and file-based routing.
2. It simplifies common tasks like routing and API integration.
3. Ideal for applications where performance and SEO are priorities.

---

## **What Have We Learned?**

This Milestone, we expanded the functionality of our e-commerce application by introducing two new features:

1. **Search Functionality**:

   - Users can dynamically search for products by typing into a search bar.
   - We used the `useState` hook to track the search term and update the product list in real-time.

2. **Category Filters**:
   - Users can filter products by selecting a category from a dropdown menu.
   - We combined the selected category with the search term to refine the product list.

---

## **Key Takeaways**

1. **State Management**:

   - The `useState` hook is essential for managing local component state in React.
   - Multiple state variables can be combined to create powerful filtering logic.

2. **Dynamic Rendering**:

   - Using `.filter()` allows us to dynamically update the UI based on user input.

3. **Event Handling**:
   - React's event handling system (`onChange`) enables real-time updates for search and filter functionality.

---

## **Next Steps**

Next Milestone, we will:

1. Transition the e-commerce project to Next.js, learning about server-side rendering (SSR) and static site generation (SSG).
2. Explore how to integrate APIs with Next.js for enhanced performance and SEO.

---

Congratulations on completing Milestone 3! Keep practicing and building on your React skills as we dive into advanced topics in the next lesson.

---
