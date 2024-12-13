// components/MarkdownEditor.tsx
'use client';

import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { ChangeEvent } from 'react';
import { ContextStore } from '@uiw/react-md-editor';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export default function MarkdownEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value?: string, event?: ChangeEvent<HTMLTextAreaElement>, state?: ContextStore) => void;
}) {
  return (
    <div className="container">
      <MDEditor value={value} onChange={onChange} height={500} />
    </div>
  );
}