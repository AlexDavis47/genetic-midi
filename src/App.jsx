import { useState } from 'react';
import DrumPatternSimulator from './genetic_algorithm/simulator';
import DrumPlayer from './genetic_algorithm/player';

const App = () => {
    const [simulator] = useState(() => new DrumPatternSimulator());
    const [player] = useState(() => new DrumPlayer());
    const [isPlaying, setIsPlaying] = useState(false);
    const [bestPattern, setBestPattern] = useState(null);
    const [isEvolved, setIsEvolved] = useState(false);

    const handleEvolve = async () => {
        await simulator.evolve(10, 'automatic');
        const population = simulator.getCurrentPopulation();
        setBestPattern(population[0].pattern);
        setIsEvolved(true);
    };

    const handlePlay = async () => {
        if (!isEvolved) return;

        if (!isPlaying) {
            await player.initialize();
            player.loadPattern(bestPattern);
            await player.start();
        } else {
            player.stop();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Drum Pattern Evolution</h1>

            <div className="space-x-4 mb-4">
                <button
                    onClick={handleEvolve}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Evolve Pattern
                </button>

                <button
                    onClick={handlePlay}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    disabled={!isEvolved}
                >
                    {isPlaying ? 'Stop' : 'Play Pattern'}
                </button>
            </div>

            {bestPattern && (
                <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
          {JSON.stringify(bestPattern, null, 2)}
        </pre>
            )}
        </div>
    );
};

export default App;