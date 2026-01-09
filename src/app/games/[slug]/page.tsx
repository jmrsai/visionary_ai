"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { MOCK_TESTS } from "@/lib/data";
import { CosmicRacerGame } from "@/components/games/cosmic-racer-game";
import { JungleExplorerGame } from "@/components/games/jungle-explorer-game";
import { VisualSnakeGame } from "@/components/games/visual-snake-game";
import { WordBuilderGame } from "@/components/games/word-builder-game";
import { useRouter } from "next/navigation";


const GameComponent = ({ slug, onBack }: { slug: string; onBack: () => void }) => {
    switch (slug) {
        case "cosmic-racer": return <CosmicRacerGame />;
        case "jungle-explorer": return <JungleExplorerGame onBack={onBack} />;
        case "visual-snake-game": return <VisualSnakeGame onBack={onBack} />;
        case "word-builder": return <WordBuilderGame onBack={onBack} />;
        default: return null;
    }
}

export default function GamePage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();

  const game = MOCK_TESTS.find((g) => g.id === slug);

  if (!game || game.category !== "Kids' Game Zone") {
    notFound();
  }
  
  const handleBack = () => {
    router.push('/gym');
  };

  return (
    <div className="space-y-6">
      <Link href="/gym" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
        &larr; Back to Eye Gym
      </Link>
      <GameComponent slug={slug} onBack={handleBack}/>
    </div>
  );
}
