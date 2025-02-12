/**
 * Main.jsx - Milestone 2 Final
 * This component fetches products dynamically from the Fake Store API and displays them using the ProductCard component.
 * It uses React hooks (useState, useEffect) for state management and data fetching.
 */

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

function Main({ onAddToCart }) {
  // State for storing products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from the Fake Store API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    }

    fetchProducts();
  }, []); // Empty dependency array ensures the fetch runs once

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      {/* Welcome Section */}
      <section className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-blue-700">
          Welcome to Our Store!
        </h2>
        <p className="mt-4 text-gray-600">
          Explore our wide range of products below.
        </p>
      </section>

      {/* Product Listings */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-center col-span-full">Loading products...</p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))
        )}
      </section>
    </main>
  );
}

export default Main;
