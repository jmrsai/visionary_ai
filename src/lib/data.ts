
import { Activity, BookOpen, Brain, Dumbbell, Eye, Glasses, HeartPulse, Target, Video, View, Wind, Sparkles, CalendarCheck, ScanEye, Zap, ListTodo } from "lucide-react";
import type { Test, Reminder, ActivityLog, Exercise, Circuit, AdherenceLog } from "./types";

export const MOCK_REMINDERS: Reminder[] = [
  { id: 1, title: 'Blinking exercise', time: 'in 30 minutes', type: 'exercise', enabled: true },
  { id: 2, title: 'Latanoprost', time: '13:00', type: 'Eye Drops', enabled: true, dosage: "1 drop in each eye", frequency: "Daily" },
  { id: 3, title: '20-20-20 Rule', time: '14:00', type: 'exercise', enabled: false },
  { id: 4, title: 'Annual Eye Exam', time: 'Tomorrow', type: 'appointment', enabled: true },
];

export const MOCK_ACTIVITIES: ActivityLog[] = [
    { id: 1, description: "Completed: Focus Shift exercise.", timestamp: "2 hours ago", score: "+5 pts" },
    { id: 2, description: "New personalized workout available.", timestamp: "5 hours ago", score: "" },
    { id: 3, description: "Vision Score increased to 92.", timestamp: "1 day ago", score: "+2" },
    { id: 4, description: "Took Color Vision test.", timestamp: "2 days ago", score: "9/10" },
];

export const MOCK_ADHERENCE_HISTORY: AdherenceLog[] = [
    { id: '1', medication: 'Latanoprost', type: 'Eye Drops', status: 'taken', time: '09:00', date: 'Today' },
    { id: '2', medication: 'Vitamin C', type: 'Capsule', status: 'taken', time: '09:05', date: 'Today' },
    { id: '3', medication: 'Latanoprost', type: 'Eye Drops', status: 'upcoming', time: '21:00', date: 'Today' },
    { id: '4', medication: 'Latanoprost', type: 'Eye Drops', status: 'skipped', time: '21:00', date: 'Yesterday' },
    { id: '5', medication: 'Vitamin C', type: 'Capsule', status: 'taken', time: '09:02', date: 'Yesterday' },
    { id: '6', medication: 'Latanoprost', type: 'Eye Drops', status: 'taken', time: '08:58', date: 'Yesterday' },
    { id: '7', medication: 'Latanoprost', type: 'Eye Drops', status: 'taken_late', time: '10:30', date: '2 days ago' },
    { id: '8', medication: 'Vitamin C', type: 'Capsule', status: 'taken', time: '09:01', date: '2 days ago' },
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
        title: "Peripheral Vision Game",
        description: "Train your peripheral awareness with the 'Side Sight' game.",
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
        id: "redness-scan",
        title: "Redness & Irritation Scan",
        description: "AI-powered analysis of eye redness from a photo. (Experimental)",
        icon: ScanEye,
        category: "Advanced Screening"
    },
    {
        id: "reading-speed",
        title: "Reading Speed Test",
        description: "Assess your visual processing and reading efficiency.",
        icon: BookOpen,
        category: "Visual Processing"
    },
    {
        id: 'accommodation-flexibility',
        title: 'Accommodation Flexibility Test',
        description: 'Quantify how quickly your eyes can change focus.',
        icon: Zap,
        category: 'Visual Processing'
    }
];

export const MOCK_EXERCISES: Exercise[] = [
    {
        id: "focus-shift",
        title: "Focus Shift",
        description: "A guided exercise to improve your eyes' ability to change focus between near and far objects.",
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
        id: "saccades",
        title: "Saccades",
        description: "Improve the speed and accuracy of your rapid eye movements.",
        icon: Wind,
        category: "Focus & Flexibility",
        duration: "30 seconds"
    },
    {
        id: "shape-tracer",
        title: "Shape Tracer",
        description: "Train your eyes to smoothly follow a moving object.",
        icon: Wind,
        category: "Focus & Flexibility",
        duration: "30 seconds"
    },
    {
        id: "jungle-explorer",
        title: "Jungle Explorer",
        description: "A fun game for kids! Help the jungle explorer spot all the animals by quickly changing your focus.",
        icon: Sparkles,
        category: "Kids' Game Zone",
        duration: "30 seconds"
    },
    {
        id: "symptom-checker",
        title: "Symptom Checker",
        description: "Use our AI to identify potential eye conditions based on your symptoms.",
        icon: Sparkles,
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
];

export const MOCK_CIRCUITS: Circuit[] = [
    {
        id: "5-min-stress-buster",
        title: "5-Min Stress Buster",
        description: "A quick routine to relieve eye strain after prolonged screen time.",
        icon: "ListTodo",
        totalDuration: "5 minutes",
        exercises: [
            { id: "focus-shift", title: "Focus Shift", duration: 60 },
            { id: "saccades", title: "Saccades", duration: 60 },
            { id: "blinking-exercise", title: "Blinking Exercise", duration: 30 },
            { id: "focus-shift", title: "Focus Shift (Round 2)", duration: 60 },
            { id: "blinking-exercise", title: "Blinking Exercise (Final)", duration: 30 },
        ]
    }
];
