"use client"; // Mark the component as a Client Component

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('auth');
    if (!user) {
      router.push('/login');
    } else {
      router.push('/home');
    }
  }, [router]);

  return <div>Redirecting...</div>;
}
