"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

export function LoadingScreen() {
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(Math.min(100, progress + Math.random() * 20));
    }, 500);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-6"
      >
        <Image
          src="https://raw.githubusercontent.com/jmrsai/visionary_ai/main/public/icons/iris.gif"
          alt="Visionary App Icon"
          width={150}
          height={150}
          className="mx-auto"
          priority
          unoptimized={true}
        />
        <div className="space-y-4">
            <h1 className="text-2xl font-bold tracking-widest text-gray-700 dark:text-gray-300">LOADING...</h1>
            <Progress value={progress} className="w-48 mx-auto h-2" />
        </div>
      </motion.div>
       <footer className="absolute bottom-4 text-xs text-gray-400 dark:text-gray-500">
        &copy; {new Date().getFullYear()} JMRSAI Techniques
      </footer>
    </div>
  );
}
