// components/DrumPatternGrid.jsx
const DrumPatternGrid = ({ pattern, currentStep, instruments }) => {
    const getVelocityColor = (velocity) => {
        if (velocity === 0) return 'bg-slate-100';
        if (velocity < 60) return 'bg-blue-200';
        if (velocity < 90) return 'bg-blue-300';
        return 'bg-blue-500';
    };

    return (
        <div className="relative overflow-x-auto">
            <table className="w-full">
                <thead>
                <tr>
                    <th className="w-24 px-2 py-1 text-left">Instrument</th>
                    {Array.from({ length: 16 }, (_, i) => (
                        <th key={i} className="w-12 px-1 py-1 text-center text-sm">
                            {i + 1}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {instruments.map((instrument) => (
                    <tr key={instrument}>
                        <td className="px-2 py-1 font-medium capitalize">
                            {instrument}
                        </td>
                        {pattern[instrument]?.map((velocity, i) => (
                            <td key={i} className="px-1 py-1 relative">
                                <div
                                    className={`w-full h-8 ${getVelocityColor(velocity)} rounded-sm
                      ${i % 4 === 0 ? 'border-l-2 border-slate-400' : ''}
                      ${currentStep === i ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                                    title={`Velocity: ${velocity}`}
                                />
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default DrumPatternGrid;