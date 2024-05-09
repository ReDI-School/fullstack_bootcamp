# Exercise 1: Style for the HTML E-commerce Page

### Objective:

Design a simple e-commerce product page using HTML and basic CSS. This page
should display a product with details like an image, name, price, description,
and an "Add to Cart" button.

### Requirements:

1. HTML Structure:

   - Create a new HTML file (e.g., `index.html`).
   - The page should have a <header> with the company logo and a navigation bar
     with links to "Home", "Shop", "Contact".
   - Below the header, add a main section (<main>) to display the products
   - Add a footer with basic information like contact details and social media
     links.

2. Products List Section:

   - Inside the <main> section, create a container for the products list.
   - Include an image of the product.
   - Add the product name as a heading (`<h1>`).
   - Display the product price.
   - Write a brief description of the product in a paragraph.

3. Basic CSS Styling:

- Use a `<style>` tag within the `<head>` of your HTML file to add basic CSS.
- Style the header to have a background color and properly spaced navigation
  links.
- Center the product image and make it responsive.
- Style the product name, price, and description with appropriate font sizes and
  colors.

### Additional Guidelines:

    - Use semantic HTML elements where appropriate.
    - Ensure the page is visually appealing and easy to navigate.
    - Make sure the product image is responsive and fits well on different screen sizes.
    - The "Add to Cart" button should have a hover effect to enhance user interaction.

### Example Structure:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>R-Commerce</title>
  </head>
  <body>
    <header>
      <h1><a href="./index.html">R-Commerce</a></h1>
      <ul>
        <li>
          <a href=""><!-- link name --></a>
        </li>
        <!--
            ...
            <li></li>
            ...
        -->
      </ul>
    </header>
    <main>
      <section>
        <h3>All the products</h3>
        <ul>
          <li>
            <img
              alt="This is an image"
              src="https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg"
            />
            <h1>
              <!-- Product name -->
            </h1>
            <p>
              <!-- Product description -->
            </p>
            <p>
              <!-- Product rpice -->
            </p>
          </li>
          <!--
            ...
            <li></li>
            ...
          -->
        </ul>
      </section>
    </main>
  </body>
</html>
```

### Submission:

- Complete the HTML and CSS code as described.
- Test the page in a web browser to ensure it looks good on different screen
  sizes.
- Submit the final HTML file (e.g., `index.html`) for review.

Good luck, and have fun creating your e-commerce product page!
