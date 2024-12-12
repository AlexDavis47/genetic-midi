import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";

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
                        step={0.1}
                        className="w-full"
                        onValueChange={onMutationChange}
                    />
                </div>
                <div>
                    <label className="text-sm font-medium">Crossover Rate</label>
                    <Slider
                        value={[crossoverRate]}
                        max={10}
                        step={0.1}
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
            </TabsContent>
        </Tabs>
    );
};

export default PatternControls;