'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiLogOut } from 'react-icons/fi';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isFrontPage = pathname.includes('/pages') || pathname === '/';
  const [username, setUsername] = useState<string | null>(null);

  // Fetch current user info on mount
  useEffect(() => {
    if (isAuthPage) {
      return;
    }
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/current-user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUsername(data.username); // Assuming `data` contains `username`
        } else {
          setUsername(null);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        setUsername(null);
      }
    };

    fetchUser();
  }, [isAuthPage]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        alert('Logout successful!');
        router.push('/login');
      } else {
        alert('Logout failed. Please try again.');
      }
    } catch (err) {
      console.error('Logout error:', err);
      alert('An error occurred during logout.');
    }
  };

  return isAuthPage || isFrontPage ? null : (
    <header className="sticky top-0 z-50 bg-black text-white p-4 flex justify-between items-center border-b border-gray-800">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <div className="flex items-center space-x-4">
        {username && <span className="text-sm text-gray-400">Hello, {username}</span>}
        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-red-600 transition-colors"
          aria-label="Logout"
        >
          <FiLogOut size={18} />
          <span className="sr-only">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;