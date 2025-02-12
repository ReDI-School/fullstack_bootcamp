# **Milestone 3: Advanced React Concepts – Reference Guide**

## **Overview**

In Milestone 3, we enhanced the e-commerce application by introducing two key features:

1. **Search Functionality**: Allows users to search for products by name.
2. **Category Filters**: Enables users to filter products dynamically based on selected categories.

---

## **Key Concepts**

### **1. Search Functionality**

- **State Management with `useState`**:
  - Used to track the search term entered by the user.
  - Dynamically updates the product list as the user types.

#### **Code Example: Search State**

```jsx
const [searchTerm, setSearchTerm] = useState("");

function handleSearch(event) {
  setSearchTerm(event.target.value.toLowerCase());
}
```

#### **Code Example: Search Bar**

```jsx
<input
  type="text"
  placeholder="Search products..."
  value={searchTerm}
  onChange={handleSearch}
/>
```

---

### **2. Category Filters**

- **Dropdown Menus with State Management**:
  - Used to track the selected category.
  - Filters the product list based on the selected value.

#### **Code Example: Filter State**

```jsx
const [selectedCategory, setSelectedCategory] = useState("");

function handleFilterChange(event) {
  setSelectedCategory(event.target.value);
}
```

#### **Code Example: Dropdown Menu**

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

### **3. Combining Search and Filters**

- **Filtering Logic**:
  - Combines both the search term and selected category to refine the product list.

#### **Code Example: Filter Logic**

```jsx
const filteredProducts = products.filter((product) => {
  const matchesSearch = product.title.toLowerCase().includes(searchTerm);
  const matchesCategory = selectedCategory
    ? product.category === selectedCategory
    : true;

  return matchesSearch && matchesCategory;
});
```

---

## **Best Practices**

1. **Case-Insensitive Matching**:

   - Always convert strings to lowercase for consistent filtering.
   - Example: `product.title.toLowerCase().includes(searchTerm)`.

2. **Fallback UI for No Results**:

   - Provide a message when no products match the filters.
   - Example: `filteredProducts.length === 0 ? "No products found." : ...`.

3. **Separation of Concerns**:
   - Keep the filtering logic separate from the rendering logic for better readability.

---

## **Learning Objectives**

By the end of this Milestone, students should be able to:

1. Implement dynamic search functionality using state and event handling.
2. Add dropdown filters to refine datasets.
3. Combine multiple state variables for advanced filtering logic.

---

## **Additional Resources**

1. [React Docs: State and Lifecycle](https://react.dev/learn/lifecycle-of-reactive-effects)
2. [MDN Web Docs: Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
3. [React Docs: Controlled Components](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components)
4. [Next.js Documentation](https://nextjs.org/docs/getting-started)

---
