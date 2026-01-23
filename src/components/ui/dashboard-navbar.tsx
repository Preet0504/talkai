"use client";

import { Bell, Search, Command } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DashboardSearch } from "./dashboard-search";

export const DashboardNavbar = () => {
  return (
    <nav className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white/80 px-6 backdrop-blur-md">
      {/* Left Side: Search Bar */}
      <DashboardSearch />
      

      {/* Right Side: Actions */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-green-700">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
        </Button>
        
        <Button className="hidden sm:flex bg-green-700 hover:bg-green-800 text-white gap-2">
           New Meeting
        </Button>
      </div>
    </nav>
  );
};