"use client";

export const MetricsBlock = () => {
    return (
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
            <div className="h-24 bg-white/80 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-mono shadow-sm">
                [ METRIC 1 ]
            </div>
            <div className="h-24 bg-white/80 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-mono shadow-sm">
                [ METRIC 2 ]
            </div>
            <div className="h-24 bg-white/80 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-mono shadow-sm">
                [ METRIC 3 ]
            </div>
            <div className="h-24 bg-white/80 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-mono shadow-sm">
                [ METRIC 4 ]
            </div>
        </section>
    );
};
