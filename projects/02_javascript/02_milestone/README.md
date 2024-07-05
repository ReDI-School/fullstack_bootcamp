# 2. Milestone: Sorting Products

### Objective:

Implement sorting functionalities for the products using JavaScript. Allow users to sort products by price or name.

### Requirements:

1. **JavaScript Enhancements:**
   - Update your JavaScript file (e.g., `app.js`) to include sorting functionalities.
2. **Sorting Options:**
   - Add UI elements (e.g., dropdown or buttons) in your HTML file to allow users to choose sorting criteria (e.g., by price or by name).
   - Update your HTML file to include these sorting options within the `<header>` or above the product list in the `<main>` section.
3. **Sorting Logic:**
   - Implement JavaScript functions to sort the product array based on the selected criteria.
   - Use array methods like `sort` to reorder the products.
4. **Update Product Display:**
   - Modify the DOM to update the product display based on the sorted product array.

### Additional Guidelines:

- Ensure the sorting functions work for both ascending and descending order.
- Make sure the sorting options are intuitive and easy to use for the user.
- Test the sorting functionality in the browser to ensure it works correctly.

### Example HTML for Sorting Options:

```jsx
<div class="products--sorting">
  <label for="sort">Sort by price:</label>
  <select id="sort" class="sort--dropdown">
    <option value="asc">Ascending</option>
    <option value="desc">Descending</option>
  </select>
</div>
```

### Example JavaScript Code for Sorting:

```jsx
document.addEventListener("DOMContentLoaded", () => {
  const sortDropdown = document.getElementById("sort");
  const productList = document.querySelector(".products--list");
  const products = Array.from(productList.children);

  sortDropdown.addEventListener("change", () => {
    const sortOrder = sortDropdown.value;
    const sortedProducts = products.sort((a, b) => {
      const priceA = parseFloat(
        a.querySelector(".product--price").textContent.replace("$", "")
      );
      const priceB = parseFloat(
        b.querySelector(".product--price").textContent.replace("$", "")
      );

      if (sortOrder === "asc") {
        return priceA - priceB;
      } else {
        return priceB - priceA;
      }
    });

    // Clear the product list
    while (productList.firstChild) {
      productList.removeChild(productList.firstChild);
    }

    // Append the sorted products
    sortedProducts.forEach((product) => {
      productList.appendChild(product);
    });
  });
});
```

### Submission:

- Complete the JavaScript code for sorting as described.
- Test the sorting functionality in the browser to ensure it works correctly.
- Submit the final JavaScript file (e.g., `app.js`) and updated HTML file for review.

Good luck, and have fun enhancing your e-commerce product page with sorting functionalities!
