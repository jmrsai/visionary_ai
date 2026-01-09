
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MOCK_TESTS } from "@/lib/data";
import type { CheckupReport, TestResult } from "@/lib/types";
import { Check, AlertTriangle, RefreshCw, Share2, Download, MessageSquare, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";

const getStatus = (result: TestResult) => {
  if (result.status === "good")
    return {
      Icon: Check,
      color: "text-green-500",
      text: "Normal",
    };
  if (result.status === "warning")
    return { Icon: AlertTriangle, color: "text-yellow-500", text: "Review" };
  return {
    Icon: AlertTriangle,
    color: "text-red-500",
    text: "Potential Issue",
  };
};

const ResultRow = ({ result }: { result: TestResult }) => {
  const testInfo = MOCK_TESTS.find((t) => t.id === result.testId);
  const status = getStatus(result);

  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
      <div className="flex items-center gap-3">
        {testInfo && <testInfo.icon className="h-5 w-5 text-muted-foreground" />}
        <p className="font-medium">{testInfo?.title || "Unknown Test"}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold">{result.value}</p>
        <p className={cn("text-sm font-semibold flex items-center justify-end gap-1", status.color)}>
            <status.Icon className="h-4 w-4" />
            {status.text}
        </p>
      </div>
    </div>
  );
};

const PastCheckups = () => {
    const { user } = useUser();
    const firestore = useFirestore();

    const historyQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(
            collection(firestore, `users/${user.uid}/visionTestResults`),
            orderBy("date", "desc"),
            limit(5)
        );
    }, [user, firestore]);

    const { data: pastReports, isLoading } = useCollection<CheckupReport>(historyQuery);

    if (isLoading) {
        return <div className="flex justify-center items-center p-4"><Loader2 className="h-5 w-5 animate-spin"/></div>
    }

    if (!pastReports || pastReports.length === 0) {
        return <p className="text-sm text-muted-foreground p-4">No past check-up history found.</p>
    }

    return (
        <div className="space-y-2 p-2">
            {pastReports.map(report => (
                <Card key={report.id} className="bg-background/50">
                    <CardHeader className="p-3">
                        <CardTitle className="text-sm">Report from {format(parseISO(report.date), "MMMM d, yyyy")}</CardTitle>
                    </CardHeader>
                </Card>
            ))}
        </div>
    )
}


export function CheckupResultCard({
  report,
  onRestart,
}: {
  report: CheckupReport;
  onRestart: () => void;
}) {
  const overallStatus = report.results.some(r => r.status === 'danger') ? 'danger' :
                        report.results.some(r => r.status === 'warning') ? 'warning' : 'good';

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Your Check-up Report Card
        </CardTitle>
        <CardDescription className="text-center">
          Completed on {format(new Date(report.date), "MMMM d, yyyy")}
        </CardDescription>
        <div className={cn("mx-auto mt-2", getStatus({status: overallStatus, testId: '', value: ''}).color)}>
          {overallStatus === 'good' && <Check className="h-8 w-8" />}
          {overallStatus !== 'good' && <AlertTriangle className="h-8 w-8" />}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card>
          <CardContent className="p-2">
            {report.results.map((result) => (
              <ResultRow key={result.testId} result={result} />
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
            <Button variant="outline" onClick={onRestart}><RefreshCw className="mr-2"/>Restart</Button>
            <Button variant="outline"><Download className="mr-2"/>Save PDF</Button>
            <Button variant="outline"><Share2 className="mr-2"/>Share</Button>
            <Button><MessageSquare className="mr-2"/>Ask AI</Button>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="history">
            <AccordionTrigger>View Past Check-ups</AccordionTrigger>
            <AccordionContent>
              <PastCheckups />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

