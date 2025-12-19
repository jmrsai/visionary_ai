
import { Activity, BookOpen, Brain, Dumbbell, Eye, Glasses, HeartPulse, Target, Video, View, Wind, Sparkles, CalendarCheck, ScanEye, Zap, ListTodo, Contrast, Layers, Palette } from "lucide-react";
import type { Test, Reminder, ActivityLog, Exercise, Circuit, AdherenceLog, CheckupReport, HrrPlate, D15Cap } from "./types";
import { StereopsisIcon } from "@/components/icons";

import activities from './data/activities.json';
import adherenceHistory from './data/adherence-history.json';
import visionScoreHistory from './data/vision-score-history.json';
import hrrPlates from './data/hrr-plates.json';
import d15Caps from './data/d15-caps.json';
import tests from './data/tests.json';
import exercises from './data/exercises.json';
import circuits from './data/circuits.json';
import checkupHistory from './data/checkup-history.json';

export const MOCK_ACTIVITIES: ActivityLog[] = activities;
export const MOCK_ADHERENCE_HISTORY: AdherenceLog[] = adherenceHistory;
export const MOCK_VISION_SCORE_HISTORY: { date: string, score: number }[] = visionScoreHistory;
export const MOCK_HRR_PLATES: HrrPlate[] = hrrPlates;
export const MOCK_D15_CAPS: D15Cap[] = d15Caps;
export const MOCK_CHECKUP_HISTORY: CheckupReport[] = checkupHistory;

const iconMapping: { [key: string]: React.ElementType } = {
    Eye,
    Palette,
    Activity,
    Contrast,
    HeartPulse,
    View,
    Brain,
    ScanEye,
    StereopsisIcon,
    BookOpen,
    Zap,
    Sparkles,
    Target,
    Video,
    Wind,
    Dumbbell,
    ListTodo
};

export const MOCK_TESTS: Test[] = tests.map(test => ({
    ...test,
    icon: iconMapping[test.icon as string] || Eye,
}));

export const MOCK_EXERCISES: Exercise[] = exercises.map(exercise => ({
    ...exercise,
    icon: iconMapping[exercise.icon as string] || Dumbbell,
}));

export const MOCK_CIRCUITS: Circuit[] = circuits;
