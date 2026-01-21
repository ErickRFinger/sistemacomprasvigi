import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';

import type { Supplier } from './data/suppliers';
import { Skeleton } from './components/ui/skeleton';
import { OrderModal } from './components/OrderModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';

// New Components
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { SupplierCard } from './components/SupplierCard';
import { EmptyState } from './components/EmptyState';

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
    // 1. Load Favorites
    const savedFavs = localStorage.getItem('vigi_favs');
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }

    // 2. Load Cache
    const cachedData = localStorage.getItem('vigi_cache');
    if (cachedData) {
      setSuppliers(JSON.parse(cachedData));
      setLoading(false);
    }

    // 3. Fetch Fresh Data
    fetch(SHEET_URL)
      .then(response => response.text())
      .then(csvText => {
        const lines = csvText.split('\n');
        const dataRows = lines.slice(1).filter(line => line.trim() !== '');

        const parsedSuppliers: Supplier[] = dataRows.map((line, index) => {
          const columns = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(col => col.trim().replace(/^"|"$/g, ''));

          const rawProducts = columns[5] || '';
          const productList = rawProducts
            ? rawProducts.split(';').map(p => p.trim()).filter(p => p !== '')
            : [];

          // --- ROBUST PARSING STRATEGY ---
          let foundLink = '';
          let foundName = '';

          // 1. Find the Link
          for (const col of columns) {
            if (col.startsWith('http')) {
              foundLink = col;
              break;
            }
          }

          // 2. Find the Name
          if (columns[0] && columns[0].length > 2) {
            foundName = columns[0];
          } else {
            const remainingCols = columns.filter(c => c !== foundLink && c.length > 2);
            if (remainingCols.length > 0) {
              foundName = remainingCols.reduce((a, b) => a.length > b.length ? a : b);
            } else {
              foundName = 'Fornecedor Desconhecido';
            }
          }

          // 3. Extract other metadata
          let city = columns[2] || '';
          let region = columns[3] || '';
          let category = columns[4] || '';

          // Smart Defaults for Link Items
          if (foundLink) {
            if (!city || city === foundName) city = 'Online';
            if (!region || region === foundName) region = 'Internet';
            if (!category || category === foundName || category === 'Online') category = 'Diversos';
          }

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

        setSuppliers(parsedSuppliers);
        localStorage.setItem('vigi_cache', JSON.stringify(parsedSuppliers));
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao carregar planilha:", error);
        setLoading(false);
      });
  }, []);

  const toggleFavorite = (e: React.MouseEvent) => {
    // This function signature is tricky to pass directly if we need the ID
    // So we'll handle it inside the map or create a wrapper
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavs = prev.includes(id)
        ? prev.filter(favId => favId !== id)
        : [...prev, id];

      if (!prev.includes(id)) {
        toast.success('Adicionado aos favoritos', {
          position: 'bottom-center',
          duration: 2000,
          className: 'bg-slate-800 text-white border-white/10'
        });
      }

      localStorage.setItem('vigi_favs', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  // Extract unique values for filters
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
    const aFav = favorites.includes(a.id);
    const bFav = favorites.includes(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen font-sans text-slate-100">
        <Header searchTerm="" onSearchChange={() => { }} onHistoryClick={() => { }} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
          <div className="space-y-4 mb-8">
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24 rounded-full bg-slate-800" />
              <Skeleton className="h-10 w-24 rounded-full bg-slate-800" />
              <Skeleton className="h-10 w-24 rounded-full bg-slate-800" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-800/50 rounded-2xl h-[300px] border border-white/5" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans">

      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onHistoryClick={() => setShowHistory(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Filters */}
        <div className="space-y-6 mb-10 animate-fade-in">
          <FilterBar
            title="Cidades"
            options={cities}
            selected={selectedCity}
            onSelect={setSelectedCity}
            activeColorClass="bg-royal-DEFAULT text-white shadow-lg shadow-royal-DEFAULT/25"
          />
          <FilterBar
            title="Categorias"
            options={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            activeColorClass="bg-orange-DEFAULT text-white shadow-lg shadow-orange-DEFAULT/25"
          />
        </div>

        {/* Results */}
        {filteredSuppliers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier, index) => (
              <div
                key={supplier.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <SupplierCard
                  supplier={supplier}
                  isFavorite={favorites.includes(supplier.id)}
                  onToggleFavorite={(e) => handleToggleFavorite(supplier.id, e)}
                  onOrderClick={() => setSelectedSupplier(supplier)}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}

      </main>

      {/* Modals */}
      {selectedSupplier && (
        <OrderModal
          supplier={selectedSupplier}
          onClose={() => setSelectedSupplier(null)}
        />
      )}

      {showHistory && (
        <OrderHistoryModal
          onClose={() => setShowHistory(false)}
        />
      )}

      <Toaster theme="dark" richColors closeButton position="bottom-right" />
    </div>
  );
}

export default App;
