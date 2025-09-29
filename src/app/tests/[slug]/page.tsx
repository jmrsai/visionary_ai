import { MOCK_TESTS } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VisualAcuityTest } from "@/components/tests/visual-acuity-test";
import { ColorVisionTest } from "@/components/tests/color-vision-test";
import { AstigmatismTest } from "@/components/tests/astigmatism-test";
import { MacularHealthTest } from "@/components/tests/macular-health-test";
import { PupilResponseTest } from "@/components/tests/pupil-response-test";
import { ReadingSpeedTest } from "@/components/tests/reading-speed-test";
import { VisualFieldTest } from "@/components/tests/visual-field-test";


export async function generateStaticParams() {
  return MOCK_TESTS.map((test) => ({
    slug: test.id,
  }));
}

const TestComponent = ({ slug }: { slug: string }) => {
    switch (slug) {
        case 'visual-acuity':
            return <VisualAcuityTest />;
        case 'color-vision':
            return <ColorVisionTest />;
        case 'astigmatism':
            return <AstigmatismTest />;
        case 'macular-health':
            return <MacularHealthTest />;
        case 'visual-field':
            return <VisualFieldTest />;
        case 'pupil-response':
            return <PupilResponseTest />;
        case 'reading-speed':
            return <ReadingSpeedTest />;
        default:
            return <p>Test not found.</p>;
    }
};

export default function TestPage({ params }: { params: { slug:string } }) {
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
          <CardDescription>Follow the instructions to complete the test.</CardDescription>
        </CardHeader>
        <CardContent>
          <TestComponent slug={params.slug} />
        </CardContent>
      </Card>
    </div>
  );
}
