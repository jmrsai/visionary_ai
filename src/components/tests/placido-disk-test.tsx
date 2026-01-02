
"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Camera, Upload, Eye } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const PlacidoDiskSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="white" />
    {[...Array(10)].map((_, i) => (
      <circle key={i} cx="50" cy="50" r={(i + 1) * 4} stroke="black" strokeWidth="2.5" fill="none" />
    ))}
    <circle cx="50" cy="50" r="3" fill="transparent" stroke="red" strokeWidth="1" />
  </svg>
);

export function PlacidoDiskTest() {
  const [step, setStep] = useState<'instructions' | 'capture' | 'compare'>('instructions');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const normalImage = PlaceHolderImages.find(img => img.id === 'placido-disk-normal');
  const distortedImage = PlaceHolderImages.find(img => img.id === 'placido-disk-keratoconus');

  const getCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      if (videoRef.current) videoRef.current.srcObject = stream;
      return true;
    } catch (err) {
      setHasCameraPermission(false);
      toast({ variant: 'destructive', title: 'Camera access denied.' });
      return false;
    }
  };

  const handleStartCapture = async () => {
    if (await getCameraPermission()) {
      setStep('capture');
    }
  };
  
  const stopCamera = () => {
     if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(dataUrl);
    stopCamera();
    setStep('compare');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
        setStep('compare');
      };
      reader.readAsDataURL(file);
    }
  };

  const restartTest = () => {
    setStep('instructions');
    setCapturedImage(null);
    stopCamera();
  };
  
  useEffect(() => stopCamera, []);


  if (step === 'instructions') {
    return (
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Corneal Topography Simulation</h3>
        <p className="text-muted-foreground max-w-md mx-auto">This test simulates a Placido's Disk to help screen for corneal irregularities like keratoconus. You will take a photo of your eye reflecting a pattern of circles.</p>
        <Alert>
          <AlertTitle>How to Get a Good Image</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside text-left">
              <li>Find a dimly lit room.</li>
              <li>Hold your device steady at arm's length.</li>
              <li>Open your eye wide and focus on the camera lens.</li>
              <li>Ensure the circle pattern is reflected clearly in your cornea (the clear front part of your eye).</li>
            </ul>
          </AlertDescription>
        </Alert>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleStartCapture} size="lg"><Camera className="mr-2 h-4 w-4"/>Use Camera</Button>
            <Button onClick={() => fileInputRef.current?.click()} size="lg" variant="outline"><Upload className="mr-2 h-4 w-4"/>Upload Photo</Button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
      </div>
    );
  }

  if (step === 'capture') {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-full aspect-square max-w-sm bg-black rounded-lg overflow-hidden">
          <video ref={videoRef} className="w-full h-full object-cover opacity-30" autoPlay playsInline />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <PlacidoDiskSVG />
          </div>
        </div>
        <p className="text-muted-foreground text-center">Position the reflection of the circles in the center of your eye, then capture.</p>
        <Button onClick={handleCapture} size="lg"><Camera className="mr-2 h-4 w-4"/>Capture Reflection</Button>
      </div>
    );
  }

  if (step === 'compare' && capturedImage && normalImage && distortedImage) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-center">Compare Your Reflection</h3>
        <p className="text-muted-foreground text-center">Look at the reflection of the circles in your photo. Do they appear uniform like the "Normal" example, or are they distorted?</p>
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader><CardTitle>Your Photo</CardTitle></CardHeader>
            <CardContent><Image src={capturedImage} alt="User's eye reflection" width={250} height={250} className="rounded-md w-full object-cover aspect-square" /></CardContent>
          </Card>
          <Card className="border-green-500">
            <CardHeader><CardTitle>Normal Reflection</CardTitle></CardHeader>
            <CardContent><Image src={normalImage.imageUrl} alt="Normal Placido reflection" width={250} height={250} className="rounded-md w-full object-cover aspect-square" data-ai-hint={normalImage.imageHint} /></CardContent>
          </Card>
          <Card className="border-orange-500">
            <CardHeader><CardTitle>Distorted Example</CardTitle></CardHeader>
            <CardContent><Image src={distortedImage.imageUrl} alt="Distorted Placido reflection for keratoconus" width={250} height={250} className="rounded-md w-full object-cover aspect-square" data-ai-hint={distortedImage.imageHint} /></CardContent>
          </Card>
        </div>
        <Alert variant="destructive">
            <AlertTitle>Disclaimer</AlertTitle>
            <AlertDescription>This is a screening simulation, not a medical diagnosis. If your reflection appears distorted or irregular, please consult an eye care professional for a comprehensive examination.</AlertDescription>
        </Alert>
        <div className="text-center">
            <Button onClick={restartTest}><RefreshCw className="mr-2 h-4 w-4"/>Test Again</Button>
        </div>
      </div>
    );
  }

  return null;
}
