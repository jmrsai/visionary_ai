
"use client";

import { useState, useEffect }from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Dumbbell, PlusCircle, Pill, Droplet, BellRing } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { Reminder } from "@/lib/types";
import { AddReminderDialog } from "@/components/add-reminder-dialog";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, Query } from "firebase/firestore";
import { addDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Loader2 } from "lucide-react";
import { AdherenceChart } from "@/components/adherence-chart";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Function to schedule a notification
const scheduleNotification = (reminder: Reminder) => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    const now = new Date();
    const [hour, minute] = reminder.time.split(':').map(Number);
    
    let notificationTime = new Date();
    notificationTime.setHours(hour, minute, 0, 0);

    // If the time is in the past for today, schedule it for tomorrow
    if (notificationTime < now) {
        notificationTime.setDate(notificationTime.getDate() + 1);
    }
    
    const delay = notificationTime.getTime() - now.getTime();

    if (delay > 0) {
        const timeoutId = setTimeout(() => {
            new Notification(`Time for your reminder: ${reminder.title}`, {
                body: `It's ${reminder.time}. Don't forget your ${reminder.type}!`,
                icon: '/icons/icon-192x192.png',
            });
        }, delay);
        
        // Store timeout ID to be able to clear it later
        (window as any).scheduledNotifications = (window as any).scheduledNotifications || {};
        (window as any).scheduledNotifications[reminder.id!] = timeoutId;
    }
};

// Function to cancel a scheduled notification
const cancelNotification = (reminderId: string) => {
    if (typeof window === 'undefined') return;
    if ((window as any).scheduledNotifications && (window as any).scheduledNotifications[reminderId]) {
        clearTimeout((window as any).scheduledNotifications[reminderId]);
        delete (window as any).scheduledNotifications[reminderId];
    }
};

export default function MedicationPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const [notificationPermission, setNotificationPermission] = useState('default');

     useEffect(() => {
        if ("Notification" in window) {
            setNotificationPermission(Notification.permission);
        }
    }, []);

    const requestNotificationPermission = () => {
        if ("Notification" in window) {
            Notification.requestPermission().then((permission) => {
                setNotificationPermission(permission);
                if (permission === 'granted') {
                    toast({
                        title: "Notifications Enabled!",
                        description: "You will now receive reminders.",
                    });
                    // Re-schedule notifications for all enabled reminders
                    if (reminders) {
                        reminders.filter(r => r.enabled).forEach(scheduleNotification);
                    }
                } else {
                     toast({
                        title: "Notifications Denied",
                        description: "You will not receive reminders. You can enable them in your browser settings.",
                        variant: "destructive",
                    });
                }
            });
        }
    };
    
    const remindersQuery = useMemoFirebase(() => {
        if (user && firestore) {
          return collection(firestore, `users/${user.uid}/medicationReminders`);
        }
        return null;
      }, [user, firestore]);

    const { data: reminders, isLoading } = useCollection<Reminder>(remindersQuery);
    
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const toggleReminder = (id: string, currentStatus: boolean) => {
        if (!remindersQuery || !reminders) return;
        const reminderRef = doc(remindersQuery, id!);
        updateDocumentNonBlocking(reminderRef, { enabled: !currentStatus });

         if (!currentStatus) { // If it's being enabled
            const reminder = reminders.find(r => r.id === id);
            if (reminder) scheduleNotification(reminder);
        } else { // If it's being disabled
            cancelNotification(id);
        }
    }
    
    const addReminder = (newReminder: Omit<Reminder, "id" | "enabled" | "userId">) => {
        if (!remindersQuery || !user) return;
        addDocumentNonBlocking(remindersQuery, { ...newReminder, userId: user.uid, enabled: true }).then(docRef => {
            if (docRef) {
                scheduleNotification({ ...newReminder, id: docRef.id, enabled: true });
            }
        });
    };
    
     useEffect(() => {
        if (typeof window === 'undefined') return;

        // Clear all existing timeouts first
        if ((window as any).scheduledNotifications) {
            Object.values((window as any).scheduledNotifications).forEach(timeoutId => clearTimeout(timeoutId as number));
            (window as any).scheduledNotifications = {};
        }
        // When reminders are loaded, schedule notifications for enabled ones
        if (reminders && notificationPermission === 'granted') {
            reminders.filter(r => r.enabled).forEach(scheduleNotification);
        }
    }, [reminders, notificationPermission]);

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
                <h1 className="text-3xl font-bold">Medication & Reminders</h1>
                <p className="text-muted-foreground">
                    Manage your exercise, medication, and appointment reminders.
                </p>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)} disabled={!user}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Reminder
            </Button>
        </div>
        
         {notificationPermission !== 'granted' && (
            <Alert>
                <BellRing className="h-4 w-4" />
                <AlertTitle>Enable Notifications</AlertTitle>
                <AlertDescription>
                    To receive alerts for your reminders, please enable notifications.
                    <Button onClick={requestNotificationPermission} size="sm" className="ml-4">Enable</Button>
                </AlertDescription>
            </Alert>
        )}


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
                {!isLoading && reminders && reminders.length > 0 ? (
                    reminders.map((reminder) => (
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
                                disabled={notificationPermission !== 'granted'}
                            />
                        </div>
                    ))
                ) : !isLoading && (
                <div className="text-center py-12 text-muted-foreground">
                    <Bell className="mx-auto h-12 w-12" />
                    <p className="mt-4">You have no reminders set.</p>
                </div>
                )}
            </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Weekly Adherence Chart</CardTitle>
                <CardDescription>A visual summary of your medication adherence this week.</CardDescription>
            </CardHeader>
            <CardContent>
                <AdherenceChart />
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
