import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_TESTS } from "@/lib/data";
import { CosmicRacerGame } from "@/components/games/cosmic-racer-game";
import { JungleExplorerGame } from "@/components/games/jungle-explorer-game";
import { VisualSnakeGame } from "@/components/games/visual-snake-game";
import { WordBuilderGame } from "@/components/games/word-builder-game";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export async function generateStaticParams() {
  const games = MOCK_TESTS.filter((test) => test.category === "Kids' Game Zone");
  return games.map((game) => ({
    slug: game.id,
  }));
}

const GameComponent = ({ slug, onBack }: { slug: string; onBack: () => void }) => {
    switch (slug) {
        case "cosmic-racer": return <CosmicRacerGame onBack={onBack} />;
        case "jungle-explorer": return <JungleExplorerGame onBack={onBack} />;
        case "visual-snake-game": return <VisualSnakeGame onBack={onBack} />;
        case "word-builder": return <WordBuilderGame onBack={onBack} />;
        default: return null;
    }
}

export default function GamePage({ params }: { params: { slug: string } }) {
  const game = MOCK_TESTS.find((g) => g.id === params.slug);

  if (!game || game.category !== "Kids' Game Zone") {
    notFound();
  }

  const handleBack = () => {
    "use server";
    // This is a placeholder for a server action if needed,
    // but we can just rely on the link for navigation.
  };

  return (
    <div className="space-y-6">
      <Link href="/gym" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
        &larr; Back to Eye Gym
      </Link>
      <GameComponent slug={params.slug} onBack={handleBack}/>
    </div>
  );
}
