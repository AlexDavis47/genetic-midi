import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Slider } from "./ui/slider";
import DrumPatternGrid from './DrumPatternGrid';
import PlaybackControls from './PlaybackControls';

const PatternViewer = ({
                           pattern,
                           currentStep,
                           selectedIndex,
                           totalPatterns,
                           instruments,
                           isPlaying,
                           onPlayPause,
                           onNext,
                           onRating,
                           chromosome
                       }) => {
    const stats = {
        totalHits: Object.values(pattern).reduce((sum, track) =>
            sum + track.filter(v => v > 0).length, 0),
        avgVelocity: Object.values(pattern).reduce((sum, track) =>
                sum + track.reduce((s, v) => s + v, 0), 0) /
            Object.values(pattern).reduce((sum, track) =>
                sum + track.filter(v => v > 0).length, 0),
        kickCount: pattern.kick?.filter(v => v > 0).length || 0,
        snareCount: pattern.snare?.filter(v => v > 0).length || 0,
        hihatCount: pattern.hihat?.filter(v => v > 0).length || 0
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pattern Viewer</CardTitle>
                <CardDescription>Pattern {selectedIndex + 1}/{totalPatterns}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-sm space-y-1">
                            <div className="font-medium">Pattern Statistics:</div>
                            <div>Fitness Score: {chromosome?.fitness?.toFixed(2) || 0}</div>
                            <div>Rating: {chromosome?.rating || 0}/10</div>
                            <div>Total Hits: {stats.totalHits}</div>
                            <div>Avg Velocity: {stats.avgVelocity?.toFixed(1) || 0}</div>
                        </div>
                        <div className="text-sm space-y-1">
                            <div className="font-medium">Hit Counts:</div>
                            <div>Kick: {stats.kickCount}</div>
                            <div>Snare: {stats.snareCount}</div>
                            <div>Hi-hat: {stats.hihatCount}</div>
                        </div>
                    </div>

                    <DrumPatternGrid
                        pattern={pattern}
                        currentStep={currentStep}
                        instruments={instruments}
                    />
                    <PlaybackControls
                        isPlaying={isPlaying}
                        onPlayPause={onPlayPause}
                        onNext={onNext}
                    />
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Rate this pattern:</p>
                        <Slider
                            defaultValue={[chromosome?.rating || 0]}
                            max={10}
                            step={1}
                            onValueChange={onRating}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PatternViewer;