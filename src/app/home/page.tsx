'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserData {
  name: string;
  email: string;
  phone: string;
  image: string;
}

export default function HomePage() {
  const [user, setUser] = useState<{ name: string; time: string } | null>(null);
  const [showCelebration, setShowCelebration] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [formData, setFormData] = useState<UserData>({ name: '', email: '', phone: '', image: '' });
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
      router.push('/login'); // Redirect to login if not authenticated
    } else {
      setUser(JSON.parse(auth));
    }

    const timer = setTimeout(() => {
      setShowCelebration(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [router]);

  const handleAddClick = () => {
    setFormData({ name: '', email: '', phone: '', image: '' });
    setShowForm(true);
    setIsEditing(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing !== null) {
      const updatedUsers = users.map((user, index) =>
        index === isEditing ? formData : user
      );
      setUsers(updatedUsers);
    } else {
      setUsers([...users, formData]);
    }
    setShowForm(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (index: number) => {
    const filteredUsers = users.filter((_, i) => i !== index);
    setUsers(filteredUsers);
  };

  const handleEdit = (index: number) => {
    setFormData(users[index]);
    setIsEditing(index);
    setShowForm(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="relative max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded overflow-hidden">
        {showCelebration && (
          <div className="celebration">
            <div className="firework"></div>
            <div className="firework"></div>
            <div className="firework"></div>
          </div>
        )}
        {user ? (
          <>
            <h2 className="text-2xl mb-4 text-center">🎉 Welcome, {user.name}! 🎉</h2>
            <p className="text-center">Login-time: {user.time}</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <div className="absolute top-0 right-0 m-4">
        <button
          onClick={handleAddClick}
          className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 transition"
          style={{ marginTop: '70px' }}
        >
          Add
        </button>
      </div>

      {/* Search Input */}
      <div className="mt-6 max-w-md mx-auto">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by name"
          className="border p-2 w-full rounded mb-4 focus:outline-none focus:ring focus:ring-green-500"
        />
      </div>

      {/* User Cards */}
      <div className="mt-6 max-w-5xl mx-auto grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((userData, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow-lg flex flex-col items-center transition-transform transform hover:scale-105">
              {userData.image && (
                <img
                  src={userData.image}
                  alt="Uploaded"
                  className="w-24 h-24 object-cover rounded-full border-2 border-green-500 mb-2"
                />
              )}
              <div className="flex-grow text-center">
                <h3 className="text-lg font-semibold text-gray-800">{userData.name}</h3>
                <p className="text-sm text-gray-600">Email: {userData.email}</p>
                <p className="text-sm text-gray-600">Phone: {userData.phone}</p>
              </div>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full">No users found</p>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{isEditing !== null ? 'Edit User' : 'Add User'} Details</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Name"
                  className="border p-2 w-full rounded focus:outline-none focus:ring focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Email"
                  className="border p-2 w-full rounded focus:outline-none focus:ring focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="Phone Number (10 digits)"
                  maxLength={10}
                  className="border p-2 w-full rounded focus:outline-none focus:ring focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="border p-2 w-full rounded focus:outline-none focus:ring focus:ring-green-500"
                />
              </div>
              <button className="bg-blue-500 text-white py-2 px-4 w-full rounded hover:bg-blue-600 transition">
                {isEditing !== null ? 'Update' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
