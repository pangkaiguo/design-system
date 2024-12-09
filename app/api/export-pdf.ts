import { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument } from "pdf-lib";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { content } = req.body;

    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 400]);
      page.drawText(content || "Empty Content");

      const pdfBytes = await pdfDoc.save();
      res.setHeader("Content-Type", "application/pdf");
      res.send(pdfBytes);
    } catch (error) {
      res.status(500).json({ error: "Failed to export PDF" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

