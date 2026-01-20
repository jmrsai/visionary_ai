
import { Home, Dumbbell, User, ClipboardList, Pill, Wrench, Settings } from 'lucide-react';
import type { NavItem } from '@/lib/types';

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/gym', label: 'Gym', icon: Dumbbell },
  { href: '/tests', label: 'Tests', icon: ClipboardList },
  { href: '/medication', label: 'Medication', icon: Pill },
  { href: '/tools', label: 'Tools', icon: Wrench },
  { href: '/profile', label: 'Profile', icon: User },
];
