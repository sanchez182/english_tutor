"use client";

import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/store/sidebarStore";
import { cn } from "@/lib/utils";

interface SidebarToggleProps {
  className?: string;
}

export function SidebarToggle({ className }: SidebarToggleProps) {
  const { isCollapsed, toggleCollapse } = useSidebarStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleCollapse}
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      className={cn(
        "h-8 w-8 shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
        className
      )}
    >
      <PanelLeft
        className={cn(
          "h-4 w-4 transition-transform duration-300",
          isCollapsed && "rotate-180"
        )}
      />
    </Button>
  );
}
