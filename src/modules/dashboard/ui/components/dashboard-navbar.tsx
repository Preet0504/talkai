"use client";
import { useEffect, useState } from "react";
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { SoundToggle } from "@/components/ui/sound-toggle";
import DashboardCommand from "./dashboard-command";

export const DashboardNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
      <nav className="flex items-center justify-between gap-3 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <Button
            className="size-9 cursor-pointer"
            variant="outline"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            {state === "collapsed" || isMobile ? (
              <PanelLeftIcon />
            ) : (
              <PanelLeftCloseIcon />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCommandOpen((open) => !open)}
            className="h-9 w-9 sm:w-[240px] justify-start font-normal text-muted-foreground hover:text-foreground"
            aria-label="Open search"
          >
            <SearchIcon className="size-4" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="ml-auto pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1 font-mono text-sm font-medium text-muted-foreground sm:inline-flex">
              <span>&#8984;</span>K
            </kbd>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <SoundToggle />
          <ThemeSwitcher />
        </div>
      </nav>
    </>
  );
};
