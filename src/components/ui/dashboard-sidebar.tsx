"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { BotIcon, StarIcon, VideoIcon, LayoutDashboard, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu";

const navigation = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Meetings", icon: VideoIcon, href: "/meetings" },
  { label: "Agents", icon: BotIcon, href: "/agents" },
];

const secondaryNav = [
  { label: "Upgrade", icon: StarIcon, href: "/upgrade", color: "text-amber-500" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export const DashboardSidebar = ({ user, onLogOut }: { user: [string, string], onLogOut: () => Promise<void> }) => {
  const pathname = usePathname();
  return (
    <Sidebar className="border-r border-slate-200 bg-white">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-700 text-white shadow-lg shadow-green-200">
            <BotIcon size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Talk.AI</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </SidebarGroupLabel>
          <SidebarMenu>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive}
                    className={`flex items-center gap-3 px-3 py-6 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? "bg-green-50 text-green-700 font-medium hover:bg-green-100 hover:text-green-800" 
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Link href={item.href}>
                      <item.icon className={`h-5 w-5 ${isActive ? "text-green-700" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Account
          </SidebarGroupLabel>
          <SidebarMenu>
            {secondaryNav.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild className="text-slate-600 hover:bg-slate-50 hover:text-slate-900 py-6">
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className={`h-5 w-5 ${item.color || "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-100 p-4 bg-slate-50/50">
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <button className="w-full items-center gap-3 px-2 py-2 hover:bg-slate-100 rounded-lg transition-colors outline-none cursor-pointer flex">
            <div className="h-9 w-9 rounded-full bg-green-700 flex items-center justify-center text-white text-xs font-bold">
                {user[0]?.charAt(0) || "U"}
            </div>
            <div className="flex flex-1 flex-col overflow-hidden text-left">
                <span className="truncate text-sm font-semibold text-slate-900">{user[0]}</span>
                <span className="truncate text-xs text-slate-500 text-left">{user[1]}</span>
            </div>
            </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="bottom" align="end" className="w-56 mb-2">
            <DropdownMenuItem asChild>
            <Link href="/settings/profile">View Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
            <Link href="/upgrade">Billing & Subscription</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            onSelect={onLogOut}
            >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};