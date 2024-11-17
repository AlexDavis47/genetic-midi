import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Slider } from "./ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Play, Square, SkipForward } from 'lucide-react';
import { generateInitialPopulation, type Population } from '../utils/patternGenerator';
import audioEngine from '../utils/audioEngine';

const DrumPatternInterface = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentGeneration, setCurrentGeneration] = useState(1);
    const [selectedPattern, setSelectedPattern] = useState(0);
    const [population, setPopulation] = useState<Population[]>([]);

    useEffect(() => {
        const initialPopulation = generateInitialPopulation(16);
        setPopulation(initialPopulation);
    }, []);

    const handlePlayPause = async () => {
        if (population.length === 0) return;

        setIsPlaying(!isPlaying);
        await audioEngine.playPattern(population[selectedPattern].pattern);
    };

    const handleNextPattern = () => {
        audioEngine.stop();
        setIsPlaying(false);
        setSelectedPattern((prev) => (prev + 1) % population.length);
    };

    const handlePatternRating = (value: number[]) => {
        if (population.length === 0) return;

        const newPopulation = [...population];
        newPopulation[selectedPattern].rating = value[0];
        setPopulation(newPopulation);
    };

    const getVelocityColor = (velocity: number) => {
        if (velocity === 0) return 'bg-slate-100';
        if (velocity < 60) return 'bg-blue-200';
        if (velocity < 90) return 'bg-blue-300';
        return 'bg-blue-500';
    };

    const instruments = ['kick', 'snare', 'hihat', 'openhat'];

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold">Drum Pattern Evolution</h1>
                    <p className="text-slate-600">Generation {currentGeneration}</p>
                </div>

                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Pattern Viewer</CardTitle>
                        <CardDescription>
                            Pattern {selectedPattern + 1}/16
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Pattern Grid */}
                            <div className="relative overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                    <tr>
                                        <th className="w-24 px-2 py-1 text-left">Instrument</th>
                                        {Array.from({ length: 16 }, (_, i) => (
                                            <th key={i} className="w-12 px-1 py-1 text-center text-sm">
                                                {i + 1}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {instruments.map((instrument) => (
                                        <tr key={instrument}>
                                            <td className="px-2 py-1 font-medium capitalize">
                                                {instrument}
                                            </td>
                                            {population[selectedPattern]?.pattern[instrument]?.map((velocity, i) => (
                                                <td key={i} className="px-1 py-1">
                                                    <div
                                                        className={`w-full h-8 ${getVelocityColor(velocity)} rounded-sm 
                                ${i % 4 === 0 ? 'border-l-2 border-slate-400' : ''}`}
                                                        title={`Velocity: ${velocity}`}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Playback Controls */}
                            <div className="flex items-center justify-center space-x-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handlePlayPause}
                                >
                                    {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleNextPattern}
                                >
                                    <SkipForward className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Pattern Rating */}
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Rate this pattern:</p>
                                <Slider
                                    defaultValue={[0]}
                                    max={10}
                                    step={1}
                                    onValueChange={handlePatternRating}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DrumPatternInterface;