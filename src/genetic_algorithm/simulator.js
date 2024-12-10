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
            .map(() => new Chromosome());
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
        this.manualRatings.clear();
        // Wait for user ratings to be provided
        // This will be connected to UI later
        return new Promise(resolve => {
            // Temporary mock implementation
            this.population.forEach(chromosome => {
                chromosome.fitness = 0; // Will be set by UI
            });
            resolve();
        });
    }

    calculateFitness(pattern) {
        let fitness = 0;
        const rules = GA_PARAMS.fitnessRules;

        // Evaluate kick on downbeat
        if (rules.kickOnDownbeat) {
            const downbeats = [0, 8]; // Beats 1 and 3 in 16th notes
            fitness += downbeats.reduce((sum, beat) =>
                sum + (pattern.kick[beat] > 0 ? rules.kickOnDownbeat : 0), 0);
        }

        // Add other rule evaluations here...

        return fitness;
    }

    createNextGeneration() {
        const nextGeneration = [];

        // Sort by fitness
        this.population.sort((a, b) => b.fitness - a.fitness);

        // Elitism
        for (let i = 0; i < GA_PARAMS.elitismCount; i++) {
            nextGeneration.push(this.population[i].clone());
        }

        // Fill rest with crossover
        while (nextGeneration.length < GA_PARAMS.populationSize) {
            const parent1 = this.selectParent();
            const parent2 = this.selectParent();

            const [child1, child2] = Chromosome.crossover(parent1, parent2);

            if (Math.random() < GA_PARAMS.mutationRate) child1.mutate(GA_PARAMS.mutationRate);
            if (Math.random() < GA_PARAMS.mutationRate) child2.mutate(GA_PARAMS.mutationRate);

            nextGeneration.push(child1);
            if (nextGeneration.length < GA_PARAMS.populationSize) {
                nextGeneration.push(child2);
            }
        }

        this.population = nextGeneration;
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