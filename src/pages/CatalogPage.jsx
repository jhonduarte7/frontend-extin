import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Flame,
  Wrench,
  ShieldCheck,
  Search,
  Filter,
  Loader2,
  Package,
  Layers,
  Award,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import api from '@/services/api';

// Complete fallback items matching backend DatabaseSeeder.java (12 products + 8 services)
const SEED_CATALOG_ITEMS = [
  // 12 Products
  {
    id: 'prod-pqs-5',
    sku_code: 'EXT-PQS-5',
    name: 'Extintor Polvo Químico Seco (PQS) 5 Lbs ABC',
    type: 'PRODUCT',
    category: 'PQS',
    classType: 'Clase ABC',
    capacity: '5 Lbs (2.3 Kg)',
    agent: 'Polvo Químico Seco ABC (Fosfato Monoamónico)',
    description: 'Portátil y liviano, ideal para camionetas, taxis, áreas administrativas y pequeños comercios.',
  },
  {
    id: 'prod-pqs-10',
    sku_code: 'EXT-PQS-10',
    name: 'Extintor Polvo Químico Seco (PQS) 10 Lbs ABC',
    type: 'PRODUCT',
    category: 'PQS',
    classType: 'Clase ABC',
    capacity: '10 Lbs (4.5 Kg)',
    agent: 'Polvo Químico Seco ABC',
    description: 'Estándar para depósitos, oficinas corporativas, plantas y locales comerciales. Máxima versatilidad.',
  },
  {
    id: 'prod-pqs-20',
    sku_code: 'EXT-PQS-20',
    name: 'Extintor Polvo Químico Seco (PQS) 20 Lbs ABC',
    type: 'PRODUCT',
    category: 'PQS',
    classType: 'Clase ABC',
    capacity: '20 Lbs (9.0 Kg)',
    agent: 'Polvo Químico Seco ABC',
    description: 'Alto poder extintor para galpones industriales, estaciones de servicio, talleres y áreas de almacenamiento químico.',
  },
  {
    id: 'prod-co2-5',
    sku_code: 'EXT-CO2-5',
    name: 'Extintor Dióxido de Carbono (CO2) 5 Lbs Clase BC',
    type: 'PRODUCT',
    category: 'CO2',
    classType: 'Clase BC',
    capacity: '5 Lbs (2.3 Kg)',
    agent: 'Dióxido de Carbono Puro (CO2)',
    description: 'Agente limpio no conductor. Apto para tableros eléctricos pequeños y equipos de cómputo.',
  },
  {
    id: 'prod-co2-10',
    sku_code: 'EXT-CO2-10',
    name: 'Extintor Dióxido de Carbono (CO2) 10 Lbs Clase BC',
    type: 'PRODUCT',
    category: 'CO2',
    classType: 'Clase BC',
    capacity: '10 Lbs (4.5 Kg)',
    agent: 'Dióxido de Carbono Puro (CO2)',
    description: 'No deja residuos. Recomendado para cuartos de servidores, data centers e instrumental de laboratorio.',
  },
  {
    id: 'prod-co2-15',
    sku_code: 'EXT-CO2-15',
    name: 'Extintor Dióxido de Carbono (CO2) 15 Lbs Clase BC',
    type: 'PRODUCT',
    category: 'CO2',
    classType: 'Clase BC',
    capacity: '15 Lbs (6.8 Kg)',
    agent: 'Dióxido de Carbono Puro (CO2)',
    description: 'Mayor tiempo de descarga para salas de máquinas, transformadores y cuartos de telecomunicaciones.',
  },
  {
    id: 'prod-h2o-25',
    sku_code: 'EXT-H2O-25',
    name: 'Extintor de Agua Presurizada 2.5 Galones Clase A',
    type: 'PRODUCT',
    category: 'WATER',
    classType: 'Clase A',
    capacity: '2.5 Gal (9.5 L)',
    agent: 'Agua con Aditivo Humectante',
    description: 'Cilindro de acero inoxidable. Efecto refrigerante superior para depósitos de madera, papel y textiles.',
  },
  {
    id: 'prod-solk-10',
    sku_code: 'EXT-SOLK-10',
    name: 'Extintor Agente Limpio Solkaflam 10 Lbs Clase ABC',
    type: 'PRODUCT',
    category: 'SOLK',
    classType: 'Clase ABC',
    capacity: '10 Lbs (4.5 Kg)',
    agent: 'Agente Limpio Solkaflam (Ecológico)',
    description: 'Sustituto de Halón, no corrosivo y de evaporación instantánea. Protección de activos de alto valor.',
  },
  {
    id: 'prod-k-6l',
    sku_code: 'EXT-K-6L',
    name: 'Extintor Acetato de Potasio 6 Lts Clase K',
    type: 'PRODUCT',
    category: 'K',
    classType: 'Clase K',
    capacity: '6 Litros',
    agent: 'Acetato de Potasio (Químico Húmedo)',
    description: 'Especializado para cocinas comerciales e industriales. Sofoca grasas animales y vegetales calientes.',
  },
  {
    id: 'prod-gab-met',
    sku_code: 'GAB-MET-10',
    name: 'Gabinete Metálico Rojo de Pared para Extintor 10-20 Lbs',
    type: 'PRODUCT',
    category: 'ACCESSORY',
    classType: 'Accesorio',
    capacity: '10 a 20 Lbs',
    agent: 'Gabinete con Vidrio y Cerradura',
    description: 'Protege el extintor de intemperie y vandalismo en pasillos de centros comerciales y edificios.',
  },
  {
    id: 'prod-mang-30',
    sku_code: 'MANG-INC-30',
    name: 'Manguera Contra Incendio 1.5 Pulgadas x 30 Metros',
    type: 'PRODUCT',
    category: 'ACCESSORY',
    classType: 'Accesorio',
    capacity: '1.5" x 30m',
    agent: 'Manguera Sintética de Alta Presión',
    description: 'Con acoples de bronce de conexión rápida para sistemas de cajetines de gabinete hidrante.',
  },
  {
    id: 'prod-valv-15',
    sku_code: 'VALV-ANG-15',
    name: 'Válvula Angular de Bronce 1.5 Pulgadas 300 PSI',
    type: 'PRODUCT',
    category: 'ACCESSORY',
    classType: 'Accesorio',
    capacity: '1.5" 300 PSI',
    agent: 'Bronce Forjado Certificado',
    description: 'Válvula para conexión de mangueras a la columna seca de la red contra incendios.',
  },

  // 8 Services
  {
    id: 'serv-rec-pqs-5',
    sku_code: 'REC-PQS-5',
    name: 'Servicio de Recarga y Mantenimiento PQS 5 Lbs',
    type: 'SERVICE',
    category: 'PQS',
    classType: 'Servicio Taller',
    capacity: '5 Lbs',
    agent: 'Recarga Polvo Químico Seco ABC 75% Fosfato',
    description: 'Desarme, revisión interna del cilindro, cambio de precinto, vástago, recarga y presurización con nitrógeno seco.',
  },
  {
    id: 'serv-rec-pqs-10',
    sku_code: 'REC-PQS-10',
    name: 'Servicio de Recarga y Mantenimiento PQS 10 Lbs',
    type: 'SERVICE',
    category: 'PQS',
    classType: 'Servicio Taller',
    capacity: '10 Lbs',
    agent: 'Recarga Polvo Químico Seco ABC 75% Fosfato',
    description: 'Servicio técnico integral de taller con anillo de verificación anual y etiqueta de control según norma COVENIN.',
  },
  {
    id: 'serv-rec-pqs-20',
    sku_code: 'REC-PQS-20',
    name: 'Servicio de Recarga y Mantenimiento PQS 20 Lbs',
    type: 'SERVICE',
    category: 'PQS',
    classType: 'Servicio Taller',
    capacity: '20 Lbs',
    agent: 'Recarga Polvo Químico Seco ABC 75% Fosfato',
    description: 'Mantenimiento preventivo, limpieza de manguera de descarga, lubricación de válvula y presurización a 195 PSI.',
  },
  {
    id: 'serv-rec-co2-5',
    sku_code: 'REC-CO2-5',
    name: 'Servicio de Recarga y Presurización CO2 5 Lbs',
    type: 'SERVICE',
    category: 'CO2',
    classType: 'Servicio Taller',
    capacity: '5 Lbs',
    agent: 'Recarga Dióxido de Carbono Puro',
    description: 'Control de tara, recarga criogénica de CO2 puro, verificación de disco de ruptura y prueba de fugas.',
  },
  {
    id: 'serv-rec-co2-10',
    sku_code: 'REC-CO2-10',
    name: 'Servicio de Recarga y Presurización CO2 10 Lbs',
    type: 'SERVICE',
    category: 'CO2',
    classType: 'Servicio Taller',
    capacity: '10 Lbs',
    agent: 'Recarga Dióxido de Carbono Puro',
    description: 'Pesaje estricto, inspección de cono difusor de descarga no estático y certificación de operatividad.',
  },
  {
    id: 'serv-pru-hid',
    sku_code: 'PRU-HID-CIL',
    name: 'Prueba Hidrostática y Certificación de Cilindro',
    type: 'SERVICE',
    category: 'PQS',
    classType: 'Prueba Hidrostática',
    capacity: 'Cilindros 5 a 30 Lbs',
    agent: 'Ensayo de Presión Hidrostática a 400 PSI',
    description: 'Prueba obligatoria cada 5 años bajo norma COVENIN 1040 / NFPA 10 con troquelado oficial de fecha.',
  },
  {
    id: 'serv-mant-gab',
    sku_code: 'MANT-GAB-MANG',
    name: 'Mantenimiento Preventivo a Gabinete y Manguera',
    type: 'SERVICE',
    category: 'ACCESSORY',
    classType: 'Servicio en Sitio',
    capacity: 'Gabinete 1.5"',
    agent: 'Prueba de Presión a Manguera y Engrase',
    description: 'Inspección de carrete, estanqueidad de válvula angular y doblado normativo de manguera de lona.',
  },
  {
    id: 'serv-cert-bomb',
    sku_code: 'CERT-BOMB-ANL',
    name: 'Inspección Técnica y Certificado de Operatividad',
    type: 'SERVICE',
    category: 'PQS',
    classType: 'Certificación Oficial',
    capacity: 'Instalaciones Comerciales',
    agent: 'Informe de Carga Fuego y Operatividad',
    description: 'Elaboración de informe técnico y certificado de operatividad de extintores para trámites de bomberos.',
  },
];

