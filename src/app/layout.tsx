import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/toaster";
import { MobileNav } from "@/components/mobile-nav";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { FloatingChatbot } from "@/components/floating-chatbot";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/sidebar-nav";
import { FirebaseClientProvider, FirebaseErrorListener } from "@/firebase";
import "./globals.css";

export const metadata: Metadata = {
  title: "Visionary - Your Personal Vision Care App",
  description: "An application for eye health, exercises, and therapies.",
  manifest: "/manifest.json",
  icons: {
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  initialScale: 1,
  width: "device-width",
  userScalable: false,
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Visionary" />

        {/* iOS Splash Screens */}
        <link rel="apple-touch-startup-image" href="/splashscreens/iphone5_splash.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splashscreens/iphone6_splash.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splashscreens/iphoneplus_splash.png" media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splashscreens/iphonex_splash.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splashscreens/iphonexr_splash.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splashscreens/iphonexsmax_splash.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splashscreens/ipad_splash.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splashscreens/ipadpro1_splash.png" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splashscreens/ipadpro3_splash.png" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splashscreens/ipadpro2_splash.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <FirebaseErrorListener />
            <SidebarProvider>
              <Sidebar>
                  <SidebarNav />
              </Sidebar>
              <SidebarInset>
                  <div className="relative flex min-h-screen w-full flex-col bg-background pb-16 md:pb-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-background via-background to-blue-500/10 dark:to-blue-900/20 -z-10" />
                    <Header />
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                      {children}
                    </main>
                  </div>
                  <MobileNav />
              </SidebarInset>
            </SidebarProvider>
            <FloatingChatbot />
            <Toaster />
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
