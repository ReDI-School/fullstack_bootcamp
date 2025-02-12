/**
 * layout.js - Root Layout for Twitter Clone (Next.js App Router)
 * This file defines the global structure of the application.
 */

import Navbar from "@/components/Navbar";
import "../styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <Navbar />
        <main className="container mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
