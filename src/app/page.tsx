
"use client";

import { useUser } from "@/firebase";
import { Loader2 } from "lucide-react";
import { LoginForm } from "@/app/login/login-form";
import { UserDashboard } from "@/components/user-dashboard";

export default function Home() {
  const { user, isUserLoading, userError } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (userError) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Error loading user profile. Please try again.
      </div>
    );
  }
  
  if (!user) {
    return <LoginForm />;
  }
  
  return <UserDashboard />;
}
