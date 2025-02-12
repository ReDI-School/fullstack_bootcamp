/**
 * ProductCard.jsx - Milestone 2
 * This component is responsible for rendering individual product cards.
 * It receives product data as props and displays the product image, title, price, and an "Add to Cart" button.
 */

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex flex-col items-center">
      {/* Product Image */}
      <img
        src={product.image}
        alt={product.title}
        className="w-32 h-32 object-cover mb-4"
      />

      {/* Product Title */}
      <h3 className="text-lg font-bold text-gray-800">{product.title}</h3>

      {/* Product Price */}
      <p className="text-gray-600">${product.price.toFixed(2)}</p>

      {/* Add to Cart Button */}
      <button
        onClick={() => onAddToCart(product)}
        className="mt-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
