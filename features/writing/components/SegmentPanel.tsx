"use client";

import { Lightbulb, Quote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TextSegment } from "../types/writing.types";

interface SegmentPanelProps {
  segment: TextSegment;
  segmentIndex: number;
  totalSegments: number;
  documentSummary: string;
}

export function SegmentPanel({
  segment,
  segmentIndex,
  totalSegments,
  documentSummary,
}: SegmentPanelProps) {
  return (
    <Card className="flex flex-col h-full border-border/60 shadow-sm">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-500/10">
              <Quote className="h-3.5 w-3.5 text-violet-500" />
            </div>
            <CardTitle className="text-base font-semibold">
              Spanish Segment
            </CardTitle>
          </div>
          <Badge
            variant="secondary"
            className={cn(
              "text-xs font-medium",
              "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20"
            )}
          >
            {segmentIndex + 1} / {totalSegments}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
          {documentSummary}
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pb-4 flex-1">
        {/* The actual segment text */}
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 flex-1">
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
            {segment.segmentText}
          </p>
        </div>

        {/* Segment boundary rationale */}
        <div className="rounded-lg border border-border/50 bg-muted/30 px-3 py-2">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Why this segment
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {segment.rationale}
          </p>
        </div>

        {/* Writing hint */}
        <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/8 px-3 py-2.5">
          <Lightbulb className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-0.5">
              Writing Tip
            </p>
            <p className="text-xs leading-relaxed text-foreground/80">
              {segment.hint}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
