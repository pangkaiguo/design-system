'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';

const UserForm = ({ userId }: { userId?: string }) => {
  const [form, setForm] = useState({ email: '', role: '', password: '' });
  const [currentUser, setCurrentUser] = useState({ email: '', role: '', userId: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const res = await fetch('/api/auth/current-user');
        if (!res.ok) throw new Error('Failed to fetch current user');
        const data = await res.json();
        setCurrentUser(data);
      } catch (err: any) {
        setError('Failed to authenticate');
      }
    }
    fetchCurrentUser();

    if (userId) {
      async function fetchUser() {
        try {
          const res = await fetch(`/api/users/${userId}`);
          if (!res.ok) throw new Error('Failed to fetch user');
          const data = await res.json();
          setForm(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const method = userId ? 'PUT' : 'POST';
    const endpoint = userId ? `/api/users/${userId}` : '/api/users';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(`Failed to ${userId ? 'update' : 'create'} user`);
      alert(`User ${userId ? 'updated' : 'created'} successfully`);
      router.push('/admin/users');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <>
      <Breadcrumbs backLink="/admin/users" />
      <div className="min-h-screen bg-black flex items-start justify-center">
        <div className="w-full bg-gray-900 text-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6">
            {userId ? 'Edit User' : 'Add New User'}
          </h1>
          {loading ? (
            <p className="text-gray-400 text-center">Loading...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <p className="text-red-500">{error}</p>}

              <div className="flex flex-col">
                <label htmlFor="email" className="text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter email"
                  required
                  className="p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="role" className="text-gray-300 mb-1">Role</label>
                <select
                  id="role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  required
                  className="p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  {(form.role === 'admin' || currentUser.role === 'admin') && <option value="admin">Admin</option>}
                  <option value="user">User</option>
                </select>
              </div>

              {!userId && (
                <div className="flex flex-col">
                  <label htmlFor="password" className="text-gray-300 mb-1">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Enter password"
                    required
                    className="p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-md shadow transition duration-200 text-white"
              >
                {userId ? 'Update User' : 'Create User'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default UserForm;