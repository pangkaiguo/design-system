'use client';

import React, { useState, useEffect } from 'react';
import MarkdownView from './MarkdownView';
import Breadcrumbs from '@/components/Breadcrumbs';

async function fetchMarkdown(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/pages/${slug}`, {
    cache: 'no-cache',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch content');
  }

  return res.json();
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Resolve the params Promise
    params
      .then(({ slug }) => {
        return fetchMarkdown(slug);
      })
      .then(data => {
        setContent(data.content);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching content:', error);
        setError('Failed to fetch content');
        setLoading(false);
      });
  }, [params]); // Dependency array ensures this effect runs only when params changes

  if (loading) {
    return <div>Loading...</div>; // Render loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Render error state
  }

  return (
    <>
      <Breadcrumbs backLink="/pages/" />
      <div className="container mx-auto p-4">
        <MarkdownView content={content} />
      </div>
    </>
  );
}
