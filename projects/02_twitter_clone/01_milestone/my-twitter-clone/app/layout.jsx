// app/layout.js
// 📌 Defines the global layout for the Twitter Clone.

import "../styles/globals.css";
import Header from "@/components/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="container mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
