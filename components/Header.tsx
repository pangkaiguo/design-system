'use client';

import { useRouter, usePathname } from 'next/navigation';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isFrontPage = pathname.includes('/pages') || pathname === '/';

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
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;