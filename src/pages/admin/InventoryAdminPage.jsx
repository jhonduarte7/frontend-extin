import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Package,
  Plus,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
  Loader2,
  ArrowUpRight,
  ArrowDownLeft,
  Boxes,
  ShieldCheck,
  Tag,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/services/api';
import Pagination from '@/components/Pagination';

// Initial realistic workshop materials and parts for Equi-Extin
const INITIAL_WORKSHOP_INVENTORY = [
  {
    id: 'inv-001',
    sku: 'CIL-PQS-10',
    name: 'Cilindro de Acero PQS 10 Lbs (Certificado NFPA 10)',
    category: 'Cilindros',
    unit: 'Unidades',
    currentStock: 24,
    minStock: 10,
    unitCostUsd: 22.0,
    salePriceUsd: 38.0,
    location: 'Galpón 1 - Racks Cilindros',
    lastRestock: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
  },
  {
    id: 'inv-002',
    sku: 'CIL-CO2-15',
    name: 'Cilindro de Aluminio CO2 15 Lbs (Alta Presión 1800 PSI)',
    category: 'Cilindros',
    unit: 'Unidades',
    currentStock: 4,
    minStock: 8,
    unitCostUsd: 75.0,
    salePriceUsd: 135.0,
    location: 'Galpón 1 - Zona CO2',
    lastRestock: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
  },
  {
    id: 'inv-003',
    sku: 'QUIM-ABC-25KG',
    name: 'Polvo Químico ABC Fosfato Monoamónico 75% (Saco 25kg)',
    category: 'Agentes Químicos',
    unit: 'Sacos',
    currentStock: 18,
    minStock: 8,
    unitCostUsd: 42.0,
    salePriceUsd: 65.0,
    location: 'Taller de Llenado - Tolva PQS',
    lastRestock: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: 'inv-004',
    sku: 'GAS-CO2-KG',
    name: 'Gas Dióxido de Carbono Líquido Grado Industrial (Kg)',
    category: 'Agentes Químicos',
    unit: 'Kilogramos',
    currentStock: 32,
    minStock: 50,
    unitCostUsd: 3.5,
    salePriceUsd: 6.0,
    location: 'Tanque Criogénico Central',
    lastRestock: new Date(Date.now() - 3600000 * 24 * 15).toISOString(),
  },
  {
    id: 'inv-005',
    sku: 'VALV-PQS-STD',
    name: 'Válvula de Latón Forjado Niquelado para Extintor PQS',
    category: 'Repuestos & Válvulas',
    unit: 'Unidades',
    currentStock: 46,
    minStock: 15,
    unitCostUsd: 7.2,
    salePriceUsd: 14.0,
    location: 'Estante B-2 - Repuestos',
    lastRestock: new Date(Date.now() - 3600000 * 24 * 6).toISOString(),
  },
  {
    id: 'inv-006',
    sku: 'MANOM-175',
    name: 'Manómetro 175 PSI NPT 1/8" Cara Amarilla (Certificado)',
    category: 'Repuestos & Válvulas',
    unit: 'Unidades',
    currentStock: 9,
    minStock: 20,
    unitCostUsd: 3.8,
    salePriceUsd: 8.5,
    location: 'Gavetero Instrumental A-1',
    lastRestock: new Date(Date.now() - 3600000 * 24 * 20).toISOString(),
  },
  {
    id: 'inv-007',
    sku: 'PREC-ROJO-100',
    name: 'Precinto de Seguridad Plástico Foliado Rojo (Pack 100u)',
    category: 'Accesorios de Seguridad',
    unit: 'Packs',
    currentStock: 14,
    minStock: 5,
    unitCostUsd: 8.0,
    salePriceUsd: 15.0,
    location: 'Estante A-4 - Accesorios',
    lastRestock: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
  },
  {
    id: 'inv-008',
    sku: 'MANG-CO2-15',
    name: 'Manguera de Descarga con Corneta Difusora CO2 10/15 Lbs',
    category: 'Repuestos & Válvulas',
    unit: 'Unidades',
    currentStock: 6,
    minStock: 5,
    unitCostUsd: 12.5,
    salePriceUsd: 22.0,
    location: 'Estante B-3 - Mangueras',
    lastRestock: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
  },
  {
    id: 'inv-009',
    sku: 'QUIM-ACET-10L',
    name: 'Agente Químico Húmedo Acetato de Potasio (Bidón 10L Cocina K)',
    category: 'Agentes Químicos',
    unit: 'Bidones',
    currentStock: 2,
    minStock: 5,
    unitCostUsd: 55.0,
    salePriceUsd: 85.0,
    location: 'Área Especial Clase K',
    lastRestock: new Date(Date.now() - 3600000 * 24 * 25).toISOString(),
  },
  {
    id: 'inv-010',
    sku: 'PASAD-INOX',
    name: 'Pasador de Seguridad de Acero con Cadena Inoxidable',
    category: 'Accesorios de Seguridad',
    unit: 'Unidades',
    currentStock: 72,
    minStock: 25,
    unitCostUsd: 0.8,
    salePriceUsd: 2.0,
    location: 'Gavetero Instrumental A-2',
    lastRestock: new Date(Date.now() - 3600000 * 24 * 8).toISOString(),
  },
];

