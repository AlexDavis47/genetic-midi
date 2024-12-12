import { DRUM_PARAMS, GA_PARAMS } from './params.js';
import { Chromosome } from './chromosome.js';

class DrumPatternSimulator {
    constructor() {
        this.population = [];
        this.generation = 0;
        this.mode = 'automatic';
        this.manualRatings = new Map();
        this.initialize();
    }

    initialize() {
        this.population = Array(GA_PARAMS.populationSize)
            .fill(null)
            .map(() => this.createChromosome());
    }

    createChromosome() {
        const pattern = {};
        for (const instrument in DRUM_PARAMS.instruments) {
            pattern[instrument] = Array(DRUM_PARAMS.stepsPerBar).fill(0).map(() => {
                return Math.random() > 0.7 ?
                    this.getRandomVelocity() :
                    DRUM_PARAMS.velocityLevels.none;
            });
        }
        return {
            id: Math.random().toString(36).substr(2, 9),
            pattern,
            rating: 0,
            fitness: 0
        };
    }

    cloneChromosome(chromosome) {
        return {
            id: Math.random().toString(36).substr(2, 9),
            pattern: JSON.parse(JSON.stringify(chromosome.pattern)),
            rating: chromosome.rating,
            fitness: chromosome.fitness
        };
    }

    createNextGeneration() {
        // Convert ratings to fitness scores
        if (this.mode === 'manual') {
            this.population.forEach(chromosome => {
                chromosome.fitness = chromosome.rating;
            });
        }

        const nextGeneration = [];
        this.population.sort((a, b) => b.fitness - a.fitness);


        // Elitism
        for (let i = 0; i < GA_PARAMS.elitismCount; i++) {
            nextGeneration.push(this.cloneChromosome(this.population[i]));
        }

        // Fill rest with crossover
        while (nextGeneration.length < GA_PARAMS.populationSize) {
            const parent1 = this.selectParent();
            const parent2 = this.selectParent();

            if (Math.random() < GA_PARAMS.crossoverRate) {
                const [child1, child2] = this.crossover(parent1, parent2);
                nextGeneration.push(this.mutate(child1));
                if (nextGeneration.length < GA_PARAMS.populationSize) {
                    nextGeneration.push(this.mutate(child2));
                }
            } else {
                nextGeneration.push(this.mutate(this.cloneChromosome(parent1)));
                if (nextGeneration.length < GA_PARAMS.populationSize) {
                    nextGeneration.push(this.mutate(this.cloneChromosome(parent2)));
                }
            }
        }

        this.population = nextGeneration;
    }
    getRandomVelocity() {
        const velocities = Object.values(DRUM_PARAMS.velocityLevels).filter(v => v > 0);
        return velocities[Math.floor(Math.random() * velocities.length)];
    }

    crossover(parent1, parent2) {
        if (Math.random() > GA_PARAMS.crossoverRate) {
            return [this.cloneChromosome(parent1), this.cloneChromosome(parent2)];
        }

        const child1Pattern = {};
        const child2Pattern = {};

        for (const instrument in DRUM_PARAMS.instruments) {
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
            { id: Math.random().toString(36).substr(2, 9), pattern: child1Pattern, rating: 0, fitness: 0 },
            { id: Math.random().toString(36).substr(2, 9), pattern: child2Pattern, rating: 0, fitness: 0 }
        ];
    }

    mutate(chromosome) {
        const mutatedPattern = JSON.parse(JSON.stringify(chromosome.pattern));

        for (const instrument in mutatedPattern) {
            mutatedPattern[instrument] = mutatedPattern[instrument].map(velocity => {
                if (Math.random() < GA_PARAMS.mutationRate) {
                    return Math.random() < 0.5 ?
                        DRUM_PARAMS.velocityLevels.none :
                        this.getRandomVelocity();
                }
                return velocity;
            });
        }

        return {
            ...chromosome,
            pattern: mutatedPattern
        };
    }

    async evolve(generations = 1, mode = 'automatic') {
        this.mode = mode;

        for (let i = 0; i < generations; i++) {
            if (mode === 'automatic') {
                await this.automaticSelection();
            } else {
                await this.manualSelection();
            }

            this.createNextGeneration();
            this.generation++;
        }
    }

    async automaticSelection() {
        this.population.forEach(chromosome => {
            chromosome.fitness = this.calculateFitness(chromosome.pattern);
        });
    }

    async manualSelection() {
        this.population.forEach(chromosome => {
            chromosome.fitness = chromosome.rating;
        });
    }

