import * as Tone from 'tone';
import { DRUM_PARAMS } from './params';

class DrumPlayer {
    constructor() {
        this.sampler = null;
        this.playing = false;
        this.pattern = null;
        this.step = 0;
        this.isInitialized = false;
        this.currentStepDuration = "8n";
    }

    updateTimingParams() {
        const stepsPerBeat = DRUM_PARAMS.stepsPerBar / DRUM_PARAMS.beatsPerBar;
        switch(stepsPerBeat) {
            case 2: this.currentStepDuration = "8n"; break;
            case 3: this.currentStepDuration = "8t"; break;
            case 4: this.currentStepDuration = "16n"; break;
            case 6: this.currentStepDuration = "16t"; break;
            default: this.currentStepDuration = "16n";
        }

        if (this.playing) {
            this.stop();
            this.start();
        }
    }

    async initialize() {
        if (this.isInitialized) return;
        await Tone.start();

        this.sampler = new Tone.Sampler({
            urls: {
                "C1": "kick.wav",
                "D1": "snare.wav",
                "F#1": "hihat.wav",
                "G#1": "openhat.wav"
            },
            baseUrl: "samples/",
            onload: () => {
                console.log("Samples loaded");
                this.isInitialized = true;
            }
        }).toDestination();
    }

    async start() {
        if (!this.sampler || !this.pattern || this.playing) return;

        if (!this.isInitialized) {
            await this.initialize();
        }

        this.playing = true;
        const repeat = time => {
            this.playStep(time);
            this.step = (this.step + 1) % DRUM_PARAMS.stepsPerBar;
        };

        Tone.Transport.scheduleRepeat(repeat, this.currentStepDuration);
        Tone.Transport.start();
    }

    stop() {
        if (!this.playing) return;
        this.playing = false;
        Tone.Transport.stop();
        Tone.Transport.cancel();
        if (this.sequence) {
            this.sequence.dispose();
            this.sequence = null;
        }
        this.step = 0;
    }

    loadPattern(pattern) {
        if (this.sequence) {
            this.sequence.dispose();
        }

        this.pattern = pattern;
        console.log("Loaded pattern", pattern);
        this.step = 0;
    }

    playStep(time) {
        if (!this.sampler) return;

        for (const [instrument, note] of Object.entries(DRUM_PARAMS.instruments)) {
            const velocity = this.pattern[instrument][this.step];
            if (velocity > 0) {
                this.sampler.triggerAttackRelease(
                    note,
                    1,
                    time,
                    velocity / 127
                );
            }
        }
    }
}

export default DrumPlayer;