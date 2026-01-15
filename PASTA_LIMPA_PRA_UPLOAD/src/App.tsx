import { useState } from 'react';
import { suppliers } from './data/suppliers';
import { Phone, MapPin, Package, Search, Building2, ShoppingCart } from 'lucide-react';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  // Extract unique cities for filter
  const cities = ['all', ...new Set(suppliers.map(s => s.city))];

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'all' || supplier.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const handleWhatsApp = (phone: string, product: string) => {
    const message = `Olá, gostaria de fazer um pedido de ${product}.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100">
      {/* Header */}
      <header className="bg-slate-950 border-b border-white/10 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-DEFAULT p-2 rounded-lg">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Filters */}
        <div className="mb-8 flex overflow-x-auto pb-4 gap-2 no-scrollbar">
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
              {city === 'all' ? 'Todas as Cidades' : city}
            </button>
          ))}
        </div>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="bg-slate-800 rounded-xl shadow-lg border border-white/5 overflow-hidden hover:shadow-2xl hover:border-white/10 transition-all duration-300 group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
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
                  <button
                    onClick={() => handleWhatsApp(supplier.phone, supplier.product)}
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-[#25D366]/20 active:scale-95 duration-200"
                  >
                    <Phone className="w-5 h-5" />
                    Chamar no WhatsApp
                  </button>
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
    </div>
  );
}

export default App;
