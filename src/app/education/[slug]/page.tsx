
import Link from "next/link";
import { notFound } from "next/navigation";
import { generateEducationContent } from "@/ai/flows/education-content-generator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, BookOpen } from "lucide-react";
import Markdown from "react-markdown";

// This component fetches AI content on the server
async function AiGeneratedContent({ topic }: { topic: string }) {
    try {
        const content = await generateEducationContent({ topic });
        return (
             <div className="prose dark:prose-invert max-w-none">
                <Markdown>{content.article}</Markdown>
            </div>
        )
    } catch (error) {
        console.error("Failed to generate content:", error);
        return (
            <Alert variant="destructive">
                <AlertTitle>Error Generating Content</AlertTitle>
                <AlertDescription>
                    The AI failed to generate content for this topic. This can happen due to network issues or if the topic is too broad. Please try a different topic.
                </AlertDescription>
            </Alert>
        )
    }
}


export default function EducationArticlePage({ params }: { params: { slug: string } }) {
  if (!params.slug) {
    notFound();
  }
  
  const topic = params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="space-y-6">
       <div>
        <Link href="/education" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to Education Center</Link>
        <h1 className="text-4xl font-bold tracking-tight">{topic}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          An AI-generated overview of {topic}.
        </p>
      </div>
      
      <Card>
        <CardHeader>
            <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="h-4 w-4"/>
                <span className="text-sm">AI Generated Article</span>
            </div>
        </CardHeader>
        <CardContent>
            <React.Suspense fallback={
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">The AI is writing your article...</p>
                </div>
            }>
                <AiGeneratedContent topic={topic} />
            </React.Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

// Re-export the necessary React namespace for Suspense to work
import * as React from 'react';
