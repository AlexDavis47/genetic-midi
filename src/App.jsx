import { useState, useEffect } from 'react';
import PatternViewer from './components/PatternViewer';
import PatternControls from './components/PatternControls';
import PatternBrowser from './components/PatternBrowser';
import DrumPatternSimulator from './genetic_algorithm/simulator';
import DrumPlayer from './genetic_algorithm/player';
import * as Tone from 'tone';
import { DRUM_PARAMS, GA_PARAMS } from './genetic_algorithm/params';

const App = () => {
    const [simulator] = useState(() => new DrumPatternSimulator());
    const [player] = useState(() => new DrumPlayer());
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(-1);
    const [selectedPattern, setSelectedPattern] = useState(0);
    const [generation, setGeneration] = useState(1);
    const [population, setPopulation] = useState([]);
    const [mutationRate, setMutationRate] = useState(5);
    const [crossoverRate, setCrossoverRate] = useState(7);
    const [numGenerations, setNumGenerations] = useState(1);
    const [bpm, setBpm] = useState(DRUM_PARAMS.bpm);
    const [timeSignature, setTimeSignature] = useState('4/4');
    const [stepsPerBeat, setStepsPerBeat] = useState('4');

    const instruments = ['kick', 'snare', 'hihat', 'openhat'];

    useEffect(() => {
        setPopulation(simulator.getCurrentPopulation());
    }, []);

    useEffect(() => {
        if (isPlaying) {
            const updateStep = () => {
                // PPQ is 192 by default in Tone.js
                const ticks = Tone.Transport.ticks;
                const ticksPerStep = 192 / 4; // 16th notes
                const step = Math.floor(ticks / ticksPerStep) % DRUM_PARAMS.stepsPerBar;
                setCurrentStep(step);
            };
            const intervalId = setInterval(updateStep, 16);
            return () => clearInterval(intervalId);
        } else {
            setCurrentStep(-1);
        }
    }, [isPlaying]);

    useEffect(() => {
        GA_PARAMS.mutationRate = mutationRate / 10;
        GA_PARAMS.crossoverRate = crossoverRate / 10;
    }, [mutationRate, crossoverRate]);

    useEffect(() => {
        if (player) {
            Tone.Transport.bpm.value = bpm;
        }
    }, [bpm]);

    useEffect(() => {
        const [beats, division] = timeSignature.split('/').map(Number);
        DRUM_PARAMS.beatsPerBar = beats;
        DRUM_PARAMS.stepsPerBar = beats * Number(stepsPerBeat);
        if (player) player.updateTimingParams();
    }, [timeSignature, stepsPerBeat]);


    const startAudio = async () => {
        await Tone.start();
        if (!player.isInitialized) {
            await player.initialize();
        }
    };

    const handlePlayPause = async () => {
        if (!population.length) return;
        console.log('Play/Pause clicked');

        await startAudio();

        if (!isPlaying) {
            console.log('Starting playback', population[selectedPattern].pattern);
            player.loadPattern(population[selectedPattern].pattern);
            await player.start();
        } else {
            console.log('Stopping playback');
            player.stop();
        }
        setIsPlaying(!isPlaying);
    };

    const handlePatternSelect = async (index) => {
        player.stop();
        setIsPlaying(false);
        setSelectedPattern(index);
    };

    const handleNewGeneration = async (generations = 1) => {
        if (isPlaying) {
            await player.stop();
            setIsPlaying(false);
            setCurrentStep(-1);
        }
        await simulator.evolve(generations, 'automatic');
        setPopulation(simulator.getCurrentPopulation());
        setGeneration(prev => prev + generations);
    };


    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold">Drum Pattern Evolution</h1>
                    <p className="text-slate-600">Generation {generation}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <PatternViewer
                            pattern={population[selectedPattern]?.pattern || {}}
                            chromosome={population[selectedPattern]}
                            currentStep={currentStep}
                            selectedIndex={selectedPattern}
                            totalPatterns={population.length}
                            instruments={instruments}
                            isPlaying={isPlaying}
                            onPlayPause={handlePlayPause}
                            onNext={() => handlePatternSelect((selectedPattern + 1) % population.length)}
                            onRating={(value) => {
                                const newPop = [...population];
                                newPop[selectedPattern].rating = value[0];
                                setPopulation(newPop);
                            }}
                        />
                    </div>

                    <PatternControls
                        mutationRate={mutationRate}
                        crossoverRate={crossoverRate}
                        onMutationChange={(value) => setMutationRate(value[0])}
                        onCrossoverChange={(value) => setCrossoverRate(value[0])}
                        onNewGeneration={handleNewGeneration}
                        numGenerations={numGenerations}
                        onGenerationsChange={setNumGenerations}
                        bpm={bpm}
                        onBpmChange={setBpm}
                        timeSignature={timeSignature}
                        onTimeSignatureChange={setTimeSignature}
                        stepsPerBeat={stepsPerBeat}
                        onStepsPerBeatChange={setStepsPerBeat}
                        onReset={() => {
                            if (isPlaying) {
                                player.stop();
                                setIsPlaying(false);
                                setCurrentStep(-1);
                            }
                            simulator.initialize();
                            setPopulation(simulator.getCurrentPopulation());
                            setGeneration(1);
                            setSelectedPattern(0);
                        }}
                    />
                </div>

                <PatternBrowser
                    patterns={population}
                    selectedPattern={selectedPattern}
                    onPatternSelect={handlePatternSelect}
                />
            </div>
        </div>
    );
};

export default App;