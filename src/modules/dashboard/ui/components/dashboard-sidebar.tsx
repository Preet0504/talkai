"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BotIcon, SettingsIcon, StarIcon, VideoIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DashboardTrial } from "./dashboard-trial";
import { Separator } from "@/components/ui/separator";
import { DashboardUserButton } from "./dashboard-user-button";

const firstSection = [
  {
    icon: VideoIcon,
    label: "Meetings",
    url: "/meetings",
  },
  {
    icon: BotIcon,
    label: "Agents",
    url: "/agents",
  },
];

const secondSection = [
  {
    icon: SettingsIcon,
    label: "Settings",
    url: "/settings",
  },
  {
    icon: StarIcon,
    label: "Upgrade",
    url: "/upgrade",
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const isItemActive = (itemUrl: string) => {
    return pathname === itemUrl || pathname.startsWith(itemUrl + "/");
  };

  return (
    <Sidebar>
      <SidebarHeader className="text-sidebar-foreground px-3 py-4">
        <Link href={"/"} className="flex items-center gap-3 px-2">
          <Image src={"/logo.svg"} alt="TalkAI logo" width={32} height={32} />
          <div className="flex flex-col">
            <p className="text-lg font-semibold font-display tracking-tight">
              TalkAI
            </p>
            <span className="text-xs text-sidebar-foreground/70">
              Intelligent meetings
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <div className="px-4 py-2">
        <Separator className="opacity-20 bg-sidebar-border" />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map((item) => {
                const isActive = isItemActive(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      className="h-10 px-3"
                      isActive={isActive}
                    >
                      <Link href={item.url}>
                        <item.icon className="size-5" />
                        <span className="text-sm font-medium tracking-tight">
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="px-4 py-2">
          <Separator className="opacity-20 bg-sidebar-border" />
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondSection.map((item) => {
                const isActive = isItemActive(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      className="h-10 px-3"
                      isActive={isActive}
                    >
                      <Link href={item.url}>
                        <item.icon className="size-5" />
                        <span className="text-sm font-medium tracking-tight">
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="text-sidebar-foreground">
        <DashboardTrial />
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  );
}
