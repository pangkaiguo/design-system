'use client';

import React from 'react';
import { useEffect, useState } from 'react';

interface Page {
  id: number;
  title: string;
  slug: string;
}

export default function PagesList() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/pages', { cache: 'no-cache' });
      const data = await res.json();
      setPages(data);
    } catch (error) {
      console.error('Failed to fetch pages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Pages List</h1>
      <ul className="list-disc pl-5">
        {pages.map((page) => (
          <li key={page.id}>
            <a
              href={`/pages/${page.slug}`}
              className="text-blue-500 hover:underline"
            >
              {page.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}