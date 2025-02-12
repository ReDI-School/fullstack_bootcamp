/**
 * Header.jsx - Milestone 3
 * This component renders the website header with the title and a navigation bar.
 * The navigation includes links and the cart view button.
 */

function Header() {
  return (
    <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
      {/* Website Title */}
      <h1 className="text-2xl font-bold">My E-Commerce Store</h1>

      {/* Navigation and Cart */}
      <nav className="flex items-center space-x-6">
        <a href="/" className="hover:underline">
          Home
        </a>
        <a href="/products" className="hover:underline">
          Products
        </a>
        <div className="relative">
          <button className="bg-blue-600 py-1 px-3 rounded hover:bg-blue-700">
            View Cart
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
