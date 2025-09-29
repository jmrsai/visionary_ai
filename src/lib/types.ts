
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
  icon: string; // Changed from LucideIcon
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

// --- App-specific Helper Types (Mock Data etc.) ---

export type Reminder = {
    id: number;
    title: string;
    time: string;
    type: 'exercise' | 'medication' | 'appointment';
    enabled: boolean;
};

export type ActivityLog = {
    id: number;
    description: string;
    timestamp: string;
    score?: string;
};
