"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BookmarkPlus,
  CheckCircle2,
  XCircle,
  BookOpen,
  Briefcase,
  Info,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  AiFeedbackResponse,
  SegmentFeedbackResponse,
} from "../types/writing.types";

interface AiFeedbackPanelProps {
  feedback: AiFeedbackResponse | SegmentFeedbackResponse | null;
  segmentMode?: boolean;
}

function isSegmentFeedback(
  feedback: AiFeedbackResponse | SegmentFeedbackResponse
): feedback is SegmentFeedbackResponse {
  return "contextNote" in feedback;
}

function ScoreMeter({ score }: { score: number }) {
  const color =
    score >= 80
      ? "text-emerald-500"
      : score >= 55
      ? "text-amber-500"
      : "text-rose-500";

  const bgColor =
    score >= 80
      ? "bg-emerald-500/10 border-emerald-500/20"
      : score >= 55
      ? "bg-amber-500/10 border-amber-500/20"
      : "bg-rose-500/10 border-rose-500/20";

  return (
    <div className={cn("flex items-center gap-2 rounded-lg border px-3 py-2", bgColor)}>
      <Zap className={cn("h-4 w-4", color)} />
      <span className="text-sm font-medium text-muted-foreground">Score</span>
      <span className={cn("text-2xl font-bold tabular-nums", color)}>{score}</span>
      <span className="text-xs text-muted-foreground">/100</span>
    </div>
  );
}

export function AiFeedbackPanel({ feedback, segmentMode = false }: AiFeedbackPanelProps) {
  if (!feedback) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50">
            <BookOpen className="h-7 w-7 text-muted-foreground/40" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">
              {segmentMode
                ? "AI feedback for this segment will appear here"
                : "AI Feedback will appear here"}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              {segmentMode
                ? "Write your translation and click \"Check Segment\""
                : "Write in both panels and click \"Check with AI\""}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasContextNote = isSegmentFeedback(feedback);

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold">AI Feedback</CardTitle>
            {segmentMode && hasContextNote && (
              <Badge
                variant="secondary"
                className="text-xs bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20"
              >
                Segment {(feedback as SegmentFeedbackResponse).segmentId}
              </Badge>
            )}
          </div>
          <ScoreMeter score={feedback.overallScore} />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mt-1">
          {feedback.summary}
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        {/* Context Note (segment mode only) */}
        {hasContextNote && (feedback as SegmentFeedbackResponse).contextNote && (
          <div className="flex items-start gap-2.5 rounded-lg border border-violet-500/20 bg-violet-500/8 px-3 py-2.5">
            <Info className="h-4 w-4 text-violet-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-violet-700 dark:text-violet-400 uppercase tracking-wide mb-0.5">
                Document Context
              </p>
              <p className="text-sm leading-relaxed">
                {(feedback as SegmentFeedbackResponse).contextNote}
              </p>
            </div>
          </div>
        )}

        {/* Corrections */}
        {feedback.corrections.length > 0 ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Corrections</span>
              <Badge variant="destructive" className="text-xs">
                {feedback.corrections.length}
              </Badge>
            </div>
            {feedback.corrections.map((correction, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4"
              >
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wide mb-0.5">
                      Original
                    </p>
                    <p className="text-sm text-foreground/80 italic">
                      &ldquo;{correction.line}&rdquo;
                    </p>
                  </div>
                </div>

                <Separator className="bg-border/40" />

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      ❌ Error
                    </p>
                    <p className="text-sm">{correction.error}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      📚 Grammar Rule
                    </p>
                    <p className="text-sm">{correction.grammarRule}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 rounded-lg bg-emerald-500/8 border border-emerald-500/15 p-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-0.5">
                      ✅ Correct Form
                    </p>
                    <p className="text-sm font-medium">{correction.correctForm}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/15 p-3">
                  <Briefcase className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-primary/80 uppercase tracking-wide mb-0.5">
                      💼 IT/Business Context
                    </p>
                    <p className="text-sm">{correction.itContext}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/8 p-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Excellent! No errors found. Your writing is professional and clear.
            </p>
          </div>
        )}

        {/* Improved Version */}
        {feedback.improvedVersion && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold">
              {segmentMode ? "Improved Segment" : "Improved Version"}
            </p>
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4 relative">
              <p className="text-sm leading-relaxed">{feedback.improvedVersion}</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 gap-2 text-muted-foreground hover:text-foreground w-full"
                aria-label="Save improved version to flashcards"
              >
                <BookmarkPlus className="h-4 w-4" />
                Save to Flashcards
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
