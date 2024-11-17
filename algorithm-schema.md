# Drum Pattern Evolution Parameters

## Basic Parameters
```javascript
const DRUM_PARAMS = {
    instruments: {
        kick: 'C1',
        snare: 'D1',
        hihat: 'F#1',
        openhat: 'G#1'
    },

    velocityLevels: {
        none: 0,
        ghost: 30,     // Very soft (ghost notes)
        soft: 60,      // Normal soft hit
        normal: 90,    // Standard hit
        accent: 127    // Strong accent
    },

    // Standard beat division
    stepsPerBar: 16,   // 16th note resolution
    beatsPerBar: 4,
    totalBars: 1
}
```

## Pattern Structure

```javascript
type DrumPattern = {
    kick:    [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],  // 0-127 values
    snare:   [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],  // 0-127 values
    hihat:   [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],  // 0-127 values
    openhat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]   // 0-127 values
}
```
## Genetic Algorithm Parameters

```javascript
const GA_PARAMS = {
    populationSize: 16,
    mutationRate: 0.05,
    crossoverRate: 0.7,
    elitismCount: 2,

    fitnessRules: {
        // Basic rhythm rules
        kickOnDownbeat: 2,         // Reward kicks on beats 1 and 3
        snareOnUpbeat: 2,          // Reward snares on 2 and 4
        hihatContinuity: 1,        // Reward consistent hi-hat patterns
        
        // Dynamic rules
        kickAccent: 1.5,           // Reward accented kicks on 1
        snareGhostNotes: 1.5,      // Reward ghost notes between main hits
        velocityVariation: 1,      // Reward interesting dynamic patterns
        
        // Pattern rules
        syncopation: 1,            // Reward off-beat accents
        complexity: 1,             // Balance between sparse and dense
        naturalFlow: 1.5           // Reward human-like velocity changes
    },

    // Template patterns for initial population seeding
    templatePatterns: {
        basic: {
            kick:  [127,0,0,0, 0,0,0,0, 127,0,0,0, 0,0,0,0],
            snare: [0,0,0,0, 127,0,0,0, 0,0,0,0, 127,0,0,0],
            hihat: [90,60,90,60, 90,60,90,60, 90,60,90,60, 90,60,90,60]
        },
        ghostNotes: {
            kick:  [127,0,0,0, 0,0,0,0, 127,0,0,0, 0,0,0,0],
            snare: [0,0,30,0, 127,0,30,0, 0,0,30,0, 127,0,30,0],
            hihat: [90,60,90,60, 90,60,90,60, 90,60,90,60, 90,60,90,60]
        }
    }
}
```