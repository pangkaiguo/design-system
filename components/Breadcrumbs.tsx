'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export const Breadcrumbs = ({ backLink }: { backLink: string }) => {
  const router = useRouter();

  return (
    <div
      className="w-full bg-gray-900 text-white py-3 px-4 flex items-center mb-6"
    >
      <button
        onClick={() => router.push(backLink)}
        className="text-blue-500 hover:underline flex items-center"
      >
        <span className="mr-1">←</span>
        <span>Back</span>
      </button>
    </div>
  );
};

export default Breadcrumbs;