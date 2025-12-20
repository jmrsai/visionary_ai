
"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye } from 'lucide-react';
import { JungleExplorerGame } from './jungle-explorer-game';
import { CosmicRacerGame } from './cosmic-racer-game';

interface VisionTest {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<{ onBack: () => void }>;
  emoji: string;
}

interface KidsVisionTestsProps {
  onBack: () => void;
}

export function KidsVisionTests({ onBack }: KidsVisionTestsProps) {
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

  const visionTests: VisionTest[] = [
    { id: 'jungle-explorer', name: 'Jungle Explorer', description: 'Spot all the animals hiding in the jungle!', component: JungleExplorerGame, emoji: '🦋' },
    { id: 'cosmic-racer', name: 'Cosmic Racer', description: 'Follow the spaceship with your eyes as it races through the cosmos.', component: CosmicRacerGame, emoji: '🚀' },
  ];

  const startTest = (testId: string) => {
    setSelectedTestId(testId);
  };
  
  const handleBackToSelection = () => {
      setSelectedTestId(null);
  }

  const SelectedTestComponent = visionTests.find(t => t.id === selectedTestId)?.component;

  if (SelectedTestComponent) {
    return <SelectedTestComponent onBack={handleBackToSelection} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 pb-20 rounded-lg">
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-purple-200 p-4">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="w-5 h-5" /></Button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Vision Test Adventures 🔍</h1>
            <p className="text-sm text-gray-600">Fun eye games with Professor Owl!</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Card className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 border-0 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 text-6xl opacity-20">👁️</div>
          <div className="relative">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">🦉</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">Professor Owl's Eye Adventures!</h2>
                <p className="text-sm text-purple-100">Discover how amazing your eyes are!</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {visionTests.map((test) => (
            <Card key={test.id} className="relative overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-purple-300 group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-200 to-transparent opacity-50"></div>
              <div className="p-5">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center text-3xl border-2 border-purple-300 group-hover:scale-110 transition-transform duration-200">{test.emoji}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{test.name}</h3>
                    <p className="text-sm text-gray-700 mb-3">{test.description}</p>
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-purple-100 text-purple-700 font-medium">Game</Badge>
                      <span className="text-xs text-green-600 font-medium">✅ Kid-Friendly</span>
                    </div>
                  </div>
                  <Button size="lg" onClick={() => startTest(test.id)} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg">
                    <Eye className="w-4 h-4 mr-2" /> Play Game!
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">👨‍⚕️</div>
            <div>
              <h3 className="font-bold text-green-800 mb-1">Safe & Fun Testing</h3>
              <p className="text-sm text-green-700">These games are designed for fun and learning. For real eye health concerns, always visit an eye doctor with your parents!</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
