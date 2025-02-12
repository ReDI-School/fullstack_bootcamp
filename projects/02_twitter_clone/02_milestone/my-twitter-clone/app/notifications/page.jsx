/**
 * Notifications.js - Week 6
 * This page displays user notifications, such as new followers and mentions.
 * It simulates notifications using static data (can be replaced with API calls).
 */
export default function Notifications() {
  const notifications = [
    { id: 1, type: "mention", message: "@user123 mentioned you in a tweet!" },
    { id: 2, type: "follow", message: "John Doe started following you!" },
    { id: 3, type: "like", message: "Your tweet received 10 new likes!" },
  ];

  return (
    <main className="container mx-auto p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-blue-500">🔔 Notifications</h1>

      {/* Notifications List */}
      <ul className="mt-6 space-y-4">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className="bg-gray-100 p-4 rounded-lg shadow-sm"
          >
            {notification.message}
          </li>
        ))}
      </ul>

      {/* Back Button */}
      <a
        href="/"
        className="block text-center mt-6 text-blue-500 hover:underline"
      >
        ⬅️ Back to Home
      </a>
    </main>
  );
}
