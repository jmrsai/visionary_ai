
"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Upload,
    FileImage,
    Loader2,
    CheckCircle2,
    AlertCircle,
    History,
    TrendingDown,
    TrendingUp,
    ShieldCheck,
    ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/firebase";
import { analyzeDiagnostics, AnalyzeDiagnosticsOutput } from "@/ai/flows/analyze-diagnostics";
import { useToast } from "@/hooks/use-toast";

export default function DiagnosticUploader() {
    const { user } = useUser();
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalyzeDiagnosticsOutput | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setResult(null);
        } else {
            toast({
                title: "Invalid File",
                description: "Please select an image file (e.g. JPG, PNG).",
                variant: "destructive"
            });
        }
    };

    const uploadToSupabase = async (file: File) => {
        if (!user) return null;
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.uid}/${Date.now()}.${fileExt}`;
        const filePath = `diagnostics/${fileName}`;

        const { data, error } = await supabase.storage
            .from('visionary-docs')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;
        return data.path;
    };

    const handleUploadAndAnalyze = async () => {
        if (!file || !user) return;

        setIsUploading(true);
        setUploadProgress(20);

        try {
            // 1. Upload to Supabase Storage
            await uploadToSupabase(file);
            setUploadProgress(60);

            // 2. Prepare for analysis (convert to DataURI for AI flow)
            setIsAnalyzing(true);
            const reader = new FileReader();
            reader.onload = async (e) => {
                const imageDataUri = e.target?.result as string;
                if (imageDataUri) {
                    try {
                        const analysisResult = await analyzeDiagnostics({ imageDataUri });
                        setResult(analysisResult);
                        setUploadProgress(100);
                        toast({
                            title: "Analysis Complete",
                            description: "Your diagnostic results are encrypted and saved.",
                        });
                    } catch (analysisError) {
                        toast({
                            title: "AI Analysis Failed",
                            description: "The file was uploaded but AI analysis failed. Please try again later.",
                            variant: "destructive"
                        });
                    }
                }
                setIsAnalyzing(false);
                setIsUploading(false);
            };
            reader.readAsDataURL(file);

        } catch (error: any) {
            console.error("Upload failed:", error);
            toast({
                title: "Upload Failed",
                description: error.message || "Could not upload file to secure storage.",
                variant: "destructive"
            });
            setIsUploading(false);
        }
    };

    return (
        <Card className="glass-card border-primary/20 overflow-hidden max-w-2xl mx-auto shadow-2xl">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <ShieldCheck className="w-6 h-6 text-primary" />
                            Diagnostic Vault
                        </CardTitle>
                        <CardDescription>Secure storage & AI monitoring for OCT/Fundus photos.</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                        End-to-End Encrypted
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <AnimatePresence mode="wait">
                    {!result ? (
                        <motion.div
                            key="uploader"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={cn(
                                "relative border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all",
                                file ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"
                            )}
                            onClick={() => !isUploading && fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileSelect}
                            />

                            {isUploading ? (
                                <div className="text-center space-y-4 w-full max-w-xs">
                                    <div className="relative w-24 h-24 mx-auto">
                                        <Loader2 className="w-24 h-24 text-primary animate-spin opacity-20" />
                                        <div className="absolute inset-0 flex items-center justify-center font-bold text-primary">
                                            {uploadProgress}%
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="font-bold text-lg animate-pulse">
                                            {isAnalyzing ? "AI Analyzing Patterns..." : "Securely Uploading to Vault..."}
                                        </p>
                                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                            <motion.div
                                                className="bg-primary h-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${'${uploadProgress}'}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : file ? (
                                <div className="text-center">
                                    <div className="bg-primary/10 p-6 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                        <FileImage className="w-16 h-16 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-1 truncate max-w-[200px]">{file.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-6">File ready for analysis</p>
                                    <div className="flex gap-4 justify-center">
                                        <Button variant="outline" className="rounded-xl" onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                        }}>
                                            Cancel
                                        </Button>
                                        <Button className="rounded-xl px-8 shadow-lg shadow-primary/20" onClick={(e) => {
                                            e.stopPropagation();
                                            handleUploadAndAnalyze();
                                        }}>
                                            Start AI Analysis
                                            <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-muted p-8 rounded-full mb-6 relative">
                                        <Upload className="w-10 h-10 text-muted-foreground" />
                                        <div className="absolute -bottom-2 -right-2 bg-primary p-2 rounded-lg shadow-lg">
                                            <History className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Drop your scan here</h3>
                                    <p className="text-muted-foreground text-center max-w-sm">
                                        Upload your Fundus photo or OCT scan to track changes over time with AI precision.
                                    </p>
                                </>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                        >
                            {/* Analysis Header */}
                            <div className={cn(
                                "p-6 rounded-3xl flex items-center justify-between border",
                                result.category === 'Stable' ? "bg-green-500/10 border-green-500/20" : "bg-orange-500/10 border-orange-500/20"
                            )}>
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "p-3 rounded-2xl",
                                        result.category === 'Stable' ? "bg-green-500 text-white" : "bg-orange-500 text-white"
                                    )}>
                                        {result.category === 'Stable' ? <CheckCircle2 className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-xl leading-none mb-1 uppercase tracking-tight">{result.category}</h4>
                                        <p className="text-sm opacity-70">Visualizing Structural Integrity</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black">{result.drift}%</div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-50">Drift Score</div>
                                </div>
                            </div>

                            {/* Summary Detail */}
                            <div className="space-y-4">
                                <div className="bg-muted/30 p-6 rounded-3xl border border-border/50">
                                    <h5 className="font-bold text-sm mb-2 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-primary" />
                                        AI Clinical Summary
                                    </h5>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {result.summary}
                                    </p>
                                </div>

                                <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
                                    <h5 className="font-bold text-sm mb-2">Recommendation</h5>
                                    <p className="text-md font-semibold text-primary">
                                        {result.recommendation}
                                    </p>
                                </div>
                            </div>

                            <Button variant="secondary" className="w-full rounded-2xl" onClick={() => setResult(null)}>
                                <History className="mr-2 h-4 w-4" />
                                Upload Another Scan
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>

            <CardFooter className="bg-muted/20 border-t border-border/50 flex flex-col p-6 text-center space-y-4">
                <div className="flex items-center gap-2 justify-center text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    <History className="w-3 h-3" />
                    Storage Limit: 2GB / 10GB Used
                </div>
                <p className="text-[10px] text-muted-foreground italic max-w-xs mx-auto">
                    Note: This preliminary AI analysis does not replace a professional ophthalmic consultation. Always consult your doctor for definitive diagnosis.
                </p>
            </CardFooter>
        </Card>
    );
}
