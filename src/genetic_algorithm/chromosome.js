import { DRUM_PARAMS, GA_PARAMS } from './params.js';
export class Chromosome {
    constructor(pattern = null) {
        this.fitness = 0;
        this.pattern = pattern || this.generateRandomPattern();
    }

    generateRandomPattern() {
        const pattern = {};
        for (const instrument in DRUM_PARAMS.instruments) {
            pattern[instrument] = Array(DRUM_PARAMS.stepsPerBar).fill(0).map(() => {
                // 70% chance of no hit, 30% chance of a hit with random velocity
                return Math.random() > 0.7 ?
                    this.getRandomVelocity() :
                    DRUM_PARAMS.velocityLevels.none;
            });
        }
        return pattern;
    }

    getRandomVelocity() {
        const velocities = Object.values(DRUM_PARAMS.velocityLevels).filter(v => v > 0);
        return velocities[Math.floor(Math.random() * velocities.length)];
    }

    mutate(mutationRate) {
        const mutatedPattern = JSON.parse(JSON.stringify(this.pattern));

        for (const instrument in mutatedPattern) {
            mutatedPattern[instrument] = mutatedPattern[instrument].map(velocity => {
                if (Math.random() < mutationRate) {
                    // 50% chance to zero out, 50% chance for new random velocity
                    return Math.random() < 0.5 ?
                        DRUM_PARAMS.velocityLevels.none :
                        this.getRandomVelocity();
                }
                return velocity;
            });
        }

        this.pattern = mutatedPattern;
    }

    static crossover(parent1, parent2) {
        const child1Pattern = {};
        const child2Pattern = {};

        for (const instrument in DRUM_PARAMS.instruments) {
            // Randomly select crossover point
            const crossPoint = Math.floor(Math.random() * DRUM_PARAMS.stepsPerBar);

            child1Pattern[instrument] = [
                ...parent1.pattern[instrument].slice(0, crossPoint),
                ...parent2.pattern[instrument].slice(crossPoint)
            ];

            child2Pattern[instrument] = [
                ...parent2.pattern[instrument].slice(0, crossPoint),
                ...parent1.pattern[instrument].slice(crossPoint)
            ];
        }

        return [
            new Chromosome(child1Pattern),
            new Chromosome(child2Pattern)
        ];
    }

    clone() {
        return new Chromosome(JSON.parse(JSON.stringify(this.pattern)));
    }
}

