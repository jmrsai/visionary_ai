"use client";

import { useState, useMemo, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, RefreshCw, X, ArrowLeft, Loader2, Palette, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { HrrTest } from './hrr-test';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { MOCK_D15_CAPS } from '@/lib/data';
import { IshiharaPlateSVG } from './ishihara-plate-svg';

// Mock Type for what the flow *would* return
type IshiharaPlateOutput = {
    correctNumber: number;
    options: number[];
}


const TOTAL_PLATES = 5; 

const getStatus = (score: number): 'normal' | 'attention' | 'concern' => {
    const accuracy = score / TOTAL_PLATES;
    if (accuracy >= 0.9) return 'normal'; // 90-100%
    if (accuracy >= 0.7) return 'attention'; // 70-89%
    return 'concern';
};

const getStatusInfo = (status: 'normal' | 'attention' | 'concern') => {
  switch (status) {
    case 'normal': 
        return { 
            text: 'Normal', 
            color: 'text-green-600', 
            bgColor: 'bg-green-100 dark:bg-green-900/50',
            interpretation: 'Your color vision appears to be normal. You correctly identified most color patterns.'
        };
    case 'attention': 
        return { 
            text: 'Needs Attention', 
            color: 'text-yellow-600', 
            bgColor: 'bg-yellow-100 dark:bg-yellow-900/50',
            interpretation: 'Some difficulty with color discrimination was detected. Consider consulting an eye care professional.'
        };
    case 'concern': 
        return { 
            text: 'Concerning', 
            color: 'text-red-600', 
            bgColor: 'bg-red-100 dark:bg-red-900/50',
            interpretation: 'A significant color vision deficiency was detected. We strongly recommend a professional evaluation.'
        };
  }
};


const IshiharaTest = ({ onBack }: { onBack: () => void }) => {
  const [step, setStep] = useState<'instructions' | 'test' | 'results' | 'loading'>('instructions');
  const [currentPlate, setCurrentPlate] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [plateData, setPlateData] = useState<IshiharaPlateOutput | null>(null);
  const { toast } = useToast();

  const getNextPlate = useCallback(async () => {
    setStep('loading');
    try {
        // This simulates a call to an AI flow. In a real scenario, this would be an async call.
        const randomNumber = Math.floor(Math.random() * 90) + 10;
        const distractors = new Set<number>();
        while(distractors.size < 3) {
            const d = Math.floor(Math.random() * 90) + 10;
            if (d !== randomNumber) distractors.add(d);
        }
        const options = [randomNumber, ...Array.from(distractors)].sort(() => Math.random() - 0.5);
        const data: IshiharaPlateOutput = {
            correctNumber: randomNumber,
            options: options,
        };

        setPlateData(data);
        setStep('test');
    } catch (error) {
        console.error("Failed to generate Ishihara plate:", error);
        toast({
            title: "Error Generating Test",
            description: "Could not generate the next plate. Please try again.",
            variant: "destructive"
        });
        setStep('instructions');
    }
  }, [toast]);


  const startTest = () => {
    setCurrentPlate(0);
    setScore(0);
    setUserAnswers([]);
    getNextPlate();
  };

  const handleAnswer = (answer: number) => {
    if (!plateData) return;
    setUserAnswers([...userAnswers, answer]);
    if (answer === plateData.correctNumber) {
      setScore(score + 1);
    }
    
    if (currentPlate < TOTAL_PLATES - 1) {
      setCurrentPlate(currentPlate + 1);
      getNextPlate();
    } else {
      setStep('results');
    }
  };

  const restartTest = () => {
    setStep('instructions');
  };

  if (step === 'instructions') {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold">Dynamically Generated Ishihara Test</h3>
        <p className="text-muted-foreground mt-2 mb-4">
          You will be shown a series of unique, computer-generated plates. Click the number you see in the plate. This test primarily screens for red-green color deficiencies.
        </p>
        <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
            <Button onClick={startTest}>Start Test</Button>
        </div>
      </div>
    );
  }

  if (step === 'loading') {
    return (
        <div className="flex flex-col items-center justify-center text-center h-64 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Generating next test plate...</p>
        </div>
    )
  }

  if (step === 'results') {
    const finalStatus = getStatus(score);
    const statusInfo = getStatusInfo(finalStatus);
    const accuracy = Math.round((score / TOTAL_PLATES) * 100);

    return (
      <div className="max-w-lg mx-auto space-y-6">
        <Card className="text-center shadow-lg">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Palette className="h-8 w-8 text-primary"/>
            </div>
            <CardTitle>Color Vision Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-6xl font-bold text-primary">{accuracy}</span>
              <span className="text-3xl text-muted-foreground">/100</span>
            </div>
             <Badge className={cn("text-sm", statusInfo.bgColor, statusInfo.color)}>{statusInfo.text}</Badge>
            <p className="text-sm text-muted-foreground">
                You correctly identified {score} out of {TOTAL_PLATES} plates.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
                <CardTitle className="text-lg text-blue-800 dark:text-blue-300">Interpretation</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-blue-700 dark:text-blue-300/90">{statusInfo.interpretation}</p>
                 <p className="text-xs text-blue-600 dark:text-blue-400/80 mt-4">This screening is not a substitute for a professional diagnosis.</p>
            </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" size="lg" onClick={restartTest}>
                <RefreshCw className="mr-2 h-4 w-4" /> Retake Test
            </Button>
            <Button size="lg" onClick={onBack}>
                Done
            </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center space-y-6 max-w-md mx-auto">
        <div className="w-full text-center">
            <p className="text-muted-foreground">Plate {currentPlate + 1} of {TOTAL_PLATES}</p>
        </div>
        <div className="w-80 h-80 relative rounded-full overflow-hidden border-4 border-muted flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            {plateData ? (
                <IshiharaPlateSVG numberToDisplay={plateData.correctNumber} width={320} height={320} />
            ) : (
                 <div className="w-full h-full bg-muted animate-pulse" />
            )}
        </div>
        <p className="font-semibold text-lg">What number do you see?</p>
        <div className="grid grid-cols-2 gap-4 w-full">
            {plateData?.options.map(option => (
            <Button key={option} size="lg" variant="outline" className="h-24 text-3xl font-bold" onClick={() => handleAnswer(option)}>
                {option}
            </Button>
            ))}
        </div>
         <div className="w-full pt-4">
          <Progress value={((currentPlate + 1) / TOTAL_PLATES) * 100} />
        </div>
    </div>
  );
};


