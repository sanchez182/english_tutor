"use client";

import { BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarNavItem } from "./SidebarNavItem";
import { SidebarToggle } from "./SidebarToggle";
import { useSidebarStore } from "@/store/sidebarStore";
import { NAV_ITEMS } from "@/constants/navigation";

function SidebarContent({
  isCollapsed,
  onMobileClose,
}: {
  isCollapsed: boolean;
  onMobileClose?: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Header */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-sidebar-border px-4",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <BrainCircuit className="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground leading-tight">
                EnglishCoach
              </span>
              <span className="text-[10px] text-sidebar-foreground/50 leading-tight">
                AI-Powered Tutor
              </span>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <BrainCircuit className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
        )}
        {!isCollapsed && <SidebarToggle />}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map((navItem) => (
            <SidebarNavItem
              key={navItem.href}
              item={navItem}
              isCollapsed={isCollapsed}
              onMobileClose={onMobileClose}
            />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-3 py-3">
        <Separator className="mb-3 bg-sidebar-border" />
        {isCollapsed ? (
          <SidebarToggle className="mx-auto" />
        ) : (
          <p className="text-center text-[10px] text-sidebar-foreground/40 leading-relaxed">
            Technical English Coach
            <br />v0.1.0
          </p>
        )}
      </div>
    </div>
  );
}

export function Sidebar() {
  const { isCollapsed, isMobileOpen, closeMobile } = useSidebarStore();

  return (
    <TooltipProvider>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col flex-shrink-0 border-r border-sidebar-border",
          "transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[68px]" : "w-[240px]"
        )}
      >
        <SidebarContent isCollapsed={isCollapsed} />
      </aside>

      {/* Mobile Sidebar — Sheet Drawer */}
      <Sheet open={isMobileOpen} onOpenChange={closeMobile}>
        <SheetContent side="left" className="w-[240px] p-0 border-sidebar-border">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SidebarContent isCollapsed={false} onMobileClose={closeMobile} />
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}
