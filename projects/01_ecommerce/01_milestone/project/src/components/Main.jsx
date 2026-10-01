/**
 * Main.jsx
 * This component renders the main content area of the website.
 *
 * EXERCISE 2: Replace the hardcoded product divs below with a reusable
 * ProductCard component. Steps:
 *   1. Create src/components/ProductCard.jsx with props: name, price, description
 *   2. Define a products array above this function
 *   3. Use .map() to render a <ProductCard /> for each product
 *   4. Remember to add a key prop to each card
 *
 * EXERCISE 4: Update this component to receive products as a prop from App.jsx
 *   instead of defining the array here.
 */

function Main() {
  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      {/* Welcome Section */}
      <section className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-blue-700">Welcome to Our Store!</h2>
        <p className="mt-4 text-gray-600">Discover our amazing products and enjoy exclusive deals.</p>
      </section>

      {/* TODO (Exercise 2): Replace the hardcoded divs below with a .map() over
          a products array, rendering a <ProductCard /> for each item */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-bold text-gray-800">Product 1</h3>
          <p className="text-gray-600">This is a placeholder for the product description.</p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-bold text-gray-800">Product 2</h3>
          <p className="text-gray-600">This is a placeholder for the product description.</p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-bold text-gray-800">Product 3</h3>
          <p className="text-gray-600">This is a placeholder for the product description.</p>
        </div>
      </section>
    </main>
  );
}

export default Main;
