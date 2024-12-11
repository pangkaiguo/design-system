'use client';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const MdxPages = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPages() {
      try {
        const res = await fetch('/api/pages');
        if (!res.ok) throw new Error('Failed to fetch pages');
        const data = await res.json();
        setPages(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPages();
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const res = await fetch(`/api/pages/${slug}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete page');
      setPages(pages.filter((page) => page.slug !== slug));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <>
      <Breadcrumbs backLink="/admin/" />
      <div className="bg-black min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">MDX Pages</h1>
          <Link
            href="/admin/mdx-editor/new-page"
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
          >
            Create New Page
          </Link>
        </div>

        {loading && <p className="text-gray-400">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto bg-gray-900 shadow rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800 border-b">
                  <th className="p-4 text-gray-300 font-medium">PageID</th>
                  <th className="p-4 text-gray-300 font-medium">Title</th>
                  <th className="p-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page, index) => (
                  <tr
                    key={page.slug}
                    className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'
                      } border-b hover:bg-gray-600 transition`}
                  >
                    <td className="p-4 text-gray-200">{page.id}</td>
                    <td className="p-4 text-gray-200">
                      <Link
                        href={`/admin/mdx-editor/${page.slug}`}
                        className="text-blue-500 hover:underline"
                      >
                        {page.title}
                      </Link>
                    </td>
                    <td className="p-4 flex space-x-2">
                      <Link
                        href={`/admin/mdx-editor/${page.slug}`}
                        className="px-3 py-1 text-sm bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(page.slug)}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded shadow hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
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

export default MdxPages;