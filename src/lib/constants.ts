
import { Home, Dumbbell, User, ClipboardList, Pill, GraduationCap, Video, Settings, UserCheck } from 'lucide-react';
import type { NavItem } from '@/lib/types';

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/for-you', label: 'For You', icon: UserCheck },
  { href: '/gym', label: 'Gym', icon: Dumbbell },
  { href: '/tests', label: 'Tests', icon: ClipboardList },
  { href: '/medication', label: 'Medication', icon: Pill },
  { href: '/profile', label: 'Profile', icon: User },
];
