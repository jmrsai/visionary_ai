
"use client";

import DiagnosticUploader from "@/components/tools/diagnostic-uploader";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function DiagnosticsPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button asChild variant="ghost" size="icon" className="rounded-full">
                    <Link href="/tools">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Diagnostic Vault</h1>
                    <p className="text-muted-foreground">Secure analysis for professional eye scans.</p>
                </div>
            </div>

            <div className="mt-8">
                <DiagnosticUploader />
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-8">
                <div className="p-6 rounded-2xl bg-muted/50 border border-border/50">
                    <h3 className="font-bold text-lg mb-2">Secure Storage</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        All uploaded diagnostic images are stored in an end-to-end encrypted Supabase bucket. Access is restricted exclusively to your authenticated account.
                    </p>
                </div>
                <div className="p-6 rounded-2xl bg-muted/50 border border-border/50">
                    <h3 className="font-bold text-lg mb-2">Trend Monitoring</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Our AI models analyze micro-structural changes in retinal scans and OCT reports to identify early signs of drift that might require professional medical attention.
                    </p>
                </div>
            </div>
        </div>
    );
}
