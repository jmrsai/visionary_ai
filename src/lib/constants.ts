import { Home, Dumbbell, User } from 'lucide-react';
import type { NavItem } from '@/lib/types';

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/gym', label: 'Gym', icon: Dumbbell },
  { href: '/profile', label: 'Profile', icon: User },
];
