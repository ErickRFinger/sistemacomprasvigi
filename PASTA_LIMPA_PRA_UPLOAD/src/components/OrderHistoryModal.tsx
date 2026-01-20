import { X, Clock, Trash2, Calendar, ShoppingBag } from 'lucide-react';
import { useOrderHistory } from '../hooks/useOrderHistory';

interface OrderHistoryModalProps {
    onClose: () => void;
}

export function OrderHistoryModal({ onClose }: OrderHistoryModalProps) {
    const { history, clearHistory } = useOrderHistory();

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl border border-white/10 flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-950">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-royal-DEFAULT" />
                        Histórico de Pedidos
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {history.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Nenhum pedido registrado ainda.</p>
                        </div>
                    ) : (
                        history.map((order) => (
                            <div key={order.id} className="bg-slate-800/50 rounded-xl border border-white/5 p-4 relative group">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-white">{order.supplierName}</h3>
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(order.date)}
                                    </span>
                                </div>
                                <div className="text-sm text-slate-300 whitespace-pre-line bg-slate-950/50 p-3 rounded-lg border border-white/5">
                                    {order.items}
                                </div>
                                <div className="mt-2 text-right text-xs text-royal-text font-medium">
                                    {order.totalItems} itens totais
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {history.length > 0 && (
                    <div className="p-6 border-t border-white/10 bg-slate-950 flex justify-end">
                        <button
                            onClick={() => {
                                if (confirm("Tem certeza que deseja limpar todo o histórico?")) {
                                    clearHistory();
                                }
                            }}
                            className="text-red-400 hover:text-red-300 text-sm flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Limpar Histórico
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
