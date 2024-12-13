'use client';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Role, Users } from '@/app/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const AdminUsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; username: string; role: Role }>({
    id: '',
    email: '',
    username: '',
    role: 'GUEST',
  });
  const router = useRouter();

  useEffect(() => {
    // Fetch current user information
    async function fetchCurrentUser() {
      try {
        const res = await fetch('/api/auth/current-user');
        if (!res.ok) throw new Error('Failed to fetch current user');
        const data = await res.json();
        setCurrentUser(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          alert(err.message || 'Failed to authenticate.');
        } else {
          alert('Failed to authenticate.');
        }
      }
    }

    fetchCurrentUser();

    // Fetch all users
    async function fetchUsers() {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Failed to authenticate.');
        } else {
          setError('Failed to authenticate.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    // Prevent deleting the current user
    if (currentUser.id === id) {
      alert("You can't delete your own account.");
      return;
    }

    // Confirm deletion
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to delete user');
      setUsers(users.filter((user: Users) => user.id !== id)); // Remove deleted user from state
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message || 'Delete user failed.');
      } else {
        alert('Delete user failed.');
      }
    }
  };

  return (
    <>
      <Breadcrumbs backLink="/admin/" />
      <div className="bg-black min-h-screen">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          {currentUser.role === 'ADMIN' && (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
              onClick={() => router.push('/admin/users/new')}
            >
              Add New User
            </button>
          )}
        </div>

        {/* Content Section */}
        {loading && <p className="text-gray-400">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto bg-gray-900 shadow rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800 border-b">
                  <th className="p-4 text-gray-300 font-medium">ID</th>
                  <th className="p-4 text-gray-300 font-medium">Username</th>
                  <th className="p-4 text-gray-300 font-medium">Email</th>
                  <th className="p-4 text-gray-300 font-medium">Role</th>
                  <th className="p-4 text-gray-300 font-medium">Created At</th>
                  <th className="p-4 text-gray-300 font-medium">Updated At</th>
                  <th className="p-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: Users, index) => (
                  <tr
                    key={user.id}
                    className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'
                      } border-b hover:bg-gray-600 transition`}
                  >
                    <td className="p-4 text-gray-200">{user.id}</td>
                    <td className="p-4 text-gray-200">{user.username}</td>
                    <td className="p-4 text-gray-200">{user.email}</td>
                    <td className="p-4 text-gray-200 capitalize">{user.role}</td>
                    <td className="p-4 text-gray-200">{new Date(user.createdAt).toLocaleString()}</td>
                    <td className="p-4 text-gray-200">{new Date(user.updatedAt).toLocaleString()}</td>
                    <td className="p-4 flex space-x-2">
                      {(currentUser.role === 'ADMIN' || user.id === currentUser.id) && (
                        <button
                          className="px-3 py-1 text-sm bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
                          onClick={() => router.push(`/admin/users/${user.id}`)}
                        >
                          Edit
                        </button>
                      )}
                      {/* Conditionally render the delete button */}
                      {user.id !== currentUser.id && currentUser.role === 'ADMIN' && (
                        <button
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded shadow hover:bg-red-600 transition"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminUsersList;