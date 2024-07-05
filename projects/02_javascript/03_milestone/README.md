# 3. Milestone: Adding Products to the Cart

### Objective:

Add interactive functionalities to allow users to add products to the cart. Implement a function that adds selected products to the cart and displays a confirmation message.

### Requirements:

1. **JavaScript Enhancements:**
   - Update your JavaScript file (e.g., `app.js`) to include functionalities for adding products to the cart.
2. **Cart Data Structure:**
   - Define a data structure (e.g., an array) to keep track of the products added to the cart.
3. **Buy Now Button:**
   - Implement an event listener for the "But Now" button for each product.
   - When the button is clicked, the corresponding product should be added to the cart.
4. **Display Cart Items Modal:**
   - Add a section in your HTML to display the items in the cart.
   - Update this section whenever a new item is added to the cart.

### Additional Guidelines:

- Ensure the "Add to Cart" functionality works for all products.
- Make sure the cart display is clear and user-friendly.
- Test the "Add to Cart" functionality in the browser to ensure it works correctly.

### Example HTML for Cart Section:

```jsx
<div id="modalCart" class="modal-cart">
  <div class="modal-cart-content">
    <span class="modal-cart-close">&times;</span>
    <h1>Cart</h1>
    <p>...</p>
  </div>
</div>
```

### Example JavaScript Code for Adding to Cart:

```jsx
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modalCart");
  const cartLink = document.getElementById("cartLink");
  const closeBtn = document.getElementsByClassName("modal-cart-close")[0];
  const cartItems = [];
  const cartDisplay = document.querySelector(".modal-cart-content p");

  cartLink.onclick = function () {
    modal.style.display = "block";
    setTimeout(() => {
      modal.classList.add("show");
    }, 10);
    updateCartDisplay();
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
    });
  });

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
});
```

### Submission:

- Complete the JavaScript code for the "Add to Cart" functionality as described.
- Test the "Add to Cart" functionality in the browser to ensure it works correctly.
- Submit the final JavaScript file (e.g., `app.js`) and updated HTML file for review.

Good luck, and have fun enhancing your e-commerce product page with the "Add to Cart" functionality!
