# Bonus Milestone: Implementing a Search Functionality and Fetch Remote Data

### Objective:

Implement a search functionality that allows users to search for products by name. Display only the products that match the search query. Additionally, fetch product data from a remote web server to dynamically populate the product list.

### Requirements:

1. **JavaScript Enhancements:**
   - Update your JavaScript file (e.g., `app.js`) to include functionalities for searching products and fetching data from a remote server.
2. **Fetch Product Data:**
   - Use the Fetch API to retrieve product data from a remote web server.
3. **Search Input Element:**
   - Add a search input field to your HTML for users to enter their search queries.
4. **Filter Products:**
   - Implement a function to filter and display products that match the search query.
5. **Display Filtered Products:**
   - Update the product display to show only the products that match the search query.

### Additional Guidelines:

- Ensure the search functionality works for all products.
- Make sure the fetched product data is displayed correctly.
- Test the search and fetch functionalities in the browser to ensure they work correctly.

### Example HTML for Search Input:

```html
<!-- Add this inside the <header> section or above the product list -->
<li class="navbar--search-cart">
  <input type="text" placeholder="Search..." class="navbar--search" />
</li>
```

### Example JavaScript Code for Search Functionality and Fetching Data:

```jsx
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modalCart");
  const cartLink = document.getElementById("cartLink");
  const closeBtn = document.getElementsByClassName("modal-cart-close")[0];
  const searchInput = document.querySelector(".navbar--search");
  const productList = document.querySelector(".products--list");
  const products = Array.from(productList.children);

  cartLink.onclick = function () {
    modal.style.display = "block";
    setTimeout(() => {
      modal.classList.add("show");
    }, 10);
  };

  closeBtn.onclick = function () {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.classList.remove("show");
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
    }
  };

  const addToCartButtons = document.querySelectorAll(".product--buy");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const product = event.target.closest(".product.card");
      const productName = product.querySelector(".product--name").textContent;
      const productPrice = product.querySelector(".product--price").textContent;

      cartItems.push({
        name: productName,
        price: productPrice,
      });

      displayConfirmation(productName);
      updateCartDisplay();
      openCartModal();
    });
  });

  function openCartModal() {
    modal.style.display = "block";
    setTimeout(() => {
      modal.classList.add("show");
    }, 10);
    updateCartDisplay();
  }

  function closeCartModal() {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  }

  function updateCartDisplay() {
    if (cartItems.length === 0) {
      cartDisplay.textContent = "Your cart is empty.";
    } else {
      cartDisplay.innerHTML =
        "<ul>" +
        cartItems
          .map((item) => `<li>${item.name} - ${item.price}</li>`)
          .join("") +
        "</ul>";
    }
  }

  function displayConfirmation(productName) {
    const confirmation = document.createElement("div");
    confirmation.className = "confirmation-message";
    confirmation.textContent = `${productName} has been added to the cart.`;
    document.body.appendChild(confirmation);

    setTimeout(() => {
      confirmation.remove();
    }, 3000);
  }

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    products.forEach((product) => {
      const productName = product
        .querySelector(".product--name")
        .textContent.toLowerCase();
      if (productName.includes(query)) {
        product.style.display = "";
      } else {
        product.style.display = "none";
      }
    });
  });
});
```

### Submission:

- Complete the JavaScript code for the search functionality and fetching data as described.
- Test the search and fetch functionalities in the browser to ensure they work correctly.
- Submit the final JavaScript file (e.g., `app.js`) and updated HTML file for review.

Good luck, and have fun enhancing your e-commerce product page with the search functionality and dynamic data fetching!
