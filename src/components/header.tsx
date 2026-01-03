"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Settings,
  LogOut,
  Menu,
  LogIn,
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
import { useUser, useAuth } from "@/firebase";
import { getAuth } from "firebase/auth";

const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar");

export function Header() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const getTitle = () => {
    if (pathname === "/") return "Dashboard";
    if (pathname.startsWith("/gym/exercise")) return "Guided Exercise";
    if (pathname.startsWith("/tests/")) return "Diagnostic Tests";
    if (pathname.startsWith("/profile/adherence")) return "Adherence History";
    const navItem = NAV_ITEMS.find((item) => pathname.startsWith(item.href) && item.href !== '/');
    if (navItem) return navItem.label;
    return "Visionary";
  };

  const handleLogout = () => {
    auth.signOut();
  }
  
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
              {user?.photoURL ? (
                  <AvatarImage src={user.photoURL} alt={user.displayName || "User avatar"} />
              ) : userAvatar && user ? (
                <AvatarImage
                  src={userAvatar.imageUrl}
                  alt={userAvatar.description}
                  data-ai-hint={userAvatar.imageHint}
                />
              ) : null}
              <AvatarFallback>{user ? (user.displayName?.charAt(0) || user.email?.charAt(0))?.toUpperCase() : <User className="h-5 w-5" />}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isUserLoading ? (
            <DropdownMenuLabel>Loading...</DropdownMenuLabel>
          ) : user ? (
            <>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex w-full items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex w-full items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuLabel>Welcome</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex w-full items-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login / Sign Up
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
