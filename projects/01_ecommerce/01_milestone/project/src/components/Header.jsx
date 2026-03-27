/**
 * Header.jsx
 * This component renders the website header, including the title and navigation links.
 * It uses Tailwind CSS classes for styling.
 */

function Header({title, subtitle}) {
  return (
    <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-sm">{subtitle}</p>
      <nav>
        <a href="/" className="text-white mr-4 hover:underline">Home</a>
        <a href="/products" className="text-white hover:underline">Products</a>
      </nav>
    </header>
  );
}

export default Header;
