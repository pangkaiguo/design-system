'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const MdxPages = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPages() {
      try {
        const res = await fetch('/api/page');
        if (!res.ok) {
          throw new Error('Failed to fetch pages');
        }
        const data = await res.json();
        setPages(data);
      } catch (error) {
        console.error('Error fetching pages:', error);
        alert('Failed to load pages. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchPages();
  }, []);

  const handleDelete = async (slug: string) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this page?');
    if (!isConfirmed) return;

    try {
      const res = await fetch(`/api/page/${slug}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete page');
      alert('Page deleted successfully');
      // delete success, refresh page list
      setPages(pages.filter((page) => page.slug !== slug));
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">MDX Pages</h1>
        <Link
          href="/admin/mdx-editor/new-page"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Page
        </Link>
      </div>

      <ul className="mt-6 space-y-4">
        {pages.map((page) => (
          <li
            key={page.slug}
            className="p-4 border rounded shadow-sm hover:shadow-md hover:bg-gray-100 transition"
          >
            <div className="flex justify-between items-center">
              <Link
                href={`/admin/mdx-editor/${page.slug}`}
                className="text-blue-500 hover:underline"
              >
                {page.title}
              </Link>
              <button
                onClick={() => handleDelete(page.slug)}
                className="text-red-500 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MdxPages;