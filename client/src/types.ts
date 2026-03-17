export interface ParseResponse {
  html: string;
  rawText: string;
}

export interface TailorResponse {
  tailoredHtml: string;
}

export type AppStep = "upload" | "tailoring" | "editing";

export type AiProvider = "claude" | "gemini";
