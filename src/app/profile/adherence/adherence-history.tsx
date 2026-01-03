
"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdherenceLog } from "@/lib/types";
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { useCollection, useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";

const statusIcons = {
  taken: <CheckCircle className="h-5 w-5 text-green-500" />,
  skipped: <XCircle className="h-5 w-5 text-red-500" />,
  upcoming: <Clock className="h-5 w-5 text-yellow-500" />,
  taken_late: <CheckCircle className="h-5 w-5 text-yellow-500" />,
};

const groupHistoryByDate = (history: AdherenceLog[]) => {
  return history.reduce((acc, log) => {
    // This is a simplified date grouping. A real app would use date-fns for robust grouping.
    const date = new Date(log.timestamp).toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(log);
    return acc;
  }, {} as Record<string, AdherenceLog[]>);
};

export function AdherenceHistory() {
  const { user } = useUser();
  const firestore = useFirestore();

  const adherenceCollectionRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `users/${user.uid}/adherenceLogs`), orderBy("timestamp", "desc"));
  }, [user, firestore]);

  const { data: history, isLoading } = useCollection<AdherenceLog>(adherenceCollectionRef);
  
  const groupedHistory = useMemo(() => {
      if (!history) return {};
      return groupHistoryByDate(history);
  }, [history]);
  
  const dates = Object.keys(groupedHistory);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Full History</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
             <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        ) : (
        <div className="space-y-6">
          {dates.length > 0 ? dates.map((date) => (
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
                        {log.status === 'upcoming' ? 'Scheduled for ' : 'Logged at '} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="text-sm font-medium capitalize">
                        {log.status.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )) : (
            <div className="text-center py-12 text-muted-foreground">
                <Clock className="mx-auto h-12 w-12" />
                <p className="mt-4">You have no adherence history yet.</p>
            </div>
          )}
        </div>
        )}
      </CardContent>
    </Card>
  );
}
