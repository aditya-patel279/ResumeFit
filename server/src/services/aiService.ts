import { tailorWithClaude } from "./claude";
import { tailorWithGemini } from "./gemini";
import type { AiProvider } from "../types";

export async function tailorResume(
  resumeHtml: string,
  jobDescription: string,
  provider: AiProvider
): Promise<string> {
  switch (provider) {
    case "claude":
      return tailorWithClaude(resumeHtml, jobDescription);
    case "gemini":
      return tailorWithGemini(resumeHtml, jobDescription);
    default:
      throw new Error(`Unsupported AI provider: ${provider as string}`);
  }
}
