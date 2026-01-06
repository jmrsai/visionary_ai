
'use client';

import { useUser } from "@/firebase";
import { LoginForm } from "@/app/login/login-form";
import { UserDashboard } from "@/components/user-dashboard";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (user) {
    return <UserDashboard />;
  }

  return <LoginForm />;
}
