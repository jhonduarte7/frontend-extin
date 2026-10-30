import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileSpreadsheet,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  Receipt,
  Loader2,
  RefreshCw,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/services/api';
import QuoteDetailModal from '@/components/admin/QuoteDetailModal';
import Pagination from '@/components/Pagination';

// Coherent fallback quotes ensuring complete UI functionality
const MOCK_INITIAL_QUOTES = [
  {
    quote_id: 'QT-2026-9041',
    customer_name: 'Inversiones Metalmecánicas del Este C.A.',
    customer_tax_id: 'J-30894512-4',
    customer_phone: '+58 414-2345678',
    customer_email: 'compras@metaleste.com',
    customer_city: 'Caracas',
    customer_address: 'Av. Francisco de Miranda, Centro Seguros, Piso 5',
    issue_date: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'PENDING',
    target_currency: 'VES',
    exchange_rate: 36.50,
    subtotal: 144.00,
    applies_iva: true,
    tax_rate: 16.00,
    tax_amount: 23.04,
    total_amount_usd: 167.04,
    total_amount_local: 6096.96,
    items: [
      {
        sku: 'PQS-10',
        name: 'Extintor Polvo Químico PQS 10 Lbs ABC',
        type: 'PRODUCT',
        quantity: 3,
        unit_price: 38.00,
        subtotal: 114.00,
      },
      {
        sku: 'REC-CO2-10',
        name: 'Servicio de Recarga CO2 10 Lbs',
        type: 'SERVICE',
        quantity: 2,
        unit_price: 15.00,
        subtotal: 30.00,
      },
    ],
  },
  {
    quote_id: 'QT-2026-8812',
    customer_name: 'Bodegón & Alimentos Santa Fe C.A.',
    customer_tax_id: 'J-41223984-1',
    customer_phone: '+58 424-9876543',
    customer_email: 'administracion@bodegonsantafe.ve',
    customer_city: 'Miranda',
    customer_address: 'C.C. Santa Fe Norte, Nivel PB, Local 12',
    issue_date: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'APPROVED',
    target_currency: 'VES',
    exchange_rate: 36.50,
    subtotal: 167.00,
    applies_iva: false,
    tax_rate: 0.00,
    tax_amount: 0.00,
    total_amount_usd: 167.00,
    total_amount_local: 6095.50,
    items: [
      {
        sku: 'REC-PQS-10',
        name: 'Servicio Recarga PQS 10 Lbs',
        type: 'SERVICE',
        quantity: 6,
        unit_price: 12.00,
        subtotal: 72.00,
      },
      {
        sku: 'K6-CHEM',
        name: 'Extintor Acetato de Potasio 6 Lts (Cocina)',
        type: 'PRODUCT',
        quantity: 1,
        unit_price: 95.00,
        subtotal: 95.00,
      },
    ],
  },
  {
    quote_id: 'QT-2026-7510',
    customer_name: 'Taller Mecánico Los Ruices C.A.',
    customer_tax_id: 'V-14567890-3',
    customer_phone: '+58 412-1122334',
    customer_email: 'tallerlosruices@gmail.com',
    customer_city: 'Caracas',
    customer_address: 'Calle Los Laboratorios, Galpón 8, Los Ruices',
    issue_date: new Date(Date.now() - 3600000 * 48).toISOString(),
    status: 'INVOICED',
    invoice_number: 'FC-00482',
    target_currency: 'VES',
    exchange_rate: 36.50,
    subtotal: 76.00,
    applies_iva: false,
    tax_rate: 0.00,
    tax_amount: 0.00,
    total_amount_usd: 76.00,
    total_amount_local: 2774.00,
    payment_reference: 'PM-993214',
    items: [
      {
        sku: 'PQS-20',
        name: 'Extintor Polvo Químico PQS 20 Lbs',
        type: 'PRODUCT',
        quantity: 1,
        unit_price: 52.00,
        subtotal: 52.00,
      },
      {
        sku: 'REC-PQS-10',
        name: 'Recarga Cilindro PQS 10 Lbs',
        type: 'SERVICE',
        quantity: 2,
        unit_price: 12.00,
        subtotal: 24.00,
      },
    ],
  },
  {
    quote_id: 'QT-2026-6409',
    customer_name: 'Centro Médico Quirúrgico Ávila C.A.',
    customer_tax_id: 'J-29837461-8',
    customer_phone: '+58 212-5558899',
    customer_email: 'suministros@clinicaavila.com',
    customer_city: 'Caracas',
    customer_address: 'Urb. San Bernardino, Av. Panteón',
    issue_date: new Date(Date.now() - 3600000 * 72).toISOString(),
    status: 'PENDING',
    target_currency: 'VES',
    exchange_rate: 36.50,
    subtotal: 340.00,
    applies_iva: true,
    tax_rate: 16.00,
    tax_amount: 54.40,
    total_amount_usd: 394.40,
    total_amount_local: 14395.60,
    items: [
      {
        sku: 'CO2-15',
        name: 'Extintor CO2 15 Lbs (Quirófanos / Servidores)',
        type: 'PRODUCT',
        quantity: 4,
        unit_price: 85.00,
        subtotal: 340.00,
      },
    ],
  },
];

