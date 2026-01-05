
"use client";

import { useUser } from "@/firebase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MOCK_TESTS, MOCK_EXERCISES } from "@/lib/data";
import Link from "next/link";
import { ChevronRight, Loader2, UserCheck } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const getPersonalizedContent = (interests: string[] = []) => {
    const content: { title: string; items: any[] } = {
        title: "Based on Your Interests",
        items: []
    };

    if (interests.includes('strain_reduction')) {
        content.items.push(...MOCK_EXERCISES.filter(ex => ex.category === 'Strain Reduction'));
    }
    if (interests.includes('vision_improvement')) {
        content.items.push(...MOCK_EXERCISES.filter(ex => ex.category === 'Focus & Flexibility'));
    }
    if (interests.includes('preventative_care')) {
        content.items.push(...MOCK_TESTS.filter(t => t.category === 'Core Diagnostics'));
    }
     if (interests.includes('kids_health')) {
        content.items.push(...MOCK_TESTS.filter(t => t.category === "Kids' Game Zone"));
    }

    // Deduplicate
    content.items = Array.from(new Set(content.items.map(item => item.id)))
        .map(id => content.items.find(item => item.id === id));
        
    return content;
}


export default function ForYouPage() {
    const { user, isUserLoading } = useUser();

    if (isUserLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!user) {
        return (
             <Alert>
                <UserCheck className="h-4 w-4" />
                <AlertTitle>Please Sign In</AlertTitle>
                <AlertDescription>
                    You need to be signed in to see your personalized recommendations.
                    <Link href="/login" className="font-bold text-primary hover:underline ml-2">Sign In</Link>
                </AlertDescription>
            </Alert>
        )
    }

    const personalizedContent = getPersonalizedContent(user.interests);

    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-3xl font-bold">For You</h1>
                <p className="text-muted-foreground">
                  Content and tools tailored to your personal eye health goals.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{personalizedContent.title}</CardTitle>
                    <CardDescription>
                        We've selected these items based on the interests you chose: {user.interests?.map(i => i.replace(/_/g, ' ')).join(', ')}.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {personalizedContent.items.map((item) => {
                        const path = item.category === "Kids' Game Zone" ? `/games/${item.id}` : (item.duration ? `/gym/exercise/${item.id}` : `/tests/${item.id}`);

                        return (
                            <Link key={item.id} href={path} className="group">
                                <Card className="h-full transition-all group-hover:border-primary group-hover:shadow-lg">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <item.icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <CardTitle>{item.title}</CardTitle>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </CardContent>
                                </Card>
                            </Link>
                        )
                    })}

                    {personalizedContent.items.length === 0 && (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            <p>No specific recommendations based on your interests. Go to your <Link href="/profile" className="text-primary underline">profile</Link> to update them!</p>
                        </div>
                    )}
                </CardContent>
            </Card>

        </div>
    )
}
