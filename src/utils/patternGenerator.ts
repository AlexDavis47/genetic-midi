import { DRUM_PARAMS } from './constants';

export type DrumPattern = {
    kick: number[];
    snare: number[];
    hihat: number[];
    openhat: number[];
};

export type Population = {
    id: number;
    pattern: DrumPattern;
    fitness: number;
    rating: number;
};

// Generate a random velocity based on defined levels
const getRandomVelocity = () => {
    const velocities = [0, 30, 60, 90, 127]; // none, ghost, soft, normal, accent
    const randomIndex = Math.floor(Math.random() * velocities.length);
    return velocities[randomIndex];
};

// Generate a single random pattern
export const generateRandomPattern = (): DrumPattern => {
    const pattern: DrumPattern = {
        kick: Array(16).fill(0),
        snare: Array(16).fill(0),
        hihat: Array(16).fill(0),
        openhat: Array(16).fill(0)
    };

    // Generate kick pattern (emphasis on 1 and 3)
    for (let i = 0; i < 16; i++) {
        if (i % 4 === 0) { // Downbeats (1 and 3)
            pattern.kick[i] = Math.random() < 0.7 ? 127 : 0;
        } else {
            pattern.kick[i] = Math.random() < 0.2 ? getRandomVelocity() : 0;
        }
    }

    // Generate snare pattern (emphasis on 2 and 4)
    for (let i = 0; i < 16; i++) {
        if (i % 4 === 2) { // Upbeats (2 and 4)
            pattern.snare[i] = Math.random() < 0.8 ? 127 : 0;
        } else {
            pattern.snare[i] = Math.random() < 0.15 ? getRandomVelocity() : 0;
        }
    }

    // Generate hihat pattern (more consistent)
    for (let i = 0; i < 16; i++) {
        if (i % 2 === 0) { // Eighth notes
            pattern.hihat[i] = Math.random() < 0.9 ? 90 : 0;
        } else {
            pattern.hihat[i] = Math.random() < 0.6 ? 60 : 0;
        }
    }

    // Generate open hihat (sparse)
    for (let i = 0; i < 16; i++) {
        pattern.openhat[i] = Math.random() < 0.1 ? getRandomVelocity() : 0;
    }

    return pattern;
};

// Generate initial population
export const generateInitialPopulation = (size: number): Population[] => {
    return Array(size).fill(null).map((_, index) => ({
        id: index,
        pattern: generateRandomPattern(),
        fitness: 0,
        rating: 0
    }));
};