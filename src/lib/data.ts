import { Activity, BookOpen, Brain, Dumbbell, Eye, Glasses, HeartPulse, Target, Video, View, Wind, Sparkles, CalendarCheck, ScanEye, Zap, ListTodo, Contrast, Layers, Palette, Rocket, Move, Orbit, Grid, CircleDot, EyeOff, Disc } from "lucide-react";
import type { Test, Exercise, Circuit, HrrPlate, D15Cap, CheckupReport, Reminder, Consultation, AdherenceLog } from "./types";
import { StereopsisIcon } from "@/components/icons";

import hrrPlates from './data/hrr-plates.json';
import d15Caps from './data/d15-caps.json';
import tests from './data/tests.json';
import exercises from './data/exercises.json';
import circuits from './data/circuits.json';


// This file contains mock data that might be replaced by a database in a full application.

export const MOCK_CHECKUP_HISTORY: CheckupReport[] = [
    {
        "id": "history-1",
        "date": "2024-05-20T12:00:00.000Z",
        "results": [
            { "testId": "visual-acuity", "value": "20/20", "status": "good" },
            { "testId": "macular-health", "value": "No Issues", "status": "good" },
            { "testId": "color-vision", "value": "Normal", "status": "good" },
            { "testId": "visual-field", "value": "10/10", "status": "good" },
            { "testId": "accommodation-flexibility", "value": "380ms", "status": "good" }
        ]
    },
    {
        "id": "history-2",
        "date": "2024-04-20T12:00:00.000Z",
        "results": [
            { "testId": "visual-acuity", "value": "20/25", "status": "warning" },
            { "testId": "macular-health", "value": "No Issues", "status": "good" },
            { "testId": "color-vision", "value": "Normal", "status": "good" },
            { "testId": "visual-field", "value": "9/10", "status": "warning" },
            { "testId": "accommodation-flexibility", "value": "510ms", "status": "warning" }
        ]
    }
];

export const MOCK_VISION_SCORE_HISTORY = [
  { "date": "Jan", "score": 80 },
  { "date": "Feb", "score": 82 },
  { "date": "Mar", "score": 85 },
  { "date": "Apr", "score": 84 },
  { "date": "May", "score": 88 },
  { "date": "Jun", "score": 90 },
  { "date": "Jul", "score": 92 }
];

export const MOCK_REMINDERS: Reminder[] = [
    { "id": "1", "title": "Latanoprost Drops", "time": "09:00", "type": "Eye Drops", "enabled": true },
    { "id": "2", "title": "Blinking Exercise", "time": "12:00", "type": "exercise", "enabled": true },
    { "id": "3", "title": "Vitamin C", "time": "09:05", "type": "Capsule", "enabled": true },
    { "id": "4", "title": "Follow-up Appointment", "time": "15:30", "type": "appointment", "enabled": false }
];

export const MOCK_CONSULTATIONS: Consultation[] = [
  {
    "id": "consult-1",
    "userId": "user-123",
    "doctorId": "doc-456",
    "patientName": "Alex Doe",
    "scheduledTime": "2024-08-15T14:00:00.000Z",
    "duration": 30,
    "type": "routine",
    "status": "scheduled",
    "meetingLink": "https://meet.google.com/xyz-abc-def",
    "notes": "Patient reports increased eye strain and dryness."
  },
  {
    "id": "consult-2",
    "userId": "user-123",
    "doctorId": "doc-456",
    "patientName": "Alex Doe",
    "scheduledTime": "2024-07-28T10:30:00.000Z",
    "duration": 15,
    "type": "follow_up",
    "status": "completed",
    "meetingLink": "https://meet.google.com/xyz-abc-def",
    "notes": "Reviewed progress on dry eye exercises. Patient reports improvement."
  }
];

export const MOCK_ADHERENCE_HISTORY: AdherenceLog[] = [
    { "id": "1", "medication": "Latanoprost", "type": "Eye Drops", "status": "taken", "time": "09:00", "date": "Today" },
    { "id": "2", "medication": "Vitamin C", "type": "Capsule", "status": "taken", "time": "09:05", "date": "Today" },
    { "id": "3", "medication": "Latanoprost", "type": "Eye Drops", "status": "upcoming", "time": "21:00", "date": "Today" },
    { "id": "4", "medication": "Latanoprost", "type": "Eye Drops", "status": "skipped", "time": "21:00", "date": "Yesterday" },
    { "id": "5", "medication": "Vitamin C", "type": "Capsule", "status": "taken", "time": "09:02", "date": "Yesterday" },
    { "id": "6", "medication": "Latanoprost", "type": "Eye Drops", "status": "taken", "time": "08:58", "date": "Yesterday" },
    { "id": "7", "medication": "Latanoprost", "type": "Eye Drops", "status": "taken_late", "time": "10:30", "date": "2 days ago" },
    { "id": "8", "medication": "Vitamin C", "type": "Capsule", "status": "taken", "time": "09:01", "date": "2 days ago" }
];


export const MOCK_HRR_PLATES: HrrPlate[] = hrrPlates;
export const MOCK_D15_CAPS: D15Cap[] = d15Caps;
export const MOCK_CIRCUITS: Circuit[] = circuits;

const iconMapping: { [key: string]: React.ElementType } = {
    Eye,
    Palette,
    Activity,
    Contrast,
    HeartPulse,
    View,
    Brain,
    ScanEye,
    StereopsisIcon,
    BookOpen,
    Zap,
    Sparkles,
    Target,
    Video,
    Wind,
    Dumbbell,
    ListTodo,
    Rocket,
    Move,
    Orbit,
    Grid,
    CircleDot,
    EyeOff,
    Disc,
    Layers,
};

export const MOCK_TESTS: Test[] = tests.map(test => ({
    ...test,
    icon: iconMapping[test.icon as string] || Eye,
}));

export const MOCK_EXERCISES: Exercise[] = exercises.map(exercise => ({
    ...exercise,
    icon: iconMapping[exercise.icon as string] || Dumbbell,
}));
