'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    setLoggedIn(!!auth); // Check if user is authenticated
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth'); // Remove auth info
    setLoggedIn(false); // Update state
    router.push('/login'); // Redirect to Login
  };

  return (
    <nav className="p-4 bg-blue-500 text-white flex justify-between">
      <b><h1>User Dashboard</h1></b>
      {loggedIn ? (
        <button 
          onClick={handleLogout} 
          className="bg-red-500 px-4 py-2 rounded transition duration-300 hover:bg-red-600"
        >
          Logout
        </button>
      ) : (
        <div>
          <a 
            href="/login" 
            className="mr-4 transition duration-300 hover:text-yellow-800"
          >
            Login
          </a>
          <a 
            href="/signup" 
            className="transition duration-300 hover:text-yellow-800"
          >
            Sign Up
          </a>
        </div>
      )}
    </nav>
  );
}
