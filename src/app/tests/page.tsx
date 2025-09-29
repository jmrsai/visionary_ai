import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MOCK_TESTS } from "@/lib/data";

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
              <Card key={test.id} className="hover:border-primary hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <test.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>{test.title}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">{test.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
