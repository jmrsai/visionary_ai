import { Brain } from "lucide-react";
import { SymptomCheckerForm } from "./symptom-checker-form";

export default function SymptomCheckerPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Brain className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">AI Symptom Checker</h1>
          <p className="text-muted-foreground">
            Describe your eye symptoms to get AI-powered insights.
          </p>
        </div>
      </div>
      <SymptomCheckerForm />
    </div>
  );
}
