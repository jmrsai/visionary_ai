"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Dumbbell, PlusCircle, Pill, Droplet } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { Reminder } from "@/lib/types";
import { AddReminderDialog } from "@/components/add-reminder-dialog";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, addDoc, updateDoc } from "firebase/firestore";
import { setDocumentNonBlocking, addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Loader2 } from "lucide-react";

export default function RemindersPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const remindersCollectionRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, `users/${user.uid}/reminders`);
    }, [user, firestore]);

    const { data: reminders, isLoading } = useCollection<Reminder>(remindersCollectionRef);
    
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const toggleReminder = (id: string, currentStatus: boolean) => {
        if (!remindersCollectionRef) return;
        const reminderRef = doc(remindersCollectionRef, id);
        updateDoc(reminderRef, { enabled: !currentStatus });
    }
    
    const addReminder = (newReminder: Omit<Reminder, "id" | "enabled">) => {
        if (!remindersCollectionRef) return;
        addDocumentNonBlocking(remindersCollectionRef, { ...newReminder, enabled: true });
    };

    const getIcon = (type: Reminder['type']) => {
        switch (type) {
            case 'exercise': return <Dumbbell className="h-5 w-5" />;
            case 'Eye Drops': return <Droplet className="h-5 w-5" />;
            case 'Pill':
            case 'Capsule':
            case 'Liquid':
                return <Pill className="h-5 w-5" />;
            case 'appointment': return <Bell className="h-5 w-5" />;
            default: return <Bell className="h-5 w-5" />;
        }
    }

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold">Reminders</h1>
                <p className="text-muted-foreground">
                    Manage your exercise, medication, and appointment reminders.
                </p>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)} disabled={!user}>
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
                {isLoading && (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                )}
                {!isLoading && reminders && reminders.map((reminder) => (
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
                    <Switch 
                        checked={reminder.enabled}
                        onCheckedChange={() => toggleReminder(reminder.id!, reminder.enabled)}
                        aria-label={`Toggle reminder for ${reminder.title}`}
                    />
                </div>
                ))}
                {!isLoading && (!reminders || reminders.length === 0) && (
                <div className="text-center py-12 text-muted-foreground">
                    <Bell className="mx-auto h-12 w-12" />
                    <p className="mt-4">You have no reminders set.</p>
                </div>
                )}
            </div>
            </CardContent>
        </Card>
      </div>
      <AddReminderDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddReminder={addReminder}
      />
    </>
  );
}
