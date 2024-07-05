### Exercise 1: Enhance E-commerce Page with Advanced Template Components

**Objective:**
Add advanced template components to the e-commerce product page, such as cards, modals, and a hero section. Also, provide an overview of other useful components like sliders and breadcrumbs.

### Requirements:

### HTML Structure:

1. **Use Existing HTML Files:**
   - Use the HTML files (`index.html`, `clothing.html`, `electronics.html`) provided in previous milestones.

### Advanced Template Components:

1. **Cards:**
   - The product list is already using card-like structures for displaying products. Ensure these are styled as cards.
2. **Modals:**
   - Add a modal component to display additional product details or images.
3. **Hero Section:**
   - The hero section is already present. Ensure it is styled properly and can be reused across different pages.

### Additional Theoretical Components:

1. **Sliders:**
   - Mention the use of sliders for showcasing featured products or promotions.
2. **Breadcrumbs:**
   - Explain the use of breadcrumbs for better navigation and user experience.
3. **Accordions:**
   - Describe how accordions can be used for FAQ sections or additional product information.

### Detailed Steps:

1. **Cards:**

   - Ensure the product list items are styled as cards.
   - Example:
     ```html
     <ul class="products--list">
       <li>
         <div class="product card">
           <img
             alt="This is an image"
             src="<https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg>"
             class="product--image"
           />
           <h1 class="product--name">
             WD 2TB Elements Portable External Hard Drive - USB 3.0
           </h1>
           <p class="product--description">
             USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC
             Performance High Capacity; Compatibility Formatted NTFS for Windows
             10, Windows 8.1, Windows 7; Reformatting may be required for other
             operating systems; Compatibility may vary depending on user's
             hardware configuration and operating system
           </p>
           <p class="product--price">$ 64</p>
           <button class="product--details">View Details</button>
         </div>
       </li>
       <!-- More products -->
     </ul>
     ```
   - CSS:

     ```css
     .card {
       padding: 20px;
       box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
       border-radius: 12px;
       overflow: hidden;
       transition: transform 0.2s;
     }

     .card:hover {
       transform: scale(1.05);
     }

     .product--details {
       background-color: #dd4c93;
       border: none;
       color: white;
       padding: 10px 20px;
       text-align: center;
       text-decoration: none;
       display: inline-block;
       font-size: 16px;
       margin: 10px 2px;
       cursor: pointer;
       border-radius: 5px;
     }
     ```

2. **Modals:**

   - Add a modal component to display additional product details.
   - Example:
     ```html
     <!-- Modal -->
     <div id="productModal" class="modal">
       <div class="modal-content">
         <span class="close">&times;</span>
         <h1>Product Details</h1>
         <img src="" alt="Product Image" id="modalProductImage" />
         <p id="modalProductDescription"></p>
         <p id="modalProductPrice"></p>
       </div>
     </div>
     ```
   - CSS:

     ```css
     /* MODAL */
     .modal {
       display: none;
       position: fixed;
       z-index: 1;
       left: 0;
       top: 0;
       width: 100%;
       height: 100%;
       overflow: auto;
       background-color: rgb(0, 0, 0);
       background-color: rgba(0, 0, 0, 0.4);
       padding-top: 60px;
     }

     .modal img {
       width: 300px;
     }

     .modal-content {
       position: relative;
       display: flex;
       gap: 20px;
       flex-direction: column;
       justify-content: center;
       align-items: center;
       background-color: #fefefe;
       margin: auto;
       padding: 20px;
       border: 1px solid #888;
       width: 80%;
     }

     .close {
       position: absolute;
       top: 10px;
       right: 20px;
       color: #ff0000;
       font-size: 34px;
       font-weight: bold;
     }

     .close:hover,
     .close:focus {
       color: black;
       text-decoration: none;
       cursor: pointer;
     }
     ```

   - JavaScript:

     ```javascript
     ...
     	...
     		<script/>
     			// Get the modal
     			var modal = document.getElementById("productModal");

     			// Get the button that opens the modal
     			var btns = document.querySelectorAll(".product--details");

     			// Get the <span> element that closes the modal
     			var span = document.getElementsByClassName("close")[0];

     			// When the user clicks the button, open the modal
     			btns.forEach(btn => {
     			  btn.onclick = function() {
     			    modal.style.display = "block";
     			    // Populate modal content based on the product details
     			    var product = btn.closest(".product");
     			    document.getElementById("modalProductImage").src = product.querySelector(".product--image").src;
     			    document.getElementById("modalProductDescription").innerText = product.querySelector(".product--description").innerText;
     			    document.getElementById("modalProductPrice").innerText = product.querySelector(".product--price").innerText;
     			  };
     			});

     			// When the user clicks on <span> (x), close the modal
     			span.onclick = function() {
     			  modal.style.display = "none";
     			};

     			// When the user clicks anywhere outside of the modal, close it
     			window.onclick = function(event) {
     			  if (event.target == modal) {
     			    modal.style.display = "none";
     			  }
     			};
     		</script>
     	</body>
     </html>
     ```

     > _Don't be afraid! You will learn how to read this JavaScript code in the next section of the course. For now, feel free to just copy the code inside a <script> tag in your index.html._

3. **Hero Section:**
   - Ensure the hero section is styled properly.
   - Example:
     ```html
     <section class="site--hero">Ready to Shop</section>
     ```
   - CSS:
     ```css
     .site--hero {
       background-image: url(../images/shopping.jpg);
       background-position: bottom;
       background-repeat: no-repeat;
       background-size: cover;
       color: white;
       font-size: 90px;
       padding: 240px;
       text-align: center;
     }
     ```

### Additional Theoretical Components:

1. **Sliders:**
   - Sliders can be used to showcase featured products or promotions. They allow users to swipe through different items or images in a confined space, making it interactive and visually appealing.
2. **Breadcrumbs:**
   - Breadcrumbs improve navigation by showing the user's current location within the website's hierarchy. They provide a trail for the user to follow back to the starting or entry point.
3. **Accordions:**
   - Accordions can be used for FAQ sections or to hide and show additional product information. They help in organizing content in a clean and collapsible format, allowing users to expand sections of interest.

> Not required for the exercise, but feel free to explore this arguments too.

### Submission:

- Complete the HTML, CSS, and JavaScript code as described.
- Test the page in a web browser to ensure it looks good on different screen sizes.
- Submit the final HTML files (e.g., `index.html`, `clothing.html`, `electronics.html`) for review.

Good luck, and have fun enhancing your e-commerce product page with advanced template components!