export default function QuotesAdminPage() {
  const { t } = useTranslation();

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'APPROVED' | 'INVOICED'
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;

  // Load quotes from backend API with localStorage & fallback integration
  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/quotes?page=0&size=50');
      const backendQuotes = res.data?.content || [];

      // Retrieve locally submitted quotes from storefront
      let localQuotes = [];
      try {
        localQuotes = JSON.parse(localStorage.getItem('extin_submitted_quotes') || '[]');
      } catch (_e) {
        console.warn('Could not parse local quotes', _e);
      }

      // Merge backend + local + mock seed if backend is empty
      if (backendQuotes.length > 0) {
        // Map backend DTOs cleanly
        const merged = [...localQuotes, ...backendQuotes];
        // Deduplicate by quote_id
        const uniqueQuotes = Array.from(new Map(merged.map(q => [q.quote_id, q])).values());
        setQuotes(uniqueQuotes);
      } else {
        // Fallback with mock seed + any local storefront quotes
        const merged = [...localQuotes, ...MOCK_INITIAL_QUOTES];
        const uniqueQuotes = Array.from(new Map(merged.map(q => [q.quote_id, q])).values());
        setQuotes(uniqueQuotes);
      }
    } catch (err) {
      console.warn('Backend quotes fetch fallback activated:', err);
      let localQuotes = [];
      try {
        localQuotes = JSON.parse(localStorage.getItem('extin_submitted_quotes') || '[]');
      } catch {
        // Ignored
      }
      const merged = [...localQuotes, ...MOCK_INITIAL_QUOTES];
      const uniqueQuotes = Array.from(new Map(merged.map(q => [q.quote_id, q])).values());
      setQuotes(uniqueQuotes);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // Filtered & searched quotes
  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      // Status filter
      if (statusFilter !== 'ALL' && q.status !== statusFilter) {
        return false;
      }

      // Search query filter
      if (!searchQuery.trim()) return true;

      const qTerm = searchQuery.toLowerCase();
      const idMatch = (q.quote_id || '').toLowerCase().includes(qTerm);
      const nameMatch = (q.customer_name || '').toLowerCase().includes(qTerm);
      const taxMatch = (q.customer_tax_id || q.document_number || '').toLowerCase().includes(qTerm);
      const phoneMatch = (q.customer_phone || '').toLowerCase().includes(qTerm);
      const cityMatch = (q.customer_city || '').toLowerCase().includes(qTerm);

      return idMatch || nameMatch || taxMatch || phoneMatch || cityMatch;
    });
  }, [quotes, statusFilter, searchQuery]);

  // Reset page index when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  // Total pages and paginated quotes (5 records per page)
  const totalPages = Math.ceil(filteredQuotes.length / PAGE_SIZE) || 1;
  const paginatedQuotes = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredQuotes.slice(start, start + PAGE_SIZE);
  }, [filteredQuotes, currentPage]);

  // Statistics counters
  const stats = useMemo(() => {
    return {
      total: quotes.length,
      pending: quotes.filter((q) => q.status === 'PENDING').length,
      approved: quotes.filter((q) => q.status === 'APPROVED').length,
      invoiced: quotes.filter((q) => q.status === 'INVOICED').length,
    };
  }, [quotes]);

  // Open modal handler
  const handleOpenDetail = (quote) => {
    setSelectedQuote(quote);
    setIsModalOpen(true);
  };

  // Callback when a quote is updated or invoiced in modal
  const handleQuoteUpdated = (updatedQuote) => {
    setQuotes((prev) =>
      prev.map((q) => (q.quote_id === updatedQuote.quote_id ? updatedQuote : q))
    );
    setSelectedQuote(updatedQuote);
  };

  // Quick Approve action from table
  const handleQuickApprove = async (quote, e) => {
    e.stopPropagation();
    try {
      await api.patch(`/admin/quotes/${quote.quote_id}/status?status=APPROVED`);
    } catch (err) {
      console.warn('Quick approve fallback:', err);
    }
    const updated = { ...quote, status: 'APPROVED' };
    handleQuoteUpdated(updated);
  };

  // Status Badge UI component
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="warning" className="text-[10px] uppercase font-bold">
            <Clock className="w-3 h-3 mr-1" />
            {t('admin.quotes.statusPending', 'PENDIENTE')}
          </Badge>
        );
      case 'APPROVED':
        return (
          <Badge variant="info" className="text-[10px] uppercase font-bold">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {t('admin.quotes.statusApproved', 'APROBADO')}
          </Badge>
        );
      case 'INVOICED':
        return (
          <Badge variant="success" className="text-[10px] uppercase font-bold">
            <Receipt className="w-3 h-3 mr-1" />
            {t('admin.quotes.statusInvoiced', 'FACTURADO')}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px] uppercase font-bold">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <FileSpreadsheet className="w-7 h-7 text-[#E53935]" />
            <span>{t('admin.quotes.title', 'Gestión de Cotizaciones y Talonarios')}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {t(
              'admin.quotes.subtitle',
              'Revisión comercial, fijación de modalidad tributaria (Con IVA / Sin IVA) y emisión de facturas a tasa oficial BCV.'
            )}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchQuotes}
          disabled={loading}
          className="text-xs border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin text-[#E53935]' : ''}`} />
          {t('admin.quotes.refresh', 'Actualizar Lista')}
        </Button>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Quotes */}
        <div
          onClick={() => setStatusFilter('ALL')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className={statusFilter === 'ALL' ? 'text-slate-300' : 'text-slate-500'}>
              {t('admin.quotes.statsTotal', 'Total Cotizaciones')}
            </span>
            <FileSpreadsheet className="w-4 h-4 opacity-75" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono">{stats.total}</div>
        </div>

        {/* Pending */}
        <div
          onClick={() => setStatusFilter('PENDING')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'PENDING'
              ? 'bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400'
          }`}
        >
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className={statusFilter === 'PENDING' ? 'text-amber-100' : 'text-amber-600 dark:text-amber-400'}>
              {t('admin.quotes.statsPending', 'Pendientes')}
            </span>
            <Clock className="w-4 h-4 opacity-75" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-amber-600 dark:text-amber-400 group-hover:text-amber-500">
            <span className={statusFilter === 'PENDING' ? 'text-white' : ''}>{stats.pending}</span>
          </div>
        </div>

        {/* Approved */}
        <div
          onClick={() => setStatusFilter('APPROVED')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'APPROVED'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-600/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400'
          }`}
        >
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className={statusFilter === 'APPROVED' ? 'text-blue-100' : 'text-blue-600 dark:text-blue-400'}>
              {t('admin.quotes.statsApproved', 'Aprobadas')}
            </span>
            <CheckCircle2 className="w-4 h-4 opacity-75" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-blue-600 dark:text-blue-400">
            <span className={statusFilter === 'APPROVED' ? 'text-white' : ''}>{stats.approved}</span>
          </div>
        </div>

        {/* Invoiced */}
        <div
          onClick={() => setStatusFilter('INVOICED')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'INVOICED'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-600/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-400'
          }`}
        >
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className={statusFilter === 'INVOICED' ? 'text-emerald-100' : 'text-emerald-600 dark:text-emerald-400'}>
              {t('admin.quotes.statsInvoiced', 'Facturadas')}
            </span>
            <Receipt className="w-4 h-4 opacity-75" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-emerald-600 dark:text-emerald-400">
            <span className={statusFilter === 'INVOICED' ? 'text-white' : ''}>{stats.invoiced}</span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        {/* Filter & Search Bar Header */}
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
                  'admin.quotes.searchPlaceholder',
                  'Buscar por cliente, RIF o Nro. de solicitud...'
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

            {/* Quick Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
                Filtrar:
              </span>
              {[
                { key: 'ALL', label: t('admin.quotes.filterAll', 'Todos') },
                { key: 'PENDING', label: t('admin.quotes.filterPending', 'Pendientes') },
                { key: 'APPROVED', label: t('admin.quotes.filterApproved', 'Aprobadas') },
                { key: 'INVOICED', label: t('admin.quotes.filterInvoiced', 'Facturadas') },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusFilter(tab.key)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === tab.key
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

        {/* Table Content */}
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
              <Loader2 className="w-7 h-7 animate-spin text-[#E53935]" />
              <p className="text-xs font-medium">
                {t('admin.quotes.loading', 'Cargando cotizaciones comerciales...')}
              </p>
            </div>
          ) : filteredQuotes.length === 0 ? (
            <div className="py-16 text-center text-slate-500 dark:text-slate-400 text-xs space-y-2">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto opacity-70" />
              <p className="font-semibold">
                {t('admin.quotes.emptyMessage', 'No se encontraron cotizaciones con los filtros seleccionados.')}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-xs"
                >
                  Limpiar búsqueda
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE VIEW */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">
                        {t('admin.quotes.colId', 'Nro. Solicitud')}
                      </th>
                      <th className="px-5 py-3.5">
                        {t('admin.quotes.colCustomer', 'Cliente / Empresa')}
                      </th>
                      <th className="px-5 py-3.5">
                        {t('admin.quotes.colPhone', 'Teléfono')}
                      </th>
                      <th className="px-5 py-3.5">
                        {t('admin.quotes.colDate', 'Fecha')}
                      </th>
                      <th className="px-5 py-3.5">
                        {t('admin.quotes.colModality', 'Modalidad')}
                      </th>
                      <th className="px-5 py-3.5 text-right">
                        {t('admin.quotes.colTotal', 'Monto Total')}
                      </th>
                      <th className="px-5 py-3.5 text-center">
                        {t('admin.quotes.colStatus', 'Estado')}
                      </th>
                      <th className="px-5 py-3.5 text-right">
                        {t('admin.quotes.colActions', 'Acciones')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paginatedQuotes.map((q) => {
                      const formattedDate = q.issue_date
                        ? new Date(q.issue_date).toLocaleDateString('es-VE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })
                        : 'Hoy';

                      const totalUsd = q.total_amount_usd || q.subtotal || 0;
                      const totalLocal = q.total_amount_local || totalUsd * (q.exchange_rate || 36.50);

                      return (
                        <tr
                          key={q.quote_id}
                          onClick={() => handleOpenDetail(q)}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                        >
                          {/* Quote ID */}
                          <td className="px-5 py-3.5 font-mono font-bold text-slate-900 dark:text-slate-100">
                            #{q.quote_id.substring(0, 12)}
                          </td>

                          {/* Customer */}
                          <td className="px-5 py-3.5">
                            <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#E53935] transition-colors">
                              {q.customer_name || 'Inversiones Generales'}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                              {q.customer_tax_id || q.document_number || 'J-XXXXXXXX-X'} • {q.customer_city || 'Caracas'}
                            </div>
                          </td>

                          {/* Phone */}
                          <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 font-medium">
                            {q.customer_phone || '+58 212-2437061'}
                          </td>

                          {/* Date */}
                          <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                            {formattedDate}
                          </td>

                          {/* Modality */}
                          <td className="px-5 py-3.5">
                            {q.applies_iva ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                Con IVA ({q.tax_rate || 16}%)
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                Sin IVA (Contado)
                              </span>
                            )}
                          </td>

                          {/* Total */}
                          <td className="px-5 py-3.5 text-right">
                            <div className="font-mono font-black text-slate-900 dark:text-slate-100">
                              ${totalUsd.toFixed(2)} USD
                            </div>
                            <div className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                              Bs. {totalLocal.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-3.5 text-center">
                            {renderStatusBadge(q.status)}
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                              {q.status === 'PENDING' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => handleQuickApprove(q, e)}
                                  className="h-7 px-2 text-[11px] border-slate-300 dark:border-slate-700 text-blue-600 hover:text-blue-700"
                                  title="Aprobar presupuesto"
                                >
                                  <FileCheck className="w-3.5 h-3.5" />
                                </Button>
                              )}

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenDetail(q)}
                                className="h-7 text-xs border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#E53935] hover:text-[#E53935]"
                              >
                                <Eye className="w-3.5 h-3.5 mr-1" />
                                {t('admin.quotes.btnViewDetail', 'Detalle')}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS VIEW */}
              <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedQuotes.map((q) => {
                  const formattedDate = q.issue_date
                    ? new Date(q.issue_date).toLocaleDateString('es-VE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })
                    : 'Hoy';

                  const totalUsd = q.total_amount_usd || q.subtotal || 0;
                  const totalLocal = q.total_amount_local || totalUsd * (q.exchange_rate || 36.50);

                  return (
                    <div
                      key={q.quote_id}
                      onClick={() => handleOpenDetail(q)}
                      className="p-4 space-y-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                            #{q.quote_id.substring(0, 10)}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {formattedDate}
                          </span>
                        </div>
                        {renderStatusBadge(q.status)}
                      </div>

                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {q.customer_name || 'Inversiones Generales'}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {q.customer_tax_id || q.document_number} • {q.customer_phone}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Total Estimado</span>
                          <span className="font-mono font-black text-slate-900 dark:text-slate-100">
                            ${totalUsd.toFixed(2)} USD
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono block">
                            Bs. {totalLocal.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(q);
                          }}
                          className="h-8 text-xs border-slate-300 dark:border-slate-700 text-[#E53935]"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Ver Detalle
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
                totalItems={filteredQuotes.length}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Quote Detail & Invoicing Modal */}
      <QuoteDetailModal
        quote={selectedQuote}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedQuote(null);
        }}
        onQuoteUpdated={handleQuoteUpdated}
      />
    </div>
  );
}
