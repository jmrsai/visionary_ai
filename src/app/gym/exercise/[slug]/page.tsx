import { MOCK_EXERCISES } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InteractiveExercise } from "./interactive-exercise";

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
          <InteractiveExercise exercise={exercise} />
        </CardContent>
      </Card>
    </div>
  );
}
