
"use client";

import { useUser } from "@/firebase";
import { Loader2, Eye, BrainCircuit, Dumbbell, Video } from "lucide-react";
import { LoginForm } from "@/app/login/login-form";
import { UserDashboard } from "@/components/user-dashboard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const LandingPage = () => {
    const heroImage = PlaceHolderImages.find(p => p.id === 'landing-hero');
    const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

    const features = [
        {
            icon: Eye,
            title: "Comprehensive Diagnostics",
            description: "From visual acuity to macular health, run a full suite of tests to monitor your vision."
        },
        {
            icon: BrainCircuit,
            title: "AI-Powered Insights",
            description: "Leverage AI to check symptoms, generate personalized workouts, and analyze your health data."
        },
        {
            icon: Dumbbell,
            title: "Guided Eye Gym",
            description: "Reduce eye strain and improve focus with structured exercises and workout circuits."
        },
        {
            icon: Video,
            title: "Telemedicine",
            description: "Connect with eye care professionals for secure video consultations directly within the app."
        }
    ];

    const testimonials = [
        {
            name: "Alex R.",
            role: "Software Developer",
            quote: "Visionary has been a game-changer for my eye strain. The 20-20-20 rule reminders and focus exercises have made a huge difference in my workday."
        },
        {
            name: "Brenda M.",
            role: "Retired Teacher",
            quote: "I use the Amsler grid test every week to monitor my macular health. It's so reassuring to have this tool at my fingertips. The app is incredibly easy to use."
        },
        {
            name: "Carlos V.",
            role: "Student",
            quote: "The AI symptom checker pointed me in the right direction when I had persistent eye redness. It gave me the confidence to book an appointment and get it checked out."
        }
    ];

  return (
    <div className="w-full max-w-none p-0 -m-6 bg-background">
        {/* Hero Section */}
        <section className="relative text-center py-20 px-4 bg-primary/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-transparent to-background/90 z-10"/>
            {heroImage && (
                <Image 
                    src={heroImage.imageUrl} 
                    alt="Abstract eye illustration"
                    layout="fill"
                    objectFit="cover"
                    className="opacity-20"
                    data-ai-hint={heroImage.imageHint}
                />
            )}
            <div className="relative z-20 container mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">Take Control of Your Vision Health</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Your personal AI-powered companion for eye exercises, diagnostic tests, and holistic vision care.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Button asChild size="lg">
                        <Link href="/login">Get Started Free</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/login">Sign In</Link>
                    </Button>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 container mx-auto">
             <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">A Holistic Approach to Eye Care</h2>
                <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Everything you need to monitor, train, and understand your vision in one simple app.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <Card key={index} className="text-center">
                        <CardHeader>
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <feature.icon className="h-6 w-6" />
                            </div>
                        </CardHeader>
                        <CardContent>
                             <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                            <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 bg-muted/50">
             <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold">Loved by Users Worldwide</h2>
                    <p className="text-muted-foreground mt-2">Don't just take our word for it. Here's what our users are saying.</p>
                </div>
                 <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                         <Card key={index}>
                            <CardContent className="pt-6">
                                <p className="italic">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                                     <Avatar className="h-10 w-10">
                                        {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={testimonial.name} />}
                                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
        
        {/* Final CTA Section */}
        <section className="py-20 px-4 text-center container mx-auto">
             <h2 className="text-3xl font-bold">Ready to See the Difference?</h2>
             <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
                Start your journey towards better eye health today. It's free to get started.
             </p>
             <div className="mt-8">
                 <Button asChild size="lg" className="text-lg">
                    <Link href="/login">Create Your Free Account</Link>
                </Button>
             </div>
        </section>
    </div>
  );
};


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
    return <LandingPage />;
  }
  
  return <UserDashboard />;
}
