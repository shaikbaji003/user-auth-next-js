"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthFormProps {
  isLogin?: boolean;
}

export default function AuthForm({ isLogin = false }: AuthFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === '' || password === '') {
      alert("Please fill out all fields");
      return;
    }
    
    if (!isLogin) {
      // Signup logic
      localStorage.setItem('auth', JSON.stringify({ username }));
      alert("User created successfully!");
      router.push('/login');
    } else {
      // Login logic
      const authData = localStorage.getItem('auth');
      if (authData) {
        const { username: savedUsername } = JSON.parse(authData);
        if (savedUsername === username) {
          router.push('/home');
        } else {
          alert("Invalid credentials");
        }
      } else {
        alert("No user found. Please sign up.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl mb-4">{isLogin ? 'Login' : 'Sign Up'}</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="block w-full mb-4 p-2 border"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="block w-full mb-4 p-2 border"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {isLogin ? 'Login' : 'Sign Up'}
      </button>
      {isLogin && (
        <p className="mt-4">
          New here? <a href="/signup" className="text-blue-500">Sign Up</a>
        </p>
      )}
    </form>
  );
}
