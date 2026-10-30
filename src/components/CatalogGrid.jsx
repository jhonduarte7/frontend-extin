import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flame, Search, Filter, ShieldCheck } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';

export default function CatalogGrid({ onAddToCart }) {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // 6 Mock Extinguishers representing typical fire safety inventory
  const mockProducts = useMemo(
    () => [
      {
        id: 1,
        sku: 'EXT-PQS-10',
        name: t('items.pqs10.name', 'Extintor PQS 10 Lbs'),
        category: 'PQS',
        classType: t('items.pqs10.class', 'Clase ABC'),
        capacity: t('items.pqs10.capacity', '10 Lbs (4.5 Kg)'),
        agent: t('items.pqs10.agent', 'Polvo Químico Seco ABC'),
        description: t(
          'items.pqs10.desc',
          'Apto para depósitos, oficinas, locales comerciales y vehículos de carga. Máxima cobertura ante fuegos de materiales sólidos, líquidos inflamables y tableros eléctricos.'
        ),
      },
      {
        id: 2,
        sku: 'EXT-PQS-20',
        name: t('items.pqs20.name', 'Extintor PQS 20 Lbs'),
        category: 'PQS',
        classType: t('items.pqs20.class', 'Clase ABC'),
        capacity: t('items.pqs20.capacity', '20 Lbs (9.0 Kg)'),
        agent: t('items.pqs20.agent', 'Polvo Químico Seco ABC'),
        description: t(
          'items.pqs20.desc',
          'Capacidad de descarga extendida para galpones de manufactura, plantas químicas, estaciones de servicio e industrias pesadas.'
        ),
      },
      {
        id: 3,
        sku: 'EXT-CO2-10',
        name: t('items.co210.name', 'Extintor CO2 10 Lbs'),
        category: 'CO2',
        classType: t('items.co210.class', 'Clase BC'),
        capacity: t('items.co210.capacity', '10 Lbs (4.5 Kg)'),
        agent: t('items.co210.agent', 'Dióxido de Carbono Puro (CO2)'),
        description: t(
          'items.co210.desc',
          'Agente limpio gaseoso no conductor eléctrico. No deja residuos químicos ni daña servidores, cuartos de control ni instrumental médico sensible.'
        ),
      },
      {
        id: 4,
        sku: 'EXT-CO2-15',
        name: t('items.co215.name', 'Extintor CO2 15 Lbs'),
        category: 'CO2',
        classType: t('items.co215.class', 'Clase BC'),
        capacity: t('items.co215.capacity', '15 Lbs (6.8 Kg)'),
        agent: t('items.co215.agent', 'Dióxido de Carbono Puro (CO2)'),
        description: t(
          'items.co215.desc',
          'Mayor alcance y tiempo de descarga para maquinaria industrial, transformadores y cuartos de telecomunicaciones sin generar corrosión.'
        ),
      },
      {
        id: 5,
        sku: 'EXT-AGUA-25',
        name: t('items.water25.name', 'Extintor Agua Presurizada 2.5 Gal'),
        category: 'WATER',
        classType: t('items.water25.class', 'Clase A'),
        capacity: t('items.water25.capacity', '2.5 Gal (9.5 L)'),
        agent: t('items.water25.agent', 'Agua con Aditivo Humectante'),
        description: t(
          'items.water25.desc',
          'Cilindro de acero inoxidable. Efecto refrigerante superior para depósitos de madera, archivos de papel, textiles y cartón prensado.'
        ),
      },
      {
        id: 6,
        sku: 'EXT-K-6L',
        name: t('items.k6.name', 'Extintor Acetato de Potasio 6 Lts'),
        category: 'K',
        classType: t('items.k6.class', 'Clase K'),
        capacity: t('items.k6.capacity', '6 Litros'),
        agent: t('items.k6.agent', 'Acetato de Potasio (Agente Químico Húmedo)'),
        description: t(
          'items.k6.desc',
          'Especializado para cocinas industriales, freidoras de alta temperatura y grasas vegetales/animales. Crea una capa saponificante sofocante.'
        ),
      },
    ],
    [t]
  );

  const categories = [
    { key: 'ALL', label: t('catalog.filterAll', 'Todos los Equipos') },
    { key: 'PQS', label: t('catalog.filterPqs', 'Polvo Químico PQS') },
    { key: 'CO2', label: t('catalog.filterCo2', 'Dióxido de Carbono CO2') },
    { key: 'WATER', label: t('catalog.filterWater', 'Agua Presurizada') },
    { key: 'K', label: t('catalog.filterK', 'Clase K (Cocinas)') },
  ];

  // Filtering logic
  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === 'ALL' || product.category === selectedCategory;
      const matchesSearch =
        searchTerm.trim() === '' ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.classType.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [mockProducts, selectedCategory, searchTerm]);

  const handleSelectNew = (product) => {
    if (onAddToCart) {
      onAddToCart({ ...product, requestType: 'PRODUCT' });
    }
    // Also trigger custom event for future CartSheet drawer integration
    window.dispatchEvent(
      new CustomEvent('extin-cart-add', {
        detail: { product, requestType: 'PRODUCT' },
      })
    );
  };

  const handleSelectRecharge = (product) => {
    if (onAddToCart) {
      onAddToCart({ ...product, requestType: 'SERVICE' });
    }
    window.dispatchEvent(
      new CustomEvent('extin-cart-add', {
        detail: { product, requestType: 'SERVICE' },
      })
    );
  };

  return (
    <section id="catalog" className="space-y-8 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E53935] mb-1">
            <Flame className="w-4 h-4" />
            <span>{t('catalog.title', 'Catálogo Oficial de Equipos & Recargas')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Extintores Portátiles y Servicios de Recarga
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-2xl">
            {t(
              'catalog.subtitle',
              'Seleccione sus extintores o servicios de mantenimiento y solicite su cotización B2B formal sin compromiso.'
            )}
          </p>
        </div>

        {/* Corporate Trust Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-semibold self-start md:self-end border border-slate-200 dark:border-slate-700">
          <ShieldCheck className="w-4 h-4 text-[#E53935]" />
          <span>{t('catalog.priceNotice', 'Precios corporativos a solicitud')}</span>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 text-xs">
          <Filter className="w-4 h-4 text-slate-400 mr-1 shrink-0 hidden sm:block" />
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer text-xs ${
                  isSelected
                    ? 'bg-[#E53935] text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por modelo o SKU..."
            className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Responsive Product Grid: 1 col mobile, 2 sm, 3 lg, 3-4 desktop */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectNew={handleSelectNew}
              onSelectRecharge={handleSelectRecharge}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            No se encontraron equipos para el criterio de búsqueda seleccionado.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCategory('ALL');
              setSearchTerm('');
            }}
            className="text-xs text-[#E53935] border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/40"
          >
            Restablecer Filtros
          </Button>
        </div>
      )}
    </section>
  );
}
