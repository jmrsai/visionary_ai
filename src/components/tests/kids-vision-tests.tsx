
"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, Volume2 } from 'lucide-react';
import { MOCK_TESTS } from '@/lib/data';
import { JungleExplorerGame } from './jungle-explorer-game';
import { CosmicRacerGame } from './cosmic-racer-game';

interface VisionTest {
  id: string;
  name: string;
  description: string;
  type: 'color' | 'astigmatism' | 'amsler' | 'acuity' | 'game';
  emoji: string;
  kidFriendly: boolean;
}

interface TestQuestion {
  id: string;
  question: string;
  image?: string;
  options: string[];
  correctAnswer?: number;
}

interface KidsVisionTestsProps {
  onBack: () => void;
}

export function KidsVisionTests({ onBack }: KidsVisionTestsProps) {
  const [selectedTest, setSelectedTest] = useState<VisionTest | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [testPhase, setTestPhase] = useState<'selection' | 'instructions' | 'testing' | 'results'>('selection');

  const visionTests: VisionTest[] = [
    { id: 'jungle-explorer', name: 'Jungle Explorer', description: 'Spot all the animals hiding in the jungle!', type: 'game', emoji: '🦋', kidFriendly: true },
    { id: 'cosmic-racer', name: 'Cosmic Racer', description: 'Follow the spaceship with your eyes as it races through the cosmos.', type: 'game', emoji: '🚀', kidFriendly: true },
    { id: 'color-adventure', name: 'Color Magic Quest', description: 'Help Rainbow Dragon find hidden numbers!', type: 'color', emoji: '🌈', kidFriendly: true },
    { id: 'line-detective', name: 'Line Detective', description: 'Solve the mystery of the magical fan!', type: 'astigmatism', emoji: '🔍', kidFriendly: true },
    { id: 'grid-explorer', name: 'Magic Grid Explorer', description: 'Explore the enchanted grid castle!', type: 'amsler', emoji: '🏰', kidFriendly: true },
    { id: 'letter-adventure', name: 'Letter Size Adventure', description: 'Help tiny letters grow bigger!', type: 'acuity', emoji: '📖', kidFriendly: true }
  ];

  const getTestQuestions = (testType: string): TestQuestion[] => {
    switch (testType) {
      case 'color-adventure':
        return [
          { id: 'color1', question: 'What number is Rainbow Dragon hiding in this magical pattern?', image: '🟢🔴🟢🔴🟢\n🔴🟢🔴🟢🔴\n🟢🟢🟢🟢🟢\n🔴🟢🔴🟢🔴\n🟢🔴🟢🔴🟢', options: ['5', '8', '3', 'I see swirls but no number'] },
          { id: 'color2', question: 'Can you spot the hidden treasure number?', image: '🟡🟠🟡🟠🟡\n🟠🟡🟡🟡🟠\n🟡🟡🟠🟡🟡\n🟠🟡🟡🟡🟠\n🟡🟠🟡🟠🟡', options: ['2', '6', '9', 'I see dots but no number'] }
        ];
      case 'line-detective':
        return [{ id: 'astig1', question: 'Look at the magical fan! Which lines look the darkest and sharpest to you?', image: '📏 Imagine lines pointing in all directions like a fan', options: ['All lines look the same - crystal clear!', 'The up-and-down lines look darker', 'The left-and-right lines look darker', 'Some diagonal lines look darker'] }];
      case 'grid-explorer':
        return [
          { id: 'amsler1', question: 'Stare at the magic dot in the center! Can you see all four corners of the castle grid?', image: '⊞ Grid with center dot', options: ['Yes, I see all four corners!', 'No, some corners are missing'] },
          { id: 'amsler2', question: 'Still looking at the center dot, do all the grid lines look perfectly straight?', image: '⊞ Grid lines', options: ['Yes, all lines are perfectly straight!', 'Some lines look wavy or bent', 'Some areas look blurry or missing'] }
        ];
      case 'letter-adventure':
        return [
          { id: 'acuity1', question: 'Which direction is this magical letter E pointing?', image: 'E (large size)', options: ['→ Right', '← Left', '↑ Up', '↓ Down'], correctAnswer: 0 },
          { id: 'acuity2', question: 'How about this smaller one?', image: 'Ǝ (medium size)', options: ['→ Right', '← Left', '↑ Up', '↓ Down'], correctAnswer: 1 }
        ];
      default: return [];
    }
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);
    
    const questions = getTestQuestions(selectedTest!.id);
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setTestPhase('results');
    }
  };

  const startTest = (test: VisionTest) => {
    setSelectedTest(test);
    setCurrentQuestion(0);
    setAnswers([]);
    setTestPhase('instructions');
  };

  if (selectedTest?.type === 'game') {
      if (selectedTest.id === 'jungle-explorer') return <JungleExplorerGame />;
      if (selectedTest.id === 'cosmic-racer') return <CosmicRacerGame />;
  }

  if (testPhase === 'instructions' && selectedTest) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-300 via-purple-300 to-pink-300 rounded-lg">
        <div className="sticky top-0 bg-black/20 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between text-white">
            <Button variant="ghost" size="icon" onClick={() => setTestPhase('selection')} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-xl font-bold">{selectedTest.name}</h1>
              <p className="text-sm">Get Ready for Adventure!</p>
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Volume2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 text-center space-y-8 text-white">
          <div className="text-8xl mb-6">{selectedTest.emoji}</div>
          <h2 className="text-2xl font-bold mb-4">{selectedTest.name}</h2>
          
          <div className="bg-white/20 rounded-2xl p-6 space-y-4">
            <p className="text-xl">🦉 Professor Owl says:</p>
            <p className="text-lg">{selectedTest.description}</p>
            
            <div className="bg-white/20 rounded-xl p-4 space-y-2">
              <p className="font-bold">📋 Instructions:</p>
              {(selectedTest.type === 'color' || selectedTest.id === 'color-adventure') && <div className="space-y-1 text-sm"><p>• Look carefully at the colorful patterns</p><p>• Try to find hidden numbers or shapes</p><p>• Choose what you see - there's no wrong answer!</p></div>}
              {(selectedTest.type === 'astigmatism' || selectedTest.id === 'line-detective') && <div className="space-y-1 text-sm"><p>• Look at the fan of lines</p><p>• Tell us which lines look darkest or sharpest</p><p>• Keep your head straight and still</p></div>}
              {(selectedTest.type === 'amsler' || selectedTest.id === 'grid-explorer') && <div className="space-y-1 text-sm"><p>• Cover one eye with your hand</p><p>• Stare at the dot in the center</p><p>• Tell us what you see around the edges</p></div>}
              {(selectedTest.type === 'acuity' || selectedTest.id === 'letter-adventure') && <div className="space-y-1 text-sm"><p>• Look at each letter E carefully</p><p>• Tell us which way it's pointing</p><p>• Try to see the smallest ones you can!</p></div>}
            </div>
          </div>

          <Button onClick={() => setTestPhase('testing')} size="lg" className="w-full h-16 text-xl bg-white text-purple-600 hover:bg-gray-100 rounded-2xl font-bold">
            🚀 Start the Adventure!
          </Button>
        </div>
      </div>
    );
  }

  if (testPhase === 'testing' && selectedTest) {
    const questions = getTestQuestions(selectedTest.id);
    const question = questions[currentQuestion];
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-400 via-blue-400 to-purple-400 rounded-lg">
        <div className="sticky top-0 bg-black/20 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between text-white">
            <Button variant="ghost" size="icon" onClick={() => setTestPhase('selection')} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h1 className="font-bold">{selectedTest.name}</h1>
              <p className="text-sm">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
            <div className="text-right w-16">
              <div className="text-sm">Progress</div>
              <div className="w-full bg-white/20 rounded-full h-2 mt-1">
                <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <Card className="p-6 bg-white/95 text-center">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{question.question}</h2>
            <div className="my-8 p-8 bg-gray-100 rounded-2xl flex items-center justify-center min-h-32">
              {/* Stimulus content here */}
               <div className="text-center">
                  <div className="text-4xl mb-4">
                    {selectedTest.type === 'color' && '🌈'}
                    {selectedTest.type === 'astigmatism' && '🔍'}
                    {selectedTest.type === 'amsler' && '🏰'}
                    {selectedTest.type === 'acuity' && '📖'}
                  </div>
                  {selectedTest.type === 'color' && <div className="grid grid-cols-5 gap-1 text-2xl whitespace-pre-wrap">{question.image}</div>}
                  {selectedTest.type === 'astigmatism' && <div className="relative w-32 h-32 mx-auto text-8xl text-gray-600 flex items-center justify-center">※</div>}
                  {selectedTest.type === 'amsler' && <div className="grid grid-cols-10 gap-px w-48 h-48 mx-auto bg-white border-2 border-black relative">{[...Array(100)].map((_, i) => <div key={i} className="border-l border-b border-gray-400"></div>)}<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-black rounded-full"></div></div>}
                  {selectedTest.type === 'acuity' && <div className={`font-mono font-bold ${currentQuestion === 0 ? 'text-8xl' : 'text-6xl'}`}>{currentQuestion === 0 ? 'E' : 'Ǝ'}</div>}
               </div>
            </div>
          </Card>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <Button key={index} onClick={() => handleAnswer(index)} className="w-full h-16 text-left bg-white hover:bg-purple-50 text-gray-900 border-2 border-purple-200 hover:border-purple-400 rounded-2xl text-lg font-medium justify-start" variant="outline">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">{String.fromCharCode(65 + index)}</div>
                  <span>{option}</span>
                </div>
              </Button>
            ))}
          </div>

          <div className="text-center text-white"><p className="text-lg">🦉 Take your time, young explorer!</p></div>
        </div>
      </div>
    );
  }

  if (testPhase === 'results' && selectedTest) {
    const questions = getTestQuestions(selectedTest.id);
    let score = 0;
    if (selectedTest.type === 'acuity') {
      score = answers.reduce((acc, answer, index) => acc + (answer === questions[index].correctAnswer ? 1 : 0), 0);
      score = Math.round((score / questions.length) * 100);
    } else {
      score = Math.floor(Math.random() * 20) + 80;
    }
    
    let resultMessage = score >= 90 ? 'Fantastic! Your eyes are super strong! 🌟' : score >= 70 ? 'Great job! You\'re doing amazingly well! ⭐' : 'Good effort! Keep practicing your eye adventures! 💪';
    let resultEmoji = score >= 90 ? '🏆' : '🎉';

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-300 via-blue-300 to-purple-300 p-4 rounded-lg">
        <div className="max-w-md mx-auto pt-12 space-y-6">
          <div className="text-center text-white">
            <div className="w-24 h-24 bg-yellow-300 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce"><div className="text-4xl">{resultEmoji}</div></div>
            <h2 className="text-3xl font-bold mb-2">Adventure Complete! 🎉</h2>
            <p className="text-xl">{selectedTest.name} finished!</p>
          </div>
          <Card className="p-6 text-center bg-white">
            <div className="text-6xl font-bold text-purple-600 mb-2">{score}%</div>
            <div className="text-gray-600 mb-4">Amazing Score!</div>
            <p className="text-lg text-gray-800 font-medium">{resultMessage}</p>
          </Card>
          <Card className="p-4 bg-white/90">
            <h3 className="font-bold text-purple-600 mb-2">🦉 Professor Owl's Tips:</h3>
            <div className="text-sm text-gray-700 space-y-1">
              {(selectedTest.type === 'color' || selectedTest.id === 'color-adventure') && <><p>• Colors help us see the world beautifully!</p><p>• Eat colorful fruits and vegetables for healthy eyes</p></>}
              {(selectedTest.type === 'astigmatism' || selectedTest.id === 'line-detective') && <><p>• Sharp vision helps us see details clearly</p><p>• Blink often to keep your eyes fresh!</p></>}
              {(selectedTest.type === 'amsler' || selectedTest.id === 'grid-explorer') && <><p>• Your central vision is very important</p><p>• Take breaks from screens to rest your eyes</p></>}
              {(selectedTest.type === 'acuity' || selectedTest.id === 'letter-adventure') && <><p>• Reading helps strengthen your eye muscles</p><p>• Good lighting makes reading easier!</p></>}
            </div>
          </Card>
          <div className="space-y-3">
            <Button onClick={() => setTestPhase('selection')} className="w-full h-12 bg-white text-purple-600 hover:bg-gray-100 font-bold">Try Another Adventure! 🎮</Button>
            <Button variant="outline" onClick={() => setTestPhase('selection')} className="w-full border-white text-white hover:bg-white/20">Back to Kids Zone</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 pb-20 rounded-lg">
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-purple-200 p-4">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="w-5 h-5" /></Button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Vision Test Adventures 🔍</h1>
            <p className="text-sm text-gray-600">Fun eye tests with Professor Owl!</p>
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
                      <Badge className="bg-purple-100 text-purple-700 font-medium">{test.type}</Badge>
                      <span className="text-xs text-green-600 font-medium">✅ Kid-Friendly</span>
                    </div>
                  </div>
                  <Button size="lg" onClick={() => startTest(test)} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg">
                    <Eye className="w-4 h-4 mr-2" /> Start Test!
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
              <p className="text-sm text-green-700">These tests are designed for fun and learning. For real eye health concerns, always visit an eye doctor with your parents!</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
