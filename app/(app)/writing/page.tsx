import type { Metadata } from "next";
import { WritingFeature } from "@/features/writing";

export const metadata: Metadata = {
  title: "Writing Training — EnglishCoach",
  description:
    "Practice expressing technical ideas from Spanish to professional English. Get AI-powered grammar and register corrections.",
};

export default function WritingPage() {
  return <WritingFeature />;
}
