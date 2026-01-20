import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

import type { Supplier } from './data/suppliers';
import { Phone, MapPin, Package, Search, Building2, Heart, Clock } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { Skeleton } from './components/ui/skeleton';
import { OrderModal } from './components/OrderModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';



function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);


  const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR0meRkTnIesDrj_y2PSGZ5-sn0LZmo6s3MDaEB6zRtH8KS-jZkXeekWsJmIOxaRyy2Pvt-jpgfohIe/pub?output=csv";

  useEffect(() => {
    // 1. Load Favorites from LocalStorage
    const savedFavs = localStorage.getItem('vigi_favs');
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }

    // 2. Load Cache (Instant Load)
    const cachedData = localStorage.getItem('vigi_cache');
    if (cachedData) {
      setSuppliers(JSON.parse(cachedData));
      setLoading(false); // Show content immediately
    }

    // 3. Fetch Fresh Data (Background Update)
    fetch(SHEET_URL)
      .then(response => response.text())
      .then(csvText => {
        const lines = csvText.split('\n');
        const dataRows = lines.slice(1).filter(line => line.trim() !== '');

        const parsedSuppliers: Supplier[] = dataRows.map((line, index) => {
          const columns = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(col => col.trim().replace(/^"|"$/g, ''));

          // Expected columns: NOME, TELEFONE, CIDADE, REGIAO, CATEGORIA, PRODUTOS
          // Index: 0, 1, 2, 3, 4, 5

          const rawProducts = columns[5] || '';
          const productList = rawProducts
            ? rawProducts.split(';').map(p => p.trim()).filter(p => p !== '')
            : [];

          // --- ROBUST PARSING STRATEGY ---
          // Scan the row to find the Link (URL) and Name, regardless of which column they ended up in.
          // This handles cases where data was pasted into the wrong columns (shifted).

          let foundLink = '';
          let foundName = '';

          // 1. Find the Link (First column starting with http)
          for (const col of columns) {
            if (col.startsWith('http')) {
              foundLink = col;
              break;
            }
          }

          // 2. Find the Name
          // Priority: Column 0, then any non-empty column that isn't the link, isn't a likely category/city
          if (columns[0] && columns[0].length > 2) {
            foundName = columns[0];
          } else {
            // Fallback: look for likely name in other columns (excluding the link we found)
            const remainingCols = columns.filter(c => c !== foundLink && c.length > 2);
            // Heuristic: The longest remaining string is likely the name (or product description)
            if (remainingCols.length > 0) {
              foundName = remainingCols.reduce((a, b) => a.length > b.length ? a : b);
            } else {
              foundName = 'Fornecedor Desconhecido';
            }
          }

          // 3. Extract other metadata (if in correct place, otherwise default)
          let city = columns[2] || '';
          let region = columns[3] || '';
          let category = columns[4] || '';

          // Smart Defaults for Link Items
          if (foundLink) {
            if (!city || city === foundName) city = 'Online';
            if (!region || region === foundName) region = 'Internet';
            if (!category || category === foundName || category === 'Online') category = 'Diversos';
          }

          // If we found a link but no phone in column 1, use the found link
          const finalPhone = foundLink || columns[1] || '';

          return {
            id: String(index + 1),
            name: foundName,
            phone: finalPhone,
            city: city,
            region: region,
            product: category || 'Diversos',
            products: productList
          };
        });

        // Update State & Cache
        setSuppliers(parsedSuppliers);
        localStorage.setItem('vigi_cache', JSON.stringify(parsedSuppliers));
        setLoading(false);

      })
      .catch(error => {
        console.error("Erro ao carregar planilha:", error);
        setLoading(false);
      });
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavs = prev.includes(id)
        ? prev.filter(favId => favId !== id)
        : [...prev, id];

      if (!prev.includes(id)) {
        toast.success('Adicionado aos favoritos', {
          position: 'bottom-center',
          duration: 2000,
        });
      }

      localStorage.setItem('vigi_favs', JSON.stringify(newFavs));

      return newFavs;
    });
  };

  // Extract unique cities and categories
  const cities = ['all', ...new Set(suppliers.map(s => s.city).filter(c => c))];
  const categories = ['all', ...new Set(suppliers.map(s => s.product).filter(c => c))];

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'all' || supplier.city === selectedCity;
    const matchesCategory = selectedCategory === 'all' || supplier.product === selectedCategory;

    return matchesSearch && matchesCity && matchesCategory;
  }).sort((a, b) => {
    // Sort favorites first
    const aFav = favorites.includes(a.id);
    const bFav = favorites.includes(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  const handleOrderClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 font-sans text-slate-100">
        {/* Skeleton Header */}
        <header className="bg-slate-950 border-b border-white/10 shadow-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-10 w-full md:w-96 rounded-lg" />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Skeleton Filters */}
          <div className="space-y-4 mb-8">
            <div className="flex gap-2 overflows-hidden">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
            </div>
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-800 rounded-xl border border-white/5 p-6 h-[280px] flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-12 w-full rounded-lg mt-4" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100">
      {/* Header */}
      <header className="bg-slate-950 border-b border-white/10 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <img
                src="/vigi-logo.png"
                alt="Vigi Câmeras"
                className="h-12 w-auto object-contain drop-shadow-md"
              />
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">VIGI Controle</h1>
                <p className="text-royal-text text-sm font-medium opacity-60">Gestão de Fornecedores</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-lg leading-5 bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-royal-DEFAULT sm:text-sm transition-all"
                placeholder="Buscar por nome ou produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* History Button */}
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white font-medium py-2 px-4 rounded-lg transition-all active:scale-95 whitespace-nowrap"
            >
              <Clock className="w-5 h-5" />
              <span className="hidden sm:inline">Histórico</span>
            </button>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Filters Section */}
        <div className="space-y-4 mb-8">
          {/* City Filters */}
          <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider self-center mr-2">Cidades:</span>
            {cities.map(city => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`
                            px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                            ${selectedCity === city
                    ? 'bg-royal-DEFAULT text-white shadow-lg shadow-royal-DEFAULT/20 transform scale-105'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-white/5'}
                        `}
              >
                {city === 'all' ? 'Todas' : city}
              </button>
            ))}
          </div>

          {/* Category Filters */}
          <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider self-center mr-2">Categorias:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
                            px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                            ${selectedCategory === cat
                    ? 'bg-orange-DEFAULT text-white shadow-lg shadow-orange-DEFAULT/20 transform scale-105'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-white/5'}
                        `}
              >
                {cat === 'all' ? 'Todas' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className={`bg-slate-800 rounded-xl shadow-lg border overflow-hidden hover:shadow-2xl transition-all duration-300 group
                ${favorites.includes(supplier.id) ? 'border-orange-500/30 ring-1 ring-orange-500/20' : 'border-white/5 hover:border-white/10'}
              `}
            >
              <div className="p-6 relative">
                {/* Favorite Button */}
                <button
                  onClick={(e) => toggleFavorite(supplier.id, e)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
                >
                  <Heart
                    className={`w-6 h-6 transition-colors ${favorites.includes(supplier.id) ? 'fill-orange-500 text-orange-500' : 'text-slate-600'}`}
                  />
                </button>

                <div className="flex justify-between items-start mb-4 pr-10">
                  <div className="flex items-center gap-3">
                    <div className="bg-royal-DEFAULT/20 p-2 rounded-lg group-hover:bg-royal-DEFAULT/30 transition-colors">
                      <Building2 className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white line-clamp-1">{supplier.name}</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Package className="w-5 h-5 text-orange-DEFAULT" />
                    <span className="text-sm font-medium">{supplier.product}</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-400">
                    <MapPin className="w-5 h-5 text-slate-500" />
                    <span className="text-sm">{supplier.city} <span className="text-slate-600">|</span> {supplier.region}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5">
                  {supplier.phone.startsWith('http') ? (
                    (() => {
                      const isShopee = supplier.phone.includes('shopee') || supplier.phone.includes('shp.ee');
                      const isML = supplier.phone.includes('mercadolivre');

                      return (
                        <a
                          href={supplier.phone}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-lg transition-all shadow-lg active:scale-95 duration-200
                            ${isShopee
                              ? 'bg-[#EE4D2D] hover:bg-[#D03E1F] text-white hover:shadow-[#EE4D2D]/20'
                              : isML
                                ? 'bg-[#FFE600] hover:bg-[#E6CF00] text-[#2D3277] hover:shadow-[#FFE600]/20'
                                : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-600/20'
                            }
                          `}
                        >
                          <ExternalLink className="w-5 h-5" />
                          {isShopee ? 'Ver na Shopee' : isML ? 'Ver no Mercado Livre' : 'Acessar Link'}
                        </a>
                      );
                    })()
                  ) : (
                    <button
                      onClick={() => handleOrderClick(supplier)}
                      className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-[#25D366]/20 active:scale-95 duration-200"
                    >
                      <Phone className="w-5 h-5" />
                      Fazer Pedido
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSuppliers.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
              <Search className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-white">Nenhum fornecedor encontrado</h3>
            <p className="text-slate-400">Tente buscar por outro termo ou cidade.</p>
          </div>
        )}
      </main>

      {/* Order Modal */}
      {selectedSupplier && (
        <OrderModal
          supplier={selectedSupplier}
          onClose={() => setSelectedSupplier(null)}
        />
      )}

      {/* History Modal */}
      {showHistory && (
        <OrderHistoryModal
          onClose={() => setShowHistory(false)}
        />
      )}

      <Toaster theme="dark" richColors />
    </div>
  );
}


export default App;
