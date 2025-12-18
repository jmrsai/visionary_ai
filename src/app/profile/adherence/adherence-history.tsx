"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_ADHERENCE_HISTORY } from "@/lib/data";
import type { AdherenceLog } from "@/lib/types";
import { CheckCircle, XCircle, Clock } from "lucide-react";

const statusIcons = {
  taken: <CheckCircle className="h-5 w-5 text-green-500" />,
  skipped: <XCircle className="h-5 w-5 text-red-500" />,
  upcoming: <Clock className="h-5 w-5 text-yellow-500" />,
  taken_late: <CheckCircle className="h-5 w-5 text-yellow-500" />,
};

const groupHistoryByDate = (history: AdherenceLog[]) => {
  return history.reduce((acc, log) => {
    const date = log.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(log);
    return acc;
  }, {} as Record<string, AdherenceLog[]>);
};

export function AdherenceHistory() {
  const groupedHistory = groupHistoryByDate(MOCK_ADHERENCE_HISTORY);
  const dates = Object.keys(groupedHistory).sort((a, b) => {
      // Simple date sort for "Today", "Yesterday", etc.
      if (a === 'Today') return -1;
      if (b === 'Today') return 1;
      if (a === 'Yesterday') return -1;
      if (b === 'Yesterday') return 1;
      return a.localeCompare(b);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Full History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {dates.map((date) => (
            <div key={date}>
              <h3 className="text-lg font-semibold mb-2 sticky top-16 bg-background py-2 z-10">
                {date}
              </h3>
              <div className="space-y-4 ml-4 border-l-2 pl-8 relative">
                {groupedHistory[date].map((log) => (
                  <div key={log.id} className="flex items-start gap-4">
                    <div className="absolute -left-[1.1rem] top-1 flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                        {statusIcons[log.status]}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{log.medication}</p>
                      <p className="text-sm text-muted-foreground">
                        {log.status === 'upcoming' ? 'Scheduled for ' : 'Logged at '} {log.time}
                      </p>
                    </div>
                    <div className="text-sm font-medium capitalize">
                        {log.status.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
