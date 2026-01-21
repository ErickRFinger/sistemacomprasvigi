import React from 'react';

interface FilterBarProps {
    title: string;
    options: string[];
    selected: string;
    onSelect: (option: string) => void;
    colorClass?: string;
    activeColorClass?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
    title,
    options,
    selected,
    onSelect,
    colorClass = 'bg-slate-800 text-slate-300 border-white/5',
    activeColorClass = 'bg-royal-DEFAULT text-white shadow-lg shadow-royal-DEFAULT/25'
}) => {
    return (
        <div className="flex flex-col space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{title}</span>
            <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar mask-fade-right">
                {options.map(option => (
                    <button
                        key={option}
                        onClick={() => onSelect(option)}
                        className={`
              px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300
              border
              ${selected === option
                                ? `${activeColorClass} border-transparent scale-105 font-bold`
                                : `${colorClass} hover:bg-slate-700 hover:border-white/10 hover:text-white`
                            }
            `}
                    >
                        {option === 'all' ? 'Todas' : option}
                    </button>
                ))}
            </div>
        </div>
    );
};
