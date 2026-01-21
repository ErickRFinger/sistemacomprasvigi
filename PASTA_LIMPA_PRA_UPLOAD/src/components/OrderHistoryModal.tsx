import { useState, useEffect } from 'react';
import { X, Clock, Trash2, Calendar, ShoppingBag, ArrowRight } from 'lucide-react';
import { useOrderHistory } from '../hooks/useOrderHistory';
import { toast } from 'sonner';

interface OrderHistoryModalProps {
    onClose: () => void;
}

export function OrderHistoryModal({ onClose }: OrderHistoryModalProps) {
    const { history, clearHistory } = useOrderHistory();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-all duration-300 ${isVisible ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none pointer-events-none'}`}>
            <div
                className={`
                    w-full max-w-2xl max-h-[85vh] flex flex-col
                    bg-slate-900/90 backdrop-blur-xl rounded-2xl 
                    border border-white/10 shadow-2xl overflow-hidden
                    transition-all duration-300 transform
                    ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}
                `}
            >

                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-slate-950/50 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-2 bg-royal-500/10 rounded-lg">
                            <Clock className="w-6 h-6 text-royal-400" />
                        </div>
                        <span className="font-display">Histórico de Pedidos</span>
                    </h2>
                    <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                                <ShoppingBag className="w-10 h-10 opacity-50" />
                            </div>
                            <p className="text-lg font-medium">Nenhum pedido registrado ainda.</p>
                            <p className="text-sm opacity-60">Seus pedidos recentes aparecerão aqui.</p>
                        </div>
                    ) : (
                        history.map((order, index) => (
                            <div
                                key={order.id}
                                className="group bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 hover:border-white/10 p-5 transition-all duration-300"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-royal-500/20 flex items-center justify-center text-royal-400 font-bold text-sm">
                                            {order.supplierName.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-white leading-tight">{order.supplierName}</h3>
                                            <span className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(order.date)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-white/5 text-xs font-medium text-slate-300 border border-white/5">
                                        {order.totalItems} itens
                                    </div>
                                </div>

                                <div className="pl-[52px]">
                                    <div className="text-sm text-slate-300 bg-black/20 p-4 rounded-xl border border-white/5 font-mono leading-relaxed opacity-90">
                                        {order.items}
                                    </div>

                                    <div className="mt-4 flex justify-end">
                                        <button className="text-xs font-bold text-royal-400 hover:text-royal-300 flex items-center gap-1 transition-colors uppercase tracking-wide">
                                            Ver detalhes <ArrowRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {history.length > 0 && (
                    <div className="p-6 border-t border-white/10 bg-slate-950/50 flex justify-end">
                        <button
                            onClick={() => {
                                if (confirm("Tem certeza que deseja limpar todo o histórico?")) {
                                    clearHistory();
                                    toast.success("Histórico limpo com sucesso.");
                                }
                            }}
                            className="group flex items-center gap-2 px-4 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-sm font-medium border border-transparent hover:border-red-500/20"
                        >
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Limpar Histórico
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
