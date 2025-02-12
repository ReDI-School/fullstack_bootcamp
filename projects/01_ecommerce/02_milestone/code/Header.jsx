/**
 * Header.jsx - Milestone 2
 * This component renders the website header with the title, navigation links, and a cart counter.
 * The cart counter dynamically updates based on the number of items in the cart.
 */

function Header({ cartCount }) {
  return (
    <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
      {/* Website Title */}
      <h1 className="text-2xl font-bold">My E-Commerce Store</h1>

      {/* Navigation and Cart */}
      <nav className="flex items-center space-x-6">
        <a href="/" className="hover:underline">Home</a>
        <a href="/products" className="hover:underline">Products</a>
        <div className="relative">
          <button className="bg-blue-600 py-1 px-3 rounded hover:bg-blue-700">
            View Cart
          </button>
          {/* Cart Counter */}
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-2">
              {cartCount}
            </span>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
