
"use client";

import { useState } from "react";
import { MOCK_TESTS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { VisualAcuityTest } from "@/components/tests/visual-acuity-test";
import { MacularHealthTest } from "@/components/tests/macular-health-test";
import { ColorVisionTest } from "@/components/tests/color-vision-test";
import { VisualFieldTest } from "@/components/tests/visual-field-test";
import { AccommodationFlexibilityTest } from "@/components/tests/accommodation-flexibility-test";
import type { TestResult, CheckupReport } from "@/lib/types";
import { v4 as uuidv4 } from 'uuid';
import { CheckupResultCard } from "./result-card";

const checkupTestIds = [
  "visual-acuity",
  "macular-health",
  "color-vision",
  "visual-field",
  "accommodation-flexibility",
];

const checkupTests = checkupTestIds.map(id => MOCK_TESTS.find(t => t.id === id)!);

const TestComponent = ({ testId, onComplete }: { testId: string, onComplete: (result: TestResult) => void }) => {
  // This is a simplified way to pass onComplete. In a real app, you might use a more robust
  // event system or context, as each test component has a different way of determining its result.
  // For now, we'll simulate completion with a button.
  
  const getTestComponent = () => {
    switch (testId) {
      case "visual-acuity": return <VisualAcuityTest />;
      case "macular-health": return <MacularHealthTest />;
      case "color-vision": return <ColorVisionTest />;
      case "visual-field": return <VisualFieldTest />;
      case "accommodation-flexibility": return <AccommodationFlexibilityTest />;
      default: return <p>Test not found.</p>;
    }
  }

  // --- MOCK RESULT GENERATION ---
  // This simulates the test generating a result. In a real app, this would come from the test component itself.
  const getMockResult = (): TestResult => {
      switch (testId) {
        case 'visual-acuity': return { testId, value: '20/25', status: 'good' };
        case 'macular-health': return { testId, value: 'No Issues', status: 'good' };
        case 'color-vision': return { testId, value: 'Normal', status: 'good' };
        case 'visual-field': return { testId, value: '9/10', status: 'warning' };
        case 'accommodation-flexibility': return { testId, value: '450ms', status: 'warning' };
        default: return { testId, value: 'N/A', status: 'good' };
      }
  }

  return (
    <div>
        {getTestComponent()}
        <div className="text-center mt-8">
            <Button onClick={() => onComplete(getMockResult())}>Simulate Test Completion</Button>
            <p className="text-xs text-muted-foreground mt-2">(This button simulates finishing the test for demo purposes)</p>
        </div>
    </div>
  )
};

export function TestRunner() {
  const [step, setStep] = useState<"idle" | "running" | "finished">("idle");
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const [finalReport, setFinalReport] = useState<CheckupReport | null>(null);

  const startCheckup = () => {
    setStep("running");
    setCurrentTestIndex(0);
    setResults([]);
    setFinalReport(null);
  };

  const handleTestComplete = (result: TestResult) => {
    const newResults = [...results, result];
    setResults(newResults);

    if (currentTestIndex < checkupTests.length - 1) {
      setCurrentTestIndex(currentTestIndex + 1);
    } else {
      const report: CheckupReport = {
          id: uuidv4(),
          date: new Date().toISOString(),
          results: newResults,
      };
      setFinalReport(report);
      setStep("finished");
    }
  };

  if (step === "idle") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your 5-Minute Check-up</CardTitle>
          <CardDescription>
            This guided check-up will take you through five core tests. Please
            find a quiet, well-lit space before you begin.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <ul className="text-muted-foreground list-disc list-inside text-left max-w-md mx-auto mb-6">
                {checkupTests.map(t => <li key={t.id}>{t.title}</li>)}
            </ul>
          <Button size="lg" onClick={startCheckup}>
            Begin Check-up
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (step === 'finished' && finalReport) {
      return <CheckupResultCard report={finalReport} onRestart={startCheckup} />;
  }

  const currentTest = checkupTests[currentTestIndex];
  const progress = ((currentTestIndex + 1) / checkupTests.length) * 100;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm font-medium text-primary">Test {currentTestIndex + 1} of {checkupTests.length}</p>
        <h2 className="text-2xl font-bold tracking-tight">{currentTest.title}</h2>
        <Progress value={progress} className="w-full max-w-sm mx-auto mt-2 h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{currentTest.title}</CardTitle>
          <CardDescription>{currentTest.description}</CardDescription>
        </CardHeader>
        <CardContent>
            <TestComponent 
                testId={currentTest.id}
                onComplete={handleTestComplete}
            />
        </CardContent>
      </Card>
    </div>
  );
}
