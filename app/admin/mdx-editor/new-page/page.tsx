'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import MDEditor from '@uiw/react-md-editor';  // import MDEditor component

const PageEditor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { slug } = useParams(); // get the slug from the URL

  const isEditMode = Boolean(slug); // judge whether it is in edit mode

  // edit mode: fetch the page data from the server
  useEffect(() => {
    if (!isEditMode) return;

    async function fetchPage() {
      try {
        const res = await fetch(`/api/pages/slug/${slug}`);
        if (!res.ok) throw new Error('Failed to fetch page');
        const data = await res.json();
        setTitle(data.title);
        setContent(data.content);
      } catch (error) {
        console.error('Error fetching page:', error);
        setError('Failed to load page data');
      }
    }

    fetchPage();
  }, [isEditMode, slug]);

  const handleContentChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContent(value);
    }
  };

  const handleSubmit = async () => {
    if (loading) return;
    if (!title || !content) {
      setError('Please fill out all fields.');
      return;
    }

    setLoading(true);
    setError('');

    const pageData = {
      title,
      content,
      slug: isEditMode ? slug : uuidv4(), // edit mode: use the existing slug, create mode: generate a new slug
    };

    try {
      const res = await fetch(`/api/pages${isEditMode ? `/slug/${slug}` : ''}`, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save page');
      }

      alert(`Page ${isEditMode ? 'updated' : 'created'} successfully`);
      router.push('/admin/mdx-editor');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Unexpected error');
      } else {
        setError('Unexpected error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/mdx-editor');
  };

  return (
    <div className="w-full mx-auto">
      <h1 className="text-2xl font-bold mb-4">{isEditMode ? `Edit Page` : 'Create New Page'}</h1>
      <div className={`flex flex-col space-y-4 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <MDEditor
          value={content}
          onChange={handleContentChange}
          className="p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[500px]"
        />

        <div className="grid grid-cols-6 gap-4 mt-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 col-span-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 rounded ${loading ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'}  col-span-4`}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Page' : 'Create Page'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageEditor;