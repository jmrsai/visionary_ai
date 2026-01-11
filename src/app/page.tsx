'use client';

import { useUser } from "@/firebase";
import { LoginForm } from "@/app/login/login-form";
import { UserDashboard } from "@/components/user-dashboard";
import { LoadingScreen } from "@/components/loading-screen";

export default function Home() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return <LoadingScreen />;
  }
  
  if (user) {
    return <UserDashboard />;
  }

  return <LoginForm />;
}
