import { Home, TestTube2, Dumbbell, Bell, User, CalendarCheck } from 'lucide-react';
import type { NavItem } from '@/lib/types';

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/primary-check-up', label: 'Check-up', icon: CalendarCheck },
  { href: '/tests', label: 'Tests', icon: TestTube2 },
  { href: '/gym', label: 'Gym', icon: Dumbbell },
  { href: '/reminders', label: 'Reminders', icon: Bell },
  { href: '/profile', label: 'Profile', icon: User },
];
