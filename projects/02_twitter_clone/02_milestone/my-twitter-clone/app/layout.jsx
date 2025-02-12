/**
 * layout.js - Week 6
 * This is the root layout component that wraps all pages in a consistent structure.
 * It includes the global header, navigation, and a footer.
 */
import "./globals.css";
import Header from "@/components/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 font-sans antialiased">
        {/* Global Header */}
        <Header />

        {/* Main Content */}
        <main className="container mx-auto p-6">{children}</main>

        {/* Footer */}
        <footer className="text-center py-4 text-gray-600">
          <p>
            © {new Date().getFullYear()} Twitter Clone. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
