import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// /api/versions
// get all versions
// const response = await fetch('/api/versions', {
//   method: 'GET',
// });
// const versions = await response.json();
// console.log(versions);

// create a new version
// const response = await fetch('/api/versions', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     version: '1.0.0',
//     releaseDate: '2024-12-10T00:00:00Z',
//     changelog: 'Initial release',
//   }),
// });
// const newVersion = await response.json();
// console.log(newVersion);


const prisma = new PrismaClient();

export async function GET() {
  try {
    const versions = await prisma.versions.findMany();
    return NextResponse.json(versions);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    }
    return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { version, releaseDate, changelog } = await req.json();

    if (!version || !releaseDate || !changelog) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newVersion = await prisma.versions.create({
      data: {
        version,
        releaseDate,
        changelog,
      },
    });

    return NextResponse.json(newVersion, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    }
    return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 });
  }
}
