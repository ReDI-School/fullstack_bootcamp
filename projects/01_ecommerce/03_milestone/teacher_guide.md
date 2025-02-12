# **Milestone 3: Advanced React Concepts – Teacher Guide**

## **Objective**

This Milestone focuses on enhancing the e-commerce application with the following functionalities:

1. Implementing a **search bar** to filter products by name.
2. Adding **category filters** to allow users to filter products dynamically.
3. Combining both search and filter logic for an interactive user experience.

---

## **Key Concepts to Teach**

### **1. Search Functionality**

- Introduce the importance of search functionality for improving user experience.
- Demonstrate how to use the `useState` hook to track user input.
- Explain how to filter a dataset dynamically using `.filter()`.

#### **Teaching Example**: Search Bar

```jsx
const [searchTerm, setSearchTerm] = useState("");

function handleSearch(event) {
  setSearchTerm(event.target.value.toLowerCase());
}
```

### **2. Category Filters**

- Explain how dropdown menus can be used to create filters.
- Teach the use of the `useState` hook to track the selected category.
- Discuss the concept of conditional logic when filtering data.

#### **Teaching Example**: Dropdown Menu

```jsx
const [selectedCategory, setSelectedCategory] = useState("");

function handleFilterChange(event) {
  setSelectedCategory(event.target.value);
}
```

### **3. Combining Search and Filter**

- Highlight the importance of combining multiple state variables for complex filtering.
- Show how to use `.filter()` with multiple conditions.

#### **Teaching Example**: Filtering Logic

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

## **Classroom Flow**

### **1. Warm-Up: Discuss State Management**

Start the session by revisiting the basics of `useState` and how it helps track component-specific data.

#### **Discussion Prompt**:

- "Why is managing state important in a React application?"

### **2. Hands-On: Search Functionality**

1. Demonstrate how to add a search bar to the e-commerce app.
2. Explain the filtering logic and render the updated product list.

#### **Teaching Tips**:

- Emphasize the real-time updates provided by `onChange` events.
- Test with a few example search terms to show dynamic filtering.

### **3. Hands-On: Category Filters**

1. Introduce the dropdown menu for category selection.
2. Show how to track the selected category with `useState`.

#### **Teaching Tips**:

- Discuss how conditional logic helps filter products by category.
- Test with different categories to show the filtering in action.

### **4. Combining Search and Filters**

Guide students in combining the search term and category filter to refine the product list.

#### **Teaching Tips**:

- Explain how `.filter()` can handle multiple conditions.
- Test edge cases, such as no search term or no category selected.

---

## **Common Pitfalls and How to Address Them**

1. **Case Sensitivity in Search**:

   - Always convert strings to lowercase to ensure consistent matching.
   - Example: `searchTerm.toLowerCase()`.

2. **Empty States**:

   - Discuss what to render when no products match the filters.
   - Example: `filteredProducts.length === 0 ? "No products found." : ...`.

3. **Combining Multiple States**:
   - Remind students to consider how multiple states interact and ensure their logic is correct.

---

## **Learning Outcomes**

By the end of this Milestone, students should be able to:

1. Implement a search bar using `useState` and dynamic filtering.
2. Add category filters using a dropdown menu and conditional logic.
3. Combine multiple filters to refine datasets dynamically.

---

## **Additional Resources**

1. [React Docs: State and Lifecycle](https://react.dev/learn/lifecycle-of-reactive-effects)
2. [MDN Web Docs: Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
3. [React Docs: Controlled Components](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components)
4. [Next.js Documentation](https://nextjs.org/docs/getting-started)

---
