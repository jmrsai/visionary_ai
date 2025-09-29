
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Reminder } from "@/lib/types";

interface AddReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddReminder: (reminder: Omit<Reminder, "id" | "enabled">) => void;
}

export function AddReminderDialog({
  open,
  onOpenChange,
  onAddReminder,
}: AddReminderDialogProps) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState<Reminder["type"]>("exercise");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");

  const handleSubmit = () => {
    if (title && time && type) {
      const newReminder: Omit<Reminder, "id" | "enabled"> = { title, time, type };
      if (type === 'medication') {
        newReminder.dosage = dosage;
        newReminder.frequency = frequency;
      }
      onAddReminder(newReminder);
      
      // Reset form
      setTitle("");
      setTime("");
      setType("exercise");
      setDosage("");
      setFrequency("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Reminder</DialogTitle>
          <DialogDescription>
            Set up a new notification for your eye care routine.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select onValueChange={(value: Reminder["type"]) => setType(value)} defaultValue={type}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exercise">Exercise</SelectItem>
                <SelectItem value="medication">Medication</SelectItem>
                <SelectItem value="appointment">Appointment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Take eye drops"
            />
          </div>
           {type === 'medication' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g., 1 pill, 10mg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Input
                  id="frequency"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  placeholder="e.g., Twice a day, every 4 hours"
                />
              </div>
            </>
           )}
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g., 2:00 PM or in 30 mins"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Add Reminder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
