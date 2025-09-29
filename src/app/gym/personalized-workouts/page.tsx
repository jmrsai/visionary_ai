import { Dumbbell } from "lucide-react";
import { WorkoutForm } from "./workout-form";

export default function PersonalizedWorkoutsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Dumbbell className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">AI Personalized Workouts</h1>
          <p className="text-muted-foreground">
            Let our AI craft the perfect eye workout routine just for you.
          </p>
        </div>
      </div>
      <WorkoutForm />
    </div>
  );
}
