'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MDEditor from '@uiw/react-md-editor'; // import MDEditor component

const EditPage = (props: { params: { slug: string } }) => {
  const [page, setPage] = useState({ title: '', content: '' });
  const router = useRouter();
  // State to hold the slug value
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    // Unwrap params (Promise) to access slug
    const fetchSlug = async () => {
      const unwrappedParams = await props.params; // Unwrap the Promise
      setSlug(unwrappedParams.slug); // Access the slug from the unwrapped params
    };
    fetchSlug();
  }, [props]);  // Depend on params to refetch when it changes

  useEffect(() => {
    if (!slug) return;

    async function fetchPage() {
      try {
        const res = await fetch(`/api/page/${slug}`);
        if (!res.ok) throw new Error(`Page not found: ${slug}`);
        const data = await res.json();
        setPage(data);
      } catch (error) {
        console.error('Error fetching page:', error);
      }
    }

    fetchPage();
  }, [slug]);

  const handleSave = async () => {
    if (!slug) return;
    try {
      const res = await fetch(`/api/page/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(page),
      });

      if (!res.ok) throw new Error('Failed to update page');
      alert('Page updated successfully');
      router.push('/admin/mdx-editor');
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  const handleCancel = () => {
    router.push('/admin/mdx-editor');
  };

  const handleDelete = async () => {
    if (!slug) return;

    const confirmed = window.confirm('Are you sure you want to delete this page? This action cannot be undone.');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/page/${slug}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete page');
      alert('Page deleted successfully');
      router.push('/admin/mdx-editor');  // Redirect after deletion
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Page</h1>
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={page.title}
          onChange={(e) => setPage({ ...page, title: e.target.value })}
          className="p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <MDEditor
          value={page.content}
          onChange={(value) => setPage({ ...page, content: value || '' })}
          className="p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[500px]"
        />

        <div className="grid grid-cols-6 gap-4 mt-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded bg-red-500 hover:bg-red-600"
          >
            Delete Page
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 col-span-4"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPage;