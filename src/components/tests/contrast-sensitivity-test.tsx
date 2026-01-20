
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
  ChevronRight,
  Trophy,
  Info,
  Activity,
  Keyboard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ContrastStep {
  letter: string;
  contrast: number; // 0 to 1
}

export function ContrastSensitivityTest() {
  const [gameState, setGameState] = useState<'intro' | 'testing' | 'complete'>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);

  const steps: ContrastStep[] = [
    { letter: "C", contrast: 1.0 },
    { letter: "D", contrast: 0.8 },
    { letter: "H", contrast: 0.6 },
    { letter: "K", contrast: 0.4 },
    { letter: "O", contrast: 0.2 },
    { letter: "R", contrast: 0.1 },
    { letter: "S", contrast: 0.05 },
    { letter: "V", contrast: 0.02 },
  ];

  const startTest = () => {
    setGameState('testing');
    setCurrentStep(0);
    setScore(0);
    setUserInput("");
  };

  const handleNext = () => {
    const isCorrect = userInput.toUpperCase() === steps[currentStep].letter;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setUserInput("");
    } else {
      setGameState('complete');
    }
  };

  return (
    <Card className="glass-card border-primary/20 overflow-hidden shadow-2xl max-w-xl mx-auto">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-violet-500/10 rounded-2xl">
            <Activity className="w-8 h-8 text-violet-500" />
          </div>
        </div>
        <CardTitle className="text-2xl font-black">Contrast Sensitivity</CardTitle>
        <CardDescription>Pelli-Robson Digital Evaluation</CardDescription>
      </CardHeader>

      <CardContent className="p-8">
        <AnimatePresence mode="wait">
          {gameState === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <p className="text-muted-foreground leading-relaxed">
                Identify the fading letters. This test measures how well you can distinguish objects from their background.
                Essential for night driving and reading in low light.
              </p>
              <div className="bg-muted/50 p-4 rounded-2xl border border-border/50 text-xs text-left">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <Info className="w-3 h-3 text-primary" /> Setup Instructions
                </h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Sit exactly 1 meter from the screen.</li>
                  <li>Ensure no glare on your display.</li>
                  <li>Keep screen brightness at standard levels.</li>
                </ul>
              </div>
              <Button onClick={startTest} className="w-full rounded-2xl py-6 text-lg font-bold bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-500/20">
                Start Evaluation
              </Button>
            </motion.div>
          )}

          {gameState === 'testing' && (
            <motion.div
              key="testing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span>Sensitivity Level</span>
                  <span>Step {currentStep + 1}/8</span>
                </div>
                <div className="h-1 bg-muted rounded-full">
                  <motion.div
                    className="h-full bg-violet-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${'${((currentStep + 1) / 8) * 100}'}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center p-12 bg-white rounded-3xl min-h-[250px] shadow-inner">
                <motion.span
                  key={currentStep}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: steps[currentStep].contrast, scale: 1 }}
                  className="text-9xl font-black text-black select-none pointer-events-none"
                >
                  {steps[currentStep].letter}
                </motion.span>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-center block uppercase tracking-widest text-muted-foreground">Type the letter you see</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    maxLength={1}
                    value={userInput}
                    onChange={(e) => {
                      setUserInput(e.target.value);
                      // Auto-submit if single char
                      if (e.target.value.length === 1) {
                        setTimeout(() => handleNext(), 300);
                      }
                    }}
                    className="w-full text-center text-3xl font-black h-16 rounded-2xl bg-muted/50 border-none focus-visible:outline-none focus:ring-2 focus:ring-violet-500 transition-all uppercase"
                    autoFocus
                  />
                  <Button onClick={handleNext} className="h-16 w-16 rounded-2xl bg-violet-500 hover:bg-violet-600">
                    <ChevronRight className="w-8 h-8" />
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground opacity-50">
                  <Keyboard className="w-3 h-3" /> Auto-submits after entry
                </div>
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
              <h3 className="text-2xl font-black">Analysis Complete</h3>

              <div className="p-8 rounded-[40px] bg-violet-500/5 border border-violet-500/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Activity className="w-24 h-24" />
                </div>
                <div className="text-xs font-bold text-violet-500 uppercase tracking-widest mb-1">Sensitivity Score</div>
                <div className="text-6xl font-black tracking-tighter">
                  {Math.floor((score / 8) * 100)}%
                </div>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Badge className="bg-violet-500">
                    {score > 6 ? "EXCELLENT" : score > 4 ? "GOOD" : "NEEDS CARE"}
                  </Badge>
                </div>
              </div>

              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Your sensitivity to low contrast is {score > 6 ? 'optimal for night vision' : 'below standard range'}.
              </p>

              <div className="space-y-2 pt-4">
                <Button className="w-full rounded-2xl bg-violet-600 hover:bg-violet-700" asChild>
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

      <CardFooter className="bg-muted/10 border-t border-border/50 p-6">
        <div className="flex gap-4 items-start">
          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Contrast sensitivity often decreases before visual acuity during eye conditions like cataracts or glaucoma.
            Regular digital screening helps track subtle changes.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
