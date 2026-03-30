import { BrainCircuit, PenLine, BookOpen, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const metadata = {
  title: "Dashboard — EnglishCoach",
};

const FEATURE_CARDS = [
  {
    title: "Writing Training",
    description:
      "Practice translating your Spanish technical thoughts into professional English. Get line-by-line AI feedback on grammar and register.",
    icon: PenLine,
    href: "/writing",
    badge: "Active",
    badgeVariant: "default" as const,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Flashcards",
    description:
      "Review corrected phrases and vocabulary from your writing sessions. Spaced-repetition for long-term retention.",
    icon: BookOpen,
    href: "/flashcards",
    badge: "Coming Soon",
    badgeVariant: "secondary" as const,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    title: "Progress Analytics",
    description:
      "Track your improvement over time. See which grammar rules you struggle with and how your scores evolve.",
    icon: TrendingUp,
    href: "/analytics",
    badge: "Coming Soon",
    badgeVariant: "secondary" as const,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <BrainCircuit className="h-5 w-5 text-primary" />
          </div>
          <Badge variant="outline" className="text-xs">
            Senior Engineer Track
          </Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, Engineer 👋
        </h1>
        <p className="text-muted-foreground text-sm max-w-lg">
          Your AI-powered technical English coach is ready. Start a writing session
          or review your flashcards to sharpen your professional communication skills.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {FEATURE_CARDS.map((feature) => {
          const Icon = feature.icon;
          const isActive = feature.badge === "Active";

          return (
            <Link
              key={feature.title}
              href={isActive ? feature.href : "#"}
              aria-label={`Go to ${feature.title}`}
              className={!isActive ? "cursor-not-allowed" : ""}
            >
              <Card
                className={`h-full border-border/60 shadow-sm transition-all duration-200 ${
                  isActive
                    ? "hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
                    : "opacity-60"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${feature.bg}`}
                    >
                      <Icon className={`h-4 w-4 ${feature.color}`} />
                    </div>
                    <Badge variant={feature.badgeVariant} className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-semibold mt-2">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Tip of the Day */}
      <Card className="border-primary/20 bg-primary/5 shadow-sm">
        <CardContent className="py-4 flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0 mt-0.5">
            <BrainCircuit className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold mb-0.5">Pro Tip for Engineers</p>
            <p className="text-sm text-muted-foreground">
              In English stand-ups, use the <strong>past simple</strong> for completed work:{" "}
              <em>&ldquo;I completed the migration&rdquo;</em>, not{" "}
              <em>&ldquo;I have completed the migration.&rdquo;</em> Reserve the present perfect for ongoing
              impact: <em>&ldquo;I&apos;ve been optimizing the queries.&rdquo;</em>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
