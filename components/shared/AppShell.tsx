"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/shared/sidebar/Sidebar";
import { useSidebarStore } from "@/store/sidebarStore";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { openMobile } = useSidebarStore();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="flex h-14 items-center gap-3 border-b border-border px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={openMobile}
            aria-label="Open navigation menu"
            className="h-8 w-8"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground text-sm">
              EnglishCoach
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
