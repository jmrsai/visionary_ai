import type { LucideIcon } from 'lucide-react';
import { Timestamp } from "firebase/firestore";

// --- Base Types ---

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

// --- Firestore Data Models ---

export interface User {
  id: string; // Document ID from Firebase Auth
  email: string;
  displayName: string;
  createdAt: Timestamp;
  preferences?: {
    darkMode?: boolean;
    notifications?: boolean;
  };
}

export interface Therapy {
  id: string; // Auto-generated
  name: string;
  description: string;
  instructions: string; // Can be markdown
  conditions: string[];
  durationInMinutes: number;
}

export interface Exercise {
    id: string;
    title: string;
    description:string;
    instructions?: string;
    benefits?: string[];
    videoUrl?: string;
    icon: LucideIcon;
    category: string;
    duration: string;
}

export interface Test {
    id: string;
    title: string;
    purpose?: string;
    description: string;
    howItWorks?: string;
    image?: string;
    icon: LucideIcon;
    category: string;
}

// --- User Progress Sub-collections ---

export interface CompletedExercise {
  id: string; // Auto-generated
  exerciseId: string; // Ref to exercises collection
  completedAt: Timestamp;
  duration: number; // in seconds or minutes
}

export interface CompletedTherapy {
  id: string; // Auto-generated
  therapyId: string; // Ref to therapies collection
  completedAt: Timestamp;
}

export interface TestResult {
  id: string; // Auto-generated
  testId: string; // Ref to tests collection
  result: { [key: string]: any }; // Flexible result object
  takenAt: Timestamp;
}

// --- App-specific Helper Types (Mock Data etc.) ---

export type Reminder = {
    id: number;
    title: string;
    time: string;
    type: 'exercise' | 'medication' | 'appointment';
};

export type ActivityLog = {
    id: number;
    description: string;
    timestamp: string;
    score?: string;
};