    calculateFitness(pattern) {
        let fitness = 0;
        const rules = GA_PARAMS.fitnessRules;
        const stepsPerBeat = DRUM_PARAMS.stepsPerBar / DRUM_PARAMS.beatsPerBar;

        // Rhythmic Structure (30% of score)
        // Kick on downbeat
        const downbeats = Array.from({length: DRUM_PARAMS.beatsPerBar}, (_, i) => i * stepsPerBeat);
        const kickDownbeats = downbeats.reduce((sum, beat) =>
            sum + (pattern.kick[beat] > 0 ? 3 : 0), 0);

        // Snare on upbeat (beats 2 and 4)
        const upbeats = Array.from({length: DRUM_PARAMS.beatsPerBar/2}, (_, i) => (i * stepsPerBeat * 2) + stepsPerBeat);
        const snareUpbeats = upbeats.reduce((sum, beat) =>
            sum + (pattern.snare[Math.floor(beat)] > 0 ? 3 : 0), 0);

        // Hi-hat pattern consistency
        const hihatPattern = this.evaluateHiHatPattern(pattern.hihat);

        // Density and Complexity (20% of score)
        const totalNotes = Object.values(pattern).reduce((sum, track) =>
            sum + track.filter(v => v > 0).length, 0);
        const densityScore = this.calculateDensityScore(totalNotes, DRUM_PARAMS.stepsPerBar);

        // Velocity Dynamics (20% of score)
        const velocityScore = this.evaluateVelocityDynamics(pattern);

        // Pattern Balance (30% of score)
        const balanceScore = this.evaluatePatternBalance(pattern);

        // Combine scores with weights
        fitness = (
            (kickDownbeats + snareUpbeats + hihatPattern) * 0.3 +
            densityScore * 0.2 +
            velocityScore * 0.2 +
            balanceScore * 0.3
        );

        return fitness * 10; // Scale to 0-100 range
    }

    evaluateHiHatPattern(hihat) {
        let score = 0;

        // Strongly reward 8th note patterns
        let eighthNoteCount = 0;
        for (let i = 0; i < hihat.length; i += 2) {
            if (hihat[i] > 0) eighthNoteCount++;
        }
        score += (eighthNoteCount / (hihat.length/2)) * 10;

        // Reward 16th note fills
        for (let i = 1; i < hihat.length; i += 2) {
            if (hihat[i] > 0) score += 0.5;
        }

        // Extra reward for velocity dynamics
        let lastVel = 0;
        for (let i = 0; i < hihat.length; i += 2) {
            if (hihat[i] > 0) {
                if (lastVel > 0 && hihat[i] !== lastVel) score += 1;
                lastVel = hihat[i];
            }
        }

        return score * 1.5; // Increased weight for hi-hat patterns
    }

    calculateDensityScore(totalNotes, totalSteps) {
        // Optimal density is around 40-60% of total possible hits
        const density = totalNotes / totalSteps;
        if (density < 0.2) return density * 50; // Too sparse
        if (density > 0.8) return (1 - density) * 50; // Too dense
        return 10 - Math.abs(0.5 - density) * 20; // Sweet spot around 50%
    }

    evaluateVelocityDynamics(pattern) {
        let score = 0;
        for (const instrument in pattern) {
            const velocities = pattern[instrument].filter(v => v > 0);
            if (velocities.length > 0) {
                // Reward velocity variation
                const uniqueVelocities = new Set(velocities).size;
                score += uniqueVelocities;

                // Reward accents on strong beats
                const strongBeats = [0, 4, 8, 12];
                strongBeats.forEach(beat => {
                    if (pattern[instrument][beat] > 90) score += 1;
                });
            }
        }
        return score;
    }

    evaluatePatternBalance(pattern) {
        let score = 0;

        // Check for kick-snare interaction
        for (let i = 0; i < pattern.kick.length; i++) {
            if (pattern.kick[i] > 0 && pattern.snare[i] === 0) score += 0.5;
            if (pattern.kick[i] === 0 && pattern.snare[i] > 0) score += 0.5;
        }

        // Reward syncopation
        const weakBeats = [1, 3, 5, 7, 9, 11, 13, 15];
        weakBeats.forEach(beat => {
            if (pattern.kick[beat] > 0 || pattern.snare[beat] > 0) score += 0.5;
        });

        // Penalize excessive repetition
        for (const instrument in pattern) {
            let repetitions = 0;
            for (let i = 1; i < pattern[instrument].length; i++) {
                if (pattern[instrument][i] === pattern[instrument][i-1]) repetitions++;
            }
            score -= repetitions * 0.2;
        }

        return Math.max(0, score);
    }

    selectParent() {
        // Tournament selection
        const tournamentSize = 3;
        let best = null;

        for (let i = 0; i < tournamentSize; i++) {
            const contestant = this.population[Math.floor(Math.random() * this.population.length)];
            if (!best || contestant.fitness > best.fitness) {
                best = contestant;
            }
        }

        return best;
    }

    getCurrentPopulation() {
        return this.population;
    }
}

export default DrumPatternSimulator;