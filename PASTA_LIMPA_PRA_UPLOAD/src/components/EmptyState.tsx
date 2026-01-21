import React from 'react';
import { Search } from 'lucide-react';

export const EmptyState: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
            <div className="relative mb-6 group">
                <div className="absolute -inset-4 bg-royal-500/20 rounded-full blur-xl group-hover:bg-royal-500/30 transition-all duration-500"></div>
                <div className="relative bg-slate-800/50 p-6 rounded-full border border-white/10 shadow-2xl backdrop-blur-sm">
                    <Search className="w-10 h-10 text-slate-400 group-hover:text-white transition-colors duration-300" />
                </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Nenhum fornecedor encontrado</h3>
            <p className="text-slate-400 max-w-sm mx-auto">
                Não conseguimos encontrar o que você procura. Tente usar termos mais genéricos ou verifique a ortografia.
            </p>
        </div>
    );
};
