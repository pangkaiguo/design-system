// app/page/[slug]/page.tsx
'use client';

import React from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';

interface PageProps {
  params: { slug: string };
}

async function fetchMarkdown(slug: string) {
  const res = await fetch(`http://localhost:3000/api/page/${slug}`, {
    cache: 'no-cache',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch content');
  }

  return res.json();
}

export default async function Page({ params }: PageProps) {
  const { content } = await fetchMarkdown(params.slug);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-100 rounded shadow">
        <MarkdownPreview source={content} />
      </div>
    </div>
  );
}