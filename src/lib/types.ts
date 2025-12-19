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

export interface Circuit {
  id: string;
  title: string;
  description: string;
  icon: string;
  totalDuration: string;
  exercises: {
    id: string;
    title: string;
    duration: number; // in seconds
  }[];
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

export type TestResult = {
    testId: string;
    value: string;
    status: 'good' | 'warning' | 'danger';
};

export type CheckupReport = {
    id: string;
    date: string; // ISO string
    results: TestResult[];
};

export type HrrPlate = {
    plateImageUri: string;
    correctSymbol: "circle" | "cross" | "triangle";
    options: ("circle" | "cross" | "triangle" | "none")[];
    deficiencyType: "Red-Green" | "Blue-Yellow";
};

export type D15Cap = {
    id: number;
    color: string;
}

export interface Consultation {
  id: string;
  userId: string;
  doctorId: string;
  patientName: string;
  scheduledTime: string; // ISO string
  duration: number;
  type: 'routine' | 'follow_up' | 'urgent' | 'second_opinion';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  meetingLink: string;
  notes?: string;
}


// --- App-specific Helper Types (Mock Data etc.) ---

export type Reminder = {
    id?: string; // Optional because it will be set by Firestore
    title: string;
    time: string;
    type: 'exercise' | 'Eye Drops' | 'Pill' | 'Capsule' | 'Liquid' | 'appointment';
    enabled: boolean;
    dosage?: string;
    frequency?: string;
    reason?: string;
    appearance?: {
        shape: string;
        color: string;
    },
    note?: string; // New property
};

export type AdherenceLog = {
    id: string;
    medication: string;
    type: 'Eye Drops' | 'Pill' | 'Capsule' | 'Liquid';
    status: 'taken' | 'skipped' | 'upcoming' | 'taken_late';
    time: string;
    date: string;
};

export type ActivityLog = {
    id: number;
    description: string;
    timestamp: string;
    score?: string;
};
