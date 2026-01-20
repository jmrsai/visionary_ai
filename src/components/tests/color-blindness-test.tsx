
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Eye,
    CheckCircle2,
    AlertCircle,
    RefreshCcw,
    ChevronRight,
    Trophy,
    Info,
    History
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface IshiharaPlate {
    id: number;
    number: string;
    description: string;
    colors: {
        primary: string; // The color of the number
        secondary: string; // The color of the background dots
    };
}

export function ColorBlindnessTest() {
    const [gameState, setGameState] = useState<'intro' | 'testing' | 'complete'>('intro');
    const [currentPlateIndex, setCurrentPlateIndex] = useState(0);
    const [userInput, setUserInput] = useState("");
    const [results, setResults] = useState<{ plateId: number; isCorrect: boolean }[]>([]);

    // Mock plates using curated color pairs for specific deficiencies
    const plates: IshiharaPlate[] = [
        { id: 1, number: "12", description: "Demonstration plate (Visible to all)", colors: { primary: "#E91E63", secondary: "#4CAF50" } },
        { id: 2, number: "8", description: "Red-Green deficiency check", colors: { primary: "#f44336", secondary: "#4caf50" } },
        { id: 3, number: "5", description: "Protanopia check", colors: { primary: "#ff9800", secondary: "#8bc34a" } },
        { id: 4, number: "29", description: "Deuteranopia check", colors: { primary: "#ef5350", secondary: "#66bb6a" } },
    ];

    const startTest = () => {
        setGameState('testing');
        setCurrentPlateIndex(0);
        setResults([]);
        setUserInput("");
    };

    const handleNext = () => {
        const isCorrect = userInput.trim() === plates[currentPlateIndex].number;
        setResults([...results, { plateId: plates[currentPlateIndex].id, isCorrect }]);

        if (currentPlateIndex < plates.length - 1) {
            setCurrentPlateIndex(prev => prev + 1);
            setUserInput("");
        } else {
            setGameState('complete');
        }
    };

    const renderPlate = (plate: IshiharaPlate) => {
        // Generate a grid of points with slight random jitter
        const dots = [];
        const size = 300;
        const spacing = 12;

        for (let x = spacing; x < size; x += spacing) {
            for (let y = spacing; y < size; y += spacing) {
                const distFromCenter = Math.sqrt(Math.pow(x - size / 2, 2) + Math.pow(y - size / 2, 2));
                if (distFromCenter > (size / 2 - 10)) continue;

                // Simple logic to "draw" the number in the center
                // In a real app, this would be a pre-rendered high-quality Ishihara image
                const isNumber = distFromCenter < 80 && Math.random() > 0.4;

                dots.push({
                    x, y,
                    r: Math.random() * 4 + 2,
                    color: isNumber ? plate.colors.primary : plate.colors.secondary,
                    opacity: Math.random() * 0.5 + 0.5
                });
            }
        }

        return (
            <div className="relative w-[300px] h-[300px] mx-auto rounded-full overflow-hidden bg-slate-100 shadow-inner">
                <svg viewBox="0 0 300 300" className="w-full h-full">
                    {dots.map((dot, i) => (
                        <circle
                            key={i}
                            cx={dot.x}
                            cy={dot.y}
                            r={dot.r}
                            fill={dot.color}
                            fillOpacity={dot.opacity}
                        />
                    ))}
                    {/* Visual hint for the number if we had a proper path rendering logic */}
                    <text
                        x="50%"
                        y="50%"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fontSize="120"
                        fontWeight="900"
                        fill={plate.colors.primary}
                        fillOpacity="0.05" // Very faint hint for debug/sim
                    >
                        {plate.number}
                    </text>
                </svg>
            </div>
        );
    };

    const correctCount = results.filter(r => r.isCorrect).length;

    return (
        <Card className="glass-card border-primary/20 overflow-hidden shadow-2xl max-w-xl mx-auto">
            <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <Eye className="w-8 h-8 text-primary" />
                    </div>
                </div>
                <CardTitle className="text-2xl font-black">Color Vision Screening</CardTitle>
                <CardDescription>Digital Ishihara Plate Test</CardDescription>
            </CardHeader>

            <CardContent className="p-8">
                <AnimatePresence mode="wait">
                    {gameState === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="text-center space-y-6"
                        >
                            <p className="text-muted-foreground leading-relaxed">
                                This test screens for red-green and blue-yellow color vision deficiencies.
                                Find a comfortable distance from your screen and ensure your brightness is at 100%.
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                <Badge variant="secondary">4 Plates</Badge>
                                <Badge variant="secondary">2 Minutes</Badge>
                                <Badge variant="secondary">No Glasses Needed</Badge>
                            </div>
                            <Button onClick={startTest} className="w-full rounded-2xl py-6 text-lg font-bold shadow-lg shadow-primary/20">
                                Start Screening
                            </Button>
                        </motion.div>
                    )}

                    {gameState === 'testing' && (
                        <motion.div
                            key="testing"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    <span>Plate {currentPlateIndex + 1} of {plates.length}</span>
                                    <span>{Math.floor(((currentPlateIndex + 1) / plates.length) * 100)}% Complete</span>
                                </div>
                                <div className="h-1 bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-primary"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${'${((currentPlateIndex + 1) / plates.length) * 100}'}%` }}
                                    />
                                </div>
                            </div>

                            {renderPlate(plates[currentPlateIndex])}

                            <div className="space-y-4">
                                <label className="text-sm font-bold text-center block">What number do you see?</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Enter number..."
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        className="text-center text-2xl h-14 rounded-2xl bg-muted/50 border-none focus-visible:ring-primary"
                                    />
                                    <Button onClick={handleNext} disabled={!userInput} className="h-14 w-14 rounded-2xl p-0">
                                        <ChevronRight className="w-6 h-6" />
                                    </Button>
                                </div>
                                <Button variant="link" className="w-full text-xs text-muted-foreground" onClick={() => { setUserInput("0"); handleNext(); }}>
                                    I don't see any number
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {gameState === 'complete' && (
                        <motion.div
                            key="complete"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6"
                        >
                            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-black">Screening Complete</h3>

                            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                                <div className="text-sm font-bold text-primary uppercase tracking-widest mb-1">Your Result</div>
                                <div className="text-4xl font-black">{correctCount}/{plates.length}</div>
                                <p className="mt-2 text-sm font-medium">
                                    {correctCount === plates.length
                                        ? "Normal Color Vision Detected"
                                        : "Potential Deficiency Detected"}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Button className="w-full rounded-2xl" asChild>
                                    <Link href="/dashboard">Return to Dashboard</Link>
                                </Button>
                                <Button variant="outline" className="w-full rounded-2xl" onClick={startTest}>
                                    <RefreshCcw className="w-4 h-4 mr-2" /> Retake Test
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>

            <CardFooter className="bg-muted/30 border-t border-border/50 p-6">
                <div className="flex gap-4 items-start">
                    <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                        This digital screening is for informational purposes only. Color representation on digital screens can vary.
                        Consult an eye care professional for a clinical color vision assessment.
                    </p>
                </div>
            </CardFooter>
        </Card>
    );
}
