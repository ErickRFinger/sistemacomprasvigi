import { Skeleton } from "./ui/skeleton";

export function AppSkeleton() {
    return (
        <div className="min-h-screen font-sans text-slate-100">
            {/* Header Skeleton */}
            <header className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-12 w-12 rounded-xl bg-slate-800/50" />
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-32 bg-slate-800/50" />
                                <Skeleton className="h-4 w-24 bg-slate-800/50" />
                            </div>
                        </div>
                        <Skeleton className="w-full md:w-96 h-12 rounded-xl bg-slate-800/50" />
                        <Skeleton className="h-10 w-28 rounded-xl bg-slate-800/50" />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Filters Skeleton */}
                <div className="space-y-6 mb-10">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20 bg-slate-800/50" />
                        <div className="flex gap-2 overflow-hidden">
                            <Skeleton className="h-10 w-24 rounded-xl bg-slate-800/50 shrink-0" />
                            <Skeleton className="h-10 w-32 rounded-xl bg-slate-800/50 shrink-0" />
                            <Skeleton className="h-10 w-28 rounded-xl bg-slate-800/50 shrink-0" />
                            <Skeleton className="h-10 w-24 rounded-xl bg-slate-800/50 shrink-0" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20 bg-slate-800/50" />
                        <div className="flex gap-2 overflow-hidden">
                            <Skeleton className="h-10 w-24 rounded-xl bg-slate-800/50 shrink-0" />
                            <Skeleton className="h-10 w-32 rounded-xl bg-slate-800/50 shrink-0" />
                            <Skeleton className="h-10 w-28 rounded-xl bg-slate-800/50 shrink-0" />
                        </div>
                    </div>
                </div>

                {/* Cards Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-slate-800/40 rounded-2xl h-[280px] border border-white/5 p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <Skeleton className="h-12 w-12 rounded-xl bg-slate-700/50" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-40 bg-slate-700/50" />
                                        <Skeleton className="h-4 w-20 bg-slate-700/50" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Skeleton className="h-4 w-full bg-slate-700/50" />
                                    <Skeleton className="h-4 w-2/3 bg-slate-700/50" />
                                </div>
                            </div>
                            <Skeleton className="h-12 w-full rounded-xl bg-slate-700/50" />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
