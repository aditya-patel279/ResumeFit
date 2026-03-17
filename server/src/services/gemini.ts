import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT, buildUserPrompt } from "./aiPrompt";

const getClient = (): GoogleGenerativeAI => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Please add it to your .env file."
    );
  }
  return new GoogleGenerativeAI(apiKey);
};

export async function tailorWithGemini(
  resumeHtml: string,
  jobDescription: string
): Promise<string> {
  const client = getClient();
  const model = client.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  const result = await model.generateContent(
    buildUserPrompt(resumeHtml, jobDescription)
  );

  const response = result.response;
  const text = response.text();

  if (!text) {
    throw new Error("No text response received from Gemini");
  }

  return text;
}
