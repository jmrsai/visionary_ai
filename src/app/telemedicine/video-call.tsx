
"use client";

import { Video, Phone, MessageSquare, Monitor, ScanEye, Bot, FileText, X } from 'lucide-react';
import type { Consultation } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ocularHealthScan, OcularHealthScanOutput } from '@/ai/flows/ocular-health-scan';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, ListChecks } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface VideoCallProps {
    consultation: Consultation;
    onEndCall: () => void;
    isDoctor: boolean;
}

const confidenceColors: Record<string, string> = {
    "Low": "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300",
    "Medium": "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    "High": "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
};


const AiAssistant = ({ consultation }: { consultation: Consultation }) => {
    const { toast } = useToast();
    const [scanResult, setScanResult] = useState<OcularHealthScanOutput | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    const handleScan = async () => {
        setIsScanning(true);
        setScanResult(null);
        toast({
          title: "AI Scan Initiated",
          description: "Analyzing the patient's video feed for ocular health signs.",
        });

        try {
          // In a real implementation, you'd capture a frame from the video feed.
          // For this demo, we'll use a placeholder data URI.
          const mockEyeImageUri = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAYEBAUEBAYFBQUGBgYHCQ4JCQgICRINDQoOFRIWFhUSFBQXGIocHBcXMSIuHh4uKEKERENRSTFNUFFWWVlbWv/2wBDAQYFBQUJCAkFCTAwLDRWWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWv/wAARCAA5ADgDAREAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAECA//EABwQAQEAAwEAAwAAAAAAAAAAAAERIQISQVFhcf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDsoiIAIkAkkAkkFkAEkgEkgggAkgEggsiCCCRBBIIJJBZFdAAAAAAAAAAAAAAAAAAB//9k=";

          const result = await ocularHealthScan({ eyeImageUri: mockEyeImageUri });
          setScanResult(result);

        } catch (error) {
            console.error("Ocular scan failed:", error);
            toast({
                title: "Scan Failed",
                description: "The AI was unable to complete the ocular health scan.",
                variant: "destructive",
            });
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <Card className="bg-gray-800 border-gray-700 h-full flex flex-col">
            <CardHeader className="flex-row items-center gap-2">
                <Bot className="h-5 w-5 text-primary"/>
                <CardTitle className="text-white text-base">AI Assistant</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-4 overflow-y-auto">
                 <div className="space-y-2">
                    <Button onClick={handleScan} disabled={isScanning} className="w-full">
                        {isScanning ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        ) : (
                            <ScanEye className="mr-2 h-4 w-4"/>
                        )}
                        Ocular Health Scan
                    </Button>
                </div>
                {isScanning && (
                     <div className="text-center p-4 text-gray-300">
                        <p>Scanning patient's eye...</p>
                    </div>
                )}
                {scanResult && (
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-300 flex items-center gap-2 mb-2">
                                Detected Conditions
                            </h4>
                            <div className="space-y-2">
                            {scanResult.detectedConditions.map(item => (
                                <div key={item.condition} className="p-3 rounded-lg border bg-gray-900/50 border-gray-700">
                                    <div className="flex justify-between items-center">
                                        <h5 className="font-medium text-gray-200">{item.condition}</h5>
                                        <Badge className={cn("text-xs", confidenceColors[item.confidence])}>{item.confidence} Confidence</Badge>
                                    </div>
                                    <p className="text-xs text-gray-400">{item.explanation}</p>
                                </div>
                            ))}
                            {scanResult.detectedConditions.length === 0 && <p className="text-sm text-gray-400">No specific conditions detected.</p>}
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold text-gray-300 flex items-center gap-2 mb-2"><ListChecks className="h-4 w-4"/> Recommendations</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
                                {scanResult.recommendations.map((action, i) => <li key={i}>{action}</li>)}
                            </ul>
                        </div>
                        <Alert variant="destructive" className="bg-red-900/30 border-red-700 text-red-300">
                           <p className="text-xs">{scanResult.disclaimer}</p>
                        </Alert>
                    </div>
                )}
                
                 <div className="space-y-2">
                    <Button variant="secondary" className="w-full"><FileText className="mr-2 h-4 w-4"/> Generate Summary</Button>
                </div>
            </CardContent>
        </Card>
    )
}


export function VideoCall({ consultation, onEndCall, isDoctor }: VideoCallProps) {
    const doctorName = "Dr. Chen";
    const patientName = consultation.patientName;
    const selfName = isDoctor ? doctorName : patientName;
    const otherName = isDoctor ? patientName : doctorName;
    
    const [showAi, setShowAi] = useState(isDoctor);

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 text-white">
            <div className="h-full flex flex-col md:flex-row">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col">
                     {/* Header */}
                    <div className="bg-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-700">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                                <span className="text-white font-medium">
                                    {otherName.charAt(0)}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-white font-medium">{otherName}</h3>
                                <p className="text-gray-300 text-sm">Patient ID: {consultation.userId}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-green-400 text-sm">● Connected</span>
                            <span className="text-gray-300 text-sm">15:23</span>
                        </div>
                    </div>
                     {/* Video Area */}
                     <div className="flex-1 relative bg-gray-900">
                        {/* Main video */}
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-32 h-32 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-white text-4xl font-medium">
                                        {otherName.charAt(0)}
                                    </span>
                                </div>
                                <h3 className="text-white text-xl font-medium">{otherName}</h3>
                                <p className="text-gray-400">Audio only - Camera disabled</p>
                            </div>
                        </div>

                        {/* Self video */}
                        <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg border-2 border-gray-600 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-2">
                                    <span className="text-white text-lg font-medium">
                                        {selfName.charAt(0)}
                                        {selfName.split(' ')[1]?.charAt(0) || ''}
                                    </span>
                                </div>
                                <p className="text-white text-sm">{selfName}</p>
                            </div>
                        </div>
                     </div>
                      {/* Controls */}
                    <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
                        <div className="flex items-center justify-center space-x-4">
                            <TooltipProvider>
                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Video className="h-5 w-5"/></Button></TooltipTrigger><TooltipContent><p>Toggle Video</p></TooltipContent></Tooltip>
                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Phone className="h-5 w-5"/></Button></TooltipTrigger><TooltipContent><p>Toggle Mic</p></TooltipContent></Tooltip>
                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><MessageSquare className="h-5 w-5"/></Button></TooltipTrigger><TooltipContent><p>Chat</p></TooltipContent></Tooltip>
                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Monitor className="h-5 w-5"/></Button></TooltipTrigger><TooltipContent><p>Share Screen</p></TooltipContent></Tooltip>
                             {isDoctor && (
                                <Tooltip><TooltipTrigger asChild><Button variant={showAi ? "secondary": "ghost"} size="icon" onClick={() => setShowAi(!showAi)}><Bot className="h-5 w-5"/></Button></TooltipTrigger><TooltipContent><p>Toggle AI Assistant</p></TooltipContent></Tooltip>
                            )}
                             <Tooltip><TooltipTrigger asChild><Button variant="destructive" size="icon" onClick={onEndCall}><Phone className="h-5 w-5 transform rotate-135" /></Button></TooltipTrigger><TooltipContent><p>End Call</p></TooltipContent></Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>
                {/* AI Assistant Sidebar */}
                {showAi && (
                    <div className="w-full md:w-80 lg:w-96 bg-gray-800 border-l border-gray-700 flex flex-col">
                        <AiAssistant consultation={consultation} />
                    </div>
                )}
            </div>
        </div>
    );
}
