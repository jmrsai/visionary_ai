import { Activity, BookOpen, Brain, Dumbbell, Eye, Glasses, HeartPulse, Target, Video, View, Wind, Sparkles, CalendarCheck, ScanEye, Zap, ListTodo, Contrast, Layers, Palette, Rocket, Move, Orbit, Grid, CircleDot, EyeOff, Disc } from "lucide-react";
import type { Test, Exercise, Circuit, HrrPlate, D15Cap, CheckupReport, Reminder, Consultation, AdherenceLog } from "./types";
import { StereopsisIcon } from "@/components/icons";

import hrrPlatesData from './data/hrr-plates.json';
import d15CapsData from './data/d15-caps.json';
import testsData from './data/tests.json';
import exercisesData from './data/exercises.json';
import circuitsData from './data/circuits.json';
import checkupHistoryData from './data/checkup-history.json';
import visionScoreHistoryData from './data/vision-score-history.json';
import remindersData from './data/reminders.json';
import consultationsData from './data/consultations.json';


// This file contains mock data that might be replaced by a database in a full application.

export const MOCK_CHECKUP_HISTORY: CheckupReport[] = checkupHistoryData;

export const MOCK_VISION_SCORE_HISTORY: {date: string; score: number}[] = visionScoreHistoryData;

export const MOCK_HRR_PLATES: HrrPlate[] = hrrPlatesData;
export const MOCK_D15_CAPS: D15Cap[] = d15CapsData;
export const MOCK_CIRCUITS: Circuit[] = circuitsData;
export const MOCK_REMINDERS: Reminder[] = remindersData;
export const MOCK_CONSULTATIONS: Consultation[] = consultationsData;


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

export const MOCK_TESTS: Test[] = testsData.map(test => ({
    ...test,
    icon: iconMapping[test.icon as string] || Eye,
}));

export const MOCK_EXERCISES: Exercise[] = exercisesData.map(exercise => ({
    ...exercise,
    icon: iconMapping[exercise.icon as string] || Dumbbell,
}));
