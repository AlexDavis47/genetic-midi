import DrumPatternSimulator from './simulator.js';
import DrumPlayer from './player.js';

async function runTest() {
    const simulator = new DrumPatternSimulator();
    const player = new DrumPlayer();

    await player.initialize();
    await simulator.evolve(10, 'automatic');

    const bestPattern = simulator.getCurrentPopulation()[0];
    console.log('Best pattern:', bestPattern.pattern);

    player.loadPattern(bestPattern.pattern);
    await player.start();

    setTimeout(() => {
        player.stop();
    }, 8000);
}

runTest().catch(console.error);