"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { NavItem } from "@/constants/navigation";

interface SidebarNavItemProps {
  item: NavItem;
  isCollapsed: boolean;
  onMobileClose?: () => void;
}

export function SidebarNavItem({
  item,
  isCollapsed,
  onMobileClose,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
  const Icon = item.icon;

  const linkContent = (
    <Link
      href={item.isPlaceholder ? "#" : item.href}
      onClick={onMobileClose}
      aria-label={item.label}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
          : "text-sidebar-foreground/80",
        item.isPlaceholder && "opacity-50 cursor-not-allowed hover:bg-transparent",
        isCollapsed && "justify-center px-2"
      )}
    >
      <Icon
        className={cn(
          "shrink-0 transition-transform duration-200",
          isCollapsed ? "h-5 w-5" : "h-4 w-4"
        )}
      />
      {!isCollapsed && (
        <span className="truncate">{item.label}</span>
      )}
      {!isCollapsed && item.isPlaceholder && (
        <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 bg-muted px-1.5 py-0.5 rounded">
          Soon
        </span>
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger render={linkContent} />
        <TooltipContent side="right" sideOffset={8}>
          <span>{item.label}</span>
          {item.isPlaceholder && (
            <span className="ml-1 text-muted-foreground">(Coming soon)</span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}
