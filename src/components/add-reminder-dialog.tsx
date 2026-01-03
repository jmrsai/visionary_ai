
"use client";

import { useState, useRef, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { medicationOcr } from "@/ai/flows/medication-ocr";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ScanLine, X } from "lucide-react";

interface AddReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddReminder: (reminder: Omit<Reminder, "id" | "enabled" | "userId">) => void;
}

const pillShapes = ["pill", "capsule", "circle"];
const pillColors = ["#f87171", "#60a5fa", "#fbbf24", "#a78bfa", "#ffffff", "#9ca3af"];


export function AddReminderDialog({
  open,
  onOpenChange,
  onAddReminder,
}: AddReminderDialogProps) {
  const [title, setTitle] = useState("");
  const [times, setTimes] = useState<string[]>([""]);
  const [type, setType] = useState<Reminder["type"]>("Pill");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [specificDays, setSpecificDays] = useState<string[]>([]);
  const [reason, setReason] = useState("");
  const [appearance, setAppearance] = useState({ shape: 'pill', color: '#f87171' });
  const [note, setNote] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const isMedication = ["Eye Drops", "Pill", "Capsule", "Liquid"].includes(type);
  
  useEffect(() => {
    let numTimes = 1;
    if (frequency === "Twice a day") numTimes = 2;
    else if (frequency === "Three times a day") numTimes = 3;
    else if (frequency === "Four times a day") numTimes = 4;
    
    if (frequency === "As Needed") {
        setTimes([]);
    } else {
        setTimes(prev => {
            const newTimes = [...prev];
            while (newTimes.length < numTimes) newTimes.push("");
            return newTimes.slice(0, numTimes);
        });
    }

  }, [frequency]);

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...times];
    newTimes[index] = value;
    setTimes(newTimes);
  };
  
  const resetForm = () => {
    setTitle("");
    setTimes([""]);
    setType("Pill");
    setDosage("");
    setFrequency("Daily");
    setSpecificDays([]);
    setReason("");
    setAppearance({ shape: 'pill', color: '#f87171' });
    setNote("");
    setIsScanning(false);
  }

  const handleSubmit = () => {
    let finalFrequency = frequency;
    if (frequency === "Specific Days" && specificDays.length > 0) {
        finalFrequency = specificDays.join(', ');
    }
      
    if (title && type && (times.length > 0 || frequency === "As Needed")) {
      const newReminder: Omit<Reminder, "id" | "enabled" | "userId"> = { title, time: times.join(', '), type, frequency: finalFrequency };
      if (isMedication) {
        newReminder.dosage = dosage;
        newReminder.reason = reason;
        newReminder.appearance = appearance;
        newReminder.note = note;
      }
      onAddReminder(newReminder);
      
      resetForm();
      onOpenChange(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    toast({
      title: "Scanning Prescription...",
      description: "The AI is analyzing the image.",
    });

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageDataUri = e.target?.result as string;
        if (imageDataUri) {
            const result = await medicationOcr({ imageDataUri });
            setTitle(result.medicationName);
            setDosage(result.dosage);
            
            // Simple logic to map AI frequency to form frequency
            const freqLower = result.frequency.toLowerCase();
            if (freqLower.includes("daily") || freqLower.includes("once a day")) {
                setFrequency("Daily");
            } else if (freqLower.includes("twice") || freqLower.includes("2 times")) {
                setFrequency("Twice a day");
            } else if (freqLower.includes("three") || freqLower.includes("3 times")) {
                setFrequency("Three times a day");
            } else if (freqLower.includes("four") || freqLower.includes("4 times")) {
                setFrequency("Four times a day");
            }
            
             toast({
                title: "Scan Complete",
                description: "The form has been populated with the extracted details.",
             });
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
        console.error("OCR failed:", error);
        toast({
            title: "Scan Failed",
            description: "Could not extract details from the image. Please fill the form manually.",
            variant: "destructive"
        })
    } finally {
        setIsScanning(false);
        if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add a New Reminder</DialogTitle>
          <DialogDescription>
            Set up a new notification, or scan a prescription to get started.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
          
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()} disabled={isScanning}>
            {isScanning ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            ) : (
                <ScanLine className="mr-2 h-4 w-4"/>
            )}
            {isScanning ? "Scanning..." : "Scan Prescription with AI"}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or Enter Manually</span>
            </div>
          </div>
        
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
                <Label htmlFor="note">Notes</Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Any additional instructions or details (e.g., take with food, avoid sunlight)"
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
                <Select onValueChange={setFrequency} value={frequency}>
                    <SelectTrigger id="frequency-type">
                        <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Daily">Once a day</SelectItem>
                        <SelectItem value="Twice a day">Twice a day</SelectItem>
                        <SelectItem value="Three times a day">Three times a day</SelectItem>
                        <SelectItem value="Four times a day">Four times a day</SelectItem>
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
            
            {times.map((time, index) => (
                <div key={index} className="space-y-2">
                    <Label htmlFor={`time-${index}`}>Time {times.length > 1 ? index + 1 : ''}</Label>
                    <Input
                        id={`time-${index}`}
                        type="time"
                        value={time}
                        onChange={(e) => handleTimeChange(index, e.target.value)}
                    />
                </div>
            ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Add Reminder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
