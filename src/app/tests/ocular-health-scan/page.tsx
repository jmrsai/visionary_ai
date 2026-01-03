
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { OcularHealthScan } from "@/components/tests/ocular-health-scan";

export default function OcularHealthScanPage() {

  return (
    <div className="space-y-6">
       <div>
        <Link href="/tests" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to All Tests</Link>
        <h1 className="text-4xl font-bold tracking-tight">Ocular Health Scan</h1>
        <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
          Use our AI-powered tool to analyze a photo of your eye for signs of conditions like cataracts or pterygium. This is an experimental screening tool, not a diagnosis.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>AI Eye Scan</CardTitle>
          <CardDescription>Follow the instructions to get your AI-powered analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <OcularHealthScan />
        </CardContent>
      </Card>
    </div>
  );
}
