"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NAV_ITEMS } from "@/lib/constants";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ThemeToggle } from "./theme-toggle";
import { SidebarTrigger } from "./ui/sidebar";

const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar");

export function Header() {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname === "/") return "Dashboard";
    if (pathname.startsWith("/gym/exercise")) return "Guided Exercise";
    if (pathname.startsWith("/tests/")) return "Diagnostic Tests";
    if (pathname.startsWith("/profile/adherence")) return "Adherence History";
    const navItem = NAV_ITEMS.find((item) => pathname.startsWith(item.href) && item.href !== '/');
    if (navItem) return navItem.label;
    return "Visionary";
  };
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <SidebarTrigger className="md:hidden" />

      <div className="flex-1">
        <h1 className="text-xl font-semibold">{getTitle()}</h1>
      </div>
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="overflow-hidden rounded-full">
            <Avatar className="h-9 w-9">
              {userAvatar && (
                <AvatarImage
                  src={userAvatar.imageUrl}
                  alt={userAvatar.description}
                  data-ai-hint={userAvatar.imageHint}
                />
              )}
              <AvatarFallback>AV</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/profile" className="flex w-full items-center">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
