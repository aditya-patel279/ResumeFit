export type AiProvider = "claude" | "gemini";

export interface TailorRequest {
  resumeHtml: string;
  jobDescription: string;
  provider: AiProvider;
}

export interface TailorResponse {
  tailoredHtml: string;
}

export interface DownloadRequest {
  html: string;
  filename?: string;
}

export interface ParsedResume {
  html: string;
  rawText: string;
}
