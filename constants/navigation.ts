import { LayoutDashboard, PenLine, BookOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  isPlaceholder?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Writing Training",
    href: "/writing",
    icon: PenLine,
  },
  {
    label: "Flashcards",
    href: "/flashcards",
    icon: BookOpen,
    isPlaceholder: true,
  },
];
