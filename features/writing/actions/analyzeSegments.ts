"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import type {
  AnalyzeSegmentsInput,
  SegmentAnalysisResponse,
} from "../types/writing.types";

const SEGMENT_SYSTEM_PROMPT = `You are a bilingual Business English Coach and Senior Software Architect.
Your task is to analyze a Spanish text that a software engineer wants to translate into professional English,
and divide it into meaningful segments for a step-by-step writing practice exercise.

Rules for segmentation:
1. Create between 2 and 5 segments — never more, never less.
2. Split at natural semantic boundaries: paragraph breaks, topic shifts, transitions from narration to quotes, etc.
3. Keep each segment coherent and self-contained enough to write independently.
4. For each segment, write a short "rationale" explaining WHY you cut there.
5. For each segment, write a "hint" — a concrete writing tip for the professional translation of that specific part
   (e.g., "This paragraph requires formal register. Avoid contractions. Use 'we are pleased to' instead of 'we're happy to'").

Respond ONLY with a valid JSON object in this exact format:
{
  "documentSummary": "<brief summary of the full document's purpose, tone, and context>",
  "segments": [
    {
      "id": 1,
      "segmentText": "<the exact portion of the original Spanish text for this segment>",
      "rationale": "<why this is a logical segment boundary>",
      "hint": "<specific professional writing tip for translating this segment>"
    }
  ]
}`;

export async function analyzeSegments(
  input: AnalyzeSegmentsInput
): Promise<
  | { success: true; data: SegmentAnalysisResponse }
  | { success: false; error: string }
> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error:
        "Gemini API key is not configured. Please add your GEMINI_API_KEY to the .env file.",
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SEGMENT_SYSTEM_PROMPT,
    });

    const userPrompt = `Please analyze the following Spanish text and divide it into segments for writing practice:

"""
${input.fullSpanishText}
"""

Return the segmentation as a JSON object following the format described.`;

    const result = await model.generateContent(userPrompt);
    const responseText = result.response.text();

    const cleanedText = responseText.replace(/```json\n?|\n?```/g, "").trim();
    const data = JSON.parse(cleanedText) as SegmentAnalysisResponse;

    return { success: true, data };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return { success: false, error: errorMessage };
  }
}
