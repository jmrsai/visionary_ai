
'use client';

import { useUser } from "@/firebase";
import { LoginForm } from "@/app/login/login-form";
import { UserDashboard } from "@/components/user-dashboard";
import Image from "next/image";

export default function Home() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Image 
          src="https://firebasestorage.googleapis.com/v0/b/studio-4426725626-6840a.firebasestorage.app/o/iris.gif?alt=media&token=6eaaa164-ea31-4221-a6ed-50cad3a2f1f9" 
          alt="Loading..." 
          width={150} 
          height={150} 
          unoptimized 
        />
      </div>
    );
  }
  
  if (user) {
    return <UserDashboard />;
  }

  return <LoginForm />;
}
