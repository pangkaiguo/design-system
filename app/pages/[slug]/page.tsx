// app/pages/[slug]/page.tsx
import MarkdownView from './MarkdownView';
import Breadcrumbs from '@/components/Breadcrumbs';

interface PageProps {
  params: { slug: string };
}

async function fetchMarkdown(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/pages/${slug}`, {
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
    <>
      <Breadcrumbs backLink="/pages/" />
      <div className="container mx-auto p-4">
        <MarkdownView content={content} />
      </div>
    </>
  );
}