// components/PlaybackControls.jsx
import { Button } from "./ui/button";
import { Play, Square, SkipForward } from 'lucide-react';

const PlaybackControls = ({ isPlaying, onPlayPause, onNext }) => {
    return (
        <div className="flex items-center justify-center space-x-4">
            <Button
                variant="outline"
                size="icon"
                onClick={onPlayPause}
            >
                {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={onNext}
            >
                <SkipForward className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default PlaybackControls;