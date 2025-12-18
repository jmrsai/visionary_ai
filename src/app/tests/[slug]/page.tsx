import { MOCK_TESTS, MOCK_EXERCISES } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VisualAcuityTest } from "@/components/tests/visual-acuity-test";
import { MacularHealthTest } from "@/components/tests/macular-health-test";
import { ColorVisionTest } from "@/components/tests/color-vision-test";
import { AstigmatismTest } from "@/components/tests/astigmatism-test";
import { ContrastSensitivityTest } from "@/components/tests/contrast-sensitivity-test";
import { PupilResponseTest } from "@/components/tests/pupil-response-test";
import { VisualFieldTest } from "@/components/tests/visual-field-test";
import { RednessIrritationScan } from "@/components/tests/redness-irritation-scan";
import { StereopsisTest } from "@/components/tests/stereopsis-test";
import { ReadingSpeedTest } from "@/components/tests/reading-speed-test";
import { AccommodationFlexibilityTest } from "@/components/tests/accommodation-flexibility-test";
import { JungleExplorerGame } from "@/components/tests/jungle-explorer-game";

export async function generateStaticParams() {
  return MOCK_TESTS.map((test) => ({
    slug: test.id,
  }));
}

const TestComponent = ({ testId }: { testId: string }) => {
    switch (testId) {
      case "visual-acuity": return <VisualAcuityTest />;
      case "macular-health": return <MacularHealthTest />;
      case "color-vision": return <ColorVisionTest />;
      case "astigmatism": return <AstigmatismTest />;
      case "contrast-sensitivity": return <ContrastSensitivityTest />;
      case "pupil-response": return <PupilResponseTest />;
      case "visual-field": return <VisualFieldTest />;
      case "redness-scan": return <RednessIrritationScan />;
      case "stereopsis": return <StereopsisTest />;
      case "reading-speed": return <ReadingSpeedTest />;
      case "accommodation-flexibility": return <AccommodationFlexibilityTest />;
      case "jungle-explorer": return <JungleExplorerGame />;
      default: return <p>Test not found.</p>;
    }
}

export default function TestPage({ params }: { params: { slug: string } }) {
  const test = MOCK_TESTS.find((e) => e.id === params.slug);

  if (!test) {
    notFound();
  }

  return (
    <div className="space-y-6">
       <div>
        <Link href="/tests" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to All Tests</Link>
        <h1 className="text-4xl font-bold tracking-tight">{test.title}</h1>
        <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
          {test.description}
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Interactive Test</CardTitle>
          <CardDescription>Follow the instructions on the screen to complete the test.</CardDescription>
        </CardHeader>
        <CardContent>
          <TestComponent testId={test.id} />
        </CardContent>
      </Card>
    </div>
  );
}
