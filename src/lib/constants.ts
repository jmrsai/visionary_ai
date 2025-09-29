import { Home, TestTube2, Dumbbell, Bell, User, MessageCircle } from 'lucide-react';
import type { NavItem } from '@/lib/types';

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/tests', label: 'Tests', icon: TestTube2 },
  { href: '/gym', label: 'Gym', icon: Dumbbell },
  { href: '/reminders', label: 'Reminders', icon: Bell },
  { href: '/chatbot', label: 'Chatbot', icon: MessageCircle },
  { href: '/profile', label: 'Profile', icon: User },
];
