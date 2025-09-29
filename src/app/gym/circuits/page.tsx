import { MOCK_CIRCUITS } from "@/lib/data";
import { CircuitCard } from "./circuit-card";

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
