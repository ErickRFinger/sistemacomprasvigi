import React from 'react';
import { Search, Clock } from 'lucide-react';

interface HeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onHistoryClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ searchTerm, onSearchChange, onHistoryClick }) => {
    return (
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                    {/* Logo & Title */}
                    <div className="flex items-center gap-4 group">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-royal-DEFAULT to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <img
                                src="/logo.png"
                                alt="Vigi Câmeras"
                                className="relative h-12 w-auto object-contain drop-shadow-md transform transition duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white font-display">
                                VIGI <span className="text-transparent bg-clip-text bg-gradient-to-r from-royal-400 to-purple-400">Controle</span>
                            </h1>
                            <p className="text-slate-400 text-xs font-medium tracking-wide uppercase opacity-80">Gestão de Fornecedores</p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-royal-DEFAULT to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                        <div className="relative bg-slate-950 rounded-xl flex items-center">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-500 group-focus-within:text-royal-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-4 py-3 bg-transparent border-0 text-white placeholder-slate-500 focus:ring-0 sm:text-sm"
                                placeholder="Buscar fornecedor ou produto..."
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <kbd className="hidden sm:inline-block px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs text-slate-500 font-mono">
                                    /
                                </kbd>
                            </div>
                        </div>
                    </div>

                    {/* History Button */}
                    <button
                        onClick={onHistoryClick}
                        className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 text-slate-300 hover:text-white font-medium py-2.5 px-5 rounded-xl transition-all active:scale-95 whitespace-nowrap backdrop-blur-sm group"
                    >
                        <Clock className="w-5 h-5 group-hover:text-royal-400 transition-colors" />
                        <span className="hidden sm:inline">Histórico</span>
                    </button>

                </div>
            </div>
        </header>
    );
};
