
"use client";

import React, { useState, useMemo } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MOCK_D15_CAPS } from '@/lib/data';
import type { D15Cap } from '@/lib/types';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

function shuffle(array: any[]) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

const SortableCap = ({ cap }: { cap: D15Cap }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: cap.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        backgroundColor: cap.color,
    };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="h-12 w-12 rounded-full border-2 border-gray-500 cursor-grab touch-none">
            <div className="flex h-full w-full items-center justify-center text-white font-bold drop-shadow-md">{cap.id === 0 ? 'P' : cap.id}</div>
        </div>
    );
};

const ResultChart = ({ userOrder, correctOrder }: { userOrder: D15Cap[], correctOrder: D15Cap[] }) => {
    const points = userOrder.map((cap, i) => {
        if (i === 0) return null; // Skip pilot cap for drawing lines
        const prevCap = userOrder[i-1];
        return `${(prevCap.id) * 20 + 20},${(i) * 10} ${(cap.id) * 20 + 20},${(i+1) * 10}`;
    }).filter(Boolean).join(' ');


    return (
        <svg viewBox="0 0 340 180" className="w-full">
            <g transform="translate(10,10)">
                {/* Axis labels */}
                {correctOrder.map((cap, i) => (
                    <text key={`x-${i}`} x={(i+1)*20} y="175" textAnchor="middle" fontSize="10">{cap.id === 0 ? 'P' : cap.id}</text>
                ))}
                
                {/* Lines connecting the user's order */}
                {userOrder.slice(0, -1).map((cap, i) => {
                    const nextCap = userOrder[i+1];
                    const startX = (cap.id === 0 ? 1 : cap.id) * 20 - 10;
                    const endX = (nextCap.id === 0 ? 1 : nextCap.id) * 20 - 10;

                    return (
                        <line 
                            key={i}
                            x1={startX} y1={80}
                            x2={endX} y2={80}
                            stroke="black"
                            strokeWidth="1"
                        />
                    )
                })}

                {/* Points representing the caps in order */}
                {userOrder.map((cap, i) => {
                    return <circle key={i} cx={(cap.id === 0 ? 1 : cap.id) * 20 - 10} cy="80" r="5" fill={cap.color} stroke="black" strokeWidth="1" />
                })}
            </g>
        </svg>
    )
}

export function FarnsworthD15Test() {
    const pilotCap = MOCK_D15_CAPS.find(cap => cap.id === 0)!;
    const arrangeableCaps = MOCK_D15_CAPS.filter(cap => cap.id !== 0);
    const [caps, setCaps] = useState(() => shuffle([...arrangeableCaps]));
    const [isComplete, setIsComplete] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: any) {
        const { active, over } = event;
        if (active.id !== over.id) {
            setCaps((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    const handleSubmit = () => {
        setIsComplete(true);
    }
    
    const restartTest = () => {
        setIsComplete(false);
        setCaps(shuffle([...arrangeableCaps]));
    }

    const userOrder = [pilotCap, ...caps];
    const correctOrder = MOCK_D15_CAPS;
    
    const errors = userOrder.reduce((acc, cap, index) => {
        if (index === 0) return acc; // Skip pilot cap
        const correctPrevId = correctOrder.findIndex(c => c.id === userOrder[index-1].id);
        const correctCurrentId = correctOrder.findIndex(c => c.id === cap.id);
        if (Math.abs(correctCurrentId - correctPrevId) > 1) {
             acc++;
        }
        return acc;
    }, 0);


    if (isComplete) {
         return (
             <Card className="mx-auto max-w-2xl text-center">
                 <CardHeader>
                    <CardTitle>D-15 Test Results</CardTitle>
                 </CardHeader>
                 <CardContent>
                     <p className="mb-4">The chart below shows your arrangement. Lines that cross over indicate a potential color vision deficiency.</p>
                     <div className="border rounded-lg p-4 bg-white">
                        <ResultChart userOrder={userOrder} correctOrder={correctOrder}/>
                     </div>
                     <div className="mt-4">
                        <p className="font-semibold text-lg">{errors > 2 ? "Major errors detected" : errors > 0 ? "Minor errors detected" : "No significant errors detected"}</p>
                        <p className="text-muted-foreground text-sm">{errors > 2 ? "This pattern suggests a moderate to severe color vision deficiency." : errors > 0 ? "This may indicate a mild color vision deficiency." : "Your arrangement appears normal."}</p>
                     </div>
                     <Alert variant="destructive" className="mt-4 text-left">
                        <AlertTitle>Disclaimer</AlertTitle>
                        <AlertDescription>This is a screening tool. For an accurate diagnosis, please consult a qualified eye care professional who can administer a physical test.</AlertDescription>
                    </Alert>
                     <Button onClick={restartTest} className="mt-6">
                        <RefreshCw className="mr-2 h-4 w-4" /> Restart Test
                    </Button>
                 </CardContent>
             </Card>
         );
    }

    return (
        <div className="space-y-6">
            <Alert>
                <AlertTitle>Instructions</AlertTitle>
                <AlertDescription>
                    Drag and drop the colored caps from the bottom row to arrange them in order of color, starting from the fixed pilot cap.
                </AlertDescription>
            </Alert>
            <Card>
                <CardHeader>
                    <CardTitle>Pilot Cap</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-wrap gap-3">
                        <div style={{ backgroundColor: pilotCap.color }} className="h-12 w-12 rounded-full border-2 border-gray-500">
                             <div className="flex h-full w-full items-center justify-center text-white font-bold drop-shadow-md">P</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Arrangeable Caps</CardTitle>
                </CardHeader>
                <CardContent>
                     <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={caps}>
                            <div className="flex flex-wrap gap-3">
                                {caps.map(cap => <SortableCap key={cap.id} cap={cap} />)}
                            </div>
                        </SortableContext>
                    </DndContext>
                </CardContent>
            </Card>
            <Button onClick={handleSubmit} className="w-full">Submit Arrangement</Button>
        </div>
    );
}
