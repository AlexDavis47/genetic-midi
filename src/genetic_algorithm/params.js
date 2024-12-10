export const DRUM_PARAMS = {
    instruments: {
        kick: 'C1',
        snare: 'D1',
        hihat: 'F#1',
        openhat: 'G#1'
    },

    velocityLevels: {
        none: 0,
        ghost: 30,
        soft: 60,
        normal: 90,
        accent: 127
    },

    stepsPerBar: 16,
    beatsPerBar: 4,
    totalBars: 1
};

export const GA_PARAMS = {
    populationSize: 16,
    mutationRate: 0.05,
    crossoverRate: 0.7,
    elitismCount: 2,
    fitnessRules: {
        kickOnDownbeat: 2,
        snareOnUpbeat: 2,
        hihatContinuity: 1,
        kickAccent: 1.5,
        snareGhostNotes: 1.5,
        velocityVariation: 1,
        syncopation: 1,
        complexity: 1,
        naturalFlow: 1.5
    }
};