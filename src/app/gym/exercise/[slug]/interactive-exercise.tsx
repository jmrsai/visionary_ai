"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle, PauseCircle, RotateCcw, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { aiFormFeedback } from "@/ai/ai-form-feedback";

const EXERCISE_DURATION_S = 30; // 30 seconds
const FEEDBACK_INTERVAL_MS = 3000; // 3 seconds

type ExerciseState = "idle" | "running" | "paused" | "finished";

const getInstruction = (exerciseId: string, progress: number): string => {
    const totalDuration = EXERCISE_DURATION_S;
    const timeElapsed = totalDuration * (progress / 100);

    switch (exerciseId) {
        case "focus-shift":
            if (timeElapsed < totalDuration / 2) {
                return "For the first half, focus on a distant object (at least 20 feet away).";
            }
            return "For the second half, shift your focus to a near object (about 6 inches away).";
        case "20-20-20-rule":
            return "Look at something 20 feet away for 20 seconds.";
        case "blinking-exercise":
             if (timeElapsed < totalDuration / 3) {
                return "Close your eyes gently for 2 seconds.";
            } else if (timeElapsed < (totalDuration * 2) / 3) {
                return "Open your eyes and blink normally for 5 seconds.";
            }
            return "Now, close your eyes again for another 2 seconds.";
        case "saccades":
            const step = Math.floor(timeElapsed / 5) % 4; // Change target every 5 seconds, 4 positions
            switch(step) {
                case 0: return "Quickly look at the top-left corner of your screen.";
                case 1: return "Now, quickly look at the bottom-right corner.";
                case 2: return "Quickly look at the top-right corner.";
                case 3: return "Finally, quickly look at the bottom-left corner.";
                default: return "Follow the prompts.";
            }
        case "shape-tracer":
            return "Follow the moving shape with your eyes, keeping your head still.";
        default:
            return "Follow the on-screen prompts to complete the exercise.";
    }
};

export function InteractiveExercise({ id, title }: { id: string, title: string }) {
  const [exerciseState, setExerciseState] = useState<ExerciseState>("idle");
  const [progress, setProgress] = useState(0);
  const [feedback, setFeedback] = useState("AI feedback will appear here.");
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const feedbackTimerRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
            throw new Error("Camera not supported");
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description: "Please enable camera permissions in your browser settings to use this feature.",
        });
      }
    };

    getCameraPermission();
    
    return () => {
        // Cleanup: stop camera stream
        if(videoRef.current?.srcObject){
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    };
  }, [toast]);

  const captureFrame = useCallback(() => {
    if (!videoRef.current) return null;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg");
  }, []);

  const getAIFeedback = useCallback(async () => {
    const dataUri = captureFrame();
    if (!dataUri) return;
    
    setIsFeedbackLoading(true);
    try {
        const instruction = getInstruction(id, progress);
        const result = await aiFormFeedback({
            cameraFeedDataUri: dataUri,
            exerciseType: title,
            userInstructions: instruction
        });
        setFeedback(result.feedback);
    } catch (error) {
        console.error("Error getting AI feedback:", error);
        setFeedback("Could not get AI feedback. Please try again.");
    } finally {
        setIsFeedbackLoading(false);
    }
  }, [captureFrame, id, title, progress]);

  const startTimers = useCallback(() => {
    const duration = id === '20-20-20-rule' ? 20 : EXERCISE_DURATION_S;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / duration);
        if (newProgress >= 100) {
          clearInterval(timerRef.current);
          if (feedbackTimerRef.current) clearInterval(feedbackTimerRef.current);
          setExerciseState("finished");
          return 100;
        }
        return newProgress;
      });
    }, 1000);

    if (hasCameraPermission) {
        getAIFeedback(); // Get initial feedback
        feedbackTimerRef.current = setInterval(getAIFeedback, FEEDBACK_INTERVAL_MS);
    }
  }, [getAIFeedback, id, hasCameraPermission]);

  const handleStart = () => {
    setExerciseState("running");
    startTimers();
  };

  const handlePause = () => {
    setExerciseState("paused");
    clearInterval(timerRef.current);
    if(feedbackTimerRef.current) clearInterval(feedbackTimerRef.current);
  };

  const handleResume = () => {
    setExerciseState("running");
    startTimers();
  };

  const handleReset = () => {
    setExerciseState("idle");
    setProgress(0);
    setFeedback("AI feedback will appear here.");
    clearInterval(timerRef.current);
    if(feedbackTimerRef.current) clearInterval(feedbackTimerRef.current);
  };

  const instruction = getInstruction(id, progress);
  const duration = id === '20-20-20-rule' ? 20 : EXERCISE_DURATION_S;


  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
        <video ref={videoRef} className="h-full w-full object-cover" autoPlay muted playsInline />
        {hasCameraPermission === false && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Alert variant="destructive" className="max-w-md">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                        Please allow camera access to use the AI Coach feature. You may need to refresh the page and grant permissions. The exercise will run without video.
                    </AlertDescription>
                </Alert>
            </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="font-semibold">Instructions:</p>
        <p className="text-muted-foreground">{instruction}</p>
      </div>
        
       {hasCameraPermission && (
        <div className="space-y-2">
            <p className="font-semibold flex items-center gap-2">
                AI Coach 
                {isFeedbackLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </p>
            <p className="text-muted-foreground italic">"{feedback}"</p>
        </div>
       )}


      <Progress value={progress} />
      <p className="text-sm text-muted-foreground text-center">
        {Math.round(progress * duration / 100)}s / {duration}s
      </p>

      <div className="flex items-center justify-center gap-4 pt-4">
        {exerciseState === "idle" && (
          <Button size="lg" onClick={handleStart}>
            <PlayCircle className="mr-2 h-5 w-5" /> Start Exercise
          </Button>
        )}
        {exerciseState === "running" && (
          <Button size="lg" variant="outline" onClick={handlePause}>
            <PauseCircle className="mr-2 h-5 w-5" /> Pause
          </Button>
        )}
        {exerciseState === "paused" && (
          <Button size="lg" onClick={handleResume}>
            <PlayCircle className="mr-2 h-5 w-5" /> Resume
          </Button>
        )}
        {(exerciseState === "paused" || exerciseState === "finished") && (
          <Button size="lg" variant="secondary" onClick={handleReset}>
            <RotateCcw className="mr-2 h-5 w-5" /> Reset
          </Button>
        )}
      </div>

      {exerciseState === "finished" && (
        <Alert className="mt-4 text-center">
          <AlertTitle>Great job!</AlertTitle>
          <AlertDescription>You've completed the {title}.</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
