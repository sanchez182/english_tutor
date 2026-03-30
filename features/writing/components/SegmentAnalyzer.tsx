"use client";

import { useState } from "react";
import { Loader2, ScanText, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface SegmentAnalyzerProps {
  onAnalyze: (text: string) => Promise<void>;
  isAnalyzing: boolean;
}

export function SegmentAnalyzer({ onAnalyze, isAnalyzing }: SegmentAnalyzerProps) {
  const [text, setText] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) return;
    await onAnalyze(text.trim());
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-500/10">
            <ScanText className="h-3.5 w-3.5 text-violet-500" />
          </div>
          <CardTitle className="text-base font-semibold">
            Paste Your Spanish Text
          </CardTitle>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
          Paste the full Spanish text you want to practice. The AI will divide it
          into{" "}
          <span className="font-medium text-foreground">
            2–5 meaningful segments
          </span>{" "}
          with writing hints for each one.
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pb-4">
        <div className="relative">
          <Textarea
            id="segment-analyzer-input"
            placeholder={`Paste your Spanish text here...\n\nEjemplo: "Nos complace compartir un reconocimiento especial para nuestra enfermera Brianna, quien fue nominada para el Premio DAISY..."`}
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="min-h-[220px] resize-none text-sm leading-relaxed border-border/50 focus-visible:ring-violet-500/30 placeholder:text-muted-foreground/50"
            aria-label="Spanish text for segmentation analysis"
            disabled={isAnalyzing}
          />
          {wordCount > 0 && (
            <span className="absolute bottom-3 right-3 text-[10px] text-muted-foreground/50 tabular-nums select-none">
              {wordCount} words
            </span>
          )}
        </div>

        <Button
          id="analyze-segments-button"
          onClick={handleSubmit}
          disabled={isAnalyzing || !text.trim()}
          className="w-full gap-2 font-medium bg-violet-600 hover:bg-violet-700 text-white"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              AI is analyzing your text...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Analyze & Create Segments
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
