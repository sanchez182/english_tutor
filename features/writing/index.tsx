"use client";

import { useState } from "react";
import { toast } from "sonner";
import { LayoutList, PenLine, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { SpanishPanel } from "./components/SpanishPanel";
import { EnglishPanel } from "./components/EnglishPanel";
import { AiFeedbackPanel } from "./components/AiFeedbackPanel";
import { SegmentAnalyzer } from "./components/SegmentAnalyzer";
import { SegmentProgressBar } from "./components/SegmentProgressBar";
import { SegmentPanel } from "./components/SegmentPanel";

import { checkWriting } from "./actions/checkWriting";
import { analyzeSegments } from "./actions/analyzeSegments";

import type {
  AiFeedbackResponse,
  SegmentFeedbackResponse,
  SegmentedSession,
} from "./types/writing.types";

type WritingMode = "standard" | "segmented";

export function WritingFeature() {
  // ─── Standard Mode State ────────────────────────────────────────────────
  const [spanishContext, setSpanishContext] = useState("");
  const [userEnglishAttempt, setUserEnglishAttempt] = useState("");
  const [aiFeedback, setAiFeedback] = useState<AiFeedbackResponse | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // ─── Segmented Mode State ───────────────────────────────────────────────
  const [mode, setMode] = useState<WritingMode>("standard");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [segmentedSession, setSegmentedSession] = useState<SegmentedSession | null>(null);
  const [currentSegmentAttempt, setCurrentSegmentAttempt] = useState("");

  // ─── Standard Mode Handler ──────────────────────────────────────────────
  const handleCheckWriting = async () => {
    if (!spanishContext.trim() || !userEnglishAttempt.trim()) {
      toast.error("Please fill in both panels before checking.");
      return;
    }

    setIsChecking(true);
    setAiFeedback(null);

    const result = await checkWriting({ spanishContext, userEnglishAttempt });

    if (result.success) {
      setAiFeedback(result.data as AiFeedbackResponse);
      if ((result.data as AiFeedbackResponse).corrections.length === 0) {
        toast.success("Excellent work! No errors found.");
      } else {
        toast.info(`Found ${(result.data as AiFeedbackResponse).corrections.length} suggestion(s) to review.`);
      }
    } else {
      toast.error(result.error || "An error occurred. Please try again.");
    }

    setIsChecking(false);
  };

  // ─── Segmented Mode Handlers ────────────────────────────────────────────
  const handleAnalyzeText = async (fullSpanishText: string) => {
    setIsAnalyzing(true);

    const result = await analyzeSegments({ fullSpanishText });

    if (result.success) {
      setSegmentedSession({
        fullSpanishText,
        documentSummary: result.data.documentSummary,
        segments: result.data.segments,
        attempts: {},
        feedback: {},
        currentSegmentIndex: 0,
        isComplete: false,
      });
      setCurrentSegmentAttempt("");
      toast.success(
        `Text divided into ${result.data.segments.length} segments. Let's start with segment 1!`
      );
    } else {
      toast.error(result.error || "Failed to analyze text. Please try again.");
    }

    setIsAnalyzing(false);
  };

  const handleCheckSegment = async () => {
    if (!segmentedSession || !currentSegmentAttempt.trim()) {
      toast.error("Please write your translation before checking.");
      return;
    }

    const currentSegment =
      segmentedSession.segments[segmentedSession.currentSegmentIndex];

    setIsChecking(true);

    const result = await checkWriting({
      spanishContext: currentSegment.segmentText,
      userEnglishAttempt: currentSegmentAttempt,
      fullSpanishDocument: segmentedSession.fullSpanishText,
      segmentId: currentSegment.id,
      totalSegments: segmentedSession.segments.length,
    });

    if (result.success) {
      const segmentFeedback = result.data as SegmentFeedbackResponse;

      setSegmentedSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          attempts: {
            ...prev.attempts,
            [currentSegment.id]: currentSegmentAttempt,
          },
          feedback: {
            ...prev.feedback,
            [currentSegment.id]: segmentFeedback,
          },
        };
      });

      if (segmentFeedback.corrections.length === 0) {
        toast.success("Perfect segment! Ready to move on.");
      } else {
        toast.info(
          `${segmentFeedback.corrections.length} correction(s) found. Review and move on when ready.`
        );
      }
    } else {
      toast.error(result.error || "An error occurred. Please try again.");
    }

    setIsChecking(false);
  };

  const handleNextSegment = () => {
    if (!segmentedSession) return;

    const nextIndex = segmentedSession.currentSegmentIndex + 1;

    if (nextIndex >= segmentedSession.segments.length) {
      // All segments done
      setSegmentedSession((prev) =>
        prev ? { ...prev, isComplete: true } : null
      );
      toast.success("🎉 All segments complete! Check your final summary below.");
      return;
    }

    setSegmentedSession((prev) =>
      prev ? { ...prev, currentSegmentIndex: nextIndex } : null
    );

    // Restore previous attempt if user navigated back
    const nextSegment = segmentedSession.segments[nextIndex];
    setCurrentSegmentAttempt(
      segmentedSession.attempts[nextSegment.id] ?? ""
    );
  };

  const handleSegmentNavigation = (index: number) => {
    if (!segmentedSession) return;

    // Save current attempt before navigating
    const currentSegment =
      segmentedSession.segments[segmentedSession.currentSegmentIndex];
    setSegmentedSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        currentSegmentIndex: index,
        attempts: {
          ...prev.attempts,
          [currentSegment.id]: currentSegmentAttempt,
        },
      };
    });

    const targetSegment = segmentedSession.segments[index];
    setCurrentSegmentAttempt(
      segmentedSession.attempts[targetSegment.id] ?? ""
    );
  };

  const handleResetSegmentedMode = () => {
    setSegmentedSession(null);
    setCurrentSegmentAttempt("");
  };

  const handleSwitchMode = (newMode: WritingMode) => {
    setMode(newMode);
    // Reset state when switching modes
    setAiFeedback(null);
    setIsChecking(false);
    setIsAnalyzing(false);
  };

  // ─── Computed helpers ───────────────────────────────────────────────────
  const currentSegment = segmentedSession
    ? segmentedSession.segments[segmentedSession.currentSegmentIndex]
    : null;

  const hasCurrentFeedback =
    currentSegment !== undefined &&
    currentSegment !== null &&
    segmentedSession?.feedback[currentSegment.id] !== undefined;

  const canGoNext =
    hasCurrentFeedback &&
    !segmentedSession?.isComplete;

  const completedSegments = segmentedSession
    ? Object.keys(segmentedSession.feedback).length
    : 0;

  const averageScore =
    segmentedSession && completedSegments > 0
      ? Math.round(
          Object.values(segmentedSession.feedback).reduce(
            (sum, f) => sum + f.overallScore,
            0
          ) / completedSegments
        )
      : null;

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 h-full">
      {/* Page Header */}
      <div className="flex flex-col gap-3 flex-shrink-0">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Writing Training</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {mode === "standard"
                ? "Write your idea in Spanish, then express it in professional English. The AI will coach you."
                : "Paste a long Spanish text and practice translating it segment by segment."}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center rounded-lg border border-border/60 bg-muted/30 p-1 gap-1 shrink-0">
            <button
              id="mode-standard"
              onClick={() => handleSwitchMode("standard")}
              aria-pressed={mode === "standard"}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200",
                mode === "standard"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <PenLine className="h-3.5 w-3.5" />
              Standard
            </button>
            <button
              id="mode-segmented"
              onClick={() => handleSwitchMode("segmented")}
              aria-pressed={mode === "segmented"}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200",
                mode === "segmented"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutList className="h-3.5 w-3.5" />
              Segmented
            </button>
          </div>
        </div>
      </div>

      {/* ── STANDARD MODE ── */}
      {mode === "standard" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-shrink-0">
            <SpanishPanel value={spanishContext} onChange={setSpanishContext} />
            <EnglishPanel
              value={userEnglishAttempt}
              onChange={setUserEnglishAttempt}
              onCheck={handleCheckWriting}
              isChecking={isChecking}
            />
          </div>
          <div className="flex-1">
            <AiFeedbackPanel feedback={aiFeedback} />
          </div>
        </>
      )}

      {/* ── SEGMENTED MODE — no session yet: show analyzer ── */}
      {mode === "segmented" && !segmentedSession && (
        <div className="flex-1">
          <SegmentAnalyzer
            onAnalyze={handleAnalyzeText}
            isAnalyzing={isAnalyzing}
          />
        </div>
      )}

      {/* ── SEGMENTED MODE — session active ── */}
      {mode === "segmented" && segmentedSession && !segmentedSession.isComplete && (
        <>
          {/* Progress bar */}
          <div className="flex-shrink-0">
            <SegmentProgressBar
              segments={segmentedSession.segments}
              currentIndex={segmentedSession.currentSegmentIndex}
              feedback={segmentedSession.feedback}
              onSegmentClick={handleSegmentNavigation}
            />
          </div>

          {/* Panels */}
          {currentSegment && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-shrink-0">
              <SegmentPanel
                segment={currentSegment}
                segmentIndex={segmentedSession.currentSegmentIndex}
                totalSegments={segmentedSession.segments.length}
                documentSummary={segmentedSession.documentSummary}
              />
              <EnglishPanel
                value={currentSegmentAttempt}
                onChange={setCurrentSegmentAttempt}
                onCheck={handleCheckSegment}
                isChecking={isChecking}
                segmentMode
                canGoNext={canGoNext}
                onNextSegment={handleNextSegment}
                segmentIndex={segmentedSession.currentSegmentIndex}
                totalSegments={segmentedSession.segments.length}
                hasCurrentFeedback={hasCurrentFeedback}
              />
            </div>
          )}

          {/* Segment feedback */}
          <div className="flex-1">
            <AiFeedbackPanel
              feedback={
                currentSegment
                  ? (segmentedSession.feedback[currentSegment.id] ?? null)
                  : null
              }
              segmentMode
            />
          </div>
        </>
      )}

      {/* ── SEGMENTED MODE — session complete: summary ── */}
      {mode === "segmented" && segmentedSession?.isComplete && (
        <div className="flex flex-col gap-4 flex-1">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
                <Trophy className="h-8 w-8 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Session Complete!</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  You translated all {segmentedSession.segments.length} segments.
                </p>
              </div>
              {averageScore !== null && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Overall Average Score:
                  </span>
                  <Badge
                    className={cn(
                      "text-base font-bold px-3 py-1",
                      averageScore >= 80
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                        : averageScore >= 55
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                        : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
                    )}
                    variant="outline"
                  >
                    {averageScore} / 100
                  </Badge>
                </div>
              )}
              <Button
                id="reset-segmented-session-button"
                variant="outline"
                size="lg"
                className="gap-2 mt-2"
                onClick={handleResetSegmentedMode}
              >
                <RotateCcw className="h-4 w-4" />
                Start a New Text
              </Button>
            </CardContent>
          </Card>

          {/* Show all segment feedbacks for review */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Segment-by-segment Review
            </h3>
            {segmentedSession.segments.map((segment) => {
              const segFeedback = segmentedSession.feedback[segment.id];
              if (!segFeedback) return null;
              return (
                <div key={segment.id}>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">
                    Segment {segment.id}
                  </p>
                  <AiFeedbackPanel feedback={segFeedback} segmentMode />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
