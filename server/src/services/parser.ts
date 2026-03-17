import mammoth from "mammoth";
import { ParsedResume } from "../types";

export async function parseDocx(buffer: Buffer): Promise<ParsedResume> {
  const [htmlResult, textResult] = await Promise.all([
    mammoth.convertToHtml({ buffer }),
    mammoth.extractRawText({ buffer }),
  ]);

  return {
    html: htmlResult.value,
    rawText: textResult.value,
  };
}
