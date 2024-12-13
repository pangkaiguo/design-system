import { v4 as uuid4 } from 'uuid';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all pages
export async function GET() {
  try {
    const pages = await prisma.pages.findMany();
    return NextResponse.json(pages);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

// Create a new page
export async function POST(req: NextRequest) {
  try {
    const { title, slug, content } = await req.json();
    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // If no slug is provided, generate a UUID
    const generatedSlug = slug || uuid4();

    const newPage = await prisma.pages.create({
      data: { title, slug: generatedSlug, content },
    });

    return NextResponse.json(newPage, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}

// Update a page
export async function PUT(req: NextRequest) {
  const { slug, title, content } = await req.json();

  if (!slug || !title || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const updatedPage = await prisma.pages.update({
      where: { slug },  // Use slug to find the page
      data: {
        title,
        slug,
        content,
      },
    });
    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

// Delete a page
export async function DELETE(req: NextRequest) {
  const { slug } = await req.json();

  if (!slug) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    await prisma.pages.delete({
      where: { slug },  // Use slug to delete the page
    });
    return NextResponse.json({ message: 'Page deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}