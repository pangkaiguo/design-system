// app/pages/[slug]/MarkdownView.tsx
'use client';

import React from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';

interface MarkdownViewProps {
  content: string;
}

const MarkdownView: React.FC<MarkdownViewProps> = ({ content }) => {
  return (
    <div className="bg-gray-100 rounded shadow">
      <MarkdownPreview source={content} />
    </div>
  );
};

export default MarkdownView;