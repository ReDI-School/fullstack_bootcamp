# 1. Milestone: Generating DOM Elements

### Objective:

Use JavaScript to dynamically generate and display product elements on the webpage. This includes creating HTML elements for product listings and injecting them into the DOM.

### Requirements:

1. **JavaScript File:**
   - Create a new JavaScript file (e.g., `app.js`).
   - Link the JavaScript file to your existing HTML file.
2. **Product Data:**
   - Define an array of objects in your JavaScript file to represent the products. Each product should have properties like `id`, `name`, `price`, `description`, and `image`.
3. **Generate Product Elements:**
   - Use JavaScript to loop through the product data array and create HTML elements for each product.
   - Append these elements to the product container within the `<main>` section of your HTML.
4. **DOM Manipulation:**
   - Use DOM methods like `document.createElement`, `element.appendChild`, and `element.innerHTML` to create and insert the product elements.

### Additional Guidelines:

- Ensure the product elements are created dynamically using JavaScript and not hardcoded in the HTML.
- Make sure to use semantic HTML tags where appropriate.
- Test the dynamic generation of product elements in the browser to ensure everything is displayed correctly.

```jsx
// Example array of products
const products = [
  {
    id: 1,
    name: "Product 1",
    price: "$19.99",
    description: "Description for product 1.",
    image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
  },
  {
    id: 2,
    name: "Product 2",
    price: "$29.99",
    description: "Description for product 2.",
    image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
  },
  // Add more products as needed
];

// Function to generate product elements
function generateProductElements() {
  const productContainer = document.querySelector("main section ul");

  products.forEach((product) => {
    const productElement = document.createElement("li");

    productElement.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h1>${product.name}</h1>
      <p>${product.description}</p>
      <p>${product.price}</p>
      <button>Add to Cart</button>
    `;

    productContainer.appendChild(productElement);
  });
}

// Call the function to generate product elements when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", generateProductElements);
```

### Submission:

- Complete the JavaScript code as described.
- Test the dynamic generation of product elements in the browser to ensure they are displayed correctly.
- Submit the final JavaScript file (e.g., `app.js`) for review.

Good luck, and have fun enhancing your e-commerce product page with JavaScript!
