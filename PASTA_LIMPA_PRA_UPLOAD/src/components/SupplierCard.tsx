import React from 'react';
import { Phone, MapPin, Package, Building2, Heart, ExternalLink, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import type { Supplier } from '../data/suppliers';

interface SupplierCardProps {
    supplier: Supplier;
    isFavorite: boolean;
    onToggleFavorite: (e: React.MouseEvent) => void;
    onOrderClick: () => void;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({
    supplier,
    isFavorite,
    onToggleFavorite,
    onOrderClick
}) => {
    const [copied, setCopied] = React.useState(false);

    // Logic to determine button type (Store Link vs WhatsApp)
    const isLink = supplier.phone.startsWith('http');
    const isShopee = isLink && (supplier.phone.includes('shopee') || supplier.phone.includes('shp.ee'));
    const isML = isLink && supplier.phone.includes('mercadolivre');

    const handleCopyPhone = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(supplier.phone);
        setCopied(true);
        toast.success('Telefone copiado!', {
            className: 'bg-emerald-500 text-white border-none',
        });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className={`
        group relative flex flex-col justify-between h-full
        bg-slate-800/40 backdrop-blur-sm rounded-2xl 
        border transition-all duration-500
        ${isFavorite
                    ? 'border-orange-500/40 shadow-[0_0_30px_-10px_rgba(249,115,22,0.3)]'
                    : 'border-white/5 hover:border-white/10 hover:shadow-2xl hover:shadow-royal-900/20 hover:-translate-y-1'
                }
      `}
        >
            {/* Background Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

            <div className="p-6 relative z-10">

                {/* Top Buttons: Favorite & Copy */}
                <div className="absolute top-4 right-4 flex gap-2">
                    {!isLink && (
                        <button
                            onClick={handleCopyPhone}
                            className="p-2.5 rounded-full bg-slate-900/50 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-300 focus:outline-none"
                            title="Copiar Telefone"
                        >
                            {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                        </button>
                    )}
                    <button
                        onClick={onToggleFavorite}
                        className="p-2.5 rounded-full bg-slate-900/50 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    >
                        <Heart
                            className={`w-5 h-5 transition-transform duration-300 ${isFavorite ? 'fill-orange-500 text-orange-500 scale-110' : 'scale-100'}`}
                        />
                    </button>
                </div>

                {/* Header: Icon & Name */}
                <div className="flex items-start gap-4 mb-6 pr-20">
                    <div className={`
            p-3 rounded-xl transition-all duration-500
            ${isShopee
                            ? 'bg-[#EE4D2D]/10 text-[#EE4D2D] group-hover:bg-[#EE4D2D]/20'
                            : isML
                                ? 'bg-[#FFE600]/10 text-[#FFE600] group-hover:bg-[#FFE600]/20'
                                : 'bg-royal-DEFAULT/10 text-royal-400 group-hover:bg-royal-DEFAULT/20 group-hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]'
                        }
          `}>
                        <Building2 className="w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white leading-tight mb-1 group-hover:text-royal-300 transition-colors">
                            {supplier.name}
                        </h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/5 text-slate-400 border border-white/5">
                            ID: {supplier.id}
                        </span>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="space-y-4">
                    <div className="flex items-start gap-3 text-slate-300 group/item">
                        <Package className="w-5 h-5 text-orange-DEFAULT shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                        <div>
                            <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Produto</span>
                            <p className="font-medium">{supplier.product}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 text-slate-300 group/item">
                        <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                        <div>
                            <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Localização</span>
                            <p className="font-medium">{supplier.city} <span className="text-slate-600 mx-1">|</span> {supplier.region}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Area */}
            <div className="p-6 pt-2 mt-auto relative z-10">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6 group-hover:via-white/20 transition-all"></div>

                {isLink ? (
                    <a
                        href={supplier.phone}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
              relative w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl font-bold transition-all duration-300 shadow-lg active:scale-[0.98] group/btn overflow-hidden
              ${isShopee
                                ? 'bg-gradient-to-r from-[#EE4D2D] to-[#ff6b4a] text-white shadow-[#EE4D2D]/25 hover:shadow-[#EE4D2D]/40'
                                : isML
                                    ? 'bg-gradient-to-r from-[#FFE600] to-[#fff059] text-[#2D3277] shadow-[#FFE600]/25 hover:shadow-[#FFE600]/40'
                                    : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-blue-600/25 hover:shadow-blue-600/40'
                            }
            `}
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                        <ExternalLink className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">{isShopee ? 'Ver na Shopee' : isML ? 'Ver no Mercado Livre' : 'Acessar Link'}</span>
                    </a>
                ) : (
                    <button
                        onClick={onOrderClick}
                        className="group/btn relative w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-[0.98] overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                        <Phone className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">Fazer Pedido</span>
                    </button>
                )}
            </div>
        </div>
    );
};
