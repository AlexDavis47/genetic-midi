import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const PatternControls = ({
                             onNewGeneration,
                             onReset,
                             mutationRate,
                             crossoverRate,
                             onMutationChange,
                             onCrossoverChange,
                             numGenerations,
                             onGenerationsChange,
                             bpm,
                             onBpmChange,
                             timeSignature,
                             onTimeSignatureChange,
                             stepsPerBeat,
                             onStepsPerBeatChange
                         }) => {
    return (
        <Tabs defaultValue="parameters">
            <TabsList className="w-full">
                <TabsTrigger value="parameters" className="flex-1">Parameters</TabsTrigger>
                <TabsTrigger value="evolution" className="flex-1">Evolution</TabsTrigger>
                <TabsTrigger value="rhythm" className="flex-1">Rhythm</TabsTrigger>
            </TabsList>

            <TabsContent value="parameters" className="space-y-4">
                <div>
                    <label className="text-sm font-medium">Mutation Rate</label>
                    <Slider
                        value={[mutationRate]}
                        max={10}
                        step={1}
                        className="w-full"
                        onValueChange={onMutationChange}
                    />
                </div>
                <div>
                    <label className="text-sm font-medium">Crossover Rate</label>
                    <Slider
                        value={[crossoverRate]}
                        max={10}
                        step={1}
                        className="w-full"
                        onValueChange={onCrossoverChange}
                    />
                </div>
            </TabsContent>

            <TabsContent value="evolution" className="space-y-4">
                <div>
                    <label className="text-sm font-medium">Number of Generations</label>
                    <Input
                        type="number"
                        value={numGenerations}
                        onChange={(e) => onGenerationsChange(parseInt(e.target.value) || 1)}
                        min="1"
                        className="mt-2"
                    />
                </div>
                <Button className="w-full" onClick={() => onNewGeneration(numGenerations)}>
                    Generate {numGenerations} Generation{numGenerations > 1 ? 's' : ''}
                </Button>
                <Button variant="outline" className="w-full" onClick={onReset}>
                    Reset Evolution
                </Button>
            </TabsContent>

            <TabsContent value="rhythm" className="space-y-4">
                <div>
                    <label className="text-sm font-medium">BPM</label>
                    <Input
                        type="number"
                        value={bpm}
                        onChange={(e) => onBpmChange(parseInt(e.target.value) || 120)}
                        min="40"
                        max="300"
                        className="mt-2"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium">Time Signature</label>
                    <Select value={timeSignature} onValueChange={onTimeSignatureChange}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="3/4">3/4</SelectItem>
                            <SelectItem value="4/4">4/4</SelectItem>
                            <SelectItem value="5/4">5/4</SelectItem>
                            <SelectItem value="6/8">6/8</SelectItem>
                            <SelectItem value="7/8">7/8</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="text-sm font-medium">Steps Per Beat</label>
                    <Select value={stepsPerBeat} onValueChange={onStepsPerBeatChange}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2">2 (8th notes)</SelectItem>
                            <SelectItem value="3">3 (triplets)</SelectItem>
                            <SelectItem value="4">4 (16th notes)</SelectItem>
                            <SelectItem value="6">6 (sextuplets)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </TabsContent>
        </Tabs>
    );
};

export default PatternControls;