const d15CorrectOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

const D15Test = ({ onBack }: { onBack: () => void }) => {
  const [step, setStep] = useState<'instructions' | 'test' | 'results'>('instructions');
  const [caps, setCaps] = useState(() => [...MOCK_D15_CAPS.slice(1)].sort(() => Math.random() - 0.5));
  const [draggedCapId, setDraggedCapId] = useState<number | null>(null);
  const [resultLines, setResultLines] = useState<any[]>([]);

  const handleDragStart = (id: number) => {
    setDraggedCapId(id);
  };

  const handleDrop = (targetId: number) => {
    if (draggedCapId === null || draggedCapId === targetId) return;

    const newCaps = [...caps];
    const draggedIndex = newCaps.findIndex(c => c.id === draggedCapId);
    const targetIndex = newCaps.findIndex(c => c.id === targetId);
    
    // Swap the caps
    const draggedItem = newCaps.splice(draggedIndex, 1)[0];
    newCaps.splice(targetIndex, 0, draggedItem);
    
    setCaps(newCaps);
    setDraggedCapId(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const calculateResults = () => {
    const arrangement = [0, ...caps.map(c => c.id)]; // Add pilot cap at the start
    const lines = [];
    // Protan axis errors: 15-7, 1-8
    // Deutan axis errors: 14-6, 2-7
    // Tritan axis errors: 13-4, 3-5

    for (let i = 0; i < arrangement.length - 1; i++) {
        const cap1 = arrangement[i];
        const cap2 = arrangement[i+1];
        
        const isError = Math.abs(cap1 - cap2) > 1 && !(cap1 === 0 && cap2 === 15) && !(cap1 === 15 && cap2 === 0);
        
        let type = 'correct';
        if (isError) {
          const pair = [cap1, cap2].sort((a,b) => a-b);
          if ( (pair[0] === 7 && pair[1] === 15) || (pair[0] === 1 && pair[1] === 8) ) type = 'protan';
          else if ( (pair[0] === 6 && pair[1] === 14) || (pair[0] === 2 && pair[1] === 7) ) type = 'deutan';
          else if ( (pair[0] === 4 && pair[1] === 13) || (pair[0] === 3 && pair[1] === 5) ) type = 'tritan';
          else type = 'error';
        }
        lines.push({from: cap1, to: cap2, type });
    }
    setResultLines(lines);
  };
  
  const startTest = () => {
    setStep('test');
  };

  const finishTest = () => {
    calculateResults();
    setStep('results');
  };

  const restartTest = () => {
    setStep('instructions');
    setCaps([...MOCK_D15_CAPS.slice(1)].sort(() => Math.random() - 0.5));
  }

  if (step === 'instructions') {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold">Farnsworth D-15 Arrangement Test</h3>
        <p className="text-muted-foreground mt-2 mb-4 max-w-lg mx-auto">
          Arrange the colored caps in order of hue, starting from the fixed pilot cap. Drag and drop the caps to reorder them. Click "Finish Test" when you are done.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
          <Button onClick={startTest}>Start Test</Button>
        </div>
      </div>
    );
  }

  if (step === 'results') {
    const errorCount = resultLines.filter(l => l.type !== 'correct').length;
    const errorTypes = [...new Set(resultLines.filter(l => l.type.match(/protan|deutan|tritan/)).map(l => l.type))];

    let interpretation = "Your results suggest normal color vision.";
    if (errorCount > 2) {
      interpretation = `Your arrangement suggests a significant color deficiency. The pattern of errors may indicate a ${errorTypes.join(', ')} type deficiency.`
    } else if (errorCount > 0) {
      interpretation = `Your arrangement suggests a mild color deficiency. The pattern of errors may indicate a ${errorTypes.join(', ')} type deficiency.`
    }

    return (
        <Card className="mx-auto w-full text-center">
            <CardHeader>
                <CardTitle>D-15 Test Complete</CardTitle>
                <CardDescription>
                    {interpretation}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">Below is a diagram of your results. Lines connect the caps in the order you placed them. Crossing lines indicate errors in color perception.</p>
                {/* Result Diagram */}
                <div className="relative w-64 h-64 mx-auto my-6">
                    {MOCK_D15_CAPS.map(cap => {
                        const angle = (cap.id / 16) * 2 * Math.PI - (Math.PI / 2);
                        const x = 50 + 45 * Math.cos(angle);
                        const y = 50 + 45 * Math.sin(angle);
                        return (
                            <div key={cap.id} className="absolute w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold" style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)', backgroundColor: cap.color, color: 'white', textShadow: '0 0 2px black' }}>
                                {cap.id === 0 ? 'P' : cap.id}
                            </div>
                        )
                    })}
                     <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
                        {resultLines.map((line, i) => {
                             const fromCap = MOCK_D15_CAPS.find(c => c.id === line.from)!;
                             const toCap = MOCK_D15_CAPS.find(c => c.id === line.to)!;
                             const fromAngle = (fromCap.id / 16) * 2 * Math.PI - (Math.PI / 2);
                             const toAngle = (toCap.id / 16) * 2 * Math.PI - (Math.PI / 2);
                             const x1 = 50 + 40 * Math.cos(fromAngle);
                             const y1 = 50 + 40 * Math.sin(fromAngle);
                             const x2 = 50 + 40 * Math.cos(toAngle);
                             const y2 = 50 + 40 * Math.sin(toAngle);
                             
                             let strokeColor = 'hsl(var(--muted-foreground))';
                             if(line.type === 'protan') strokeColor = 'red';
                             if(line.type === 'deutan') strokeColor = 'green';
                             if(line.type === 'tritan') strokeColor = 'blue';

                             return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={strokeColor} strokeWidth="1" />
                        })}
                    </svg>
                </div>
                <p className="text-sm text-muted-foreground mt-4 mb-4">This screening is not a substitute for a professional diagnosis. Please consult an eye care professional.</p>
                <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />All Tests</Button>
                    <Button onClick={restartTest}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Retake Test
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="flex flex-col items-center w-full">
      <Card className="w-full">
        <CardHeader>
            <CardTitle>Arrange the Colors</CardTitle>
            <CardDescription>Drag and drop the tiles to place them in the correct order of hue.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-wrap gap-2 justify-center items-center p-4 border rounded-lg min-h-[14rem]">
                <div className="flex flex-col items-center gap-1">
                    <div style={{ backgroundColor: MOCK_D15_CAPS[0].color }} className="w-16 h-16 rounded-lg shadow-md flex items-center justify-center font-bold text-white">
                        P
                    </div>
                    <span className="text-xs mt-1">Pilot</span>
                </div>

                <div className="flex-grow grid grid-cols-5 sm:grid-cols-8 gap-2">
                    {caps.map(cap => (
                        <div
                            key={cap.id}
                            draggable
                            onDragStart={() => handleDragStart(cap.id)}
                            onDrop={() => handleDrop(cap.id)}
                            onDragOver={handleDragOver}
                            className={cn(
                                "w-16 h-16 rounded-lg shadow-md cursor-pointer transition-all flex items-center justify-center text-xs font-mono text-white",
                                draggedCapId === cap.id && "opacity-50 scale-110 ring-2 ring-primary"
                            )}
                            style={{ backgroundColor: cap.color }}
                        >
                        </div>
                    ))}
                </div>
            </div>
            <Button onClick={finishTest} className="mt-6 w-full">Finish Test</Button>
        </CardContent>
      </Card>
    </div>
  );
};

const ChromaDetectiveGame = ({ onBack }: { onBack: () => void }) => {
    const [step, setStep] = useState<'instructions' | 'game' | 'results'>('instructions');
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [grid, setGrid] = useState<any[]>([]);
    const [oddTileIndex, setOddTileIndex] = useState(-1);

    const timerRef = useRef<NodeJS.Timeout>();

    const generateLevel = (currentLevel: number) => {
        const gridSize = Math.min(Math.floor(Math.sqrt(currentLevel * 2)) + 1, 7); // Grid size from 2x2 up to 7x7
        const numTiles = gridSize * gridSize;
        const difficulty = Math.max(10, 80 - currentLevel * 4); // Color difference gets smaller

        const baseColor = {
            r: Math.floor(Math.random() * 256),
            g: Math.floor(Math.random() * 256),
            b: Math.floor(Math.random() * 256),
        };
        const oddColor = {
            r: Math.max(0, Math.min(255, baseColor.r + (Math.random() > 0.5 ? difficulty : -difficulty))),
            g: Math.max(0, Math.min(255, baseColor.g + (Math.random() > 0.5 ? difficulty : -difficulty))),
            b: Math.max(0, Math.min(255, baseColor.b + (Math.random() > 0.5 ? difficulty : -difficulty))),
        };

        const newGrid = Array(numTiles).fill(`rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`);
        const newOddTileIndex = Math.floor(Math.random() * numTiles);
        newGrid[newOddTileIndex] = `rgb(${oddColor.r}, ${oddColor.g}, ${oddColor.b})`;
        
        setGrid(newGrid);
        setOddTileIndex(newOddTileIndex);
        setTimeLeft(Math.max(3, 10 - Math.floor(currentLevel / 5)));
    };

    const startGame = () => {
        setLevel(1);
        setScore(0);
        generateLevel(1);
        setStep('game');
    };

    const handleTileClick = (index: number) => {
        if (index === oddTileIndex) {
            setScore(score + level * 10);
            const nextLevel = level + 1;
            setLevel(nextLevel);
            generateLevel(nextLevel);
        } else {
            endGame();
        }
    };
    
    const endGame = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setStep('results');
    }

    useEffect(() => {
        if (step === 'game') {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        endGame();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step]);
    
    if (step === 'instructions') {
        return (
          <div className="text-center">
            <h3 className="text-xl font-semibold">Chroma Detective Game</h3>
            <p className="text-muted-foreground mt-2 mb-4 max-w-lg mx-auto">
              Test your color perception skills! Find and tap the tile that is a different color from the rest before the timer runs out.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
              <Button onClick={startGame}>Start Game</Button>
            </div>
          </div>
        );
    }
    
     if (step === 'results') {
        return (
            <Card className="mx-auto max-w-md text-center">
                <CardHeader>
                    <CardTitle>Game Over!</CardTitle>
                    <CardDescription>You reached Level {level}.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Final Score</p>
                        <p className="text-6xl font-bold">{score}</p>
                    </div>
                    <p className="text-muted-foreground">This game is a fun way to challenge your color discrimination skills. Play again to beat your high score!</p>
                    <div className="flex justify-center gap-4">
                        <Button variant="outline" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
                        <Button onClick={startGame}>Play Again</Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const gridSize = Math.sqrt(grid.length);

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto space-y-4">
            <div className="flex justify-between w-full items-center font-mono">
                <div>Level: <span className="font-bold">{level}</span></div>
                <div>Score: <span className="font-bold">{score}</span></div>
            </div>
            <div className="relative w-full">
                <Progress value={timeLeft * 10} className="h-2" />
                <div className="absolute right-0 top-3 text-sm text-muted-foreground flex items-center gap-1"><Timer className="h-4 w-4"/> {timeLeft}s</div>
            </div>
            <div 
                className="grid gap-1.5"
                style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
            >
                {grid.map((color, i) => (
                    <div 
                        key={i} 
                        className="w-16 h-16 md:w-20 md:h-20 rounded-md cursor-pointer transition-transform hover:scale-105"
                        style={{ backgroundColor: color }}
                        onClick={() => handleTileClick(i)}
                    />
                ))}
            </div>
        </div>
    );
};


export function ColorVisionTest() {
  const [testType, setTestType] = useState<'selection' | 'ishihara' | 'd15' | 'hrr' | 'game'>('selection');

  const renderContent = () => {
    switch(testType) {
      case 'ishihara':
        return <IshiharaTest onBack={() => setTestType('selection')} />;
      case 'd15':
        return <D15Test onBack={() => setTestType('selection')} />;
      case 'hrr':
        return <HrrTest onBack={() => setTestType('selection')} />;
      case 'game':
        return <ChromaDetectiveGame onBack={() => setTestType('selection')} />;
      case 'selection':
      default:
        return (
          <div className="text-center space-y-6">
            <h3 className="text-xl font-semibold">Choose a Color Vision Test</h3>
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              <Card className="hover:border-primary transition-colors">
                  <CardHeader>
                      <CardTitle>Chroma Detective Game</CardTitle>
                      <CardDescription>A fun game to test your color perception against the clock.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Button onClick={() => setTestType('game')} className="w-full">Play Game</Button>
                  </CardContent>
              </Card>
              <Card className="hover:border-primary transition-colors">
                  <CardHeader>
                      <CardTitle>Generated Ishihara Test</CardTitle>
                      <CardDescription>Screens for red-green color deficiencies using generated plates.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Button onClick={() => setTestType('ishihara')} className="w-full">Start Ishihara Test</Button>
                  </CardContent>
              </Card>
               <Card className="hover:border-primary transition-colors">
                  <CardHeader>
                      <CardTitle>HRR Plate Test</CardTitle>
                      <CardDescription>A comprehensive test for red-green and blue-yellow deficiencies.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Button onClick={() => setTestType('hrr')} className="w-full">Start HRR Test</Button>
                  </CardContent>
              </Card>
              <Card className="hover:border-primary transition-colors">
                  <CardHeader>
                      <CardTitle>Farnsworth D-15 Test</CardTitle>
                      <CardDescription>Screens for all types of color deficiency by arranging colored tiles.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Button onClick={() => setTestType('d15')} className="w-full">Start D-15 Test</Button>
                  </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  }

  return <div>{renderContent()}</div>;
}
