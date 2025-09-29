import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export type Test = {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    category: string;
};

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

export type Exercise = {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    category: string;
    duration: string;
};
