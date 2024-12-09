import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// make sure there is only one PrismaClient instance within the application lifecycle
let prismaClient: PrismaClient;
if (process.env.NODE_ENV === "development") {
  // In development mode, ensure Prisma Client is not repeatedly instantiated.
  if (!(globalThis as any).prisma) {
    (globalThis as any).prisma = new PrismaClient();
  }
  prismaClient = (globalThis as any).prisma;
} else {
  // In production, use a single PrismaClient instance.
  prismaClient = new PrismaClient();
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const pages = await prisma.page.findMany();
      res.status(200).json(pages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch pages" });
    }
  } else if (req.method === "POST") {
    const { title, slug, content } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const page = await prisma.page.create({
        data: { title, slug, content },
      });
      res.status(201).json(page);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create page" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
