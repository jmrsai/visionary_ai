import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MOCK_CIRCUITS } from "@/lib/data";
import { ChevronRight, ListTodo, type LucideIcon } from "lucide-react";
import type { Circuit } from "@/lib/types";

const iconMap: Record<string, LucideIcon> = {
    ListTodo: ListTodo,
};

const CircuitCard = ({ circuit }: { circuit: Circuit }) => {
    const Icon = iconMap[circuit.icon];
    return (
         <Link href={`/gym/circuits/${circuit.id}`} className="group">
            <Card className="h-full transition-all group-hover:border-primary group-hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                           {Icon && <Icon className="h-6 w-6" />}
                        </div>
                        <div>
                            <CardTitle>{circuit.title}</CardTitle>
                            <CardDescription>{circuit.totalDuration}</CardDescription>
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{circuit.description}</p>
              </CardContent>
            </Card>
          </Link>
    )
}

export default function CircuitsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Eye Movement Circuits</h1>
        <p className="text-muted-foreground">
          Follow along with structured workout routines for your eyes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_CIRCUITS.map((circuit) => (
          <CircuitCard key={circuit.id} circuit={circuit} />
        ))}
      </div>
    </div>
  );
}
