import { MOCK_EXERCISES } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const exercises = MOCK_EXERCISES.filter(ex => ex.category !== 'AI Tools');
  return exercises.map((exercise) => ({
    slug: exercise.id,
  }));
}

export default function ExercisePage({ params }: { params: { slug: string } }) {
  const exercise = MOCK_EXERCISES.find((e) => e.id === params.slug);

  if (!exercise) {
    notFound();
  }

  return (
    <div className="space-y-6">
       <div>
        <Link href="/gym" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to Gym</Link>
        <h1 className="text-4xl font-bold tracking-tight">{exercise.title}</h1>
        <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
          {exercise.description}
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Guided Exercise</CardTitle>
          <CardDescription>Follow the instructions on the screen to complete the exercise.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center flex-col gap-4">
              <p className="text-muted-foreground">Interactive exercise guide coming soon.</p>
              <Button size="lg">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Start Exercise
              </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
