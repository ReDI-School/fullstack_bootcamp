/**
 * Header.js - Week 6
 * This component represents the navigation bar of the Twitter Clone app.
 * It includes the logo, navigation links, and a responsive menu.
 */

import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-wide">
          <Link href="/" className="hover:text-gray-300 transition-all">
            Twitter Clone
          </Link>
        </h1>

        {/* Navigation Menu */}
        <nav className="hidden sm:flex space-x-6">
          <Link href="/" className="hover:text-gray-300 transition-all">
            Home
          </Link>
          <Link href="/explore" className="hover:text-gray-300 transition-all">
            Explore
          </Link>
          <Link
            href="/notifications"
            className="hover:text-gray-300 transition-all"
          >
            Notifications
          </Link>
          <Link href="/profile" className="hover:text-gray-300 transition-all">
            Profile
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button className="sm:hidden text-xl">☰</button>
      </div>
    </header>
  );
}
