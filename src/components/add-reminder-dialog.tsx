
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
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

interface AddReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddReminder: (reminder: Omit<Reminder, "id" | "enabled">) => void;
}

const pillShapes = ["pill", "capsule", "circle"];
const pillColors = ["#f87171", "#60a5fa", "#fbbf24", "#a78bfa", "#ffffff", "#9ca3af"];


export function AddReminderDialog({
  open,
  onOpenChange,
  onAddReminder,
}: AddReminderDialogProps) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState<Reminder["type"]>("exercise");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [specificDays, setSpecificDays] = useState<string[]>([]);
  const [reason, setReason] = useState("");
  const [appearance, setAppearance] = useState({ shape: 'pill', color: '#f87171' });

  const isMedication = ["Eye Drops", "Pill", "Capsule", "Liquid"].includes(type);

  const handleSubmit = () => {
    let finalFrequency = frequency;
    if (frequency === "Specific Days" && specificDays.length > 0) {
        finalFrequency = specificDays.join(', ');
    }
      
    if (title && type && (time || frequency === "As Needed")) {
      const newReminder: Omit<Reminder, "id" | "enabled"> = { title, time, type, frequency: finalFrequency };
      if (isMedication) {
        newReminder.dosage = dosage;
        newReminder.reason = reason;
        newReminder.appearance = appearance;
      }
      onAddReminder(newReminder);
      
      // Reset form
      setTitle("");
      setTime("");
      setType("exercise");
      setDosage("");
      setFrequency("Daily");
      setSpecificDays([]);
      setReason("");
      setAppearance({ shape: 'pill', color: '#f87171' });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add a New Reminder</DialogTitle>
          <DialogDescription>
            Set up a new notification for your eye care routine.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select onValueChange={(value: Reminder["type"]) => setType(value)} defaultValue={type}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exercise">Exercise</SelectItem>
                <SelectItem value="Eye Drops">Eye Drops</SelectItem>
                <SelectItem value="Pill">Pill</SelectItem>
                <SelectItem value="Capsule">Capsule</SelectItem>
                <SelectItem value="Liquid">Liquid</SelectItem>
                <SelectItem value="appointment">Appointment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Name</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isMedication ? "e.g., Latanoprost" : "e.g., Blinking Exercise"}
            />
          </div>
           {isMedication && (
            <>
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g., 1 drop, 2 pills, 10mg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Medication</Label>
                <Input
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., For Glaucoma, Dry Eyes"
                />
              </div>
              <div className="space-y-2">
                <Label>Appearance</Label>
                <div className="p-4 border rounded-md space-y-4">
                    <div className="space-y-2">
                        <Label className="text-sm">Shape</Label>
                        <RadioGroup 
                            defaultValue="pill" 
                            className="flex gap-4"
                            onValueChange={(value) => setAppearance(prev => ({ ...prev, shape: value }))}
                        >
                            {pillShapes.map(shape => (
                                <Label key={shape} htmlFor={`shape-${shape}`} className="cursor-pointer">
                                    <RadioGroupItem value={shape} id={`shape-${shape}`} className="sr-only" />
                                    <div className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 ${appearance.shape === shape ? 'border-primary' : 'border-border'}`}>
                                        <div 
                                          className={`
                                            ${shape === 'pill' ? 'w-6 h-3 rounded-full' : ''}
                                            ${shape === 'capsule' ? 'w-6 h-3 rounded-full' : ''}
                                            ${shape === 'circle' ? 'w-5 h-5 rounded-full' : ''}
                                          `}
                                          style={{
                                              backgroundColor: shape === 'capsule' ? 'transparent' : appearance.color,
                                              position: 'relative',
                                              overflow: 'hidden',
                                          }}
                                        >
                                          {shape === 'capsule' && (
                                            <>
                                                <div className="absolute top-0 left-0 w-1/2 h-full" style={{backgroundColor: appearance.color}}></div>
                                                <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-300"></div>
                                            </>
                                          )}
                                        </div>
                                    </div>
                                </Label>
                            ))}
                        </RadioGroup>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm">Color</Label>
                         <RadioGroup 
                            defaultValue={appearance.color}
                            className="flex gap-2 flex-wrap"
                            onValueChange={(value) => setAppearance(prev => ({ ...prev, color: value }))}
                        >
                            {pillColors.map(color => (
                                <Label key={color} htmlFor={`color-${color}`} className="cursor-pointer">
                                    <RadioGroupItem value={color} id={`color-${color}`} className="sr-only" />
                                    <div className={`w-8 h-8 rounded-full border-2 ${appearance.color === color ? 'border-primary' : 'border-border'}`} style={{backgroundColor: color}}></div>
                                </Label>
                            ))}
                        </RadioGroup>
                    </div>
                </div>
              </div>
            </>
           )}
            <div className="space-y-2">
                <Label htmlFor="frequency-type">Frequency</Label>
                <Select onValueChange={setFrequency} defaultValue={frequency}>
                    <SelectTrigger id="frequency-type">
                        <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="Specific Days">Specific Days of the Week</SelectItem>
                        <SelectItem value="As Needed">As Needed</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            {frequency === 'Specific Days' && (
                <div className="space-y-2">
                    <Label>On Which Days?</Label>
                    <ToggleGroup 
                        type="multiple" 
                        variant="outline" 
                        className="flex flex-wrap justify-start"
                        value={specificDays}
                        onValueChange={setSpecificDays}
                    >
                        <ToggleGroupItem value="Sun">S</ToggleGroupItem>
                        <ToggleGroupItem value="Mon">M</ToggleGroupItem>
                        <ToggleGroupItem value="Tue">T</ToggleGroupItem>
                        <ToggleGroupItem value="Wed">W</ToggleGroupItem>
                        <ToggleGroupItem value="Thu">T</ToggleGroupItem>
                        <ToggleGroupItem value="Fri">F</ToggleGroupItem>
                        <ToggleGroupItem value="Sat">S</ToggleGroupItem>
                    </ToggleGroup>
                </div>
            )}
            
           {frequency !== 'As Needed' && (
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            )}
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
