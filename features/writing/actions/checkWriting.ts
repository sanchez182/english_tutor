"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import type {
  AiFeedbackResponse,
  CheckWritingInput,
  SegmentFeedbackResponse,
} from "../types/writing.types";

const STANDARD_SYSTEM_PROMPT = `You are a bilingual Senior Software Architect with 20+ years of experience and a Business English Coach.
Your job is to analyze a software engineer's English writing attempt and provide precise, actionable feedback.

The user communicates primarily in Spanish and is working in a technical IT/business environment (C#, .NET, Angular, Flutter, Supabase).

For each mistake you find, analyze:
1. What the error is
2. The grammar rule being violated
3. The correct form
4. Why the correct form is better in an IT/Business context

Respond ONLY with a valid JSON object in this exact format:
{
  "overallScore": <number 0-100>,
  "summary": "<brief professional summary of the attempt>",
  "corrections": [
    {
      "line": "<the specific phrase or sentence with the error>",
      "error": "<what is wrong>",
      "grammarRule": "<the grammar rule being violated>",
      "correctForm": "<the corrected version>",
      "itContext": "<why this matters in an IT/Business setting>"
    }
  ],
  "improvedVersion": "<the full improved English text>"
}

If the writing is already excellent, return an empty corrections array and a high score.
Keep all feedback professional and encouraging. Focus on IT/Business register.`;

const SEGMENT_SYSTEM_PROMPT = `You are a bilingual Senior Software Architect with 20+ years of experience and a Business English Coach.
Your job is to evaluate a software engineer's English translation of a SPECIFIC SEGMENT from a larger Spanish document.

The user communicates primarily in Spanish and is working in a technical IT/business environment (C#, .NET, Angular, Flutter, Supabase).

You will receive:
- The FULL original Spanish document (for full context awareness)
- The SPECIFIC Spanish segment the user is translating
- The user's English translation attempt for that segment

Evaluate ONLY the segment's translation, but be aware of:
- The tone and register required for this segment within the full document
- How this segment connects to surrounding content
- Whether the translation maintains consistency with what came before/after

For each mistake you find, analyze:
1. What the error is
2. The grammar rule being violated
3. The correct form
4. Why the correct form is better in an IT/Business context

Respond ONLY with a valid JSON object in this exact format:
{
  "segmentId": <number>,
  "overallScore": <number 0-100>,
  "summary": "<brief professional summary of the translation attempt>",
  "contextNote": "<1-2 sentences on how this segment fits the larger document and what tone/register is needed>",
  "corrections": [
    {
      "line": "<the specific phrase or sentence with the error>",
      "error": "<what is wrong>",
      "grammarRule": "<the grammar rule being violated>",
      "correctForm": "<the corrected version>",
      "itContext": "<why this matters in an IT/Business setting>"
    }
  ],
  "improvedVersion": "<the improved English translation of this segment only>"
}

If the translation is already excellent, return an empty corrections array and a high score.
Keep all feedback professional and encouraging.`;

export async function checkWriting(
  input: CheckWritingInput
): Promise<
  | { success: true; data: AiFeedbackResponse | SegmentFeedbackResponse }
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

  const isSegmentedMode =
    input.fullSpanishDocument !== undefined && input.segmentId !== undefined;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: isSegmentedMode
        ? SEGMENT_SYSTEM_PROMPT
        : STANDARD_SYSTEM_PROMPT,
    });

    const userPrompt = isSegmentedMode
      ? `FULL ORIGINAL SPANISH DOCUMENT (for context):
"""
${input.fullSpanishDocument}
"""

CURRENT SEGMENT (Segment ${input.segmentId} of ${input.totalSegments ?? "?"}):
Spanish segment to translate:
"""
${input.spanishContext}
"""

User's English translation attempt for this segment:
"""
${input.userEnglishAttempt}
"""

Please evaluate the segment translation and provide structured feedback in JSON format.`
      : `Spanish context (what the user wants to express):
"""
${input.spanishContext}
"""

User's English attempt:
"""
${input.userEnglishAttempt}
"""

Please analyze the English attempt and provide structured feedback in JSON format.`;

    const result = await model.generateContent(userPrompt);
    const responseText = result.response.text();

    const cleanedText = responseText.replace(/```json\n?|\n?```/g, "").trim();

    if (isSegmentedMode) {
      const feedbackData = JSON.parse(cleanedText) as SegmentFeedbackResponse;
      return { success: true, data: feedbackData };
    } else {
      const feedbackData = JSON.parse(cleanedText) as AiFeedbackResponse;
      return { success: true, data: feedbackData };
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return { success: false, error: errorMessage };
  }
}
