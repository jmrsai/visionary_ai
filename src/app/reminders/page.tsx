"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Dumbbell, PlusCircle, Pill } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { MOCK_REMINDERS } from "@/lib/data";
import type { Reminder } from "@/lib/types";

export default function RemindersPage() {
    const [reminders, setReminders] = useState<Reminder[]>(MOCK_REMINDERS);

    const getIcon = (type: Reminder['type']) => {
        switch (type) {
            case 'exercise': return <Dumbbell className="h-5 w-5" />;
            case 'medication': return <Pill className="h-5 w-5" />;
            case 'appointment': return <Bell className="h-5 w-5" />;
            default: return <Bell className="h-5 w-5" />;
        }
    }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold">Reminders</h1>
            <p className="text-muted-foreground">
                Manage your exercise, medication, and appointment reminders.
            </p>
        </div>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Reminder
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Reminders</CardTitle>
          <CardDescription>Stay on track with your eye care routine.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="text-muted-foreground">
                    {getIcon(reminder.type)}
                  </div>
                  <div>
                    <p className="font-semibold">{reminder.title}</p>
                    <p className="text-sm text-muted-foreground">{reminder.time}</p>
                  </div>
                </div>
                <Switch defaultChecked={reminder.id % 2 === 0} />
              </div>
            ))}
             {reminders.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Bell className="mx-auto h-12 w-12" />
                <p className="mt-4">You have no reminders set.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
