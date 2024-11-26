import React from "react";
import LoginForm from "./LoginForm";
import Link from "next/link";

// Main layout component that wraps the entire application
// Handles navigation and authentication state
const Layout = ({ children, onLogin, onLogout, username }) => {
  // If user is not logged in, show Twitter-style landing page
  if (!username) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4">
          <div className="flex min-h-screen">
            {/* Left side - Twitter banner */}
            <div className="hidden md:flex md:w-1/2 relative bg-twitter-blue items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-1/2 h-1/2 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
                </svg>
              </div>
            </div>

            {/* Right side - Login form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-4 md:px-12">
              <div className="max-w-lg">
                {/* Twitter logo for mobile */}
                <div className="md:hidden mb-8">
                  <svg
                    className="w-8 h-8 text-twitter-blue"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
                  </svg>
                </div>

                <h1 className="text-5xl font-bold mb-8">Happening now</h1>
                <h2 className="text-3xl font-bold mb-8">Join today.</h2>

                {/* Login form */}
                <div className="bg-black rounded-2xl p-8 mb-4">
                  <LoginForm onLogin={onLogin} />
                </div>

                {/* Terms and conditions */}
                <p className="text-sm text-gray-500 mt-4">
                  By signing up, you agree to the Terms of Service and Privacy
                  Policy, including Cookie Use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user is logged in, show the main layout
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation bar */}
      <nav className="border-b border-gray-800 bg-black/80 backdrop-blur-md fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* App logo */}
            <Link href="/" className="text-twitter-blue">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
              </svg>
            </Link>

            {/* User menu */}
            <div className="flex items-center gap-4">
              <Link
                href={`/profile?user=${username}`}
                className="text-white hover:text-gray-300"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-700" />
                  <span>{username}</span>
                </div>
              </Link>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-white bg-transparent border border-gray-600 rounded-full hover:bg-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content with top padding for fixed navbar */}
      <main className="pt-16">{children}</main>
    </div>
  );
};

export default Layout;
