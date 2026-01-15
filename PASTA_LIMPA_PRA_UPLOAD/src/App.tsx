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
    <div className="min-h-screen bg-royal-background font-sans">
      {/* Header */}
      <header className="bg-royal-dark text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-DEFAULT p-2 rounded-lg">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">VIGI Controle</h1>
                <p className="text-royal-DEFAULT text-sm font-medium opacity-80">Gestão de Fornecedores</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border-none rounded-lg leading-5 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:bg-white/20 focus:ring-0 sm:text-sm transition-colors"
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
                  ? 'bg-royal-dark text-white shadow-md transform scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}
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
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-royal-DEFAULT/10 p-2 rounded-lg group-hover:bg-royal-DEFAULT/20 transition-colors">
                      <Building2 className="w-6 h-6 text-royal-dark" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{supplier.name}</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Package className="w-5 h-5 text-orange-DEFAULT" />
                    <span className="text-sm font-medium">{supplier.product}</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-500">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-sm">{supplier.city} <span className="text-gray-300">|</span> {supplier.region}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleWhatsApp(supplier.phone, supplier.product)}
                    className="w-full flex items-center justify-center gap-2 bg-whatsapp-DEFAULT hover:bg-whatsapp-dark text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm hover:shadow active:scale-95 duration-200"
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
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Nenhum fornecedor encontrado</h3>
            <p className="text-gray-500">Tente buscar por outro termo ou cidade.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
