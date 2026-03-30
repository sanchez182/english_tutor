export interface AiFeedbackItem {
  line: string;
  error: string;
  grammarRule: string;
  correctForm: string;
  itContext: string;
}

export interface AiFeedbackResponse {
  overallScore: number; // 0-100
  summary: string;
  corrections: AiFeedbackItem[];
  improvedVersion: string;
}

export interface CheckWritingInput {
  spanishContext: string;
  userEnglishAttempt: string;
  // Segmented mode extras (optional)
  fullSpanishDocument?: string;
  segmentId?: number;
  totalSegments?: number;
}

export interface WritingSession {
  id: string;
  spanishText: string;
  userEnglishText: string;
  aiFeedback: AiFeedbackResponse | null;
  createdAt: string;
}

// ─── Segmented Mode Types ──────────────────────────────────────────────────

/** A single segment defined by the AI when analyzing the full Spanish text */
export interface TextSegment {
  id: number;
  segmentText: string;   // The portion of the original Spanish text for this segment
  rationale: string;     // Why the AI cut here (e.g., "Topic change — moving to patient quote")
  hint: string;          // A writing tip specific to this segment's register/tone
}

/** Input for the analyzeSegments server action */
export interface AnalyzeSegmentsInput {
  fullSpanishText: string;
}

/** AI response for the segment analysis step */
export interface SegmentAnalysisResponse {
  segments: TextSegment[];
  documentSummary: string; // The AI's high-level understanding of the full document
}

/** Feedback for a single segment, extending the base feedback */
export interface SegmentFeedbackResponse extends AiFeedbackResponse {
  segmentId: number;
  contextNote: string; // How this segment connects to the broader document
}

/** Full in-memory session state for segmented writing mode */
export interface SegmentedSession {
  fullSpanishText: string;
  documentSummary: string;
  segments: TextSegment[];
  /** Maps segmentId → the user's English attempt text */
  attempts: Record<number, string>;
  /** Maps segmentId → AI feedback for that attempt */
  feedback: Record<number, SegmentFeedbackResponse>;
  currentSegmentIndex: number;
  isComplete: boolean;
}
