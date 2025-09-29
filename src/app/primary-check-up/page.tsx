
import { TestRunner } from "./test-runner";

export default function PrimaryCheckupPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Comprehensive Eye Health Check-up</h1>
        <p className="text-muted-foreground">
          A guided suite of essential tests to monitor your eye health.
        </p>
      </div>
      <TestRunner />
    </div>
  );
}
