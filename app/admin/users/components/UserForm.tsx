'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';

const UserForm = ({ id }: { id?: string }) => {
  const [form, setForm] = useState({
    email: '',
    username: '',
    gender: '',
    role: '',
    password: '',
  });
  const [currentUser, setCurrentUser] = useState({ email: '', role: '', id: '' });
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
        console.log(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Fetching current user failed.');
        } else {
          setError('Fetching current user failed.');
        }
      }
    }
    fetchCurrentUser();

    if (id) {
      async function fetchUser() {
        try {
          const res = await fetch(`/api/users/${id}`);
          if (!res.ok) throw new Error('Failed to fetch user');
          const data = await res.json();
          setForm(data);
        } catch (err: unknown) {
          if (err instanceof Error) {
            alert(err.message || 'Fetching user failed.');
          } else {
            alert('Fetching user failed.');
          }
        } finally {
          setLoading(false);
        }
      }
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const method = id ? 'PUT' : 'POST';
    const endpoint = id ? `/api/users/${id}` : '/api/users';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error(`Failed to ${id ? 'update' : 'create'} user`);
      } else {
        alert(`User ${id ? 'updated' : 'created'} successfully`);
        router.push('/admin/users');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message || 'Submitting form failed.');
      } else {
        alert('Submitting form failed.');
      }
    }
  };

  return (
    <>
      <Breadcrumbs backLink="/admin/users" />
      <div className="min-h-screen bg-black flex items-start justify-center">
        <div className="w-full bg-gray-900 text-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6">
            {id ? 'Edit User' : 'Add New User'}
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
                <label htmlFor="username" className="text-gray-300 mb-1">Username</label>
                <input
                  type="text"
                  id="username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Enter username"
                  required
                  className="p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="gender" className="text-gray-300 mb-1">Gender</label>
                <select
                  id="gender"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  required
                  className="p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="UNSPECIFIED">Unspecified</option>
                </select>
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
                  {(form.role === 'ADMIN' || currentUser.role === 'ADMIN') && <option value="ADMIN">Admin</option>}
                  <option value="USER">User</option>
                </select>
              </div>

              {!id && (
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
                {id ? 'Update User' : 'Create User'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default UserForm;