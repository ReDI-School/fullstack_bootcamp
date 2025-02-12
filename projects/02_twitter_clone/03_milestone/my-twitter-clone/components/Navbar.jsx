"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const router = usePathname();
  const isProfilePage = router === "/profile";

  return (
    <nav className="bg-blue-500 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Home Link */}
        <Link href="/" className="text-xl font-bold">
          Twitter Clone
        </Link>

        {/* Navigation Links */}
        <div className="space-x-4">
          <Link href="/tweets" className="hover:underline">
            Tweets
          </Link>
          <Link href="/profile" className="hover:underline">
            Profile
          </Link>
          {isProfilePage ? (
            <Link
              href="/"
              className="bg-white text-blue-500 px-3 py-1 rounded-md hover:bg-gray-100"
            >
              Logout
            </Link>
          ) : (
            <Link
              href="/login"
              className="bg-white text-blue-500 px-3 py-1 rounded-md hover:bg-gray-100"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
