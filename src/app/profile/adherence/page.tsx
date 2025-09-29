
import { CheckCircle } from "lucide-react";
import { AdherenceHistory } from "./adherence-history";
import Link from "next/link";

export default function AdherencePage() {
  return (
    <div className="space-y-8">
      <div>
        <Link href="/profile" className="text-sm text-muted-foreground hover:text-primary">
          &larr; Back to Profile
        </Link>
        <div className="flex items-start gap-4 mt-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Adherence History</h1>
            <p className="text-muted-foreground">
              A complete log of your medication schedule.
            </p>
          </div>
        </div>
      </div>
      <AdherenceHistory />
    </div>
  );
}
