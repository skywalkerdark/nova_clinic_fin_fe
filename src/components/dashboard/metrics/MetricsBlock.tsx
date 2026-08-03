"use client";

export const MetricsBlock = () => {
    return (
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
            <div className="h-24 bg-gray-800/30 border border-gray-800 rounded-xl flex items-center justify-center text-gray-600 text-xs font-mono">
                [ METRIC 1 ]
            </div>
            <div className="h-24 bg-gray-800/30 border border-gray-800 rounded-xl flex items-center justify-center text-gray-600 text-xs font-mono">
                [ METRIC 2 ]
            </div>
            <div className="h-24 bg-gray-800/30 border border-gray-800 rounded-xl flex items-center justify-center text-gray-600 text-xs font-mono">
                [ METRIC 3 ]
            </div>
            <div className="h-24 bg-gray-800/30 border border-gray-800 rounded-xl flex items-center justify-center text-gray-600 text-xs font-mono">
                [ METRIC 4 ]
            </div>
        </section>
    );
};
