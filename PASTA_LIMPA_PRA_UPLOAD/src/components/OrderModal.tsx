import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, X, Send, Search } from 'lucide-react';
import type { Supplier } from '../data/suppliers';
import { useOrderHistory } from '../hooks/useOrderHistory';
import { toast } from 'sonner';

interface OrderModalProps {
    supplier: Supplier;
    onClose: () => void;
}

export function OrderModal({ supplier, onClose }: OrderModalProps) {
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [observation, setObservation] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const { addOrder } = useOrderHistory();

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation
    };

    const getStep = (productName: string) => {
        const bulkKeywords = ['rj45', 'bnc', 'bucha', 'p4', 'miguelao'];
        const pName = productName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return bulkKeywords.some(key => pName.includes(key)) ? 100 : 1;
    };

    const updateQuantity = (product: string, delta: number) => {
        const step = getStep(product);
        setQuantities(prev => {
            const current = prev[product] || 0;
            const next = Math.max(0, current + (delta * step));
            return { ...prev, [product]: next };
        });
    };

    const handleSendOrder = () => {
        const items = Object.entries(quantities)
            .filter(([_, qty]) => qty > 0)
            .map(([name, qty]) => `• ${qty}x ${name}`);

        if (items.length === 0) return;

        let message = `*Olá, ${supplier.name}! Gostaria de fazer um pedido:*\n\n${items.join('\n')}`;
        if (observation.trim()) message += `\n\n*Observações:*\n${observation}`;
        message += `\n\n*Aguardo confirmação.*`;

        const totalCount = Object.values(quantities).reduce((a, b) => a + b, 0);
        addOrder(supplier.name, items.join('\n'), totalCount);

        window.open(`https://wa.me/${supplier.phone}?text=${encodeURIComponent(message)}`, '_blank');
        handleClose();
        toast.success('Pedido enviado para o WhatsApp!');
    };

    if (!supplier.products || supplier.products.length === 0) {
        const message = `Olá, ${supplier.name}, gostaria de fazer um pedido.`;
        window.open(`https://wa.me/${supplier.phone}?text=${encodeURIComponent(message)}`, '_blank');
        onClose();
        return null;
    }

    const filteredProducts = supplier.products.filter(p =>
        p.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const hasSelectedItems = Object.values(quantities).some(q => q > 0);

    return (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-all duration-300 ${isVisible ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none pointer-events-none'}`}>
            <div
                className={`
                    w-full max-w-2xl max-h-[90vh] flex flex-col
                    bg-slate-900/90 backdrop-blur-xl rounded-2xl 
                    border border-white/10 shadow-2xl overflow-hidden
                    transition-all duration-300 transform
                    ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}
                `}
            >

                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-slate-950/50 space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-orange-500/10 rounded-lg">
                                    <ShoppingCart className="w-6 h-6 text-orange-500" />
                                </div>
                                <span className="font-display">Novo Pedido</span>
                            </h2>
                            <p className="text-slate-400 text-sm mt-1 ml-1">
                                Fornecedor: <span className="text-royal-400 font-semibold">{supplier.name}</span>
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-500 group-focus-within:text-royal-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar produto..."
                            className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-royal-500/50 focus:border-royal-500/50 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                {/* Product List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {filteredProducts.map(product => {
                        const qty = quantities[product] || 0;
                        return (
                            <div
                                key={product}
                                className={`
                                    flex items-center justify-between p-4 rounded-xl border transition-all duration-200
                                    ${qty > 0
                                        ? 'bg-royal-500/10 border-royal-500/30'
                                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                                    }
                                `}
                            >
                                <span className={`font-medium transition-colors ${qty > 0 ? 'text-white' : 'text-slate-300'}`}>
                                    {product}
                                </span>

                                <div className="flex items-center gap-1 bg-black/40 rounded-lg p-1 border border-white/10">
                                    <button
                                        onClick={() => updateQuantity(product, -1)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-md transition-all ${qty === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-white hover:bg-white/10 active:scale-90'}`}
                                        disabled={qty === 0}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>

                                    <input
                                        type="number"
                                        min="0"
                                        value={qty === 0 ? '' : qty}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value) || 0;
                                            setQuantities(prev => ({ ...prev, [product]: Math.max(0, val) }));
                                        }}
                                        className="w-16 bg-transparent text-center font-bold text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        placeholder="0"
                                    />

                                    <button
                                        onClick={() => updateQuantity(product, 1)}
                                        className="w-8 h-8 flex items-center justify-center rounded-md text-emerald-400 hover:bg-emerald-400/10 active:scale-90 transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {filteredProducts.length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                            Nenhum produto encontrado.
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-slate-950/50 flex flex-col gap-4">
                    <textarea
                        placeholder="Observações (opcional)... Ex: Entregar na parte da tarde"
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-royal-500/50 focus:border-royal-500/50 focus:outline-none resize-none h-20 text-sm transition-all"
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                    />

                    <div className="flex justify-between items-center pt-2">
                        <div className="text-sm font-medium text-slate-400">
                            {Object.keys(quantities).filter(k => quantities[k] > 0).length} itens selecionados
                        </div>
                        <button
                            onClick={handleSendOrder}
                            disabled={!hasSelectedItems}
                            className={`
                                flex items-center gap-2 font-bold py-3 px-6 rounded-xl transition-all shadow-lg active:scale-95
                                ${hasSelectedItems
                                    ? 'bg-[#25D366] hover:bg-[#128C7E] text-white shadow-[#25D366]/20'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                }
                            `}
                        >
                            <Send className="w-5 h-5" />
                            Enviar Pedido
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
