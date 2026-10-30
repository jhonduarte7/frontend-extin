import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Search,
  Plus,
  Phone,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Flame,
  Eye,
  RefreshCw,
  Loader2,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/services/api';
import ClientDetailModal from '@/components/admin/ClientDetailModal';
import Pagination from '@/components/Pagination';

// Initial realistic B2B Customers and their Equipment for Equi-Extin
const INITIAL_CRM_CUSTOMERS = [
  {
    id: 'cust-001',
    tax_id: 'J-30894512-4',
    business_name: 'Inversiones Metalmecánicas del Este C.A.',
    contact_person: 'Ing. Carlos Mendoza (Seguridad)',
    phone: '+58 414-2345678',
    email: 'compras@metaleste.com',
    city: 'Caracas',
    address: 'Av. Francisco de Miranda, Centro Seguros, Piso 5',
    equipment: [
      {
        id: 'eq-101',
        serialNumber: 'SN-PQS-8821',
        equipmentType: 'Extintor PQS 10 Lbs ABC',
        capacity: '10 Lbs',
        location: 'Cuarto de Máquinas - Galpón A',
        lastRefillDate: '2025-08-10',
        expirationDate: '2026-08-10', // EXPIRED
        notes: 'Cilindro con prueba hidrostática vencida hace 2 meses',
      },
      {
        id: 'eq-102',
        serialNumber: 'SN-CO2-3319',
        equipmentType: 'Extintor CO2 15 Lbs BC',
        capacity: '15 Lbs',
        location: 'Sala de Servidores',
        lastRefillDate: '2025-11-20',
        expirationDate: '2026-11-20', // EXPIRING SOON
        notes: 'Próximo a vencer el mes entrante',
      },
      {
        id: 'eq-103',
        serialNumber: 'SN-PQS-9904',
        equipmentType: 'Extintor PQS 20 Lbs ABC',
        capacity: '20 Lbs',
        location: 'Entrada Principal Galpón',
        lastRefillDate: '2026-02-15',
        expirationDate: '2027-02-15', // VALID
        notes: 'Equipo en condiciones óptimas',
      },
    ],
  },
  {
    id: 'cust-002',
    tax_id: 'J-20456789-1',
    business_name: 'Manufacturas Metalúrgicas del Centro C.A.',
    contact_person: 'Lcdo. Roberto Silva (Mantenimiento)',
    phone: '+58 243-551-8765',
    email: 'ventas@metalcentro.ve',
    city: 'Maracay',
    address: 'Zona Industrial San Vicente, Calle 4, Maracay, Edo. Aragua',
    equipment: [
      {
        id: 'eq-201',
        serialNumber: 'SN-PQS-1044',
        equipmentType: 'Extintor PQS 20 Lbs ABC',
        capacity: '20 Lbs',
        location: 'Taller de Tornería',
        lastRefillDate: '2025-09-01',
        expirationDate: '2026-09-01', // EXPIRED
        notes: 'Prueba hidrostática vencida',
      },
      {
        id: 'eq-202',
        serialNumber: 'SN-H2O-5510',
        equipmentType: 'Extintor Agua Presurizada 2.5 Gal',
        capacity: '2.5 Gal',
        location: 'Depósito de Madera y Cartón',
        lastRefillDate: '2026-01-10',
        expirationDate: '2027-01-10', // VALID
        notes: 'En servicio activo',
      },
    ],
  },
  {
    id: 'cust-003',
    tax_id: 'J-41223984-1',
    business_name: 'Bodegón & Alimentos Santa Fe C.A.',
    contact_person: 'Sra. Elena Rodríguez (Administración)',
    phone: '+58 424-9876543',
    email: 'administracion@bodegonsantafe.ve',
    city: 'Miranda',
    address: 'C.C. Santa Fe Norte, Nivel PB, Local 12, Baruta',
    equipment: [
      {
        id: 'eq-301',
        serialNumber: 'SN-K-6001',
        equipmentType: 'Extintor Acetato de Potasio 6 Lts Clase K',
        capacity: '6 Litros',
        location: 'Cocina / Freidoras Industriales',
        lastRefillDate: '2025-10-25',
        expirationDate: '2026-10-25', // EXPIRING SOON
        notes: 'Vence esta semana',
      },
      {
        id: 'eq-302',
        serialNumber: 'SN-PQS-7712',
        equipmentType: 'Extintor PQS 10 Lbs ABC',
        capacity: '10 Lbs',
        location: 'Pasillo Central de Venta',
        lastRefillDate: '2026-03-05',
        expirationDate: '2027-03-05', // VALID
        notes: 'Al día',
      },
    ],
  },
  {
    id: 'cust-004',
    tax_id: 'J-60890123-5',
    business_name: 'Clínica y Especialidades Santa Sofía C.A.',
    contact_person: 'Dr. Fernando Gómez (Operaciones)',
    phone: '+58 212-985-3344',
    email: 'mantenimiento@clinicasantasofia.com',
    city: 'Caracas',
    address: 'Av. Principal del Cafetal, Edif. Torre Médica, Caracas',
    equipment: [
      {
        id: 'eq-401',
        serialNumber: 'SN-CO2-9981',
        equipmentType: 'Extintor CO2 10 Lbs BC',
        capacity: '10 Lbs',
        location: 'Quirófano 3',
        lastRefillDate: '2026-04-12',
        expirationDate: '2027-04-12', // VALID
        notes: 'Certificación médica COVENIN',
      },
      {
        id: 'eq-402',
        serialNumber: 'SN-CO2-9982',
        equipmentType: 'Extintor CO2 10 Lbs BC',
        capacity: '10 Lbs',
        location: 'Sala de Imagenología / Rayos X',
        lastRefillDate: '2026-04-12',
        expirationDate: '2027-04-12', // VALID
        notes: 'Certificado de no conductividad',
      },
    ],
  },
  {
    id: 'cust-005',
    tax_id: 'J-70901234-6',
    business_name: 'Supermercados Plaza Mayor C.A.',
    contact_person: 'Ing. Maricarmen Díaz (Prevención)',
    phone: '+58 281-286-5544',
    email: 'administracion@plazamayor.com',
    city: 'Anzoátegui',
    address: 'Av. Intercomunal Jorge Rodríguez, Lechería',
    equipment: [
      {
        id: 'eq-501',
        serialNumber: 'SN-PQS-4401',
        equipmentType: 'Extintor PQS 20 Lbs',
        capacity: '20 Lbs',
        location: 'Muelle de Carga y Descarga',
        lastRefillDate: '2025-07-15',
        expirationDate: '2026-07-15', // EXPIRED
        notes: 'Venció hace 3 meses',
      },
      {
        id: 'eq-502',
        serialNumber: 'SN-PQS-4402',
        equipmentType: 'Extintor PQS 10 Lbs',
        capacity: '10 Lbs',
        location: 'Pasillo 5 Lácteos',
        lastRefillDate: '2026-05-18',
        expirationDate: '2027-05-18', // VALID
        notes: 'En regla',
      },
    ],
  },
  {
    id: 'cust-006',
    tax_id: 'V-14567890-3',
    business_name: 'Taller Mecánico Los Ruices C.A.',
    contact_person: 'Sr. Marcos Pacheco (Encargado)',
    phone: '+58 412-1122334',
    email: 'tallerlosruices@gmail.com',
    city: 'Caracas',
    address: 'Calle Los Laboratorios, Galpón 8, Los Ruices',
    equipment: [
      {
        id: 'eq-601',
        serialNumber: 'SN-PQS-1100',
        equipmentType: 'Extintor PQS 20 Lbs ABC',
        capacity: '20 Lbs',
        location: 'Fosa de Alineación y Frenos',
        lastRefillDate: '2025-06-20',
        expirationDate: '2026-06-20', // EXPIRED
        notes: 'Requiere recarga urgente de taller',
      },
    ],
  },
];

