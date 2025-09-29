import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MOCK_EXERCISES, MOCK_CIRCUITS } from "@/lib/data";
import { ChevronRight } from "lucide-react";
import { CircuitCard } from "./circuits/circuit-card";


export default function GymPage() {
  const exerciseCategories = [...new Set(MOCK_EXERCISES.map(ex => ex.category))];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Eye Gym</h1>
        <p className="text-muted-foreground">
          Strengthen your eyes and reduce strain with guided exercises and tools.
        </p>
      </div>
      
      <div>
          <h2 className="text-2xl font-semibold mb-4">Eye Movement Circuits</h2>
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {MOCK_CIRCUITS.map((circuit) => (
              <CircuitCard key={circuit.id} circuit={circuit} />
            ))}
          </div>
      </div>


      {exerciseCategories.map(category => (
        <div key={category}>
          <h2 className="text-2xl font-semibold mb-4">{category}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {MOCK_EXERCISES.filter(ex => ex.category === category).map((exercise) => {
              const exercisePath = exercise.category === 'AI Tools' 
                ? `/gym/${exercise.id}` 
                : `/gym/exercise/${exercise.id}`;
              
              return (
              <Link key={exercise.id} href={exercisePath} className="group">
                <Card className="h-full transition-all group-hover:border-primary group-hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <exercise.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle>{exercise.title}</CardTitle>
                                <CardDescription>{exercise.duration}</CardDescription>
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{exercise.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )})}
          </div>
        </div>
      ))}
    </div>
  );
}
