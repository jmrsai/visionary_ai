"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Circuit } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PlayCircle, PauseCircle, RotateCcw } from 'lucide-react';

const getInstruction = (exerciseId: string, timeElapsed: number, duration: number): string => {
    switch (exerciseId) {
        case "focus-shift":
            if (timeElapsed < duration / 2) {
                return "For the first half, focus on a distant object (at least 20 feet away).";
            }
            return "For the second half, shift your focus to a near object (about 6 inches away).";
        case "20-20-20-rule":
            return "Look at something 20 feet away for 20 seconds.";
        case "blinking-exercise":
             if (timeElapsed < duration / 3) {
                return "Close your eyes gently for 2 seconds.";
            } else if (timeElapsed < (duration * 2) / 3) {
                return "Open your eyes and blink normally for 5 seconds.";
            }
            return "Now, close your eyes again for another 2 seconds.";
        case "saccades":
            const step = Math.floor(timeElapsed / 5) % 4; // Change target every 5 seconds
            switch(step) {
                case 0: return "Quickly look at the top-left corner of your screen.";
                case 1: return "Now, quickly look at the bottom-right corner.";
                case 2: return "Quickly look at the top-right corner.";
                case 3: return "Finally, quickly look at the bottom-left corner.";
                default: return "Follow the prompts.";
            }
        default:
            return "Follow the on-screen prompts to complete the exercise.";
    }
};


export function CircuitPlayer({ circuit }: { circuit: Circuit }) {
    const [circuitState, setCircuitState] = useState<'idle' | 'running' | 'paused' | 'finished'>('idle');
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [timeInExercise, setTimeInExercise] = useState(0); // in seconds
    
    const totalCircuitDuration = useMemo(() => circuit.exercises.reduce((sum, ex) => sum + ex.duration, 0), [circuit]);
    
    const currentExercise = circuit.exercises[currentExerciseIndex];
    const timeElapsedInCircuit = useMemo(() => {
        let elapsed = 0;
        for (let i = 0; i < currentExerciseIndex; i++) {
            elapsed += circuit.exercises[i].duration;
        }
        return elapsed + timeInExercise;
    }, [circuit, currentExerciseIndex, timeInExercise]);

    const overallProgress = (timeElapsedInCircuit / totalCircuitDuration) * 100;
    const exerciseProgress = (timeInExercise / currentExercise.duration) * 100;
    const instruction = getInstruction(currentExercise.id, timeInExercise, currentExercise.duration);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (circuitState === 'running') {
            timer = setInterval(() => {
                setTimeInExercise(prevTime => {
                    if (prevTime + 1 >= currentExercise.duration) {
                        // Move to next exercise
                        if (currentExerciseIndex < circuit.exercises.length - 1) {
                            setCurrentExerciseIndex(prevIndex => prevIndex + 1);
                            return 0;
                        } else {
                            // Finish circuit
                            setCircuitState('finished');
                            return prevTime + 1;
                        }
                    }
                    return prevTime + 1;
                });
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [circuitState, currentExerciseIndex, circuit.exercises, currentExercise.duration]);

    const handleStart = () => {
        setCircuitState('running');
    };

    const handlePause = () => {
        setCircuitState('paused');
    };

    const handleResume = () => {
        setCircuitState('running');
    };

    const handleReset = () => {
        setCircuitState('idle');
        setCurrentExerciseIndex(0);
        setTimeInExercise(0);
    };

    return (
        <div className="space-y-6">
            {circuitState !== 'finished' ? (
                <>
                    {/* Current Exercise Info */}
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Up Next: Step {currentExerciseIndex + 1}/{circuit.exercises.length}</p>
                        <h3 className="text-2xl font-bold">{currentExercise.title}</h3>
                    </div>

                    {/* Instructions */}
                    <div className="p-4 rounded-lg bg-muted text-center min-h-[60px] flex items-center justify-center">
                        <p className="text-lg font-semibold">{instruction}</p>
                    </div>

                    {/* Exercise Timer */}
                    <div>
                        <Progress value={exerciseProgress} />
                        <p className="text-sm text-muted-foreground text-center mt-2">
                            {timeInExercise}s / {currentExercise.duration}s
                        </p>
                    </div>

                    {/* Overall Progress */}
                    <div className="space-y-2">
                        <h4 className="font-semibold text-center">Overall Circuit Progress</h4>
                        <Progress value={overallProgress} />
                        <p className="text-sm text-muted-foreground text-center mt-2">
                            {Math.floor(timeElapsedInCircuit / 60)}m {timeElapsedInCircuit % 60}s / {Math.floor(totalCircuitDuration/60)}m {totalCircuitDuration % 60}s
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4 pt-4">
                        {circuitState === 'idle' && (
                            <Button size="lg" onClick={handleStart}>
                                <PlayCircle className="mr-2 h-5 w-5" /> Start Circuit
                            </Button>
                        )}
                        {circuitState === 'running' && (
                            <Button size="lg" variant="outline" onClick={handlePause}>
                                <PauseCircle className="mr-2 h-5 w-5" /> Pause
                            </Button>
                        )}
                        {circuitState === 'paused' && (
                             <Button size="lg" onClick={handleResume}>
                                <PlayCircle className="mr-2 h-5 w-5" /> Resume
                            </Button>
                        )}
                         {(circuitState === "paused" || circuitState === "finished") && (
                            <Button size="lg" variant="secondary" onClick={handleReset}>
                                <RotateCcw className="mr-2 h-5 w-5" /> Reset
                            </Button>
                        )}
                    </div>
                </>
            ) : (
                <div className="text-center space-y-4">
                    <Alert className="mt-4 text-center">
                        <AlertTitle>Circuit Complete!</AlertTitle>
                        <AlertDescription>You've successfully completed the {circuit.title}. Great job!</AlertDescription>
                    </Alert>
                    <Button size="lg" variant="secondary" onClick={handleReset}>
                        <RotateCcw className="mr-2 h-5 w-5" /> Replay Circuit
                    </Button>
                </div>
            )}
        </div>
    );
}
