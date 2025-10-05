import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { RednessIrritationScan } from "@/components/tests/redness-irritation-scan";

export default function RednessScanPage() {

  return (
    <div className="space-y-6">
       <div>
        <Link href="/tests" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to All Tests</Link>
        <h1 className="text-4xl font-bold tracking-tight">Redness & Irritation Scan</h1>
        <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
          Use our AI-powered tool to analyze an image of your eye for signs of redness and irritation. This is an experimental screening tool, not a diagnosis.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>AI Eye Scan</CardTitle>
          <CardDescription>Follow the instructions to get your AI-powered analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <RednessIrritationScan />
        </CardContent>
      </Card>
    </div>
  );
}
