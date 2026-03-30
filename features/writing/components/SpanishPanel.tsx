"use client";

import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";

interface SpanishPanelProps {
  value: string;
  onChange: (value: string) => void;
}

export function SpanishPanel({ value, onChange }: SpanishPanelProps) {
  return (
    <Card className="flex flex-col h-full border-border/60 shadow-sm">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/15">
              <Globe className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            </div>
            <CardTitle className="text-base font-semibold">
              Spanish Context
            </CardTitle>
          </div>
          <Badge
            variant="secondary"
            className="text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
          >
            Panel A
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">
          Write your idea or context in Spanish. The AI will use this to evaluate your English version.
        </p>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <Textarea
          id="spanish-context-input"
          placeholder="Escribe aquí tu idea o contexto en español...

Ejemplo: 'Necesito presentar en el daily que completé la migración de la base de datos a Supabase y que el proceso fue sin interrupciones en producción.'"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-full min-h-[200px] resize-none text-sm leading-relaxed border-border/50 focus-visible:ring-amber-500/30 placeholder:text-muted-foreground/50"
          aria-label="Spanish context input"
        />
      </CardContent>
    </Card>
  );
}
