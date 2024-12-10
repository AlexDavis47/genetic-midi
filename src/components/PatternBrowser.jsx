// components/PatternBrowser.jsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";

const PatternBrowser = ({ patterns, selectedPattern, onPatternSelect }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Pattern Browser</CardTitle>
                <CardDescription>View and select patterns from the current generation</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    {patterns.map((pattern, index) => (
                        <Button
                            key={`pattern-${pattern.id}-${index}`}
                            variant={selectedPattern === index ? "default" : "outline"}
                            className="w-full h-24 flex flex-col items-center justify-center"
                            onClick={() => onPatternSelect(index)}
                        >
                            <span className="text-lg font-bold">{index + 1}</span>
                            <span className="text-sm">Rating: {pattern.rating || 0}/10</span>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default PatternBrowser;