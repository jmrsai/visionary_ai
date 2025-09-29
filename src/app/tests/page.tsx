import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MOCK_TESTS } from "@/lib/data";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function TestsPage() {
  const categories = [...new Set(MOCK_TESTS.map(test => test.category))];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Diagnostic Tests</h1>
        <p className="text-muted-foreground">
          A suite of tests to screen for various eye conditions.
        </p>
      </div>

      {categories.map(category => (
        <div key={category}>
          <h2 className="text-2xl font-semibold mb-4">{category}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {MOCK_TESTS.filter(test => test.category === category).map((test) => (
              <Link key={test.id} href={`/tests/${test.id}`} className="group">
                <Card className="h-full transition-all group-hover:border-primary group-hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <test.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle>{test.title}</CardTitle>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{test.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
