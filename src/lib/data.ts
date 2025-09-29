import { Activity, BookOpen, Brain, Dumbbell, Eye, Glasses, HeartPulse, Target, Video, View } from "lucide-react";
import type { Test, Reminder, ActivityLog, Exercise } from "./types";

export const MOCK_REMINDERS: Reminder[] = [
  { id: 1, title: 'Blinking exercise', time: 'in 30 minutes', type: 'exercise' },
  { id: 2, title: 'Take eye drops', time: '1:00 PM', type: 'medication' },
  { id: 3, title: '20-20-20 Rule', time: '2:00 PM', type: 'exercise' },
  { id: 4, title: 'Annual Eye Exam', time: 'Tomorrow', type: 'appointment' },
];

export const MOCK_ACTIVITIES: ActivityLog[] = [
    { id: 1, description: "Completed: Focus Shift exercise.", timestamp: "2 hours ago" },
    { id: 2, description: "New personalized workout available.", timestamp: "5 hours ago" },
    { id: 3, description: "Vision Score increased by 2 points.", timestamp: "1 day ago" },
    { id: 4, description: "Took Color Vision test.", timestamp: "2 days ago" },
];

export const MOCK_VISION_SCORE_HISTORY = [
  { date: 'Jan', score: 80 },
  { date: 'Feb', score: 82 },
  { date: 'Mar', score: 85 },
  { date: 'Apr', score: 84 },
  { date: 'May', score: 88 },
  { date: 'Jun', score: 90 },
  { date: 'Jul', score: 92 },
];


export const MOCK_TESTS: Test[] = [
    {
        id: "visual-acuity",
        title: "Visual Acuity Test",
        description: "Test the clarity of your vision using a digital Snellen chart.",
        icon: Eye,
        category: "Core Diagnostics"
    },
    {
        id: "color-vision",
        title: "Color Vision Test",
        description: "Screen for color blindness with Ishihara-style plates.",
        icon: Glasses,
        category: "Core Diagnostics"
    },
    {
        id: "astigmatism",
        title: "Astigmatism Test",
        description: "Check for astigmatism using a clock dial test.",
        icon: Activity,
        category: "Core Diagnostics"
    },
    {
        id: "macular-health",
        title: "Macular Health (Amsler)",
        description: "Monitor for macular degeneration with an Amsler grid.",
        icon: HeartPulse,
        category: "Advanced Screening"
    },
    {
        id: "visual-field",
        title: "Visual Field Test",
        description: "A basic screening tool to test your peripheral vision.",
        icon: View,
        category: "Advanced Screening"
    },
    {
        id: "pupil-response",
        title: "Pupil Response Test",
        description: "Neurological screening via camera-based pupil measurement. (Experimental)",
        icon: Brain,
        category: "Advanced Screening"
    },
    {
        id: "reading-speed",
        title: "Reading Speed Test",
        description: "Assess your visual processing and reading efficiency.",
        icon: BookOpen,
        category: "Visual Processing"
    }
];

export const MOCK_EXERCISES: Exercise[] = [
    {
        id: "focus-shift",
        title: "Focus Shift",
        description: "Improve your eyes' ability to change focus between near and far objects.",
        icon: Target,
        category: "Focus & Flexibility",
        duration: "30 seconds"
    },
    {
        id: "20-20-20-rule",
        title: "20-20-20 Rule",
        description: "A simple rule to reduce digital eye strain during long screen sessions.",
        icon: Eye,
        category: "Strain Reduction",
        duration: "20 seconds"
    },
    {
        id: "blinking-exercise",
        title: "Blinking Exercise",
        description: "Helps rehydrate your eyes and prevent dryness.",
        icon: Video,
        category: "Strain Reduction",
        duration: "30 seconds"
    },
    {
        id: "symptom-checker",
        title: "Symptom Checker",
        description: "Use our AI to identify potential eye conditions based on your symptoms.",
        icon: Brain,
        category: "AI Tools",
        duration: "Varies"
    },
    {
        id: "personalized-workouts",
        title: "Personalized Workouts",
        description: "Generate a custom eye workout routine with our AI coach.",
        icon: Dumbbell,
        category: "AI Tools",
        duration: "Varies"
    }
]
