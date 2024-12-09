'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const AdminPages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Fetch pages
  useEffect(() => {
    async function fetchPages() {
      try {
        const res = await fetch('/api/page');
        if (!res.ok) throw new Error('Failed to fetch pages');
        const data = await res.json();
        setPages(data);
      } catch (err) {
        setError('Failed to load pages. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchPages();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Pages</h1>
      </div>

      {loading && <p className="text-gray-600">Loading pages...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <ul className="space-y-4">
          {pages.map((page: any) => (
            <li key={page.slug}>
              <Link
                href={`/admin/mdx-editor/${page.slug}`}
                className="text-blue-500 hover:underline"
              >
                {page.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPages;