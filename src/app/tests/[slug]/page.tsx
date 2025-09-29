import { MOCK_TESTS } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Construction } from "lucide-react";

export async function generateStaticParams() {
  return MOCK_TESTS.map((test) => ({
    slug: test.id,
  }));
}

export default function TestPage({ params }: { params: { slug: string } }) {
  const test = MOCK_TESTS.find((e) => e.id === params.slug);

  if (!test) {
    notFound();
  }

  return (
    <div className="space-y-6">
       <div>
        <Link href="/tests" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to Tests</Link>
        <h1 className="text-4xl font-bold tracking-tight">{test.title}</h1>
        <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
          {test.description}
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Test Area</CardTitle>
          <CardDescription>The interactive test will be displayed here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center min-h-[300px]">
            <Construction className="h-16 w-16 text-muted-foreground/50" />
            <h2 className="mt-6 text-xl font-semibold">Feature Coming Soon</h2>
            <p className="mt-2 text-muted-foreground">
              This interactive test is currently under construction.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
