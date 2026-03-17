import { Router, Request, Response } from "express";
import multer from "multer";
import { parseDocx } from "../services/parser";
import { tailorResume } from "../services/aiService";
import { generateDocx } from "../services/docxGenerator";
import { generatePdf } from "../services/pdfGenerator";
import type { AiProvider } from "../types";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .docx files are allowed"));
    }
  },
});

router.post(
  "/parse",
  upload.single("resume"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }
      const parsed = await parseDocx(req.file.buffer);
      res.json(parsed);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to parse resume";
      res.status(500).json({ error: message });
    }
  }
);

router.post(
  "/tailor",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { resumeHtml, jobDescription, provider = "claude" } = req.body as {
        resumeHtml: string;
        jobDescription: string;
        provider?: AiProvider;
      };
      if (!resumeHtml || !jobDescription) {
        res
          .status(400)
          .json({ error: "Resume HTML and job description are required" });
        return;
      }
      const validProviders: AiProvider[] = ["claude", "gemini"];
      if (!validProviders.includes(provider)) {
        res.status(400).json({ error: `Invalid provider: ${provider}` });
        return;
      }
      const tailoredHtml = await tailorResume(
        resumeHtml,
        jobDescription,
        provider
      );
      res.json({ tailoredHtml });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to tailor resume";
      res.status(500).json({ error: message });
    }
  }
);

router.post(
  "/download/docx",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { html, filename } = req.body as {
        html: string;
        filename?: string;
      };
      if (!html) {
        res.status(400).json({ error: "HTML content is required" });
        return;
      }
      const buffer = await generateDocx(html);
      const name = filename || "tailored-resume";
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${name}.docx"`
      );
      res.send(buffer);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate DOCX";
      res.status(500).json({ error: message });
    }
  }
);

router.post(
  "/download/pdf",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { html, filename } = req.body as {
        html: string;
        filename?: string;
      };
      if (!html) {
        res.status(400).json({ error: "HTML content is required" });
        return;
      }
      const buffer = await generatePdf(html);
      const name = filename || "tailored-resume";
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${name}.pdf"`
      );
      res.send(buffer);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate PDF";
      res.status(500).json({ error: message });
    }
  }
);

export default router;
