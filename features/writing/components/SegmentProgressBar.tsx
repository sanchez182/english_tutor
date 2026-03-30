"use client";

import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TextSegment, SegmentFeedbackResponse } from "../types/writing.types";

interface SegmentProgressBarProps {
  segments: TextSegment[];
  currentIndex: number;
  feedback: Record<number, SegmentFeedbackResponse>;
  onSegmentClick: (index: number) => void;
}

export function SegmentProgressBar({
  segments,
  currentIndex,
  feedback,
  onSegmentClick,
}: SegmentProgressBarProps) {
  return (
    <div
      className="flex items-center gap-1 rounded-xl border border-border/60 bg-card p-3 shadow-sm overflow-x-auto"
      role="navigation"
      aria-label="Segment progress"
    >
      {segments.map((segment, index) => {
        const isCompleted = feedback[segment.id] !== undefined;
        const isCurrent = index === currentIndex;
        const isPending = !isCompleted && !isCurrent;

        const score = feedback[segment.id]?.overallScore;
        const scoreColor =
          score === undefined
            ? ""
            : score >= 80
            ? "text-emerald-500"
            : score >= 55
            ? "text-amber-500"
            : "text-rose-500";

        return (
          <div key={segment.id} className="flex items-center gap-1 shrink-0">
            {/* Connector line */}
            {index > 0 && (
              <div
                className={cn(
                  "h-px w-6 transition-colors duration-300",
                  isCompleted || isCurrent
                    ? "bg-primary/40"
                    : "bg-border/50"
                )}
              />
            )}

            <button
              id={`segment-step-${segment.id}`}
              onClick={() => onSegmentClick(index)}
              aria-label={`Go to segment ${index + 1}`}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200",
                isCurrent &&
                  "bg-primary text-primary-foreground shadow-sm",
                isCompleted &&
                  !isCurrent &&
                  "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/15",
                isPending &&
                  "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              {isCurrent ? (
                <Loader2 className="h-3 w-3 animate-spin opacity-60" />
              ) : isCompleted ? (
                <CheckCircle2 className="h-3 w-3 shrink-0" />
              ) : (
                <Circle className="h-3 w-3 shrink-0 opacity-50" />
              )}

              <span className="whitespace-nowrap">
                Segment {index + 1}
              </span>

              {isCompleted && score !== undefined && (
                <span className={cn("tabular-nums font-bold", scoreColor)}>
                  {score}
                </span>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