export default function InventoryAdminPage() {
  const { t } = useTranslation();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // 'ALL' | 'LOW_STOCK' | 'Cilindros' | ...
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;

  // Modals state
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [adjustmentType, setAdjustmentType] = useState('IN'); // 'IN' | 'OUT'
  const [adjustmentQty, setAdjustmentQty] = useState(1);
  const [adjustmentReason, setAdjustmentReason] = useState('RECEPCION_PROVEEDOR');
  const [adjustmentNotes, setAdjustmentNotes] = useState('');

  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    sku: '',
    name: '',
    category: 'Cilindros',
    unit: 'Unidades',
    currentStock: 10,
    minStock: 5,
    unitCostUsd: 15.0,
    salePriceUsd: 25.0,
    location: 'Galpón 1',
  });

  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  // Load Inventory from localStorage or initialize with seed + backend sync
  const fetchInventory = async () => {
    try {
      setLoading(true);

      // Check local storage persistence first
      let localItems = [];
      try {
        const stored = localStorage.getItem('extin_inventory_items');
        if (stored) {
          localItems = JSON.parse(stored);
        }
      } catch (e) {
        console.warn('Could not parse local inventory items:', e);
      }

      if (localItems.length > 0) {
        setItems(localItems);
      } else {
        // Try fetching backend catalog to enrich inventory items
        try {
          const res = await api.get('/public/catalog?size=50');
          const catalogProducts = res.data?.content || [];
          if (catalogProducts.length > 0) {
            // Map backend catalog items with inventory stock parameters
            const mappedCatalog = catalogProducts.map((p, idx) => ({
              id: p.id || `inv-cat-${idx}`,
              sku: p.sku_code || `SKU-${idx + 1}`,
              name: p.name,
              category: p.type === 'SERVICE' ? 'Servicios de Recarga' : 'Cilindros & Equipos',
              unit: 'Unidades',
              currentStock: p.type === 'SERVICE' ? 99 : Math.floor(10 + Math.random() * 25),
              minStock: 8,
              unitCostUsd: Number(p.base_price ? (p.base_price * 0.6).toFixed(2) : 20.0),
              salePriceUsd: Number(p.base_price || 35.0),
              location: 'Taller Central Equi-Extin',
              lastRestock: new Date().toISOString(),
            }));

            // Merge with workshop components
            const combined = [...INITIAL_WORKSHOP_INVENTORY, ...mappedCatalog];
            // Deduplicate by SKU
            const unique = Array.from(new Map(combined.map((i) => [i.sku, i])).values());
            setItems(unique);
            localStorage.setItem('extin_inventory_items', JSON.stringify(unique));
          } else {
            setItems(INITIAL_WORKSHOP_INVENTORY);
            localStorage.setItem('extin_inventory_items', JSON.stringify(INITIAL_WORKSHOP_INVENTORY));
          }
        } catch {
          // Fallback to initial seed
          setItems(INITIAL_WORKSHOP_INVENTORY);
          localStorage.setItem('extin_inventory_items', JSON.stringify(INITIAL_WORKSHOP_INVENTORY));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Save changes to localStorage
  const persistInventory = (updatedItems) => {
    setItems(updatedItems);
    try {
      localStorage.setItem('extin_inventory_items', JSON.stringify(updatedItems));
    } catch (e) {
      console.warn('Could not persist inventory to localStorage:', e);
    }
  };

  // Filtered Inventory list
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category / Alert filter
      if (categoryFilter === 'LOW_STOCK') {
        if (item.currentStock > item.minStock) return false;
      } else if (categoryFilter !== 'ALL' && item.category !== categoryFilter) {
        return false;
      }

      // Search query filter
      if (!searchQuery.trim()) return true;
      const term = searchQuery.toLowerCase();
      const skuMatch = (item.sku || '').toLowerCase().includes(term);
      const nameMatch = (item.name || '').toLowerCase().includes(term);
      const catMatch = (item.category || '').toLowerCase().includes(term);
      const locMatch = (item.location || '').toLowerCase().includes(term);

      return skuMatch || nameMatch || catMatch || locMatch;
    });
  }, [items, categoryFilter, searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, searchQuery]);

  // Total pages and paginated items (5 records per page)
  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [filteredItems, currentPage]);

  // Inventory Statistics
  const stats = useMemo(() => {
    const total = items.length;
    const lowStock = items.filter((i) => i.currentStock <= i.minStock).length;
    const optimal = items.filter((i) => i.currentStock > i.minStock).length;
    const totalValuationUsd = items.reduce(
      (sum, i) => sum + (Number(i.currentStock) || 0) * (Number(i.unitCostUsd) || 0),
      0
    );
    const totalValuationVes = totalValuationUsd * 36.50; // Reference BCV rate

    return { total, lowStock, optimal, totalValuationUsd, totalValuationVes };
  }, [items]);

  // Open adjustment modal
  const handleOpenAdjustment = (item) => {
    setSelectedItem(item);
    setAdjustmentType('IN');
    setAdjustmentQty(1);
    setAdjustmentReason('RECEPCION_PROVEEDOR');
    setAdjustmentNotes('');
    setIsAdjustmentModalOpen(true);
    setFeedback(null);
  };

  // Submit stock adjustment
  const handleSaveAdjustment = (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    const qty = Math.max(1, Number(adjustmentQty) || 1);
    const current = Number(selectedItem.currentStock) || 0;
    const updatedStock =
      adjustmentType === 'IN'
        ? current + qty
        : Math.max(0, current - qty);

    const updatedList = items.map((i) =>
      i.id === selectedItem.id
        ? {
            ...i,
            currentStock: updatedStock,
            lastRestock: adjustmentType === 'IN' ? new Date().toISOString() : i.lastRestock,
          }
        : i
    );

    persistInventory(updatedList);
    setIsAdjustmentModalOpen(false);

    setFeedback({
      type: 'success',
      message: `Stock de "${selectedItem.sku}" actualizado a ${updatedStock} ${selectedItem.unit}.`,
    });

    setTimeout(() => setFeedback(null), 4000);
  };

  // Submit new item
  const handleSaveNewItem = (e) => {
    e.preventDefault();
    if (!newItem.sku.trim() || !newItem.name.trim()) {
      setFeedback({
        type: 'error',
        message: 'Por favor ingrese el Código / SKU y el Nombre del Artículo.',
      });
      return;
    }

    const createdItem = {
      id: `inv-${Date.now().toString().slice(-6)}`,
      sku: newItem.sku.trim().toUpperCase(),
      name: newItem.name.trim(),
      category: newItem.category,
      unit: newItem.unit,
      currentStock: Math.max(0, Number(newItem.currentStock) || 0),
      minStock: Math.max(1, Number(newItem.minStock) || 1),
      unitCostUsd: Math.max(0, Number(newItem.unitCostUsd) || 0),
      salePriceUsd: Math.max(0, Number(newItem.salePriceUsd) || 0),
      location: newItem.location.trim() || 'Taller Central',
      lastRestock: new Date().toISOString(),
    };

    const updatedList = [createdItem, ...items];
    persistInventory(updatedList);
    setIsNewItemModalOpen(false);

    // Reset form
    setNewItem({
      sku: '',
      name: '',
      category: 'Cilindros',
      unit: 'Unidades',
      currentStock: 10,
      minStock: 5,
      unitCostUsd: 15.0,
      salePriceUsd: 25.0,
      location: 'Galpón 1',
    });

    setFeedback({
      type: 'success',
      message: `Artículo "${createdItem.sku} - ${createdItem.name}" registrado exitosamente en el inventario.`,
    });

    setTimeout(() => setFeedback(null), 4000);
  };

  // Helper badge for item status
  const getItemStatusBadge = (current, min) => {
    if (current === 0) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
          {t('admin.inventory.statusOut', 'AGOTADO')}
        </span>
      );
    }
    if (current <= min) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-50 dark:bg-red-950/50 text-[#E53935] border border-red-200 dark:border-red-900/60 shadow-2xs animate-pulse">
          <AlertTriangle className="w-3 h-3" />
          {t('admin.inventory.statusLow', 'STOCK BAJO')}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
        <CheckCircle2 className="w-3 h-3" />
        {t('admin.inventory.statusOptimal', 'ÓPTIMO')}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <Package className="w-7 h-7 text-[#E53935]" />
            <span>{t('admin.inventory.title', 'Control de Inventario & Materiales de Taller')}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {t(
              'admin.inventory.subtitle',
              'Supervisión y control de stock de cilindros, agentes extintores (PQS, CO2, Agua, K), manómetros, válvulas y precintos para recargas y despachos.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchInventory}
            disabled={loading}
            className="text-xs border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin text-[#E53935]' : ''}`} />
            {t('admin.inventory.refresh', 'Actualizar')}
          </Button>

          <Button
            size="sm"
            onClick={() => setIsNewItemModalOpen(true)}
            className="bg-[#E53935] hover:bg-[#b71c1c] text-white font-bold text-xs shadow-md shadow-red-500/20"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            {t('admin.inventory.addNewItem', 'Añadir Nuevo Artículo')}
          </Button>
        </div>
      </div>

      {/* Metric Cards (KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Articles */}
        <div
          onClick={() => setCategoryFilter('ALL')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            categoryFilter === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className={categoryFilter === 'ALL' ? 'text-slate-300' : 'text-slate-500'}>
              {t('admin.inventory.statTotal', 'Total Renglones')}
            </span>
            <Boxes className="w-4 h-4 opacity-75" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono">{stats.total}</div>
        </div>

        {/* Low Stock (Alert Filter) */}
        <div
          onClick={() => setCategoryFilter('LOW_STOCK')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            categoryFilter === 'LOW_STOCK'
              ? 'bg-[#E53935] text-white border-[#E53935] shadow-md ring-2 ring-red-500/30'
              : 'bg-white dark:bg-slate-900 border-red-200 dark:border-red-900/60 hover:border-red-400'
          }`}
        >
          <div className="flex justify-between items-center text-xs font-semibold">
            <span
              className={
                categoryFilter === 'LOW_STOCK'
                  ? 'text-red-100'
                  : 'text-[#E53935] font-bold'
              }
            >
              {t('admin.inventory.statLowStock', 'Stock Bajo / Alerta')}
            </span>
            <AlertTriangle className="w-4 h-4 opacity-75" />
          </div>
          <div
            className={`text-2xl font-black mt-2 font-mono ${
              categoryFilter === 'LOW_STOCK' ? 'text-white' : 'text-[#E53935]'
            }`}
          >
            {stats.lowStock}
          </div>
        </div>

        {/* Optimal Stock */}
        <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>{t('admin.inventory.statOptimal', 'Stock Óptimo')}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500 opacity-80" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-emerald-600 dark:text-emerald-400">
            {stats.optimal}
          </div>
        </div>

        {/* Inventory Valuation */}
        <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>{t('admin.inventory.statValuation', 'Valorización en Taller')}</span>
            <TrendingUp className="w-4 h-4 text-amber-500 opacity-80" />
          </div>
          <div className="text-xl font-black mt-2 font-mono text-slate-900 dark:text-slate-100">
            ${stats.totalValuationUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-xs font-sans text-slate-400 ml-1">USD</span>
          </div>
          <div className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 mt-0.5">
            Bs. {stats.totalValuationVes.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Feedback Toast Notification */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-medium animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs opacity-75 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Inventory Card */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        {/* Search & Filter Header */}
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t(
                  'admin.inventory.searchPlaceholder',
                  'Buscar por SKU, nombre, categoría o ubicación...'
                )}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg text-xs placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
                Categoría:
              </span>
              {[
                { key: 'ALL', label: t('admin.inventory.catAll', 'Todos') },
                { key: 'LOW_STOCK', label: t('admin.inventory.catLow', 'Stock Bajo') },
                { key: 'Cilindros', label: 'Cilindros' },
                { key: 'Agentes Químicos', label: 'Agentes Químicos' },
                { key: 'Repuestos & Válvulas', label: 'Repuestos & Válvulas' },
                { key: 'Accesorios de Seguridad', label: 'Accesorios' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setCategoryFilter(tab.key)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                    categoryFilter === tab.key
                      ? 'bg-[#E53935] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        {/* Content Table / Grid */}
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
              <Loader2 className="w-7 h-7 animate-spin text-[#E53935]" />
              <p className="text-xs font-medium">
                {t('admin.inventory.loading', 'Cargando inventario de taller...')}
              </p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-16 text-center text-slate-500 dark:text-slate-400 text-xs space-y-2">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto opacity-70" />
              <p className="font-semibold">
                {t('admin.inventory.emptyMessage', 'No se encontraron artículos con los filtros seleccionados.')}
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE VIEW */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">
                        {t('admin.inventory.colSku', 'Código / SKU')}
                      </th>
                      <th className="px-5 py-3.5">
                        {t('admin.inventory.colName', 'Nombre del Artículo')}
                      </th>
                      <th className="px-5 py-3.5">
                        {t('admin.inventory.colCategory', 'Categoría')}
                      </th>
                      <th className="px-5 py-3.5 text-center">
                        {t('admin.inventory.colCurrentStock', 'Stock Actual')}
                      </th>
                      <th className="px-5 py-3.5 text-center">
                        {t('admin.inventory.colMinStock', 'Stock Mínimo')}
                      </th>
                      <th className="px-5 py-3.5 text-center">
                        {t('admin.inventory.colStatus', 'Estado')}
                      </th>
                      <th className="px-5 py-3.5 text-right">
                        {t('admin.inventory.colActions', 'Acciones')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paginatedItems.map((item) => {
                      const isLow = item.currentStock <= item.minStock;

                      return (
                        <tr
                          key={item.id || item.sku}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                        >
                          {/* SKU */}
                          <td className="px-5 py-3.5 font-mono font-bold text-slate-900 dark:text-slate-100">
                            {item.sku}
                          </td>

                          {/* Name & Location */}
                          <td className="px-5 py-3.5">
                            <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#E53935] transition-colors">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{item.location || 'Taller Central'}</span>
                              <span className="mx-1">•</span>
                              <span>Ref: ${item.unitCostUsd?.toFixed(2)} USD</span>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-5 py-3.5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              {item.category}
                            </span>
                          </td>

                          {/* Current Stock */}
                          <td className="px-5 py-3.5 text-center">
                            <span
                              className={`font-mono text-sm font-black ${
                                isLow
                                  ? 'text-[#E53935] font-black'
                                  : 'text-slate-900 dark:text-slate-100'
                              }`}
                            >
                              {item.currentStock}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-sans">
                              {item.unit}
                            </span>
                          </td>

                          {/* Min Stock */}
                          <td className="px-5 py-3.5 text-center font-mono font-medium text-slate-500 dark:text-slate-400">
                            {item.minStock} {item.unit}
                          </td>

                          {/* Status Badge */}
                          <td className="px-5 py-3.5 text-center">
                            {getItemStatusBadge(item.currentStock, item.minStock)}
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenAdjustment(item)}
                              className="h-7 text-xs border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#E53935] hover:text-[#E53935]"
                            >
                              <SlidersHorizontal className="w-3.5 h-3.5 mr-1 text-[#E53935]" />
                              {t('admin.inventory.btnAdjustStock', 'Ajustar Stock')}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS VIEW */}
              <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedItems.map((item) => {
                  const isLow = item.currentStock <= item.minStock;

                  return (
                    <div
                      key={item.id || item.sku}
                      className="p-4 space-y-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                          {item.sku}
                        </span>
                        {getItemStatusBadge(item.currentStock, item.minStock)}
                      </div>

                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          <span>{item.category}</span>
                          <span className="mx-1">•</span>
                          <span>{item.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Stock Disponible</span>
                          <span
                            className={`font-mono text-base font-black ${
                              isLow ? 'text-[#E53935]' : 'text-slate-900 dark:text-slate-100'
                            }`}
                          >
                            {item.currentStock} {item.unit}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            (Mínimo: {item.minStock} {item.unit})
                          </span>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenAdjustment(item)}
                          className="h-8 text-xs border-slate-300 dark:border-slate-700 text-[#E53935]"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />
                          Ajustar
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Classic Navigation Pagination (5 records per page) */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredItems.length}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* STOCK ADJUSTMENT MODAL */}
      {isAdjustmentModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsAdjustmentModalOpen(false)}
            aria-hidden="true"
          />

          <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
            <div
              className="w-full max-w-lg transform rounded-2xl bg-white dark:bg-slate-900 text-left align-middle shadow-2xl transition-all border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 p-6 space-y-5"
              role="dialog"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#E53935] flex items-center justify-center border border-red-100 dark:border-red-900/50">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                      {t('admin.inventory.modalAdjustTitle', 'Ajuste de Stock')}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {selectedItem.sku} • {selectedItem.name}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAdjustmentModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveAdjustment} className="space-y-4 text-xs">
                {/* Operation Type Switch */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setAdjustmentType('IN')}
                    className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                      adjustmentType === 'IN'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <ArrowDownLeft className="w-4 h-4" />
                    <span>Entrada (+) Proveedor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustmentType('OUT')}
                    className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                      adjustmentType === 'OUT'
                        ? 'bg-[#E53935] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Salida (-) Taller / Despacho</span>
                  </button>
                </div>

                {/* Current Stock vs New Stock Preview */}
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Stock Actual</span>
                    <span className="text-lg font-black font-mono text-slate-900 dark:text-slate-100">
                      {selectedItem.currentStock} {selectedItem.unit}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Stock Resultante</span>
                    <span
                      className={`text-lg font-black font-mono ${
                        (adjustmentType === 'IN'
                          ? selectedItem.currentStock + Number(adjustmentQty || 0)
                          : selectedItem.currentStock - Number(adjustmentQty || 0)) <= selectedItem.minStock
                          ? 'text-[#E53935]'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {adjustmentType === 'IN'
                        ? selectedItem.currentStock + Number(adjustmentQty || 0)
                        : Math.max(0, selectedItem.currentStock - Number(adjustmentQty || 0))}{' '}
                      {selectedItem.unit}
                    </span>
                  </div>
                </div>

                {/* Quantity Input with quick buttons */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cantidad a {adjustmentType === 'IN' ? 'Ingresar' : 'Retirar'} ({selectedItem.unit})
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      required
                      value={adjustmentQty}
                      onChange={(e) => setAdjustmentQty(Math.max(1, Number(e.target.value)))}
                      className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
                    />
                    {[1, 5, 10, 25].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setAdjustmentQty(amt)}
                        className="px-2.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 rounded-lg font-mono font-bold text-xs"
                      >
                        +{amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preset Reason Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Motivo del Movimiento
                  </label>
                  <select
                    value={adjustmentReason}
                    onChange={(e) => setAdjustmentReason(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    {adjustmentType === 'IN' ? (
                      <>
                        <option value="RECEPCION_PROVEEDOR">Recepción de Factura / Compra Proveedor</option>
                        <option value="DEVOLUCION_TALLER">Devolución / Sobrante de Taller</option>
                        <option value="AJUSTE_FISICO">Ajuste por Conteo Físico / Auditoría</option>
                      </>
                    ) : (
                      <>
                        <option value="RECARGA_TALLER">Consumo en Recarga de Extintores (Taller)</option>
                        <option value="VENTA_EQUIPO">Venta y Despacho de Equipo Nuevo</option>
                        <option value="MERMA_TALLER">Merma / Cilindro o Pieza Defectuosa</option>
                        <option value="AJUSTE_FISICO">Ajuste por Conteo Físico</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Reference / Note Input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Referencia o Nro. de Orden (Opcional)
                  </label>
                  <input
                    type="text"
                    value={adjustmentNotes}
                    onChange={(e) => setAdjustmentNotes(e.target.value)}
                    placeholder="Ej. Factura Proveedor #3820 o Cotización #QT-9041"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAdjustmentModalOpen(false)}
                    className="text-xs"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className={`text-white font-bold text-xs ${
                      adjustmentType === 'IN'
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-[#E53935] hover:bg-[#b71c1c]'
                    }`}
                  >
                    Confirmar Ajuste de Stock
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* NEW ITEM MODAL */}
      {isNewItemModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsNewItemModalOpen(false)}
            aria-hidden="true"
          />

          <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
            <div
              className="w-full max-w-lg transform rounded-2xl bg-white dark:bg-slate-900 text-left align-middle shadow-2xl transition-all border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 p-6 space-y-4"
              role="dialog"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#E53935] flex items-center justify-center border border-red-100 dark:border-red-900/50">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                      {t('admin.inventory.modalNewTitle', 'Añadir Nuevo Artículo al Inventario')}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Registro de cilindros, materiales químicos o piezas de repuesto
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsNewItemModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveNewItem} className="space-y-3.5 text-xs">
                {/* SKU & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Código / SKU <span className="text-[#E53935]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. CIL-PQS-5 o MANOM-200"
                      value={newItem.sku}
                      onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold text-xs uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Categoría
                    </label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold"
                    >
                      <option value="Cilindros">Cilindros</option>
                      <option value="Agentes Químicos">Agentes Químicos (PQS, CO2, Agua, K)</option>
                      <option value="Repuestos & Válvulas">Repuestos & Válvulas</option>
                      <option value="Accesorios de Seguridad">Accesorios de Seguridad</option>
                    </select>
                  </div>
                </div>

                {/* Article Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre del Artículo / Descripción <span className="text-[#E53935]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Cilindro PQS 5 Lbs con Soporte Metálico"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>

                {/* Unit & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Unidad de Medida
                    </label>
                    <select
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold"
                    >
                      <option value="Unidades">Unidades (Piezas)</option>
                      <option value="Kilogramos">Kilogramos (Kg)</option>
                      <option value="Sacos">Sacos (25kg / 50kg)</option>
                      <option value="Litros">Litros (L)</option>
                      <option value="Packs">Packs / Cajas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Ubicación en Taller
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Galpón 1 - Estante A-2"
                      value={newItem.location}
                      onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Stock Initial & Min Stock */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Stock Inicial
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newItem.currentStock}
                      onChange={(e) =>
                        setNewItem({ ...newItem, currentStock: Math.max(0, Number(e.target.value)) })
                      }
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Stock Mínimo de Alerta
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newItem.minStock}
                      onChange={(e) =>
                        setNewItem({ ...newItem, minStock: Math.max(1, Number(e.target.value)) })
                      }
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold text-xs"
                    />
                  </div>
                </div>

                {/* Costs */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Costo Unitario (USD)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={newItem.unitCostUsd}
                      onChange={(e) =>
                        setNewItem({ ...newItem, unitCostUsd: Math.max(0, Number(e.target.value)) })
                      }
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Precio de Venta / Ref. (USD)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={newItem.salePriceUsd}
                      onChange={(e) =>
                        setNewItem({ ...newItem, salePriceUsd: Math.max(0, Number(e.target.value)) })
                      }
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold text-xs"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsNewItemModalOpen(false)}
                    className="text-xs"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#E53935] hover:bg-[#b71c1c] text-white font-bold text-xs shadow-xs"
                  >
                    Guardar Artículo
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
