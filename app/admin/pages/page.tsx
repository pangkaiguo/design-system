'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getServerSideProps(context: any) {
  const { slug } = context.params;
  const page = await prisma.page.findUnique({
    where: { slug },
  });

  return {
    props: {
      page: page || null,
    },
  };
}

const Page = ({ page }: { page: { content: string } | null }) => {
  if (!page) {
    return <p>Page not found</p>;
  }

  return (
    <div>
      <ReactMarkdown>{page.content}</ReactMarkdown>
    </div>
  );
};

export default Page;
