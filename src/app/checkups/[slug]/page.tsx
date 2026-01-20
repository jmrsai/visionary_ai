"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { MOCK_TESTS } from "@/lib/data";
import { ContrastSensitivityTest } from "@/components/tests/contrast-sensitivity-test";
import { ColorBlindnessTest } from "@/components/tests/color-blindness-test";
import { DryEyeDetector } from "@/components/tools/dry-eye-detector";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const CheckupComponent = ({ slug }: { slug: string }) => {
    switch (slug) {
        case "color-vision": return <ColorBlindnessTest />;
        case "contrast-sensitivity": return <ContrastSensitivityTest />;
        case "color-blindness": return <ColorBlindnessTest />;
        case "dry-eye-detector": return <DryEyeDetector />;
        default: return null;
    }
}

export default function CheckupPage() {
    const params = useParams();
    const slug = params.slug as string;
    const router = useRouter();

    const test = MOCK_TESTS.find((g) => g.id === slug);

    if (!test || test.category !== "Core Diagnostics") {
        // Some diagnostics might be in Advanced Screening, but for our new ones let's be careful
        if (slug !== 'dry-eye-detector' && test?.category !== "Advanced Screening") {
            notFound();
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button asChild variant="ghost" size="icon" className="rounded-full">
                    <Link href="/dashboard">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                </Button>
                <span className="text-sm font-medium text-muted-foreground">Vision Screening</span>
            </div>

            <div className="mt-4">
                <CheckupComponent slug={slug} />
            </div>
        </div>
    );
}
