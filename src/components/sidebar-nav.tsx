"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { VisionaryLogo } from "./icons";
import { buttonVariants } from "./ui/button";
import { useSidebar } from "./ui/sidebar";

export function SidebarNav() {
  const pathname = usePathname();
  const { open } = useSidebar();

  return (
    <div className="flex h-full flex-col">
       <div className="flex h-16 items-center border-b px-4">
         <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
           <VisionaryLogo className="h-6 w-6 text-primary" />
           <span className={cn(open ? "opacity-100" : "opacity-0", "transition-opacity duration-200")}>Visionary</span>
         </Link>
       </div>
      <nav className="flex-1 space-y-2 p-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              buttonVariants({
                variant: (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))) ? "secondary" : "ghost",
              }),
              "w-full justify-start text-base h-11",
              !open && "justify-center"
            )}
            title={open ? "" : item.label}
          >
            <item.icon className={cn(!open ? "h-6 w-6" : "mr-3 h-5 w-5")} />
            <span className={cn(open ? "inline-block" : "hidden")}>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
