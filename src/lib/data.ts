
import { Activity, BookOpen, Brain, Dumbbell, Eye, Glasses, HeartPulse, Target, Video, View, Wind, Sparkles, CalendarCheck, ScanEye, Zap, ListTodo, Contrast, Layers, Palette, Rocket, Move, Orbit, Grid, CircleDot, EyeOff, Disc, Puzzle, Gamepad2, Bird } from "lucide-react";
import { StereopsisIcon } from "@/components/icons";
import type { Test, Exercise, Circuit, HrrPlate, D15Cap, GameCharacter } from "./types";

import hrrPlatesData from './data/hrr-plates.json';
import d15CapsData from './data/d15-caps.json';
import testsData from './data/tests.json';
import exercisesData from './data/exercises.json';
import circuitsData from './data/circuits.json';
import gameCharactersData from './data/game-characters.json';
import visionScoreHistoryData from './data/vision-score-history.json';


// This file contains mock data that might be replaced by a database in a full application.

export const MOCK_HRR_PLATES: HrrPlate[] = hrrPlatesData;
export const MOCK_D15_CAPS: D15Cap[] = d15CapsData;
export const MOCK_CIRCUITS: Circuit[] = circuitsData;
export const MOCK_GAME_CHARACTERS: GameCharacter[] = gameCharactersData;
export const MOCK_VISION_SCORE_HISTORY: { date: string; score: number }[] = visionScoreHistoryData;


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
    Puzzle,
    Gamepad2,
    Bird,
};

export const MOCK_TESTS: Test[] = testsData.map(test => ({
    ...test,
    icon: iconMapping[test.icon as string] || Eye,
}));

export const MOCK_EXERCISES: Exercise[] = exercisesData.map(exercise => ({
    ...exercise,
    icon: iconMapping[exercise.icon as string] || Dumbbell,
}));
