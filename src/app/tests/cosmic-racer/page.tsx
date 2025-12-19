
import Link from "next/link";
import { CosmicRacerGame } from "@/components/tests/cosmic-racer-game";

export default function CosmicRacerPage() {
  return (
    <div>
      <Link href="/tests" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
        &larr; Back to All Tests
      </Link>
      <CosmicRacerGame />
    </div>
  );
}
