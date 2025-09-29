import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Glasses, HeartPulse, ChevronRight } from "lucide-react";
import Link from "next/link";

const checkupTests = [
    {
        title: "Visual Acuity",
        icon: Eye,
        description: "Test the sharpness of your vision."
    },
    {
        title: "Color Vision",
        icon: Glasses,
        description: "Screen for color vision deficiencies."
    },
    {
        title: "Macular Health",
        icon: HeartPulse,
        description: "Check for distortions with the Amsler grid."
    }
];

export default function PrimaryCheckupPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Primary Eye Check-up</h1>
        <p className="text-muted-foreground">
          A guided suite of essential tests to monitor your eye health.
        </p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Your 5-Minute Check-up</CardTitle>
            <CardDescription>This guided check-up will take you through three core tests. Please find a quiet, well-lit space before you begin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4 rounded-lg border p-4">
                <h3 className="font-semibold">Tests Included:</h3>
                <div className="grid md:grid-cols-3 gap-4">
                {checkupTests.map(test => (
                    <div key={test.title} className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-primary">
                            <test.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-medium text-sm">{test.title}</p>
                            <p className="text-xs text-muted-foreground">{test.description}</p>
                        </div>
                    </div>
                ))}
                </div>
            </div>
            
            <div className="text-center pt-4">
                <p className="text-muted-foreground mb-4">You will be guided through each test one by one.</p>
                <Button size="lg" asChild>
                   {/* In the future, this will link to a dynamic test runner component */}
                   <Link href="/tests/visual-acuity">
                     Begin Check-up <ChevronRight className="ml-2 h-5 w-5" />
                   </Link>
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
