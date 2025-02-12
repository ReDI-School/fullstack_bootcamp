/**
 * Main.jsx
 * This component renders the main content area of the website.
 * It includes a welcome message and a placeholder for product listings.
 * Tailwind CSS classes are used for styling.
 */

function Main() {
  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      {/* Welcome Section */}
      <section className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-blue-700">Welcome to Our Store!</h2>
        <p className="mt-4 text-gray-600">Discover our amazing products and enjoy exclusive deals.</p>
      </section>

      {/* Product Listings Placeholder */}
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
