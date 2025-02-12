export default async function UserProfilePage({ params }) {
  const { id } = params;

  async function fetchUser() {
    const response = await fetch(`https://dummyjson.com/users/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    return response.json();
  }

  const user = await fetchUser();

  return (
    <div className="container mx-auto py-6 text-center">
      <h1 className="text-2xl font-bold text-blue-600">User Profile</h1>

      {user ? (
        <div className="bg-white p-6 rounded-lg shadow-md inline-block text-left mt-6">
          <img
            src={user.image}
            alt={user.firstName}
            className="w-24 h-24 rounded-full mx-auto"
          />
          <h2 className="text-xl font-semibold mt-4">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-700">{user.email}</p>
          <p className="text-gray-600">
            {user.company.title} at {user.company.name}
          </p>
        </div>
      ) : (
        <p className="text-red-500">Failed to load profile.</p>
      )}
    </div>
  );
}
