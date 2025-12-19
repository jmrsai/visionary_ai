
"use client";

import { KidsVisionTests } from '@/components/tests/kids-vision-tests';
import Link from 'next/link';

export default function KidsZonePage() {

    return (
        <div>
            <Link href="/tests" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
                &larr; Back to All Tests
            </Link>
            <KidsVisionTests onBack={() => {}} />
        </div>
    );
}
