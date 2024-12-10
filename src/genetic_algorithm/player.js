import * as Tone from 'tone';
import { DRUM_PARAMS } from './params.js';

class DrumPlayer {
    constructor() {
        this.sampler = null;
        this.playing = false;
        this.pattern = null;
        this.step = 0;
    }

    async initialize() {
        await Tone.start();
        this.sampler = new Tone.Sampler({
            urls: {
                "C1": "kick.wav",
                "D1": "snare.wav",
                "F#1": "hihat.wav",
                "G#1": "openhat.wav"
            },
            baseUrl: "samples/",
            onload: () => console.log("Samples loaded"),
            onerror: (error) => console.error("Error loading samples:", error)
        }).toDestination();
    }

    loadPattern(pattern) {
        this.pattern = pattern;
        this.step = 0;
    }

    async start() {
        if (!this.sampler || !this.pattern || this.playing) return;

        this.playing = true;
        Tone.Transport.bpm.value = 120;

        Tone.Transport.scheduleRepeat((time) => {
            this.playStep(time);
            this.step = (this.step + 1) % DRUM_PARAMS.stepsPerBar;
        }, "16n");

        Tone.Transport.start();
    }

    stop() {
        this.playing = false;
        Tone.Transport.stop();
        Tone.Transport.cancel();
        this.step = 0;
    }

    playStep(time) {
        if (!this.sampler) return;

        for (const [instrument, note] of Object.entries(DRUM_PARAMS.instruments)) {
            const velocity = this.pattern[instrument][this.step];
            if (velocity > 0) {
                this.sampler.triggerAttackRelease(note, "16n", time, velocity / 127);
            }
        }
    }
}

export default DrumPlayer;