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

// MODAL code suggestion

// document.addEventListener("DOMContentLoaded", () => {
//   const modal = document.getElementById("modalCart");
//   const cartLink = document.getElementById("cartLink");
//   const closeBtn = document.getElementsByClassName("modal-cart-close")[0];

//   cartLink.onclick = function () {
//     modal.style.display = "block";
//     setTimeout(() => {
//       modal.classList.add("show");
//     }, 10);
//   };

//   closeBtn.onclick = function () {
//     modal.classList.remove("show");
//     setTimeout(() => {
//       modal.style.display = "none";
//     }, 300);
//   };

//   window.onclick = function (event) {
//     if (event.target == modal) {
//       modal.classList.remove("show");
//       setTimeout(() => {
//         modal.style.display = "none";
//       }, 300);
//     }
//   };
// });

// MILESTONE 1 suggestions:

// Function to generate product elements
function generateProductElements() {
  // code ...
}

// Call the function to generate product elements when the DOM is fully loaded

// MILESTONE 2 suggestions:

// Sorting
sortDropdown.addEventListener("change", () => {
  // Sorting algorithm suggestion
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
  // code ...

  // Append the sorted products
  // code ...
});

// MILESTONE 3 suggestions:

// Cart
const addToCartButtons = document.querySelectorAll(".product--buy");

addToCartButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    // code ... (add to cart button click logic)
  });
});

function updateCartDisplay() {
  // code ...
}

function displayConfirmation(productName) {
  // code ...
}

// MILESTONE 4 suggestions:
// Input search

searchInput.addEventListener("input", () => {
  // code ...
});

// Remember to add a fetch too!

// fetch('https://fakestoreapi.com/products')
//             .then(res=>res.json())
//             .then(json=> ... )
// ...
