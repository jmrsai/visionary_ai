
import { Activity, BookOpen, Brain, Dumbbell, Eye, Glasses, HeartPulse, Target, Video, View, Wind, Sparkles, CalendarCheck, ScanEye, Zap, ListTodo, Contrast, Layers, Palette, Rocket, Move, Orbit, Grid, CircleDot, EyeOff, Disc } from "lucide-react";
import type { Test, Exercise, Circuit, HrrPlate, D15Cap } from "./types";
import { StereopsisIcon } from "@/components/icons";

import hrrPlates from './data/hrr-plates.json';
import d15Caps from './data/d15-caps.json';
import tests from './data/tests.json';
import exercises from './data/exercises.json';
import circuits from './data/circuits.json';
import { MOCK_CHECKUP_HISTORY, MOCK_VISION_SCORE_HISTORY, MOCK_REMINDERS, MOCK_ADHERENCE_HISTORY, MOCK_CONSULTATIONS } from './mock-data';


export const MOCK_HRR_PLATES: HrrPlate[] = hrrPlates;
export const MOCK_D15_CAPS: D15Cap[] = d15Caps;
export const MOCK_CIRCUITS: Circuit[] = circuits;

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
    ListTodo,
    Rocket,
    Move,
    Orbit,
    Grid,
    CircleDot,
    EyeOff,
    Disc,
    Layers,
};

export const MOCK_TESTS: Test[] = tests.map(test => ({
    ...test,
    icon: iconMapping[test.icon as string] || Eye,
}));

export const MOCK_EXERCISES: Exercise[] = exercises.map(exercise => ({
    ...exercise,
    icon: iconMapping[exercise.icon as string] || Dumbbell,
}));
