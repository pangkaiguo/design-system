'use client';

import Link from 'next/link';

const AdminDashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MDX Editor Card */}
        <div className="border rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">MDX Editor</h2>
          <p className="text-gray-600 mb-6">
            Manage and edit your MDX pages effortlessly.
          </p>
          <Link
            href="/admin/mdx-editor"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to MDX Editor
          </Link>
        </div>

        {/* Users List Card */}
        <div className="border rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Users Management</h2>
          <p className="text-gray-600 mb-6">
            View and manage the list of users.
          </p>
          <Link
            href="/admin/users"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Go to Users Management
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;