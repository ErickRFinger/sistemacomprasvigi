import { useState } from 'react';
import { ShoppingCart, Plus, Minus, X, Send, Search } from 'lucide-react';
import type { Supplier } from '../data/suppliers';

import { useOrderHistory } from '../hooks/useOrderHistory';


interface OrderModalProps {
    supplier: Supplier;
    onClose: () => void;
}

export function OrderModal({ supplier, onClose }: OrderModalProps) {
    // Initialize quantities state
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [searchTerm, setSearchTerm] = useState('');
    const { addOrder } = useOrderHistory();



    const getStep = (productName: string) => {
        // UPDATED: Only these specific keywords trigger 100x step
        const bulkKeywords = ['rj45', 'bnc', 'bucha', 'p4', 'miguelao'];
        const pName = productName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        // Check if any keyword matches
        const isBulk = bulkKeywords.some(key => pName.includes(key));

        return isBulk ? 100 : 1;
    };

    const updateQuantity = (product: string, delta: number) => {
        const step = getStep(product);
        setQuantities(prev => {
            const current = prev[product] || 0;
            const next = Math.max(0, current + (delta * step));
            return { ...prev, [product]: next };
        });
    };

    const [observation, setObservation] = useState('');

    const handleSendOrder = () => {
        // Filter items with quantity > 0
        const items = Object.entries(quantities)
            .filter(([_, qty]) => qty > 0)
            .map(([name, qty]) => `• ${qty}x ${name}`);

        if (items.length === 0) return;

        let message = `*Olá, ${supplier.name}! Gostaria de fazer um pedido:*\n\n${items.join('\n')}`;

        if (observation.trim()) {
            message += `\n\n*Observações:*\n${observation}`;
        }

        message += `\n\n*Aguardo confirmação.*`;

        // Save to History
        const totalCount = Object.values(quantities).reduce((a, b) => a + b, 0);
        addOrder(supplier.name, items.join('\n'), totalCount);

        window.open(`https://wa.me/${supplier.phone}?text=${encodeURIComponent(message)}`, '_blank');
        onClose();
    };


    if (!supplier.products || supplier.products.length === 0) {
        // Fallback for suppliers without product list -> direct whatsapp
        const message = `Olá, ${supplier.name}, gostaria de fazer um pedido.`;
        window.open(`https://wa.me/${supplier.phone}?text=${encodeURIComponent(message)}`, '_blank');
        onClose();
        return null;
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-white/10 flex flex-col">

                <div className="p-6 border-b border-white/10 bg-slate-950 space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5 text-orange-DEFAULT" />
                                Novo Pedido: <span className="text-royal-DEFAULT">{supplier.name}</span>
                            </h2>
                            <p className="text-slate-400 text-sm mt-1">Selecione os itens e quantidades</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Buscar produto..."
                            className="w-full bg-slate-900 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-royal-DEFAULT"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>


                {/* Product List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {supplier.products
                        .filter(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(product => {

                            const qty = quantities[product] || 0;

                            return (
                                <div key={product} className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                    <span className="text-slate-200 font-medium">{product}</span>

                                    <div className="flex items-center gap-3 bg-slate-950 rounded-lg p-1 border border-white/10">
                                        <button
                                            onClick={() => updateQuantity(product, -1)}
                                            className={`p-2 rounded-md transition-colors ${qty === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-orange-DEFAULT hover:bg-white/10'}`}
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
                                            className="p-2 text-green-500 hover:bg-white/10 rounded-md transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-slate-950 flex flex-col gap-4">
                    <textarea
                        placeholder="Observações (opcional)... Ex: Entregar na parte da tarde"
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-slate-300 placeholder-slate-500 focus:ring-1 focus:ring-royal-DEFAULT focus:outline-none resize-none h-20 text-sm"
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                    />

                    <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-400">
                            {Object.keys(quantities).filter(k => quantities[k] > 0).length} itens selecionados
                        </div>
                        <button
                            onClick={handleSendOrder}
                            disabled={Object.values(quantities).every(q => q === 0)}
                            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-[#25D366]/20 active:scale-95"
                        >
                            <Send className="w-5 h-5" />
                            Enviar Pedido no WhatsApp
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
