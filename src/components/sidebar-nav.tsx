"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { VisionaryLogo } from "./icons";
import { buttonVariants } from "./ui/button";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 z-40 hidden h-screen w-64 border-r bg-background md:flex md:flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <VisionaryLogo className="h-6 w-6 text-primary" />
          <span className="">Visionary</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              buttonVariants({
                variant: (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))) ? "secondary" : "ghost",
                size: "lg"
              }),
              "w-full justify-start text-base"
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
