"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Heart } from 'lucide-react';
import Link from 'next/link';

const THERAPY_DURATION = 60; // seconds

export function BlinkingOwlTherapy() {
  const [therapyPhase, setTherapyPhase] = useState<'intro' | 'therapy' | 'complete'>('intro');
  const [blinksCompleted, setBlinksCompleted] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(THERAPY_DURATION);
  const [isBlinking, setIsBlinking] = useState(false);
  const therapyIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (therapyPhase === 'therapy') {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            completeTherapy();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const startBlinkingPattern = () => {
        therapyIntervalRef.current = setInterval(() => {
          setIsBlinking(true);
          setBlinksCompleted(prev => prev + 1);
          setTimeout(() => setIsBlinking(false), 600); // Owl's eyes are "closed" for 600ms
        }, 3000); // Blink every 3 seconds
      };

      startBlinkingPattern();

      return () => {
        clearInterval(timer);
        if (therapyIntervalRef.current) {
          clearInterval(therapyIntervalRef.current);
        }
      };
    }
  }, [therapyPhase]);

  const completeTherapy = () => {
    setTherapyPhase('complete');
    // In a real app, you might save the stats here
  };

  const startTherapySession = () => {
    setTherapyPhase('therapy');
    setBlinksCompleted(0);
    setTimeRemaining(THERAPY_DURATION);
  };

  const resetTherapy = () => {
    setTherapyPhase('intro');
  };

  if (therapyPhase === 'complete') {
    return (
      <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 p-4 sm:p-8 rounded-2xl text-white max-w-2xl mx-auto">
        <Card className="bg-white/10 border-purple-400/30 text-center">
            <CardHeader>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CardTitle className="text-3xl">Well Done! 🦉</CardTitle>
                </motion.div>
                <CardDescription className="text-purple-300">Blinking Session Complete!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <p className="text-purple-200">
                    Fantastic! You completed {blinksCompleted} healthy blinks with Oliver the Owl! Your eyes are now feeling fresh and moisturized! 💧
                </p>
                <div className="bg-black/20 p-4 rounded-lg text-left">
                    <h4 className="font-semibold mb-2">🎯 What You Just Did:</h4>
                    <ul className="text-sm text-purple-300 space-y-1 list-disc list-inside">
                        <li>Spread natural tears across your eyes</li>
                        <li>Washed away dust and irritants</li>
                        <li>Relaxed your eye muscles</li>
                        <li>Protected your eyes from dryness</li>
                    </ul>
                </div>
                 <div className="flex justify-around bg-black/20 p-4 rounded-lg">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                            <Star className="w-6 h-6 text-yellow-400" />
                            <p className="text-2xl font-bold">3</p>
                        </div>
                        <p className="text-xs text-purple-300">Stars Earned</p>
                    </div>
                     <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                            <Heart className="w-6 h-6 text-pink-400" />
                            <p className="text-2xl font-bold">{blinksCompleted}</p>
                        </div>
                        <p className="text-xs text-purple-300">Healthy Blinks</p>
                    </div>
                </div>
                 <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Button onClick={resetTherapy} className="w-full bg-purple-600 hover:bg-purple-700">
                        🦉 Blink Again
                    </Button>
                    <Button variant="secondary" className="w-full" asChild>
                        <Link href="/gym"> <ArrowLeft className="mr-2 h-4 w-4" />Back to Gym</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>
    );
  }

  if (therapyPhase === 'intro') {
     return (
        <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 p-4 sm:p-8 rounded-2xl text-white max-w-2xl mx-auto">
            <Card className="bg-white/10 border-purple-400/30 text-center">
                <CardHeader>
                    <CardTitle className="text-3xl">Blinking Owl Therapy 🦉</CardTitle>
                    <CardDescription className="text-purple-300">with Oliver the Wise Owl</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-5xl">🦉</p>
                    <p className="text-purple-200">
                       When we look at screens, we forget to blink properly. Oliver will guide you through a session of healthy, mindful blinks to refresh your eyes.
                    </p>
                    <div className="bg-black/20 p-4 rounded-lg text-left">
                        <h4 className="font-semibold mb-2">🎯 How to Blink Like an Owl:</h4>
                        <ul className="text-sm text-purple-300 space-y-1 list-disc list-inside">
                            <li>Watch Oliver blink slowly and gently.</li>
                            <li>Copy his blinking pattern exactly.</li>
                            <li>Close your eyes completely, then open slowly.</li>
                            <li>Do this for 1 minute to refresh your eyes!</li>
                        </ul>
                    </div>
                    <Button onClick={startTherapySession} size="lg" className="w-full bg-purple-600 hover:bg-purple-700">
                        Start Blinking Session
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-4 rounded-2xl text-white max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="font-mono text-lg">⏱️ {timeRemaining}s left</div>
        <div className="font-mono text-lg">👁️ {blinksCompleted} blinks</div>
      </div>
      
      <div className="relative aspect-video flex flex-col items-center justify-center bg-black/20 rounded-lg overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-10 left-10 text-2xl opacity-50">🌲</div>
        <div className="absolute top-20 right-16 text-xl opacity-70">✨</div>
        <div className="absolute bottom-10 left-20 text-4xl opacity-50">🌙</div>
        <div className="absolute bottom-16 right-24 text-lg opacity-60">⭐</div>
        
        {/* Owl */}
        <div className="text-center z-10">
          <motion.div
            animate={{
              scaleY: isBlinking ? [1, 0.1, 1] : 1,
            }}
            transition={{ duration: 0.6, times: [0, 0.5, 1] }}
            className="text-8xl"
          >
            🦉
          </motion.div>
          <p className="font-bold mt-2">Oliver</p>
        </div>

      </div>
        <div className="mt-6 text-center bg-purple-900/50 p-4 rounded-lg">
            <p className="font-semibold text-purple-200">
                {isBlinking 
                    ? "💧 Close your eyes gently... and open."
                    : "👀 Watch me, and copy my blinks!"
                }
            </p>
        </div>
    </div>
  );
}