export default function CatalogPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL' | 'PRODUCT' | 'SERVICE'
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch catalog from backend with automatic fallback to comprehensive seed list
  useEffect(() => {
    let isMounted = true;

    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const res = await api.get('/public/catalog?page=0&size=50');
        if (isMounted) {
          const content = res.data?.content || [];
          if (content.length > 0) {
            setItems(content);
          } else {
            setItems(SEED_CATALOG_ITEMS);
          }
        }
      } catch (err) {
        console.warn('Backend catalog API offline, rendering verified seed catalog:', err?.message);
        if (isMounted) {
          setItems(SEED_CATALOG_ITEMS);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCatalog();

    return () => {
      isMounted = false;
    };
  }, []);

  // Category filter definitions
  const categories = [
    { key: 'ALL', label: t('catalog.filterAll', 'Todos los Equipos') },
    { key: 'PQS', label: t('catalog.filterPqs', 'Polvo Químico PQS') },
    { key: 'CO2', label: t('catalog.filterCo2', 'Dióxido de Carbono CO2') },
    { key: 'WATER', label: t('catalog.filterWater', 'Agua Presurizada') },
    { key: 'K', label: t('catalog.filterK', 'Clase K (Cocinas)') },
    { key: 'SOLK', label: 'Solkaflam / Agente Limpio' },
    { key: 'ACCESSORY', label: 'Gabinetes & Accesorios' },
  ];

  // Filtered and normalized products
  const filteredProducts = useMemo(() => {
    return items.filter((item) => {
      const itemType = item.type || (String(item.sku_code || item.sku || '').startsWith('REC-') ? 'SERVICE' : 'PRODUCT');

      // 1. Filter by Type (ALL, PRODUCT, SERVICE)
      if (typeFilter === 'PRODUCT' && itemType !== 'PRODUCT') return false;
      if (typeFilter === 'SERVICE' && itemType !== 'SERVICE') return false;

      // 2. Resolve Category
      const text = `${item.sku || ''} ${item.sku_code || ''} ${item.name || ''}`.toUpperCase();
      let resolvedCat = item.category ? String(item.category).toUpperCase() : 'PQS';
      if (!item.category || item.category === 'ALL') {
        if (text.includes('CO2') || text.includes('CARBONO')) resolvedCat = 'CO2';
        else if (text.includes('PQS') || text.includes('POLVO') || text.includes('ABC')) resolvedCat = 'PQS';
        else if (text.includes('H2O') || text.includes('AGUA') || text.includes('WATER')) resolvedCat = 'WATER';
        else if (text.includes('SOLK') || text.includes('SOLKAFLAM') || text.includes('LIMPIO')) resolvedCat = 'SOLK';
        else if (text.includes('CLASE K') || text.includes('POTASIO') || text.includes('COCINA') || text.includes('-K-')) resolvedCat = 'K';
        else if (text.includes('GAB') || text.includes('MANG') || text.includes('VALV') || text.includes('DET')) resolvedCat = 'ACCESSORY';
      }

      if (categoryFilter !== 'ALL' && resolvedCat !== categoryFilter) return false;

      // 3. Filter by Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const searchable = `${item.sku || ''} ${item.sku_code || ''} ${item.name || ''} ${item.agent || ''} ${item.description || ''}`.toLowerCase();
        if (!searchable.includes(query)) return false;
      }

      return true;
    });
  }, [items, typeFilter, categoryFilter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. Header & Value Proposition */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-[#E53935] text-xs font-bold border border-red-100 dark:border-red-900/60">
              <Flame className="w-3.5 h-3.5" />
              <span>{t('catalog.title', 'Catálogo Oficial de Equipos & Recargas')}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-100 dark:border-blue-900/60">
              <Award className="w-3.5 h-3.5" />
              <span>Homologado NFPA 10 & COVENIN</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Extintores Portátiles y Servicios Técnicos
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl leading-relaxed">
            {t(
              'catalog.subtitle',
              'Seleccione sus extintores o servicios de mantenimiento y solicite su cotización B2B formal sin compromiso.'
            )}
          </p>
        </div>

        {/* Corporate Trust Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-semibold self-start md:self-end border border-slate-200 dark:border-slate-700 shrink-0">
          <ShieldCheck className="w-4 h-4 text-[#E53935]" />
          <span>{t('catalog.priceNotice', 'Precios corporativos a solicitud')}</span>
        </div>
      </div>

      {/* 2. Primary Type Tabs ("Todos los Renglones", "Equipos Nuevos", "Servicios de Recarga") */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={typeFilter === 'ALL' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTypeFilter('ALL')}
          className={`text-xs font-semibold cursor-pointer ${
            typeFilter === 'ALL'
              ? 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5 mr-1.5" />
          {t('catalog.all', 'Todos los Renglones')}
          <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {items.length}
          </span>
        </Button>

        <Button
          variant={typeFilter === 'PRODUCT' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTypeFilter('PRODUCT')}
          className={`text-xs font-semibold cursor-pointer ${
            typeFilter === 'PRODUCT'
              ? 'bg-[#E53935] hover:bg-[#b71c1c] text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Package className="w-3.5 h-3.5 mr-1.5" />
          {t('catalog.products', 'Equipos Nuevos (Extintores)')}
        </Button>

        <Button
          variant={typeFilter === 'SERVICE' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTypeFilter('SERVICE')}
          className={`text-xs font-semibold cursor-pointer ${
            typeFilter === 'SERVICE'
              ? 'bg-[#E53935] hover:bg-[#b71c1c] text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Wrench className="w-3.5 h-3.5 mr-1.5" />
          {t('catalog.services', 'Servicios de Recarga & Mantenimiento')}
        </Button>
      </div>

      {/* 3. Category Filter Chips & Real-time Search Input */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 text-xs">
          <Filter className="w-4 h-4 text-slate-400 mr-1 shrink-0 hidden sm:block" />
          {categories.map((cat) => {
            const isSelected = categoryFilter === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setCategoryFilter(cat.key)}
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

        {/* Real-time Search Input */}
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por modelo, SKU o agente..."
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* 4. Products Grid or Loading / Empty States */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#E53935]" />
          <p className="text-sm font-medium">Cargando catálogo oficial de extintores...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id || product.sku || product.sku_code}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <Package className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              No se encontraron renglones coincidentes
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs max-w-md mx-auto">
              No existen extintores o servicios que coincidan con los filtros y término de búsqueda especificado.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setTypeFilter('ALL');
              setCategoryFilter('ALL');
              setSearchQuery('');
            }}
            className="text-xs text-[#E53935] border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
          >
            Restablecer Filtros
          </Button>
        </div>
      )}
    </div>
  );
}
