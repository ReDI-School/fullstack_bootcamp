// components/Header.js
// 📌 Displays the navigation bar for the Twitter Clone.

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-300 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* App Title */}
        <h1 className="text-2xl font-bold">
          <Link href="/">Twitter Clone</Link>
        </h1>

        {/* Navigation Links */}
        <nav>
          <Link href="/" className="mr-4 hover:underline">
            Home
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
