class AudioEngine {
    private context: AudioContext | null = null;
    private buffers: { [key: string]: AudioBuffer } = {};
    private isPlaying: boolean = false;
    private tempo: number = 120;
    private currentStep: number = 0;
    private intervalId: number | null = null;

    // Initialize context only after user interaction
    initContext() {
        if (!this.context) {
            this.context = new AudioContext();
            return this.loadSamples();
        }
        return Promise.resolve();
    }

    private async loadSamples() {
        // Temporary solution: generate simple tones instead of loading samples
        if (!this.context) return;

        const createTone = (frequency: number) => {
            const length = 0.1; // 100ms
            const sampleRate = this.context!.sampleRate;
            const samples = length * sampleRate;
            const buffer = this.context!.createBuffer(1, samples, sampleRate);
            const data = buffer.getChannelData(0);

            for (let i = 0; i < samples; i++) {
                data[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) *
                    Math.exp(-5 * i / samples); // Add decay
            }

            return buffer;
        };

        this.buffers = {
            kick: createTone(60),    // Low frequency for kick
            snare: createTone(200),  // Mid frequency for snare
            hihat: createTone(2000), // High frequency for hihat
            openhat: createTone(1500) // Slightly lower for open hihat
        };
    }

    private playSample(name: string, velocity: number) {
        if (!this.context || !this.buffers[name]) return;

        const source = this.context.createBufferSource();
        const gainNode = this.context.createGain();

        source.buffer = this.buffers[name];
        source.connect(gainNode);
        gainNode.connect(this.context.destination);

        // Convert MIDI velocity (0-127) to gain (0-1)
        gainNode.gain.value = (velocity / 127) * 0.3; // Reduced volume

        source.start(0);
    }

    async playPattern(pattern: any) {
        await this.initContext();

        if (this.isPlaying) {
            this.stop();
            return;
        }

        this.isPlaying = true;
        const stepTime = (60 / this.tempo) / 4 * 1000; // Convert to milliseconds

        this.intervalId = window.setInterval(() => {
            this.playStep(pattern, this.currentStep);
            this.currentStep = (this.currentStep + 1) % 16;
        }, stepTime);
    }

    playStep(pattern: any, step: number) {
        if (pattern.kick[step] > 0) this.playSample('kick', pattern.kick[step]);
        if (pattern.snare[step] > 0) this.playSample('snare', pattern.snare[step]);
        if (pattern.hihat[step] > 0) this.playSample('hihat', pattern.hihat[step]);
        if (pattern.openhat[step] > 0) this.playSample('openhat', pattern.openhat[step]);
    }

    stop() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isPlaying = false;
        this.currentStep = 0;
    }

    setTempo(bpm: number) {
        this.tempo = bpm;
    }
}

export default new AudioEngine();