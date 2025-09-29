import { MOCK_CIRCUITS } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CircuitPlayer } from "./circuit-player";

export async function generateStaticParams() {
  return MOCK_CIRCUITS.map((circuit) => ({
    slug: circuit.id,
  }));
}

export default function CircuitPage({ params }: { params: { slug: string } }) {
  const circuit = MOCK_CIRCUITS.find((c) => c.id === params.slug);

  if (!circuit) {
    notFound();
  }

  return (
    <div className="space-y-6">
       <div>
        <Link href="/gym" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to Gym</Link>
        <h1 className="text-4xl font-bold tracking-tight">{circuit.title}</h1>
        <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
          {circuit.description}
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Circuit Player</CardTitle>
          <CardDescription>Follow the exercises as they appear on screen.</CardDescription>
        </CardHeader>
        <CardContent>
          <CircuitPlayer circuit={circuit} />
        </CardContent>
      </Card>
    </div>
  );
}
