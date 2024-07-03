### Exercise 1: Enhance E-commerce Page with Flexbox and Responsive Design

**Objective:**
Improve the e-commerce product page by using Flexbox for layout and ensuring the page is fully responsive for different screen sizes.

**Requirements:**

### HTML Structure:

1. **Update Existing HTML Files:**
   - Create two new HTML files (`clothing.html`, `electronics.html`) provided.
   - Below the header, add a main section to display the relative type of products.
   - Ensure the structure follows semantic HTML guidelines.
   - Follow the same structure of `index.html`.

### Flexbox Layout:

1. **Header:**
   - Use Flexbox to create a horizontal layout for the company logo and navigation links.
2. **Main Section:**
   - Use Flexbox to display products in a responsive grid layout.
3. **Footer:**
   - Arrange footer content (contact details and social media links) using Flexbox.

### Responsive Design:

1. **Media Queries:**
   - Use CSS media queries to adjust the layout for different screen sizes (e.g., mobile, tablet, desktop).
2. **Responsive Product Images:**
   - Ensure product images resize correctly on different devices.
3. **Responsive Navigation:**
   - Create a mobile-friendly navigation menu that converts to a hamburger menu on smaller screens.

### Detailed Steps:

1. **Header Flexbox Layout:**
   - Update the `<header>` section to use Flexbox for the logo and navigation bar.
   - Example:
     ```html
     <header class="site--bar">
       <h1 id="site--logo"><a href="./index.html">R-Commerce</a></h1>
       <ul class="navigation">
         <li class="navigation--link">
           <a href="./electronics.html">electronics</a>
         </li>
         <li class="navigation--link">
           <a href="./clothing.html">clothing</a>
         </li>
       </ul>
     </header>
     ```
2. **Product List Flexbox Layout:**
   - Update the `<main>` section to display products using Flexbox.
   - Example:
     ```html
     <main class="root">
       <section class="site--hero">Ready to Shop</section>
       <section class="products">
         <h3 class="products--title">All the products</h3>
         <ul class="products--list">
           <li>
             <div class="product">
               <img
                 alt="This is an image"
                 src="https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg"
                 class="product--image"
               />
               <h1 class="product--name">
                 WD 2TB Elements Portable External Hard Drive - USB 3.0
               </h1>
               <p class="product--description">
                 USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve
                 PC Performance High Capacity; Compatibility Formatted NTFS for
                 Windows 10, Windows 8.1, Windows 7; Reformatting may be
                 required for other operating systems; Compatibility may vary
                 depending on user's hardware configuration and operating system
               </p>
               <p class="product--price">$ 64</p>
             </div>
           </li>
           <!-- More products -->
         </ul>
       </section>
     </main>
     ```
3. **Footer Flexbox Layout:**
   - Update the `<footer>` section to use Flexbox for arranging content.
   - Example:
     ```html
     <footer class="more">
       <section>
         <div class="more--credits">
           <a href="./index.html" target="_blank">R-Commerce</a>
           <p class="more--rights">(c) 2024</p>
         </div>
       </section>
     </footer>
     ```

### CSS Styling:

1. **Basic Flexbox Styling:**
   - Add Flexbox styling to the header, main section, and footer.
   - Example:
     ```css
     /* Flexbox for Header */
     .site--bar {
       background-color: rgba(255, 255, 255, 0.5);
       display: flex;
       justify-content: space-between;
       padding: 22px 32px;
       position: absolute;
       width: 100vw;
     }

     .navigation {
       display: flex;
       justify-content: space-between;
       flex-direction: row;
       flex-wrap: nowrap;
     }

     /* Flexbox for Product List */
     .products--list {
       display: flex;
       flex-wrap: wrap;
       justify-content: space-around;
       gap: 20px;
     }

     .product {
       display: flex;
       flex-direction: column;
       justify-content: flex-start;
       padding: 6px;
       text-align: center;
       max-width: 200px;
     }

     /* Flexbox for Footer */
     .more--credits {
       display: flex;
       justify-content: space-between;
     }
     ```
2. **Responsive Design with Media Queries:**
   - Add media queries to ensure the layout adapts to different screen sizes.
   - Example:
     ```css
     @media (max-width: 1024px) {
       .products--list {
         grid-template-columns: repeat(2, 500px);
       }
     }

     @media (max-width: 768px) {
       .products--list {
         grid-template-columns: repeat(1, 500px);
       }

       .product {
         max-width: 230px;
       }
     }

     @media (max-width: 480px) {
       .product {
         max-width: 180px;
       }
     }
     ```

### Submission:

- Complete the HTML and CSS code as described.
- Test the page in a web browser to ensure it looks good on different screen sizes.
- Submit the final HTML file (e.g., `index.html`, `clothing.html`, `electronics.html`) for review.

Good luck, and have fun enhancing your e-commerce product page with Flexbox and responsive design!
