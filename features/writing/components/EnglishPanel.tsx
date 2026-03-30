"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Loader2, PenLine, Sparkles } from "lucide-react";

interface EnglishPanelProps {
  value: string;
  onChange: (value: string) => void;
  onCheck: () => void;
  isChecking: boolean;
  // Segmented mode extras
  segmentMode?: boolean;
  canGoNext?: boolean;
  onNextSegment?: () => void;
  segmentIndex?: number;
  totalSegments?: number;
  hasCurrentFeedback?: boolean;
}

export function EnglishPanel({
  value,
  onChange,
  onCheck,
  isChecking,
  segmentMode = false,
  canGoNext = false,
  onNextSegment,
  segmentIndex,
  totalSegments,
  hasCurrentFeedback = false,
}: EnglishPanelProps) {
  const isLastSegment =
    segmentIndex !== undefined &&
    totalSegments !== undefined &&
    segmentIndex === totalSegments - 1;

  const checkLabel = segmentMode ? "Check Segment" : "Check with AI";
  const nextLabel = isLastSegment ? "Finish & See Summary" : "Next Segment →";

  return (
    <Card className="flex flex-col h-full border-border/60 shadow-sm">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
              <PenLine className="h-3.5 w-3.5 text-primary" />
            </div>
            <CardTitle className="text-base font-semibold">
              Your English Version
            </CardTitle>
          </div>
          <Badge
            variant="secondary"
            className="text-xs font-medium bg-primary/10 text-primary border-primary/20"
          >
            {segmentMode && segmentIndex !== undefined
              ? `Segment ${segmentIndex + 1}`
              : "Panel B"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">
          {segmentMode
            ? "Translate this segment into professional English. Focus on tone and clarity."
            : "Write how you think the Spanish text should be expressed in professional English."}
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pb-4 flex-1">
        <Textarea
          id="english-attempt-input"
          placeholder={
            segmentMode
              ? "Write your English translation for this segment...\n\nFocus on professional register. Avoid contractions if in a formal announcement."
              : "Write your English version here...\n\nExample: 'I completed the database migration to Supabase. The process was seamless and caused no interruptions in production.'"
          }
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="flex-1 min-h-[180px] resize-none text-sm leading-relaxed border-border/50 focus-visible:ring-primary/30 placeholder:text-muted-foreground/50"
          aria-label="English writing attempt input"
        />

        <div className="flex flex-col gap-2">
          <Button
            id="check-writing-button"
            onClick={onCheck}
            disabled={isChecking || !value.trim()}
            className="w-full gap-2 font-medium"
            size="lg"
            variant={hasCurrentFeedback ? "outline" : "default"}
          >
            {isChecking ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {hasCurrentFeedback ? `Re-check Segment` : checkLabel}
              </>
            )}
          </Button>

          {segmentMode && canGoNext && onNextSegment && (
            <Button
              id="next-segment-button"
              onClick={onNextSegment}
              variant="default"
              size="lg"
              className="w-full gap-2 font-medium"
            >
              <ArrowRight className="h-4 w-4" />
              {nextLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
