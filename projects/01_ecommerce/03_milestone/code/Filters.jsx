/**
 * Filters.jsx - Milestone 3
 * This component renders the search bar and category dropdown for filtering products.
 */

function Filters({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) {
  return (
    <div className="filters flex justify-center gap-6 mb-6">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Category Dropdown */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="jewelery">Jewelery</option>
        <option value="men's clothing">Men's Clothing</option>
        <option value="women's clothing">Women's Clothing</option>
      </select>
    </div>
  );
}

export default Filters;