export default function ClientsAdminPage() {
  const { t } = useTranslation();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [alertFilter, setAlertFilter] = useState('ALL'); // 'ALL' | 'EXPIRED' | 'EXPIRING' | 'VALID'
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;

  // Modals state
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);

  // New Client Form state
  const [newClient, setNewClient] = useState({
    business_name: '',
    tax_id: '',
    contact_person: '',
    phone: '',
    email: '',
    city: 'Caracas',
    address: '',
  });

  const [feedback, setFeedback] = useState(null);

  // Fetch Customers from backend API + localStorage fallback
  const fetchCustomers = async () => {
    try {
      setLoading(true);

      // Check local storage persistence first
      let localCustomers = [];
      try {
        const stored = localStorage.getItem('extin_crm_customers');
        if (stored) {
          localCustomers = JSON.parse(stored);
        }
      } catch (e) {
        console.warn('Could not parse local CRM customers:', e);
      }

      if (localCustomers.length > 0) {
        setCustomers(localCustomers);
      } else {
        // Query backend for customers
        try {
          const res = await api.get('/admin/customers?size=50');
          const backendCustomers = res.data?.content || [];

          if (backendCustomers.length > 0) {
            // Map backend customers with equipment seed
            const mapped = backendCustomers.map((c, idx) => {
              const seedMatch = INITIAL_CRM_CUSTOMERS.find((sc) => sc.tax_id === c.tax_id);
              return {
                id: c.id || `cust-bk-${idx}`,
                tax_id: c.tax_id,
                business_name: c.business_name,
                contact_person: seedMatch?.contact_person || 'Responsable de Seguridad',
                phone: c.phone,
                email: c.email,
                city: seedMatch?.city || 'Caracas',
                address: c.address,
                equipment: seedMatch?.equipment || [
                  {
                    id: `eq-bk-${idx}-1`,
                    serialNumber: `SN-2026-${1000 + idx}`,
                    equipmentType: 'Extintor PQS 10 Lbs ABC',
                    capacity: '10 Lbs',
                    location: 'Recepción Central',
                    lastRefillDate: '2025-09-10',
                    expirationDate: idx % 2 === 0 ? '2026-09-10' : '2027-03-15',
                    notes: 'Inspeccionado por Equi-Extin',
                  },
                ],
              };
            });

            const unique = Array.from(new Map(mapped.map((c) => [c.tax_id, c])).values());
            setCustomers(unique);
            localStorage.setItem('extin_crm_customers', JSON.stringify(unique));
          } else {
            setCustomers(INITIAL_CRM_CUSTOMERS);
            localStorage.setItem('extin_crm_customers', JSON.stringify(INITIAL_CRM_CUSTOMERS));
          }
        } catch {
          setCustomers(INITIAL_CRM_CUSTOMERS);
          localStorage.setItem('extin_crm_customers', JSON.stringify(INITIAL_CRM_CUSTOMERS));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Save changes to localStorage
  const persistCustomers = (updatedList) => {
    setCustomers(updatedList);
    try {
      localStorage.setItem('extin_crm_customers', JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Could not persist customers to localStorage:', e);
    }
  };

  // Helper to get customer's equipment summary
  const getCustomerAlertSummary = (customer) => {
    const list = customer.equipment || [];
    const today = new Date();

    let expired = 0;
    let expiring = 0;

    list.forEach((eq) => {
      if (!eq.expirationDate) return;
      const diffDays = Math.ceil((new Date(eq.expirationDate) - today) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) expired++;
      else if (diffDays <= 30) expiring++;
    });

    return { total: list.length, expired, expiring, valid: list.length - expired - expiring };
  };

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      const summary = getCustomerAlertSummary(cust);

      // Alert filter
      if (alertFilter === 'EXPIRED' && summary.expired === 0) return false;
      if (alertFilter === 'EXPIRING' && summary.expiring === 0) return false;
      if (alertFilter === 'VALID' && (summary.expired > 0 || summary.expiring > 0)) return false;

      // Search query filter
      if (!searchQuery.trim()) return true;
      const term = searchQuery.toLowerCase();
      const nameMatch = (cust.business_name || '').toLowerCase().includes(term);
      const taxMatch = (cust.tax_id || '').toLowerCase().includes(term);
      const personMatch = (cust.contact_person || '').toLowerCase().includes(term);
      const phoneMatch = (cust.phone || '').toLowerCase().includes(term);
      const cityMatch = (cust.city || '').toLowerCase().includes(term);

      return nameMatch || taxMatch || personMatch || phoneMatch || cityMatch;
    });
  }, [customers, alertFilter, searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [alertFilter, searchQuery]);

  // Total pages and paginated customers (5 records per page)
  const totalPages = Math.ceil(filteredCustomers.length / PAGE_SIZE) || 1;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredCustomers.slice(start, start + PAGE_SIZE);
  }, [filteredCustomers, currentPage]);

  // Overall Statistics
  const stats = useMemo(() => {
    let totalEquipment = 0;
    let totalExpired = 0;
    let totalExpiring = 0;

    customers.forEach((c) => {
      const sum = getCustomerAlertSummary(c);
      totalEquipment += sum.total;
      totalExpired += sum.expired;
      totalExpiring += sum.expiring;
    });

    return {
      totalCustomers: customers.length,
      totalEquipment,
      totalExpired,
      totalExpiring,
    };
  }, [customers]);

  // Open detail modal
  const handleOpenDetail = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  };

  // Handle adding equipment to a customer
  const handleAddEquipment = (customerIdOrTaxId, newEquipment) => {
    const updated = customers.map((c) => {
      if (c.id === customerIdOrTaxId || c.tax_id === customerIdOrTaxId) {
        const currentEq = c.equipment || [];
        return { ...c, equipment: [newEquipment, ...currentEq] };
      }
      return c;
    });

    persistCustomers(updated);
    if (selectedCustomer && (selectedCustomer.id === customerIdOrTaxId || selectedCustomer.tax_id === customerIdOrTaxId)) {
      setSelectedCustomer({
        ...selectedCustomer,
        equipment: [newEquipment, ...(selectedCustomer.equipment || [])],
      });
    }

    setFeedback({
      type: 'success',
      message: `Extintor "${newEquipment.serialNumber}" asociado exitosamente al cliente.`,
    });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Handle performing recharge on a customer's equipment
  const handlePerformRecharge = (customerIdOrTaxId, updatedEquipment) => {
    const updated = customers.map((c) => {
      if (c.id === customerIdOrTaxId || c.tax_id === customerIdOrTaxId) {
        const currentEq = c.equipment || [];
        const refreshed = currentEq.map((eq) =>
          eq.id === updatedEquipment.id || eq.serialNumber === updatedEquipment.serialNumber
            ? updatedEquipment
            : eq
        );
        return { ...c, equipment: refreshed };
      }
      return c;
    });

    persistCustomers(updated);
    if (selectedCustomer && (selectedCustomer.id === customerIdOrTaxId || selectedCustomer.tax_id === customerIdOrTaxId)) {
      setSelectedCustomer({
        ...selectedCustomer,
        equipment: (selectedCustomer.equipment || []).map((eq) =>
          eq.id === updatedEquipment.id || eq.serialNumber === updatedEquipment.serialNumber
            ? updatedEquipment
            : eq
        ),
      });
    }

    setFeedback({
      type: 'success',
      message: `Recarga certificada registrada. Nueva vigencia hasta ${updatedEquipment.expirationDate}.`,
    });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Submit New Customer Form
  const handleSaveNewClient = (e) => {
    e.preventDefault();
    if (!newClient.business_name.trim() || !newClient.tax_id.trim()) {
      setFeedback({
        type: 'error',
        message: 'Por favor ingrese la Razón Social y el RIF de la empresa.',
      });
      return;
    }

    const created = {
      id: `cust-${Date.now().toString().slice(-6)}`,
      tax_id: newClient.tax_id.trim().toUpperCase(),
      business_name: newClient.business_name.trim(),
      contact_person: newClient.contact_person.trim() || 'Responsable de Seguridad',
      phone: newClient.phone.trim() || '+58 212-0000000',
      email: newClient.email.trim() || 'contacto@empresa.com',
      city: newClient.city.trim() || 'Caracas',
      address: newClient.address.trim() || 'Zona Industrial',
      equipment: [],
    };

    const updatedList = [created, ...customers];
    persistCustomers(updatedList);
    setIsNewClientModalOpen(false);

    setNewClient({
      business_name: '',
      tax_id: '',
      contact_person: '',
      phone: '',
      email: '',
      city: 'Caracas',
      address: '',
    });

    setFeedback({
      type: 'success',
      message: `Cliente B2B "${created.business_name}" registrado exitosamente. Ya puede asociar sus extintores.`,
    });
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-[#E53935]" />
            <span>{t('admin.clients.title', 'Directorio de Clientes B2B & Mantenimiento')}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {t(
              'admin.clients.subtitle',
              'Gestión de empresas aliadas, parques de extintores en comodato o propiedad y alertas de prueba hidrostática (PH).'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCustomers}
            disabled={loading}
            className="text-xs border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin text-[#E53935]' : ''}`} />
            {t('admin.clients.refresh', 'Actualizar')}
          </Button>

          <Button
            size="sm"
            onClick={() => setIsNewClientModalOpen(true)}
            className="bg-[#E53935] hover:bg-[#b71c1c] text-white font-bold text-xs shadow-md shadow-red-500/20"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            {t('admin.clients.btnRegisterNew', 'Registrar Nuevo Cliente B2B')}
          </Button>
        </div>
      </div>

      {/* Metric Cards (KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Customers */}
        <div
          onClick={() => setAlertFilter('ALL')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            alertFilter === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className={alertFilter === 'ALL' ? 'text-slate-300' : 'text-slate-500'}>
              {t('admin.clients.statTotalClients', 'Total Empresas')}
            </span>
            <Building2 className="w-4 h-4 opacity-75" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono">{stats.totalCustomers}</div>
        </div>

        {/* Total Installed Equipment */}
        <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>{t('admin.clients.statEquipmentCount', 'Equipos Registrados')}</span>
            <Flame className="w-4 h-4 text-[#E53935] opacity-75" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-slate-900 dark:text-slate-100">
            {stats.totalEquipment}
          </div>
        </div>

        {/* Expired Hydrostatic Alerts (Clickable Filter) */}
        <div
          onClick={() => setAlertFilter('EXPIRED')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            alertFilter === 'EXPIRED'
              ? 'bg-[#E53935] text-white border-[#E53935] shadow-md ring-2 ring-red-500/30'
              : 'bg-white dark:bg-slate-900 border-red-200 dark:border-red-900/60 hover:border-red-400'
          }`}
        >
          <div className="flex justify-between items-center text-xs font-semibold">
            <span
              className={
                alertFilter === 'EXPIRED' ? 'text-red-100' : 'text-[#E53935] font-bold'
              }
            >
              {t('admin.clients.statExpiredAlerts', 'Pruebas Vencidas')}
            </span>
            <AlertTriangle className="w-4 h-4 opacity-75" />
          </div>
          <div
            className={`text-2xl font-black mt-2 font-mono ${
              alertFilter === 'EXPIRED' ? 'text-white' : 'text-[#E53935]'
            }`}
          >
            {stats.totalExpired}
          </div>
        </div>

        {/* Expiring Soon (< 30 days) */}
        <div
          onClick={() => setAlertFilter('EXPIRING')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            alertFilter === 'EXPIRING'
              ? 'bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
              : 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-900/60 hover:border-amber-400'
          }`}
        >
          <div className="flex justify-between items-center text-xs font-semibold">
            <span
              className={
                alertFilter === 'EXPIRING' ? 'text-amber-100' : 'text-amber-600 dark:text-amber-400'
              }
            >
              {t('admin.clients.statExpiringSoon', 'Por Vencer (< 30 días)')}
            </span>
            <Clock className="w-4 h-4 opacity-75" />
          </div>
          <div
            className={`text-2xl font-black mt-2 font-mono ${
              alertFilter === 'EXPIRING' ? 'text-white' : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            {stats.totalExpiring}
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
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

      {/* Main Table Card */}
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
                  'admin.clients.searchPlaceholder',
                  'Buscar por empresa, RIF, contacto, teléfono o ciudad...'
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

            {/* Quick Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
                Filtrar:
              </span>
              {[
                { key: 'ALL', label: t('admin.clients.filterAll', 'Todos los Clientes') },
                { key: 'EXPIRED', label: t('admin.clients.filterExpired', 'Con Pruebas Vencidas') },
                { key: 'EXPIRING', label: t('admin.clients.filterExpiring', 'Próximos a Vencer') },
                { key: 'VALID', label: t('admin.clients.filterValid', 'Al Día') },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setAlertFilter(tab.key)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                    alertFilter === tab.key
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

        {/* Content Table / Cards */}
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
              <Loader2 className="w-7 h-7 animate-spin text-[#E53935]" />
              <p className="text-xs font-medium">
                {t('admin.clients.loading', 'Cargando directorio de clientes B2B...')}
              </p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="py-16 text-center text-slate-500 dark:text-slate-400 text-xs space-y-2">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto opacity-70" />
              <p className="font-semibold">
                {t('admin.clients.emptyMessage', 'No se encontraron clientes con los filtros seleccionados.')}
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
                        {t('admin.clients.colCompany', 'Empresa / Razón Social')}
                      </th>
                      <th className="px-5 py-3.5">
                        {t('admin.clients.colContact', 'Contacto')}
                      </th>
                      <th className="px-5 py-3.5">
                        {t('admin.clients.colPhoneEmail', 'Teléfono / Correo')}
                      </th>
                      <th className="px-5 py-3.5">
                        {t('admin.clients.colCity', 'Ciudad / Sede')}
                      </th>
                      <th className="px-5 py-3.5 text-center">
                        {t('admin.clients.colEquipment', 'Equipos')}
                      </th>
                      <th className="px-5 py-3.5 text-center">
                        {t('admin.clients.colAlerts', 'Estado Hidrostático')}
                      </th>
                      <th className="px-5 py-3.5 text-right">
                        {t('admin.clients.colActions', 'Acciones')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paginatedCustomers.map((c) => {
                      const summary = getCustomerAlertSummary(c);
                      const hasExpired = summary.expired > 0;
                      const hasExpiring = summary.expiring > 0;

                      return (
                        <tr
                          key={c.id || c.tax_id}
                          onClick={() => handleOpenDetail(c)}
                          className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group ${
                            hasExpired ? 'bg-red-50/30 dark:bg-red-950/10' : ''
                          }`}
                        >
                          {/* Company Name & Tax ID */}
                          <td className="px-5 py-3.5">
                            <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#E53935] transition-colors flex items-center gap-1.5">
                              <span>{c.business_name}</span>
                            </div>
                            <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                              RIF: {c.tax_id}
                            </div>
                          </td>

                          {/* Contact Person */}
                          <td className="px-5 py-3.5">
                            <div className="font-medium text-slate-800 dark:text-slate-200">
                              {c.contact_person || 'Responsable de Seguridad'}
                            </div>
                          </td>

                          {/* Phone & Email */}
                          <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
                            <div className="font-mono font-medium">{c.phone}</div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                              {c.email}
                            </div>
                          </td>

                          {/* City */}
                          <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
                            <div className="font-semibold text-slate-700 dark:text-slate-300">
                              {c.city || 'Caracas'}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                              {c.address}
                            </div>
                          </td>

                          {/* Equipment Count */}
                          <td className="px-5 py-3.5 text-center">
                            <span className="font-mono font-black text-sm text-slate-900 dark:text-slate-100">
                              {summary.total}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-sans">
                              extintores
                            </span>
                          </td>

                          {/* Status Badge */}
                          <td className="px-5 py-3.5 text-center">
                            {hasExpired ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#E53935] text-white shadow-2xs animate-pulse">
                                <AlertTriangle className="w-3 h-3" />
                                {summary.expired} {summary.expired === 1 ? 'VENCIDO' : 'VENCIDOS'}
                              </span>
                            ) : hasExpiring ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                <Clock className="w-3 h-3" />
                                {summary.expiring} POR VENCER
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                <CheckCircle2 className="w-3 h-3" />
                                AL DÍA
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={`tel:${c.phone}`}
                                title="Llamar al cliente para coordinar servicio"
                                className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenDetail(c)}
                                className="h-7 text-xs border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#E53935] hover:text-[#E53935]"
                              >
                                <Eye className="w-3.5 h-3.5 mr-1" />
                                {t('admin.clients.btnViewProfile', 'Ver Perfil')}
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
                {paginatedCustomers.map((c) => {
                  const summary = getCustomerAlertSummary(c);
                  const hasExpired = summary.expired > 0;

                  return (
                    <div
                      key={c.id || c.tax_id}
                      onClick={() => handleOpenDetail(c)}
                      className={`p-4 space-y-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
                        hasExpired ? 'bg-red-50/30 dark:bg-red-950/10' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-slate-700 dark:text-slate-300">
                          RIF: {c.tax_id}
                        </span>
                        {hasExpired ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-[#E53935] text-white">
                            <AlertTriangle className="w-3 h-3" />
                            {summary.expired} VENCIDO
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            AL DÍA
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {c.business_name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {c.contact_person} • {c.phone}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <span className="text-slate-500">
                          {summary.total} extintores instalados
                        </span>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(c);
                          }}
                          className="h-8 text-xs border-slate-300 text-[#E53935]"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Ver Perfil
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
                totalItems={filteredCustomers.length}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* CLIENT DETAIL & EQUIPMENT MODAL */}
      <ClientDetailModal
        customer={selectedCustomer}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedCustomer(null);
        }}
        onAddEquipment={handleAddEquipment}
        onPerformRecharge={handlePerformRecharge}
      />

      {/* REGISTER NEW B2B CLIENT MODAL */}
      {isNewClientModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsNewClientModalOpen(false)}
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
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                      {t('admin.clients.modalNewClientTitle', 'Registrar Nuevo Cliente B2B')}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Empresa cliente para mantenimiento de extintores y recargas
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsNewClientModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveNewClient} className="space-y-3.5 text-xs">
                {/* Business Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Razón Social / Nombre de la Empresa <span className="text-[#E53935]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Inversiones Industriales del Centro C.A."
                    value={newClient.business_name}
                    onChange={(e) => setNewClient({ ...newClient, business_name: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>

                {/* Tax ID & Contact Person */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      RIF / Documento Fiscal <span className="text-[#E53935]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. J-12345678-9"
                      value={newClient.tax_id}
                      onChange={(e) => setNewClient({ ...newClient, tax_id: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Persona de Contacto
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Ing. Carlos Mendoza"
                      value={newClient.contact_person}
                      onChange={(e) => setNewClient({ ...newClient, contact_person: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Teléfono de Contacto <span className="text-[#E53935]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. +58 414-5550199"
                      value={newClient.phone}
                      onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      placeholder="Ej. compras@empresa.com"
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* City & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Caracas"
                      value={newClient.city}
                      onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Dirección Fiscal / Sede
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Av. Principal, Galpón 4, Zona Industrial"
                      value={newClient.address}
                      onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsNewClientModalOpen(false)}
                    className="text-xs"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#E53935] hover:bg-[#b71c1c] text-white font-bold text-xs shadow-xs"
                  >
                    Guardar Cliente
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
