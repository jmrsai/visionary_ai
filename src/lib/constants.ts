import { Home, Dumbbell, User, ClipboardList, Bell, BrainCircuit } from 'lucide-react';
import type { NavItem } from '@/lib/types';

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/gym', label: 'Gym', icon: Dumbbell },
  { href: '/tests', label: 'Tests', icon: ClipboardList },
  { href: '/reminders', label: 'Reminders', icon: Bell },
  { href: '/holistic-insights', label: 'Holistic Insights', icon: BrainCircuit },
  { href: '/profile', label: 'Profile', icon: User },
];
